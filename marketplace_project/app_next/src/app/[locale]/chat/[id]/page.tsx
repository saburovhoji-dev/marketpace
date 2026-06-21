'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

interface User { id: number; username: string }
interface Product { id: number; title_ru: string; title_uz: string; title_en: string; price: number }
interface Message { id: number; content: string; senderId: number; createdAt: string; sender: User }
interface Conversation { id: number; buyerId: number; sellerId: number; buyer: User; seller: User; product: Product | null }

function formatTime(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return locale === 'ru' ? 'Вчера' : locale === 'uz' ? 'Kecha' : 'Yesterday';
  return d.toLocaleDateString();
}

export default function ChatDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const chatId = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/me').then(r => r.json()),
      fetch(`/api/conversations/${chatId}`).then(r => r.json())
    ]).then(([meData, convData]) => {
      if (meData.user) setCurrentUserId(meData.user.id);
      setConversation(convData.conversation);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = () => {
      fetch(`/api/conversations/${chatId}/messages`)
        .then(r => r.json())
        .then(data => {
          if (data.messages) setMessages(data.messages);
        })
        .catch(() => {});
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = newMessage.trim();
    if (!text || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`/api/conversations/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setNewMessage('');
        setMessages(prev => [...prev, data.message]);
        inputRef.current?.focus();
      } else {
        setError(data.error || 'Ошибка отправки');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, chatId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background gap-4 px-6">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant" data-icon="chat">chat</span>
        <p className="text-on-surface-variant text-lg">Conversation not found</p>
        <Link href="/chat" className="text-primary hover:underline text-sm">← {locale === 'ru' ? 'Назад к сообщениям' : locale === 'uz' ? 'Xabarlarga qaytish' : 'Back to messages'}</Link>
      </div>
    );
  }

  const otherUser = conversation.buyerId === currentUserId ? conversation.seller : conversation.buyer;
  const product = conversation.product;

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 bg-surface-container-low p-3 md:p-4 rounded-none flex items-center gap-3 border-b border-white/10 z-10">
        <Link href="/chat" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors -ml-1">
          <span className="material-symbols-outlined text-on-surface-variant text-xl" data-icon="arrow_back">arrow_back</span>
        </Link>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-sm md:text-base shrink-0">
          {otherUser.username[0].toUpperCase()}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-sm md:text-base truncate">{otherUser.username}</h3>
          {product && (
            <p className="text-primary text-[11px] md:text-xs font-label-mono truncate">
              {locale === 'ru' ? product.title_ru : locale === 'uz' ? product.title_uz : product.title_en} — ${product.price}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-3 md:px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-on-surface-variant/60 italic text-sm px-4 text-center">
            {locale === 'ru' ? 'Напишите первое сообщение' : locale === 'uz' ? 'Birinchi xabarni yozing' : 'Send the first message'}
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === currentUserId;
            const showSender = i === 0 || messages[i - 1].senderId !== msg.senderId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} ${showSender ? 'mt-2' : ''}`}>
                {showSender && !isMine && (
                  <span className="text-[10px] text-on-surface-variant/50 font-label-mono mb-1 ml-1">{msg.sender.username}</span>
                )}
                <div className={`max-w-[85%] md:max-w-[70%] px-3.5 py-2.5 md:px-4 md:py-3 ${
                  isMine
                    ? 'bg-primary text-background rounded-2xl rounded-br-md'
                    : 'bg-white/5 rounded-2xl rounded-bl-md'
                }`}>
                  <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1.5 ${isMine ? 'text-background/50' : 'text-on-surface-variant/50'} text-right`}>
                    {formatTime(msg.createdAt, locale)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="shrink-0 px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 bg-surface-container-low rounded-none border-t border-white/10 p-3 md:p-4 safe-bottom">
        <div className="max-w-3xl mx-auto flex items-center gap-2 md:gap-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={locale === 'ru' ? 'Напишите сообщение...' : locale === 'uz' ? 'Xabar yozing...' : 'Type a message...'}
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base text-white placeholder-on-surface-variant/50 outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
            disabled={sending}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-primary to-secondary text-background p-3 md:p-3.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(194,193,255,0.3)] transition-all active:scale-95 shrink-0"
          >
            {sending ? (
              <span className="material-symbols-outlined text-lg md:text-xl block animate-pulse" data-icon="more_horiz">more_horiz</span>
            ) : (
              <span className="material-symbols-outlined text-lg md:text-xl block" data-icon="send">send</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
