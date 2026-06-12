import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  FileText,
  Mail,
  Zap,
} from 'lucide-react';
import type { Meeting } from '../../types';
import {
  generateAgenda,
  generateMeetingSummary,
  suggestBestMeetingTimes,
  generateAIResponse,
} from '../../lib/ai-simulation';

const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily team sync to discuss progress and blockers',
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
    description: 'Quarterly product roadmap review with stakeholders',
    start_time: new Date(Date.now() + 7200000).toISOString(),
    end_time: new Date(Date.now() + 10800000).toISOString(),
    location: 'Conference Room B',
    attendees: ['dave@co.com', 'eve@co.com', 'frank@co.com'],
    agenda: 'Q4 roadmap review and prioritization',
    status: 'scheduled',
    summary: '',
    follow_up_email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Client Onboarding',
    description: 'New enterprise client onboarding call',
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

type TabType = 'schedule' | 'conflicts' | 'suggestions' | 'agenda' | 'brief' | 'followup';

export default function CalendarAssistant() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    location: '',
    attendees: '',
  });

  const tabs: { key: TabType; label: string; icon: typeof Calendar }[] = [
    { key: 'schedule', label: 'Schedule', icon: Calendar },
    { key: 'conflicts', label: 'Conflict Check', icon: AlertTriangle },
    { key: 'suggestions', label: 'Best Times', icon: Clock },
    { key: 'agenda', label: 'Auto Agenda', icon: FileText },
    { key: 'brief', label: 'Prep Brief', icon: Zap },
    { key: 'followup', label: 'Follow-Up', icon: Mail },
  ];

  const handleScheduleMeeting = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const startDateTime = new Date(`${newMeeting.date}T${newMeeting.startTime}`);
      const endDateTime = new Date(`${newMeeting.date}T${newMeeting.endTime}`);
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        description: newMeeting.description,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location: newMeeting.location,
        attendees: newMeeting.attendees.split(',').map((a) => a.trim()).filter(Boolean),
        agenda: '',
        status: 'scheduled',
        summary: '',
        follow_up_email: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const conflictResponse = generateAIResponse('calendar', 'conflict', newMeeting.title);
      const scheduleResponse = generateAIResponse('calendar', 'schedule', newMeeting.title);

      setMeetings((prev) => [...prev, meeting]);
      setAiOutput(`${scheduleResponse}\n\n${conflictResponse}`);
      setShowNewMeeting(false);
      setNewMeeting({ title: '', description: '', date: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '11:00', location: '', attendees: '' });
      setIsProcessing(false);
    }, 1500);
  };

  const handleConflictCheck = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const output = generateAIResponse('calendar', 'conflict');
      setAiOutput(output);
      setIsProcessing(false);
    }, 1200);
  };

  const handleBestTimes = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const suggestions = suggestBestMeetingTimes(meetings);
      const output = `Available meeting times (1-hour slots):\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${generateAIResponse('calendar', 'schedule')}`;
      setAiOutput(output);
      setIsProcessing(false);
    }, 1200);
  };

  const handleGenerateAgenda = (meeting: Meeting) => {
    setIsProcessing(true);
    setTimeout(() => {
      const duration = (new Date(meeting.end_time).getTime() - new Date(meeting.start_time).getTime()) / 60000;
      const agenda = generateAgenda(meeting.title, duration);
      setAiOutput(`Agenda for "${meeting.title}" (${duration} minutes):\n\n${agenda}\n\n${generateAIResponse('calendar', 'agenda')}`);
      setIsProcessing(false);
    }, 1200);
  };

  const handlePrepBrief = (meeting: Meeting) => {
    setIsProcessing(true);
    setTimeout(() => {
      const brief = `Meeting Preparation Brief: "${meeting.title}"\n\nContext: ${meeting.description}\nAttendees: ${meeting.attendees.join(', ')}\nLocation: ${meeting.location}\n\nKey Talking Points:\n- Review current project status\n- Discuss upcoming milestones\n- Address any blockers or concerns\n- Align on next steps and responsibilities\n\nBackground Research:\n- Last meeting outcome: All action items completed\n- Current sprint is 80% complete\n- Two new features are ready for demo\n\n${generateAIResponse('calendar', 'brief')}`;
      setAiOutput(brief);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFollowUp = (meeting: Meeting) => {
    setIsProcessing(true);
    setTimeout(() => {
      const summary = generateMeetingSummary(meeting.title, meeting.attendees, '30 min');
      setAiOutput(`${summary}\n\n${generateAIResponse('calendar', 'followup')}`);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Smart Calendar Assistant
          </h1>
          <p className="text-slate-500 mt-1">AI-powered scheduling, conflict detection, and meeting preparation</p>
        </div>
        <button onClick={() => setShowNewMeeting(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Meeting
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setAiOutput('');
              if (tab.key === 'conflicts') handleConflictCheck();
              if (tab.key === 'suggestions') handleBestTimes();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting List */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Scheduled Meetings</h2>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{meeting.title}</h3>
                  <span className="badge bg-emerald-100 text-emerald-700">{meeting.status}</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(meeting.start_time).toLocaleString('en-US', {
                      weekday: 'short',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    —{' '}
                    {new Date(meeting.end_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {meeting.location}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    {meeting.attendees.length} attendees
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  {(activeTab === 'agenda' || activeTab === 'schedule') && (
                    <button
                      onClick={() => {
                        setActiveTab('agenda');
                        handleGenerateAgenda(meeting);
                      }}
                      className="text-xs btn-ghost flex items-center gap-1 text-blue-600 hover:bg-blue-50"
                    >
                      <FileText className="w-3 h-3" /> Agenda
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveTab('brief');
                      handlePrepBrief(meeting);
                    }}
                    className="text-xs btn-ghost flex items-center gap-1 text-amber-600 hover:bg-amber-50"
                  >
                    <Zap className="w-3 h-3" /> Prep Brief
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('followup');
                      handleFollowUp(meeting);
                    }}
                    className="text-xs btn-ghost flex items-center gap-1 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Mail className="w-3 h-3" /> Follow-Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Output */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Calendar Output
          </h2>
          {isProcessing ? (
            <div className="flex items-center justify-center py-12">
              <div className="typing-indicator flex gap-1.5">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : aiOutput ? (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 whitespace-pre-line text-sm text-slate-700 animate-fade-in">
              {aiOutput}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar className="w-12 h-12 mb-3" />
              <p className="text-sm">Select a tab or meeting action to generate AI output</p>
            </div>
          )}
        </div>
      </div>

      {/* New Meeting Modal */}
      {showNewMeeting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Schedule New Meeting
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Title</label>
                <input
                  className="input-field"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Meeting title"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                <textarea
                  className="textarea-field"
                  rows={2}
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Meeting description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Location</label>
                  <input
                    className="input-field"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Room or link"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Start Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">End Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={newMeeting.endTime}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, endTime: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Attendees (comma-separated emails)</label>
                <input
                  className="input-field"
                  value={newMeeting.attendees}
                  onChange={(e) => setNewMeeting((p) => ({ ...p, attendees: e.target.value }))}
                  placeholder="alice@co.com, bob@co.com"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNewMeeting(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleScheduleMeeting}
                disabled={!newMeeting.title}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
