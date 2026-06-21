'use client';

export default function ContactSellerButton({ sellerId, productId, label = 'Написать' }: { sellerId: number; productId: number; label?: string }) {
  const getLocale = () => {
    if (typeof window === 'undefined') return 'ru';
    const match = window.location.pathname.match(/^\/(ru|uz|en)(\/|$)/);
    return match ? match[1] : 'ru';
  };

  const handleClick = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, productId })
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = `/${getLocale()}/login`;
        return;
      }

      if (data.conversation?.id) {
        window.location.href = `/${getLocale()}/chat/${data.conversation.id}`;
      } else {
        console.error('Chat API error:', data);
      }
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-xs font-label-mono text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 active:scale-95"
    >
      <span className="material-symbols-outlined text-[14px]" data-icon="chat">chat</span>
      {label}
    </button>
  );
}
