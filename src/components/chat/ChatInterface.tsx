import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Brain,
  Search,
  PenTool,
  Code2,
  Calendar,
  Mic,
  LayoutDashboard,
} from 'lucide-react';
import type { AgentType, ChatMessage } from '../../types';
import { generateAIResponse } from '../../lib/ai-simulation';

const agentOptions: { type: AgentType; label: string; icon: typeof Brain; color: string }[] = [
  { type: 'executive', label: 'Executive', icon: LayoutDashboard, color: 'text-blue-600 bg-blue-100' },
  { type: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-emerald-600 bg-emerald-100' },
  { type: 'research', label: 'Research', icon: Search, color: 'text-violet-600 bg-violet-100' },
  { type: 'writing', label: 'Writing', icon: PenTool, color: 'text-amber-600 bg-amber-100' },
  { type: 'code', label: 'Code', icon: Code2, color: 'text-rose-600 bg-rose-100' },
  { type: 'voice', label: 'Voice', icon: Mic, color: 'text-cyan-600 bg-cyan-100' },
];

const actionMap: Record<AgentType, string> = {
  executive: 'briefing',
  calendar: 'schedule',
  research: 'search',
  writing: 'email',
  code: 'generate',
  voice: 'command',
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentType>('executive');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      agentType: activeAgent,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(activeAgent, actionMap[activeAgent], input);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        agentType: activeAgent,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-600" />
            AI Chat
          </h1>
          <p className="text-slate-500 mt-0.5 text-sm">Interact with any AI agent through a unified chat interface</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="btn-ghost text-sm">
            Clear Chat
          </button>
        )}
      </div>

      {/* Agent Selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {agentOptions.map((agent) => (
          <button
            key={agent.type}
            onClick={() => setActiveAgent(agent.type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              activeAgent === agent.type
                ? `${agent.color} ring-2 ring-offset-1 ring-current/20`
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <agent.icon className="w-3.5 h-3.5" />
            {agent.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="card p-4 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Sparkles className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium">Start a conversation with your AI assistant</p>
              <p className="text-xs mt-1">Select an agent type and type your message below</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-slate-100 text-slate-700 rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <p
                    className={`text-xs ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                  {msg.role === 'assistant' && (
                    <span className={`badge text-[10px] ${
                      agentOptions.find((a) => a.type === msg.agentType)?.color
                    }`}>
                      {msg.agentType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="typing-indicator flex gap-1.5">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input
            ref={inputRef}
            className="input-field flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agentOptions.find((a) => a.type === activeAgent)?.label || ''} agent...`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="btn-primary flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
