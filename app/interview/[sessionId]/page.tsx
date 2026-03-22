'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  ArrowLeft,
  MessageSquare,
  Award,
  CheckCircle2,
  Target,
  TrendingUp,
  AlertTriangle,
  Mic,
  Keyboard,
} from 'lucide-react';
import Link from 'next/link';
import { AudioControls } from '@/components/interview/AudioControls';

interface Message {
  id: string;
  role: 'interviewer' | 'candidate' | 'feedback' | 'summary';
  content: string;
  score?: number | null;
  createdAt: string;
}

interface SessionData {
  id: string;
  jobTitle: string;
  jobContext: string | null;
  status: string;
  totalScore: number | null;
  questionCount: number;
  summary: string | null;
  messages: Message[];
}

interface SummaryData {
  totalScore: number;
  globalFeedback: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export default function InterviewChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/ai/interview/${sessionId}`);
        if (!res.ok) throw new Error();
        const data: SessionData = await res.json();
        setSession(data);
        setMessages(data.messages);

        const summaryMsg = data.messages.find((m) => m.role === 'summary');
        if (summaryMsg) {
          try {
            setSummaryData(JSON.parse(summaryMsg.content));
          } catch {}
        }
      } catch {
        router.push('/dashboard/ai/interview');
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, [sessionId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!answer.trim() || isSending || session?.status === 'completed') return;

    const userAnswer = answer.trim();
    setAnswer('');
    setIsSending(true);

    const tempCandidateMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'candidate',
      content: userAnswer,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempCandidateMsg]);

    try {
      const res = await fetch(`/api/ai/interview/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: userAnswer }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur');
      }

      const data = await res.json();

      const newMessages: Message[] = [];

      newMessages.push({
        id: `feedback-${Date.now()}`,
        role: 'feedback',
        content: data.feedback,
        score: data.score,
        createdAt: new Date().toISOString(),
      });

      if (data.nextQuestion) {
        newMessages.push({
          id: `question-${Date.now()}`,
          role: 'interviewer',
          content: data.nextQuestion,
          createdAt: new Date().toISOString(),
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);

      if (data.isComplete && data.summary) {
        setSummaryData(data.summary);
        setSession((prev) => (prev ? { ...prev, status: 'completed', totalScore: data.summary.totalScore } : prev));
      } else if (data.questionNumber && session) {
        setSession((prev) => (prev ? { ...prev, questionCount: data.questionNumber } : prev));
      }

      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error: any) {
      setMessages((prev) => prev.filter((m) => m.id !== tempCandidateMsg.id));
      setAnswer(userAnswer);
      const { toast } = await import('sonner');
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsSending(false);
    }
  };

  const handleTranscriptReceived = (text: string, isFromUser: boolean) => {
    // In audio mode, Gemini Live handles the conversation turn directly.
    // We just append its transcription to the UI for visibility.
    setMessages((prev) => [
      ...prev,
      {
        id: `transcript-${Date.now()}`,
        role: isFromUser ? 'candidate' : 'interviewer',
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentQuestionNumber = messages.filter((m) => m.role === 'interviewer').length;
  const maxQuestions = 6;
  const progress = session?.status === 'completed' ? 100 : (currentQuestionNumber / maxQuestions) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!session) return null;

  const visibleMessages = messages.filter((m) => m.role !== 'summary');

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 shrink-0">
        <Link
          href="/dashboard/ai/interview"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-slate-800 truncate">
            Entretien : {session.jobTitle}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[200px]">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {session.status === 'completed'
                ? 'Terminé'
                : `Question ${currentQuestionNumber}/${maxQuestions}`}
            </span>
          </div>
        </div>
        {session.totalScore !== null && (
          <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg">
            <Award className="w-4 h-4" />
            <span className="text-sm font-bold">{session.totalScore}/100</span>
          </div>
        )}

        {/* Input Mode Toggle */}
        {session.status !== 'completed' && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                inputMode === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Mode Texte"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            <button
              onClick={() => setInputMode('audio')}
              className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                inputMode === 'audio' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Mode Audio (Live)"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Audio Controls Bar */}
      <AnimatePresence>
        {inputMode === 'audio' && session.status !== 'completed' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-slate-200 overflow-hidden shrink-0"
          >
            <div className="px-4 py-3 flex items-center justify-center gap-4 max-w-4xl mx-auto">
              <AudioControls
                sessionId={sessionId}
                onTranscriptReceived={handleTranscriptReceived}
                onSpeakingStateChange={setIsAISpeaking}
              />
              <div className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Appuyez sur le micro pour parler. L'IA vous écoute en temps réel et génère une réponse vocale. Mettez vos écouteurs pour éviter l'écho.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'interviewer' && (
                <div className="max-w-[85%] lg:max-w-[65%]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageSquare className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">Recruteur IA</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-800 leading-relaxed shadow-sm">
                    {msg.content}
                  </div>
                </div>
              )}

              {msg.role === 'candidate' && (
                <div className="max-w-[85%] lg:max-w-[65%]">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              )}

              {msg.role === 'feedback' && (
                <div className="max-w-[85%] lg:max-w-[65%]">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-900 leading-relaxed">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-xs">
                        Feedback
                        {msg.score !== null && msg.score !== undefined && (
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            msg.score >= 7
                              ? 'bg-green-100 text-green-700'
                              : msg.score >= 5
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {msg.score}/10
                          </span>
                        )}
                      </span>
                    </div>
                    {msg.content}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* AI Speaking Indicator */}
          {isAISpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-3 bg-indigo-50 text-indigo-600 px-4 py-3 rounded-full border border-indigo-100 shadow-sm w-fit">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs font-bold">Le recruteur parle...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Thinking Indicator (Text Mode) */}
        {isSending && inputMode === 'text' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-slate-500"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-indigo-600 animate-spin" />
            </div>
            <span className="italic">Le recruteur analyse votre réponse...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Summary Panel */}
      {summaryData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full mb-2">
              <Award className="w-5 h-5" />
              <span className="text-xl font-bold">{summaryData.totalScore}/100</span>
            </div>
            <p className="text-sm text-slate-600 mt-2">{summaryData.globalFeedback}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-green-700 mb-2">
                <TrendingUp className="w-3.5 h-3.5" /> Points forts
              </h4>
              <ul className="space-y-1">
                {summaryData.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-green-800">{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" /> A améliorer
              </h4>
              <ul className="space-y-1">
                {summaryData.improvements.map((s, i) => (
                  <li key={i} className="text-xs text-amber-800">{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2">
                <Target className="w-3.5 h-3.5" /> Recommandations
              </h4>
              <ul className="space-y-1">
                {summaryData.recommendations.map((s, i) => (
                  <li key={i} className="text-xs text-blue-800">{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/dashboard/ai/interview"
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Nouvel entretien
            </Link>
          </div>
        </motion.div>
      )}

      {/* Input Area (Text Mode Only) */}
      {session.status !== 'completed' && inputMode === 'text' && (
        <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <textarea
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              rows={2}
              placeholder="Écrivez votre réponse... (Entrée pour envoyer)"
            />
            <button
              onClick={handleSend}
              disabled={!answer.trim() || isSending}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
