"use client";

import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function UploadZone({ onFileSelected, isLoading }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setError("Please upload a valid CSV file.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 10 MB limit.");
        return;
      }
      if (file.size === 0) {
        setError("The selected file is empty.");
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
      e.target.value = "";
    },
    [validateAndSelect],
  );

  return (
    <div className="animate-slide-up w-full max-w-[640px] mx-auto">
      {/* Drop zone */}
      <div
        id="upload-drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        className={`
          group relative py-16 px-8 rounded-2xl border-2 border-dashed text-center
          transition-all duration-300 overflow-hidden neon-border
          ${isDragOver
            ? "border-accent bg-accent/4"
            : "border-border-default bg-bg-card"
          }
          ${isLoading ? "cursor-wait pointer-events-none" : "cursor-pointer"}
          hover:border-accent/40
        `}
        style={{
          boxShadow: isDragOver
            ? '0 0 40px var(--accent-glow)'
            : undefined,
        }}
      >
        {/* Drag-over glow sweep */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-[inherit] accent-gradient opacity-[0.06] animate-gradient-shift bg-size-[200%_200%] pointer-events-none" />
        )}

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-accent/30 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-accent/30 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-accent/30 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-accent/30 rounded-br-sm pointer-events-none" />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              mx-auto mb-7 text-4xl transition-all duration-300
              border
              ${isDragOver
                ? "bg-accent/10 border-accent/30 animate-float"
                : "bg-bg-secondary border-border-default group-hover:border-accent/20"
              }
            `}
            style={isDragOver ? { boxShadow: '0 0 20px var(--accent-glow)' } : undefined}
          >
            {isLoading ? (
              <span className="animate-spin-slow">⏳</span>
            ) : isDragOver ? (
              "📥"
            ) : (
              "📄"
            )}
          </div>

          {/* Title */}
          <h2 className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-bold text-text-primary mb-2 tracking-tight">
            {isLoading
              ? "Parsing your file…"
              : isDragOver
                ? "Drop your CSV here"
                : "Upload your CSV file"}
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-text-secondary mb-7 leading-relaxed max-w-md mx-auto">
            {isLoading
              ? "We're reading your file to generate a preview."
              : "Drag & drop a CSV file here, or click to browse. Supports Facebook Leads, Google Ads exports, CRM exports, and more."}
          </p>

          {/* Browse button */}
          {!isLoading && (
            <div className="
              inline-flex items-center gap-2.5 py-3 px-8 rounded-xl
              accent-gradient text-white font-bold text-sm
              transition-all duration-300
              group-hover:-translate-y-0.5
            "
              style={{ boxShadow: '0 0 20px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.2)' }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              BROWSE FILES
            </div>
          )}

          {/* Constraints */}
          <p className="hex-badge text-text-muted mt-5">
            csv only · max 10 mb · up to 5,000 rows
          </p>
        </div>

        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="animate-slide-down mt-4 py-3.5 px-5 rounded-xl bg-error/10 border border-error/20 text-error text-sm flex items-center gap-2.5">
          <span className="text-lg">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
}
