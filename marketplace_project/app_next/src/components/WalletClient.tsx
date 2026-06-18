'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  email: string;
  balance: number;
}

export default function WalletClient({ initialUser, locale }: { initialUser: User; locale: string }) {
  const router = useRouter();
  const [balance, setBalance] = useState(initialUser.balance);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('50');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardName, setCardName] = useState(initialUser.username.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('123');
  const [isFlipped, setIsFlipped] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum })
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.balance);
        setSuccessMsg(`Successfully deposited $${amountNum.toFixed(2)} to your wallet!`);
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Deposit failed');
      }
    } catch (err) {
      setErrorMsg('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (val: string) => {
    setDepositAmount(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Balance Summary & Presets (Left Side) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(194,193,255,0.05)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="space-y-4">
            <span className="text-on-surface-variant font-label-mono text-xs uppercase tracking-widest">Available Funds</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-headline-lg font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
                ${balance.toFixed(2)}
              </span>
              <span className="text-on-surface-variant text-sm font-label-mono">USD</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400 font-label-mono">
              <span className="material-symbols-outlined text-sm" data-icon="check_circle">check_circle</span>
              Verified Safe Wallet Account
            </div>
          </div>
        </div>

        {/* Deposit Form & presets */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-xl font-headline-lg text-white">Select Top-Up Amount</h3>
          
          <div className="grid grid-cols-4 gap-3">
            {['10', '25', '50', '100'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => selectPreset(val)}
                className={`py-3 rounded-xl font-label-mono text-sm font-bold border transition-all ${
                  depositAmount === val
                    ? 'bg-primary text-on-primary border-primary hover:shadow-[0_0_15px_rgba(194,193,255,0.4)]'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                +${val}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-on-surface-variant font-label-mono text-[12px] ml-1">Custom Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-8 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body-md text-white font-bold"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Card Interface (Right Side) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Animated Card Display */}
        <div className="perspective-1000 w-full h-[220px]">
          <div
            className={`relative w-full h-full duration-700 preserve-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Card Front */}
            <div className="absolute inset-0 backface-hidden rounded-2xl p-6 bg-gradient-to-br from-primary via-[#6c63ff] to-tertiary border border-white/20 shadow-2xl flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-label-mono text-[9px] uppercase tracking-widest opacity-60">DigitalHub Card</span>
                  <div className="w-10 h-8 bg-yellow-400/80 rounded-md border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-neutral-800 text-[24px]" data-icon="dns">dns</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[36px] opacity-80" data-icon="contactless">contactless</span>
              </div>

              <div className="font-label-mono text-xl tracking-widest text-center py-2">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider opacity-60">Card Holder</span>
                  <span className="font-label-mono text-sm font-bold uppercase">{cardName || 'YOUR NAME'}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-wider opacity-60">Expires</span>
                  <span className="font-label-mono text-sm font-bold">{cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            {/* Card Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col justify-between py-6 text-white">
              <div className="w-full h-10 bg-black"></div>
              <div className="px-6 flex items-center justify-end gap-3">
                <span className="font-label-mono text-[9px] uppercase tracking-wider opacity-60">CVV</span>
                <div className="bg-white text-black font-label-mono px-3 py-1.5 rounded font-bold italic text-right w-16">
                  {cardCvv || '•••'}
                </div>
              </div>
              <div className="px-6 flex justify-between items-center text-[8px] font-label-mono opacity-50">
                <span>Authorized signature not required</span>
                <span>v2.0 SECURE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Form Inputs */}
        <form onSubmit={handleDeposit} className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-label-mono text-on-surface-variant ml-1">Card Number</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-label-mono text-white text-sm"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              onFocus={() => setIsFlipped(false)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-label-mono text-on-surface-variant ml-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-body-md text-white text-sm"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onFocus={() => setIsFlipped(false)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-label-mono text-on-surface-variant ml-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-label-mono text-white text-sm"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                onFocus={() => setIsFlipped(false)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-label-mono text-on-surface-variant ml-1">CVV</label>
              <input
                type="text"
                maxLength={3}
                placeholder="123"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-label-mono text-white text-sm"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                onFocus={() => setIsFlipped(true)}
              />
            </div>
          </div>

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" data-icon="check_circle">check_circle</span>
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" data-icon="error">error</span>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-container py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(194,193,255,0.4)] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Deposit $${depositAmount}`}
          </button>
        </form>
      </div>
    </div>
  );
}
