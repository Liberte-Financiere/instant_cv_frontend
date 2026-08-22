'use client';

import { useState, useRef, useEffect } from 'react';
import {X, Send, Loader2, Bot, User, AlertCircle, Trash2, Wand2} from 'lucide-react';
import { ChatCandidateCard } from './ChatCandidateCard';
import { ScoredCandidate } from '@/lib/talent-assistant';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  candidates?: ScoredCandidate[];
  error?: boolean;
}

const DEFAULT_MESSAGE: Message = {
  role: 'assistant',
  content: 'Bonjour ! Je suis l\'assistant Jobsira Talent. Décrivez-moi le profil que vous recherchez (ex: "Je cherche un développeur React senior à Ouagadougou") et je trouverai les meilleurs candidats pour vous.',
};

const STORAGE_KEY = 'jobsira_talent_chat_history';

export function TalentChat({ isLocked = false }: { isLocked?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_MESSAGE]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage when messages change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isLocked) {
      scrollToBottom();
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isLocked]);

  // Keyboard shortcut (Cmd/Ctrl + J or Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'j' || e.key === 'k')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Format history for the API (only successful messages)
      const history = newMessages
        .filter(m => !m.error)
        .map(({ role, content }) => ({ role, content }));

      const response = await fetch('/api/recruiter/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: history.slice(0, -1),
        }),
      });

      if (!response.ok) {
        let errorMsg = 'Une erreur est survenue.';
        try {
          const data = await response.json();
          if (data.error) errorMsg = data.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Le flux de reponse n\'est pas supporte.');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let currentCandidates: ScoredCandidate[] = [];
      let hasError = false;
      
      // Initialize empty assistant message
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '', candidates: [] }
      ]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete part in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr) continue;
            try {
              const event = JSON.parse(dataStr);
              if (event.type === 'text') {
                assistantMessage += event.data;
              } else if (event.type === 'candidates') {
                currentCandidates = event.data;
              } else if (event.type === 'error') {
                 if (assistantMessage) {
                    assistantMessage += '\n\n⚠️ ' + event.data;
                 } else {
                    assistantMessage = event.data;
                    hasError = true;
                 }
              }
              
              setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage,
                  candidates: currentCandidates,
                  error: hasError
                };
                return newMsgs;
              });
            } catch (e) {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.',
          error: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render basic markdown-like bold text
  const formatText = (text: string) => {
    // Basic bold formatting: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 z-50 flex items-center justify-center",
          isOpen 
            ? "bg-slate-800 text-slate-400 hover:text-white" 
            : "bg-primary text-white hover:bg-primary/90 hover:scale-105"
        )}
        title="Assistant IA (Ctrl+J)"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Wand2 className="w-6 h-6" />}
      </button>

      {/* Slide-in Chat Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-slate-950 border-l border-slate-800 shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Jobsira Assistant</h2>
            <p className="text-slate-400 text-xs">Propulsé par l'IA</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {messages.length > 1 && (
              <button 
                onClick={() => setMessages([DEFAULT_MESSAGE])}
                title="Nouvelle recherche"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {messages.map((msg, idx) => {
            // Ne pas rendre les messages completement vides (ex: pendant le chargement initial du stream)
            if (!msg.content && (!msg.candidates || msg.candidates.length === 0) && !msg.error) {
              return null;
            }
            
            return (
            <div 
              key={idx} 
              className={cn(
                "flex gap-4 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                msg.role === 'user' 
                  ? "bg-primary/20 text-primary" 
                  : msg.error 
                    ? "bg-red-500/20 text-red-400" 
                    : "bg-slate-800 text-slate-300"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : msg.error ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className={cn(
                "flex flex-col gap-2",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                {msg.content && (
                  <div className={cn(
                    "p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed",
                    msg.role === 'user'
                      ? "bg-primary/10 text-slate-200 rounded-tr-sm"
                      : msg.error
                        ? "bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-sm"
                        : "bg-slate-800/80 text-slate-300 rounded-tl-sm"
                  )}>
                    {formatText(msg.content)}
                  </div>
                )}

                {/* Candidate Cards (if any) */}
                {msg.candidates && msg.candidates.length > 0 && (
                  <div className="w-full mt-2 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Profils recommandés
                    </p>
                    {msg.candidates.map((candidate) => (
                      <ChatCandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 max-w-[90%]">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-slate-400">Recherche en cours...</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {messages.length > 2 && !isLoading && (
            <div className="flex justify-center mt-6 mb-2">
              <button
                onClick={() => setMessages([DEFAULT_MESSAGE])}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-medium rounded-full border border-slate-700/50 hover:border-red-500/20 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Nouvelle recherche (Effacer l'historique)
              </button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area / Locked State */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          {isLocked ? (
            <div className="text-center p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <Wand2 className="w-6 h-6 text-primary mx-auto opacity-50" />
              <p className="text-sm text-slate-300">
                Connectez-vous avec un compte recruteur pour rechercher des candidats avec l'IA.
              </p>
              <a 
                href="/recruiter/register"
                className="inline-block px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Devenir Recruteur
              </a>
            </div>
          ) : (
            <>
              <form 
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 rounded-xl p-2 transition-all"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ex: Je cherche un développeur à Abidjan..."
                  className="flex-1 w-full bg-transparent border-none focus:outline-none focus:ring-0 text-white !text-white text-sm px-3 py-2 placeholder:text-slate-400 !placeholder-slate-400 outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-primary hover:bg-primary/90 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-center mt-3">
                <span className="text-[10px] text-slate-500">
                  L'IA peut faire des erreurs. Vérifiez toujours les profils.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
