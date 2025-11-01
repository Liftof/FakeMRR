-- Migration: Add IP-based rate limiting
-- Run this in Neon SQL Editor BEFORE deploying the code changes
-- This is SAFE to run - adds a nullable column, won't affect existing data

-- Add column to track client IP addresses for rate limiting
ALTER TABLE startups
ADD COLUMN IF NOT EXISTS client_ip VARCHAR(45);

-- Add index for fast rate limit queries
CREATE INDEX IF NOT EXISTS idx_client_ip_created
ON startups(client_ip, created_at);

-- Verify the migration
SELECT COUNT(*) as total_startups FROM startups;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'startups' AND column_name = 'client_ip';
