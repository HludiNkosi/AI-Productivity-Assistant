import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  Command,
  HandMetal,
} from 'lucide-react';
import { generateAIResponse } from '../../lib/ai-simulation';

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const voiceCommands = [
  { command: '"Schedule a meeting"', description: 'Create a new meeting event', icon: Command },
  { command: '"Summarize last meeting"', description: 'Get AI meeting summary', icon: MessageSquare },
  { command: '"Read my emails"', description: 'Email digest overview', icon: Command },
  { command: '"What are my priorities?"', description: 'Get priority task list', icon: Command },
  { command: '"Draft an email to..."', description: 'Generate email draft', icon: Command },
  { command: '"Hands-free mode"', description: 'Enable continuous listening', icon: HandMetal },
];

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateSTT = (text: string) => {
    setCurrentTranscript(text);
    setTimeout(() => {
      setCurrentTranscript('');
      const userMsg: VoiceMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsProcessing(true);
      setTimeout(() => {
        const response = generateAIResponse('voice', 'response', text);
        const assistantMsg: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);

        if (!isMuted && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.rate = 0.9;
          utterance.pitch = 0.8;
          const voices = speechSynthesis.getVoices();
          const deepVoice = voices.find((v) => v.name.toLowerCase().includes('male') && v.lang.startsWith('en'));
          if (deepVoice) utterance.voice = deepVoice;
          speechSynthesis.speak(utterance);
        }
      }, 2000);
    }, 1000);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setHandsFree(false);
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    } else {
      setIsListening(true);
      simulateSTT('What are my priorities for today?');
    }
  };

  const simulateCommand = (command: string) => {
    setIsListening(true);
    simulateSTT(command);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Mic className="w-7 h-7 text-blue-600" />
          Voice AI Assistant
        </h1>
        <p className="text-slate-500 mt-1">
          Speech-to-text, natural voice responses, and hands-free workflow automation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Control Panel */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Voice Control</h2>
          <div className="flex flex-col items-center">
            {/* Mic Button */}
            <button
              onClick={toggleListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse-ring shadow-lg shadow-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <p className="mt-4 text-sm font-medium text-slate-700">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </p>
            {currentTranscript && (
              <div className="mt-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700 animate-fade-in">
                "{currentTranscript}"
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 mt-6 w-full">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMuted ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isMuted ? 'Muted' : 'Voice On'}
              </button>
              <button
                onClick={() => {
                  setHandsFree(!handsFree);
                  if (!handsFree) setIsListening(true);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  handsFree ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <HandMetal className="w-4 h-4" />
                {handsFree ? 'Active' : 'Hands-Free'}
              </button>
            </div>
          </div>

          {/* Voice Commands */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Voice Commands</h3>
            <div className="space-y-2">
              {voiceCommands.map((cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => simulateCommand(cmd.command.replace(/"/g, ''))}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors"
                >
                  <cmd.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-700">{cmd.command}</p>
                    <p className="text-xs text-slate-400">{cmd.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="lg:col-span-2 card p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Voice Conversation
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 min-h-[400px] max-h-[600px]">
            {messages.length === 0 && !isProcessing && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Mic className="w-16 h-16 mb-4" />
                <p className="text-sm">Start speaking to begin a conversation</p>
                <p className="text-xs mt-1">MLK-inspired voice responses</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-700 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start animate-fade-in">
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
        </div>
      </div>
    </div>
  );
}
