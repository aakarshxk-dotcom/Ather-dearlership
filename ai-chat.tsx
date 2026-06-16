'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface QuickAction {
  label: string;
  message: string;
}

// ── Component ──────────────────────────────────────────
export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const sessionId = 'main';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to Ather Energy's AI Assistant. I can help you with dealership operations, inventory insights, sales analytics, and more.",
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const quickActions: QuickAction[] = [
    { label: '📊 Sales Summary', message: 'Show me the current sales summary and top performing models' },
    { label: '🏪 Top Dealership', message: 'Which dealership is performing the best this month?' },
    { label: '📦 Inventory Status', message: 'What is the current inventory status across all dealerships?' },
    { label: '🔧 Service Overview', message: 'Show me the service appointments scheduled for today' },
  ];

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.response || 'I could not generate a response.',
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Connection error. Please check your network and try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping]);

  const handleClearChat = async () => {
    try {
      await fetch(`/api/ai-chat?sessionId=${sessionId}`, { method: 'DELETE' });
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Welcome to Ather Energy's AI Assistant. I can help you with dealership operations, inventory insights, sales analytics, and more.",
        timestamp: new Date().toISOString(),
      }]);
      toast.success('Chat history cleared');
    } catch {
      toast.error('Failed to clear chat');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const showQuickActions = messages.length <= 1;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center justify-center rounded-xl p-2.5 bg-neon-green/10">
              <Bot className="size-5 text-neon-green" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.5))' }} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-neon-green" />
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">AtherBot AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-green" />
              </span>
              <span className="text-[11px] text-neon-green font-medium">Online</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          className="text-muted-foreground hover:text-white hover:bg-white/5"
        >
          <Trash2 className="size-3.5" />
          <span className="ml-2 text-xs">Clear Chat</span>
        </Button>
      </div>

      {/* Chat Area */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'user' ? (
                /* User Message */
                <div className="max-w-2xl bg-gradient-to-r from-neon-green/20 to-neon-cyan/10 border border-neon-green/20 rounded-2xl rounded-br-md px-4 py-3">
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1.5 text-right">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              ) : (
                /* AI Message */
                <div className="max-w-2xl glass-card-static border-l-2 border-neon-cyan/30 px-5 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-lg p-1.5 bg-neon-cyan/10 shrink-0 mt-0.5">
                      <Bot className="size-3.5 text-neon-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-neon-cyan uppercase tracking-wider mb-1">
                        AtherBot
                      </p>
                      <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <p className="text-[10px] text-white/30 mt-1.5">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Actions below welcome message */}
                  {msg.id === 'welcome' && showQuickActions && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {quickActions.map((action) => (
                        <motion.button
                          key={action.label}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSend(action.message)}
                          className="glass-card-static px-3 py-2.5 text-left text-xs font-medium text-white/80 hover:text-neon-cyan hover:border-neon-cyan/20 transition-colors"
                        >
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex justify-start"
            >
              <div className="glass-card-static border-l-2 border-neon-cyan/30 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center rounded-lg p-1.5 bg-neon-cyan/10">
                    <Bot className="size-3.5 text-neon-cyan" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <motion.span
                      className="size-2 rounded-full bg-neon-cyan/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="size-2 rounded-full bg-neon-cyan/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="size-2 rounded-full bg-neon-cyan/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/5 p-4 shrink-0">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AtherBot anything..."
            disabled={isTyping}
            className="flex-1 h-11 px-4 bg-white/5 rounded-xl border border-white/10 text-sm text-white placeholder:text-white/30 outline-none focus:border-neon-green/30 focus:bg-white/[0.07] transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={cn(
              'btn-neon-green flex items-center justify-center h-11 w-11 p-0 rounded-xl transition-all',
              (!input.trim() || isTyping) && 'opacity-40 cursor-not-allowed'
            )}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}