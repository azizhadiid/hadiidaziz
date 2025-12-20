'use client'

import React from 'react';

export function LoginBackground() {
    return (
        <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDuration: '7s' }} />
                <div className="absolute top-40 right-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }} />
            </div>

            <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style>
        </>
    );
}