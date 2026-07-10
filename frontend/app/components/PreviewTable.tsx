"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { CsvRow } from "@/app/lib/types";

interface PreviewTableProps {
  headers: string[];
  rows: CsvRow[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PreviewTable({
  headers,
  rows,
  onConfirm,
  onCancel,
}: PreviewTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 15,
  });

  return (
    <div className="animate-slide-up w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[clamp(1.15rem,2.5vw,1.5rem)] font-bold text-text-primary tracking-tight">
            CSV Preview
          </h2>
          <span className="hex-badge py-1.5 px-3 rounded-lg bg-accent/10 text-accent border border-accent/20">
            {rows.length.toLocaleString()} rows
          </span>
          <span className="hex-badge py-1.5 px-3 rounded-lg bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
            {headers.length} cols
          </span>
        </div>

        <div className="flex gap-2.5">
          <button
            id="cancel-preview-btn"
            onClick={onCancel}
            className="
              py-2.5 px-6 rounded-xl border border-border-default bg-transparent
              text-text-secondary font-semibold text-sm cursor-pointer
              transition-all duration-200
              hover:border-error/40 hover:text-error hover:bg-error/5
            "
          >
            Cancel
          </button>
          <button
            id="confirm-import-btn"
            onClick={onConfirm}
            className="
              py-2.5 px-7 rounded-xl border-none accent-gradient
              text-white font-bold text-sm cursor-pointer
              transition-all duration-200 hover:-translate-y-0.5
              flex items-center gap-2
            "
            style={{ boxShadow: '0 0 16px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.2)' }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            CONFIRM IMPORT
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden rounded-2xl animate-border-glow">
        <div
          ref={parentRef}
          id="preview-table-scroll"
          className="overflow-auto"
          style={{ height: Math.min(rows.length * 44 + 48, 520) }}
        >
          <div className="w-max min-w-full">
            {/* Sticky header */}
            <div className="flex sticky top-0 z-10 bg-bg-secondary border-b border-accent/10">
              <div className="min-w-14 max-w-14 py-3 px-3 font-bold text-[0.7rem] text-accent/60 uppercase tracking-widest flex items-center sticky left-0 z-11g-bg-secondary">
                #
              </div>
              {headers.map((h) => (
                <div
                  key={h}
                  className="min-w-40 max-w-[260px] py-3 px-4 font-bold text-[0.7rem] text-accent/60 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis"
                  title={h}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="relative" style={{ height: rowVirtualizer.getTotalSize() }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                const isEven = virtualRow.index % 2 === 0;
                return (
                  <div
                    key={virtualRow.key}
                    className={`
                      absolute top-0 left-0 w-full flex items-center
                      border-b border-border-subtle transition-colors duration-150
                      hover:bg-accent/3
                      ${isEven ? "bg-transparent" : "bg-border-subtle"}
                    `}
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className="min-w-14 max-w-14 px-3 text-[0.78rem] text-text-muted font-medium font-mono sticky left-0 bg-inherit z-5">
                      {virtualRow.index + 1}
                    </div>
                    {headers.map((h) => (
                      <div
                        key={h}
                        className="min-w-40 max-w-[260px] px-4 text-[0.85rem] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis"
                        title={row[h] ?? ""}
                      >
                        {row[h] || (
                          <span className="text-text-muted/50 italic">—</span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="hex-badge mt-4 text-text-muted text-center">
        scroll horizontally to view all columns · review before confirming
      </p>
    </div>
  );
}
