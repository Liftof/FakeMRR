import { sql } from '@vercel/postgres';

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

  try {
    // GET - Fetch all startups
    if (req.method === 'GET') {
      const { rows } = await sql`
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

      // Rate limiting - check recent submissions (last 1 minute)
      const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();

      const { rows: recentSubmissions } = await sql`
        SELECT COUNT(*) as count
        FROM startups
        WHERE created_at > ${oneMinuteAgo}
        LIMIT 1
      `;

      // Simple rate limit: max 1 submission per minute globally
      if (recentSubmissions[0]?.count > 0) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before submitting again.'
        });
      }

      // Insert into database
      const { rows } = await sql`
        INSERT INTO startups (
          company_name,
          founder_name,
          twitter,
          website,
          mrr,
          total_revenue,
          growth_rate
        ) VALUES (
          ${companyName},
          ${founderName},
          ${twitter || ''},
          ${website || ''},
          ${mrr || 0},
          ${totalRevenue},
          ${growthRate || 0}
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

export const config = {
  runtime: 'edge',
};
