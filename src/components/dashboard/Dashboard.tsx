import { useState, useEffect } from 'react';
import {
  Sun,
  Mail,
  AlertTriangle,
  Calendar,
  TrendingUp,
  ArrowRight,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react';
import type { Task, Meeting } from '../../types';
import { generateDailyBriefing } from '../../lib/ai-simulation';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q4 Budget Proposal',
    description: 'Review and approve the Q4 budget proposal from the finance team',
    priority: 'urgent',
    status: 'pending',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    category: 'finance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Prepare Quarterly Presentation',
    description: 'Create slides for the quarterly business review',
    priority: 'high',
    status: 'in_progress',
    due_date: new Date(Date.now() + 172800000).toISOString(),
    category: 'presentation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Follow up with Engineering Team',
    description: 'Check on sprint deliverables and blockers',
    priority: 'medium',
    status: 'pending',
    due_date: new Date(Date.now() + 259200000).toISOString(),
    category: 'engineering',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Update Project Dashboard',
    description: 'Refresh metrics and KPIs on the project dashboard',
    priority: 'low',
    status: 'pending',
    due_date: null,
    category: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const sampleMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily team sync',
    start_time: new Date(Date.now() + 3600000).toISOString(),
    end_time: new Date(Date.now() + 5400000).toISOString(),
    location: 'Room A',
    attendees: ['alice@co.com', 'bob@co.com', 'carol@co.com'],
    agenda: 'Progress updates and blockers',
    status: 'scheduled',
    summary: '',
    follow_up_email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Product Review',
    description: 'Quarterly product review with stakeholders',
    start_time: new Date(Date.now() + 7200000).toISOString(),
    end_time: new Date(Date.now() + 10800000).toISOString(),
    location: 'Conference Room B',
    attendees: ['dave@co.com', 'eve@co.com'],
    agenda: 'Q4 product roadmap review',
    status: 'scheduled',
    summary: '',
    follow_up_email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Client Onboarding Call',
    description: 'Onboarding call for new enterprise client',
    start_time: new Date(Date.now() + 14400000).toISOString(),
    end_time: new Date(Date.now() + 16200000).toISOString(),
    location: 'Zoom',
    attendees: ['client@external.com', 'sales@co.com'],
    agenda: 'Introduction and setup walkthrough',
    status: 'scheduled',
    summary: '',
    follow_up_email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function Dashboard() {
  const [briefing] = useState(generateDailyBriefing(sampleTasks, sampleMeetings, 12));
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const priorityColor: Record<string, string> = {
    urgent: 'badge-urgent',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Sun className="w-7 h-7 text-amber-500" />
            {greeting}
          </h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">AI Executive Assistant Active</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Mail, label: 'Unread Emails', value: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: AlertTriangle, label: 'Urgent Tasks', value: '2', color: 'text-red-600', bg: 'bg-red-50' },
          { icon: Calendar, label: 'Meetings Today', value: '3', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: TrendingUp, label: 'Tasks Completed', value: '7', color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Briefing */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Daily Briefing
          </h2>
          <span className="text-xs text-slate-400">Generated just now</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Important Email Digest
              </h3>
              <p className="text-sm text-blue-700 whitespace-pre-line">{briefing.important_emails}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Upcoming Deadlines
              </h3>
              <p className="text-sm text-amber-700 whitespace-pre-line">{briefing.upcoming_deadlines}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Meeting Summaries
              </h3>
              <p className="text-sm text-emerald-700 whitespace-pre-line">{briefing.meeting_summaries}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Suggested Priorities
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-line">{briefing.suggested_priorities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks and Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Priority Tasks</h2>
            <a href="/tasks" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {sampleTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={priorityColor[task.priority]}>{task.priority}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{task.title}</p>
                    {task.due_date && (
                      <p className="text-xs text-slate-400">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`badge ${
                    task.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Today's Meetings</h2>
            <a href="/calendar" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View calendar <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {sampleMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center border border-blue-100">
                  <span className="text-xs font-bold text-blue-700">
                    {new Date(meeting.start_time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{meeting.title}</p>
                  <p className="text-xs text-slate-400">
                    {meeting.location} &middot; {meeting.attendees.length} attendees
                  </p>
                </div>
                <span className="badge bg-emerald-100 text-emerald-700">{meeting.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
