import { useState } from 'react';
import {
  Users,
  FileText,
  Sparkles,
  Clock,
  Mail,
  Copy,
} from 'lucide-react';
import type { Meeting } from '../../types';
import { generateMeetingSummary, generateAIResponse } from '../../lib/ai-simulation';

const sampleMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Q4 Planning Session',
    description: 'Quarterly planning session to align on objectives and resource allocation',
    start_time: new Date(Date.now() - 7200000).toISOString(),
    end_time: new Date(Date.now() - 5400000).toISOString(),
    location: 'Conference Room A',
    attendees: ['alice@co.com', 'bob@co.com', 'carol@co.com', 'dave@co.com'],
    agenda: 'Budget review, Team allocation, Priority alignment',
    status: 'completed',
    summary: '',
    follow_up_email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design Sprint Review',
    description: 'Review of the design sprint outcomes and next steps',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() - 1800000).toISOString(),
    location: 'Design Lab',
    attendees: ['eve@co.com', 'frank@co.com', 'grace@co.com'],
    agenda: 'Sprint demo, Feedback, Iteration plan',
    status: 'completed',
    summary: '',
    follow_up_email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Stakeholder Alignment',
    description: 'Cross-functional alignment meeting on product direction',
    start_time: new Date(Date.now() - 1800000).toISOString(),
    end_time: new Date(Date.now() - 600000).toISOString(),
    location: 'Board Room',
    attendees: ['henry@co.com', 'iris@co.com', 'jack@co.com', 'kate@co.com', 'leo@co.com'],
    agenda: 'Vision alignment, Roadmap priorities, Resource requests',
    status: 'completed',
    summary: '',
    follow_up_email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function MeetingSummarizer() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsGenerating(true);
    setTimeout(() => {
      const duration = `${Math.round((new Date(meeting.end_time).getTime() - new Date(meeting.start_time).getTime()) / 60000)} min`;
      const generated = generateMeetingSummary(meeting.title, meeting.attendees, duration);
      setSummary(generated);
      setIsGenerating(false);
    }, 1800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFollowUp = () => {
    if (!selectedMeeting) return;
    setIsGenerating(true);
    setTimeout(() => {
      const followUp = generateAIResponse('calendar', 'followup', selectedMeeting.title);
      setSummary((prev) => prev + '\n\n--- Follow-Up Email Draft ---\n\n' + followUp);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-600" />
          Meeting Summarizer
        </h1>
        <p className="text-slate-500 mt-1">AI-powered meeting summaries, action items, and follow-up generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting List */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Completed Meetings</h2>
          <div className="space-y-3">
            {sampleMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => handleSummarize(meeting)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedMeeting?.id === meeting.id
                    ? 'border-blue-400 bg-blue-50/50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{meeting.title}</h3>
                  <span className="badge bg-emerald-100 text-emerald-700">completed</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{meeting.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(meeting.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {meeting.attendees.length} attendees
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Output */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Summary
            </h2>
            {summary && (
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-ghost text-xs flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleFollowUp} className="btn-ghost text-xs flex items-center gap-1 text-blue-600">
                  <Mail className="w-3 h-3" /> Follow-Up
                </button>
              </div>
            )}
          </div>

          {isGenerating ? (
            <div className="flex items-center justify-center py-16">
              <div className="typing-indicator flex gap-1.5">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : summary ? (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 whitespace-pre-line text-sm text-slate-700 animate-fade-in">
              {summary}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <FileText className="w-12 h-12 mb-3" />
              <p className="text-sm">Select a meeting to generate an AI summary</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
