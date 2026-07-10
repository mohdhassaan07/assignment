"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ge-dark-mode");
    const prefersDark = saved ? saved === "true" : true;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("ge-dark-mode", String(next));
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        relative w-11 h-11 rounded-full cursor-pointer
        flex items-center justify-center text-xl overflow-hidden
        transition-all duration-300
        border border-accent/20 bg-bg-card text-text-primary
        hover:border-accent/50 hover:shadow-[0_0_16px_rgba(0,255,136,0.15)]
        backdrop-blur-sm
      "
    >
      <span
        className="absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transform: dark ? "translateY(0) rotate(0deg)" : "translateY(-40px) rotate(-90deg)",
          opacity: dark ? 1 : 0,
        }}
      >
        🌙
      </span>
      <span
        className="absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transform: dark ? "translateY(40px) rotate(90deg)" : "translateY(0) rotate(0deg)",
          opacity: dark ? 0 : 1,
        }}
      >
        ☀️
      </span>
    </button>
  );
}
