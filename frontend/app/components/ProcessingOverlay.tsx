"use client";

import { useEffect, useState } from "react";

interface ProcessingOverlayProps {
  retryInfo?: { attempt: number; maxRetries: number } | null;
}

const STEPS = [
  { label: "Uploading file", icon: "📤" },
  { label: "Sending to AI engine", icon: "🧠" },
  { label: "Mapping CRM fields", icon: "🔗" },
  { label: "Finalizing records", icon: "✅" },
];

export default function ProcessingOverlay({ retryInfo }: ProcessingOverlayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(1), 1200),
      setTimeout(() => setCurrentStep(2), 3500),
      setTimeout(() => setCurrentStep(3), 8000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec.toString().padStart(2, "0")}s` : `${sec}s`;
  };

  return (
    <div className="animate-fade-in fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xl z-1000 p-6">
      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${i % 3 === 0 ? "bg-accent" : i % 3 === 1 ? "bg-accent-cyan" : "bg-accent-dim"}`}
          style={{
            width: 2 + (i % 3) * 1.5 + 1,
            height: 2 + (i % 3) * 1.5 + 1,
            left: `${8 + (i * 7.5) % 85}%`,
            bottom: `-${6 + (i % 4) * 3}px`,
            opacity: 0,
            animationName: "particle-float",
            animationDuration: `${5 + (i % 4)}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}

      <div className="glass-card animate-slide-up py-12 px-10 max-w-[480px] w-full text-center relative rounded-2xl border-accent/20">
        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent/40 rounded-tl pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent/40 rounded-tr pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent/40 rounded-bl pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent/40 rounded-br pointer-events-none" />

        {/* Spinner ring */}
        <div className="w-20 h-20 mx-auto mb-7 relative">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className="animate-spin"
            style={{ animationDuration: "2s" }}
          >
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,255,136,0.08)" strokeWidth="3" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="url(#greenGrad)" strokeWidth="3"
              strokeLinecap="round" strokeDasharray="70 144"
            />
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#00ffcc" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            {STEPS[currentStep]?.icon}
          </span>
        </div>

        {/* Title */}
        <h2 className="gradient-text text-xl font-bold mb-2 tracking-tight">AI Processing</h2>
        <p className="text-sm text-text-secondary mb-8">
          Our AI is analyzing your CSV and mapping fields to GrowEasy CRM format.
        </p>

        {/* Steps */}
        <div className="text-left mb-7 space-y-1">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <div
                key={step.label}
                className={`
                  flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200
                  ${isActive ? "bg-accent/6 border border-accent/10" : "border border-transparent"}
                `}
              >
                <div
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center
                    text-xs font-bold transition-all duration-300
                    ${isDone
                      ? "bg-accent text-white"
                      : isActive
                        ? "bg-accent/20 text-accent border border-accent/40"
                        : "bg-bg-secondary text-text-muted"
                    }
                  `}
                  style={isDone ? { boxShadow: '0 0 10px var(--accent-glow)' } : undefined}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <span
                  className={`
                    text-[0.85rem] transition-all duration-150
                    ${isDone ? "text-accent font-medium" : isActive ? "text-text-primary font-semibold" : "text-text-muted"}
                  `}
                >
                  {step.label}
                </span>
                {isActive && (
                  <span className="animate-pulse-subtle ml-auto hex-badge text-accent">
                    running…
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Retry */}
        {retryInfo && (
          <div className="animate-slide-down py-2.5 px-4 rounded-lg bg-warning/10 border border-warning/20 text-[0.82rem] text-warning mb-4 flex items-center gap-2">
            <span>🔄</span>
            Retry attempt {retryInfo.attempt} of {retryInfo.maxRetries}…
          </div>
        )}

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-accent/10 overflow-hidden mb-4">
          <div
            className="h-full rounded-full accent-gradient transition-[width] duration-1000 ease-out shadow-[0_0_12px_rgba(0,255,136,0.5)]"
            style={{ width: `${Math.min(((currentStep + 1) / STEPS.length) * 100, 95)}%` }}
          />
        </div>

        {/* Timer */}
        <p className="hex-badge text-text-muted tracking-[0.15em]">
          elapsed: {formatTime(elapsed)}
        </p>
      </div>
    </div>
  );
}
