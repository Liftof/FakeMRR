import { neon } from '@neondatabase/serverless';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Initialize Neon client
  const sql = neon(process.env.DATABASE_URL);

  try {
    // GET - Fetch all startups
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT
          id,
          company_name as "companyName",
          founder_name as "founderName",
          twitter,
          website,
          mrr,
          total_revenue as "totalRevenue",
          growth_rate as "growthRate",
          created_at as "timestamp"
        FROM startups
        ORDER BY total_revenue DESC
      `;

      return res.status(200).json({
        success: true,
        startups: rows
      });
    }

    // POST - Add new startup
    if (req.method === 'POST') {
      const { companyName, founderName, twitter, website, mrr, totalRevenue, growthRate } = req.body;

      // Basic validation
      if (!companyName || !founderName || totalRevenue === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: companyName, founderName, totalRevenue'
        });
      }

      // Rate limiting - Per-IP: max 5 submissions per hour
      // Get real client IP (Vercel passes this in x-forwarded-for header)
      const forwardedFor = req.headers['x-forwarded-for'];
      const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers['x-real-ip'] || 'unknown';
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

      const ipSubmissions = await sql`
        SELECT COUNT(*) as count
        FROM startups
        WHERE client_ip = ${clientIp}
        AND created_at > ${oneHourAgo}
      `;

      // Per-IP rate limit: max 5 submissions per hour
      if (ipSubmissions[0]?.count >= 5) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Maximum 5 submissions per hour per user.'
        });
      }

      // Insert into database with client IP for rate limiting
      const rows = await sql`
        INSERT INTO startups (
          company_name,
          founder_name,
          twitter,
          website,
          mrr,
          total_revenue,
          growth_rate,
          client_ip
        ) VALUES (
          ${companyName},
          ${founderName},
          ${twitter || ''},
          ${website || ''},
          ${mrr || 0},
          ${totalRevenue},
          ${growthRate || 0},
          ${clientIp}
        )
        RETURNING
          id,
          company_name as "companyName",
          founder_name as "founderName",
          twitter,
          website,
          mrr,
          total_revenue as "totalRevenue",
          growth_rate as "growthRate",
          created_at as "timestamp"
      `;

      return res.status(201).json({
        success: true,
        startup: rows[0]
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
