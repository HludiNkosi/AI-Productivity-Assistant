import { useState } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  Copy,
  RotateCcw,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { generateEmailDraft } from '../../lib/ai-simulation';

type EmailTone = 'formal' | 'professional' | 'casual' | 'friendly';

const toneOptions: { value: EmailTone; label: string; color: string }[] = [
  { value: 'formal', label: 'Formal', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'professional', label: 'Professional', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'casual', label: 'Casual', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'friendly', label: 'Friendly', color: 'bg-amber-100 text-amber-700 border-amber-300' },
];

export default function EmailGenerator() {
  const [context, setContext] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState<EmailTone>('professional');
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!context.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const email = generateEmailDraft(context, recipient || 'Team', tone);
      setGeneratedEmail(email);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Mail className="w-7 h-7 text-blue-600" />
          AI Email Generator
        </h1>
        <p className="text-slate-500 mt-1">Generate professional emails with AI-powered writing assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Email Context
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Recipient</label>
                <input
                  className="input-field"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Name or email of the recipient"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Context / Topic</label>
                <textarea
                  className="textarea-field"
                  rows={5}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe what the email should be about. Include key points, context, and any specific information you want to convey..."
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 ${
                        tone === t.value ? t.color : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!context.trim() || isGenerating}
              className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate Email'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Generated Email
            </h2>
            {generatedEmail && (
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-ghost text-xs flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleRegenerate} className="btn-ghost text-xs flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Regenerate
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
          ) : generatedEmail ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Subject</label>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm font-medium text-slate-900">
                  {generatedEmail.subject}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Body</label>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm text-slate-700 whitespace-pre-line min-h-[200px]">
                  {generatedEmail.body}
                </div>
              </div>
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Email
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Mail className="w-12 h-12 mb-3" />
              <p className="text-sm">Enter context and generate an email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
