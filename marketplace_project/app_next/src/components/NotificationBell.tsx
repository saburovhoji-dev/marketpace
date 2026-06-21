'use client';

import { useEffect, useState, useRef } from 'react';
import { Link } from '@/i18n/routing';

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = () => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(data => {
          if (data.notifications) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(() => {});
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="material-symbols-outlined text-on-surface-variant hover:bg-white/5 p-2 rounded-full transition-all duration-300 relative"
        data-icon="notifications"
      >
        notifications
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_6px_rgba(255,180,171,0.5)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 max-h-[70vh] glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-bold text-sm">Уведомления</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[11px] text-primary hover:underline font-label-mono">
                Прочитать все
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant/60 text-sm">
                Нет уведомлений
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                  onClick={() => {
                    fetch('/api/notifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ notificationId: n.id })
                    });
                    setOpen(false);
                    if (n.link) window.location.href = n.link;
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-lg mt-0.5 ${n.type === 'purchase_sold' ? 'text-green-400' : n.type === 'purchase_bought' ? 'text-primary' : 'text-tertiary'}`}>
                      {n.type === 'purchase_sold' ? 'payments' : n.type === 'purchase_bought' ? 'shopping_cart' : 'notifications'}
                    </span>
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                      <p className="text-xs text-on-surface-variant/70 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-on-surface-variant/40 mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
