-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMPTZ,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Meetings table
CREATE TABLE meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  attendees TEXT[] DEFAULT '{}',
  agenda TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  summary TEXT,
  follow_up_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Emails table
CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient TEXT,
  category TEXT NOT NULL DEFAULT 'draft' CHECK (category IN ('draft', 'sent', 'follow_up', 'meeting_prep')),
  related_meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Research reports table
CREATE TABLE research_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  query TEXT NOT NULL,
  findings TEXT NOT NULL,
  sources TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'validated')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agent interactions table (chat history)
CREATE TABLE agent_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('research', 'writing', 'code', 'executive', 'calendar', 'voice')),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily briefings table
CREATE TABLE daily_briefings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  briefing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  important_emails TEXT DEFAULT '',
  upcoming_deadlines TEXT DEFAULT '',
  meeting_summaries TEXT DEFAULT '',
  suggested_priorities TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;

-- RLS policies for tasks
CREATE POLICY "select_tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_tasks" ON tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_tasks" ON tasks FOR DELETE TO authenticated USING (true);

-- RLS policies for meetings
CREATE POLICY "select_meetings" ON meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_meetings" ON meetings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_meetings" ON meetings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_meetings" ON meetings FOR DELETE TO authenticated USING (true);

-- RLS policies for emails
CREATE POLICY "select_emails" ON emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_emails" ON emails FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_emails" ON emails FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_emails" ON emails FOR DELETE TO authenticated USING (true);

-- RLS policies for research_reports
CREATE POLICY "select_research_reports" ON research_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_research_reports" ON research_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_research_reports" ON research_reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_research_reports" ON research_reports FOR DELETE TO authenticated USING (true);

-- RLS policies for agent_interactions
CREATE POLICY "select_agent_interactions" ON agent_interactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_agent_interactions" ON agent_interactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_agent_interactions" ON agent_interactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_agent_interactions" ON agent_interactions FOR DELETE TO authenticated USING (true);

-- RLS policies for daily_briefings
CREATE POLICY "select_daily_briefings" ON daily_briefings FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_daily_briefings" ON daily_briefings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_daily_briefings" ON daily_briefings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_daily_briefings" ON daily_briefings FOR DELETE TO authenticated USING (true);
