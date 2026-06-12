import { useState } from 'react';
import {
  Brain,
  Search,
  PenTool,
  Code2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  FileCheck,
  FileText,
  Mail,
  Bug,
  HelpCircle,
} from 'lucide-react';
import {
  generateResearchResponse,
  generateWritingResponse,
  generateCodeResponse,
} from '../../lib/ai-simulation';

type ResearchAction = 'search' | 'validate' | 'report';
type WritingAction = 'email' | 'proposal' | 'report';
type CodeAction = 'generate' | 'debug' | 'explain';

interface AgentOutput {
  content: string;
  timestamp: Date;
}

const agentConfig = {
  research: {
    name: 'Research Agent',
    description: 'Web search, source validation, and report generation',
    icon: Search,
    color: 'blue',
    actions: [
      { key: 'search' as ResearchAction, label: 'Web Search', icon: Globe, desc: 'Search and gather information from multiple sources' },
      { key: 'validate' as ResearchAction, label: 'Source Validate', icon: FileCheck, desc: 'Cross-reference and validate data sources' },
      { key: 'report' as ResearchAction, label: 'Report Generation', icon: FileText, desc: 'Generate comprehensive research reports' },
    ],
  },
  writing: {
    name: 'Writing Agent',
    description: 'Email composition, proposals, and professional reports',
    icon: PenTool,
    color: 'emerald',
    actions: [
      { key: 'email' as WritingAction, label: 'Write Email', icon: Mail, desc: 'Draft professional emails with appropriate tone' },
      { key: 'proposal' as WritingAction, label: 'Write Proposal', icon: FileText, desc: 'Create structured business proposals' },
      { key: 'report' as WritingAction, label: 'Write Report', icon: FileText, desc: 'Generate analytical and status reports' },
    ],
  },
  code: {
    name: 'Code Agent',
    description: 'Code generation, debugging, and explanation',
    icon: Code2,
    color: 'violet',
    actions: [
      { key: 'generate' as CodeAction, label: 'Generate Code', icon: Code2, desc: 'Write clean, production-ready code' },
      { key: 'debug' as CodeAction, label: 'Debug Code', icon: Bug, desc: 'Find and fix bugs in your codebase' },
      { key: 'explain' as CodeAction, label: 'Explain Code', icon: HelpCircle, desc: 'Get clear explanations of code logic' },
    ],
  },
};

type AgentKey = keyof typeof agentConfig;

const colorMap: Record<string, { bg: string; border: string; text: string; lightBg: string; btnBg: string; btnText: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', lightBg: 'bg-blue-100', btnBg: 'bg-blue-600', btnText: 'text-white' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', lightBg: 'bg-emerald-100', btnBg: 'bg-emerald-600', btnText: 'text-white' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', lightBg: 'bg-violet-100', btnBg: 'bg-violet-600', btnText: 'text-white' },
};

export default function AgentHub() {
  const [activeAgent, setActiveAgent] = useState<AgentKey>('research');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<AgentOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const config = agentConfig[activeAgent];
  const colors = colorMap[config.color];

  const handleAction = (actionKey: string) => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      let result = '';
      if (activeAgent === 'research') {
        result = generateResearchResponse(input, actionKey as ResearchAction);
      } else if (activeAgent === 'writing') {
        result = generateWritingResponse(input, actionKey as WritingAction);
      } else if (activeAgent === 'code') {
        result = generateCodeResponse(input, actionKey as CodeAction);
      }
      setOutput({ content: result, timestamp: new Date() });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-7 h-7 text-blue-600" />
          Multi-Agent Hub
        </h1>
        <p className="text-slate-500 mt-1">Specialized AI agents for research, writing, and code tasks</p>
      </div>

      {/* Agent Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.entries(agentConfig) as [AgentKey, typeof agentConfig.research][]).map(([key, agent]) => {
          const agentColors = colorMap[agent.color];
          const isActive = activeAgent === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveAgent(key);
                setOutput(null);
                setInput('');
              }}
              className={`card p-5 text-left transition-all duration-200 ${
                isActive ? `ring-2 ring-offset-2 ring-${agent.color}-500 ${agentColors.bg} ${agentColors.border}` : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${agentColors.lightBg} flex items-center justify-center mb-3`}>
                <agent.icon className={`w-5 h-5 ${agentColors.text}`} />
              </div>
              <h3 className="font-semibold text-slate-900">{agent.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{agent.description}</p>
              {isActive && (
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
                  <CheckCircle className="w-3.5 h-3.5" /> Active
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input & Actions */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {config.name} Input
            </h2>
            <textarea
              className="textarea-field"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeAgent === 'research'
                  ? 'Enter your research query or topic...'
                  : activeAgent === 'writing'
                  ? 'Describe what you need written...'
                  : 'Describe the code you need, paste code to debug, or ask for an explanation...'
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {config.actions.map((action) => (
              <button
                key={action.key}
                onClick={() => handleAction(action.key)}
                disabled={!input.trim() || isProcessing}
                className={`card p-4 text-left hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
              >
                <action.icon className={`w-5 h-5 ${colors.text} mb-2`} />
                <h3 className="text-sm font-medium text-slate-900">{action.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            Agent Output
          </h2>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className={`w-12 h-12 rounded-full ${colors.lightBg} flex items-center justify-center mb-4 animate-pulse`}>
                <config.icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <p className="text-sm text-slate-500">{config.name} is working...</p>
              <div className="typing-indicator flex gap-1.5 mt-3">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : output ? (
            <div className="animate-fade-in">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 whitespace-pre-line text-sm text-slate-700 max-h-[500px] overflow-y-auto">
                {output.content}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Generated at {output.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Brain className="w-12 h-12 mb-3" />
              <p className="text-sm">Enter input and select an action to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
