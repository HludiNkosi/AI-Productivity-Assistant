export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  attendees: string[];
  agenda: string;
  status: MeetingStatus;
  summary: string;
  follow_up_email: string;
  created_at: string;
  updated_at: string;
}

export type EmailCategory = 'draft' | 'sent' | 'follow_up' | 'meeting_prep';

export interface Email {
  id: string;
  subject: string;
  body: string;
  recipient: string;
  category: EmailCategory;
  related_meeting_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ResearchStatus = 'in_progress' | 'completed' | 'validated';

export interface ResearchReport {
  id: string;
  title: string;
  query: string;
  findings: string;
  sources: string[];
  status: ResearchStatus;
  created_at: string;
  updated_at: string;
}

export type AgentType = 'research' | 'writing' | 'code' | 'executive' | 'calendar' | 'voice';

export interface AgentInteraction {
  id: string;
  agent_type: AgentType;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DailyBriefing {
  id: string;
  briefing_date: string;
  important_emails: string;
  upcoming_deadlines: string;
  meeting_summaries: string;
  suggested_priorities: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType: AgentType;
}
