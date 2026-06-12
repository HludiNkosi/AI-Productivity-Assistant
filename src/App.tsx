import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import CalendarAssistant from './components/calendar/CalendarAssistant';
import EmailGenerator from './components/email/EmailGenerator';
import MeetingSummarizer from './components/meeting/MeetingSummarizer';
import TaskPlanner from './components/tasks/TaskPlanner';
import VoiceAssistant from './components/voice/VoiceAssistant';
import AgentHub from './components/agents/AgentHub';
import ChatInterface from './components/chat/ChatInterface';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarAssistant />} />
              <Route path="/email" element={<EmailGenerator />} />
              <Route path="/meetings" element={<MeetingSummarizer />} />
              <Route path="/tasks" element={<TaskPlanner />} />
              <Route path="/voice" element={<VoiceAssistant />} />
              <Route path="/agents" element={<AgentHub />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
