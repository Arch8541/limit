'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  show: boolean;
  title?: string;
  message?: string;
  onComplete?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function SuccessAnimation({
  show,
  title = 'Success!',
  message,
  onComplete,
  autoClose = true,
  duration = 3000,
}: SuccessAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      if (autoClose) {
        const timer = setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [show, autoClose, duration, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 success-animation">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <CheckCircle2 className="w-20 h-20 text-teal-600 success-animation" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          {message && <p className="text-gray-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}

interface ConfettiProps {
  show: boolean;
}

export function Confetti({ show }: ConfettiProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 10}%`,
            backgroundColor: ['#0D9488', '#14B8A6', '#F97316', '#FB923C', '#FBBF24'][
              Math.floor(Math.random() * 5)
            ],
            animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
