-- Migration: Add composite index for high-traffic public directory queries and sorting
-- Created: 2026-08-25

-- Create index on the underlying base table in bmf_club schema
CREATE INDEX IF NOT EXISTS idx_bmf_members_directory_order 
ON bmf_club.bmf_members (is_approved, priority_order ASC NULLS LAST, is_featured DESC, created_at DESC);

-- Analyze the base table to update Postgres query planner statistics
ANALYZE bmf_club.bmf_members;

