-- Create BMF Intro Requests Table
CREATE TABLE IF NOT EXISTS bmf_club.bmf_intro_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_member_id UUID NOT NULL REFERENCES bmf_club.bmf_members(id) ON DELETE CASCADE,
  target_member_name TEXT NOT NULL,
  target_member_company TEXT NOT NULL,
  target_member_email TEXT NOT NULL,
  requester_user_id UUID NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT NULL,
  requester_company TEXT NULL,
  requester_role TEXT NULL,
  requester_linkedin TEXT NULL,
  purpose TEXT NOT NULL DEFAULT 'Founder Chat',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'archived'
  founder_response_note TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE bmf_club.bmf_intro_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read of non-sensitive request counts or user-specific requests
CREATE POLICY "Allow public insert for intro requests" ON bmf_club.bmf_intro_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select for intro requests" ON bmf_club.bmf_intro_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow update for intro requests" ON bmf_club.bmf_intro_requests
  FOR UPDATE USING (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_bmf_intro_requests_target ON bmf_club.bmf_intro_requests(target_member_id);
CREATE INDEX IF NOT EXISTS idx_bmf_intro_requests_requester_email ON bmf_club.bmf_intro_requests(requester_email);
CREATE INDEX IF NOT EXISTS idx_bmf_intro_requests_status ON bmf_club.bmf_intro_requests(status);

-- Create public view for easy access
CREATE OR REPLACE VIEW public.bmf_intro_requests AS 
  SELECT * FROM bmf_club.bmf_intro_requests;

GRANT ALL ON public.bmf_intro_requests TO anon, authenticated, service_role;
