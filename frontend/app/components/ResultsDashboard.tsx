"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { CrmRecord, ImportResult, SkippedRecord } from "@/app/lib/types";

interface ResultsDashboardProps {
  result: ImportResult;
  onReset: () => void;
}

const CRM_COLUMNS: { key: keyof CrmRecord; label: string; wide?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email", wide: true },
  { key: "country_code", label: "Code" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "lead_owner", label: "Lead Owner" },
  { key: "crm_status", label: "Status" },
  { key: "crm_note", label: "CRM Note", wide: true },
  { key: "data_source", label: "Source" },
  { key: "possession_time", label: "Possession" },
  { key: "created_at", label: "Created At" },
  { key: "description", label: "Description", wide: true },
];

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);

  return <>{value.toLocaleString()}</>;
}

/* ------------------------------------------------------------------ */
/*  Imported Table (Virtualized)                                       */
/* ------------------------------------------------------------------ */
function ImportedTable({ records }: { records: CrmRecord[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: records.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 15,
  });

  if (records.length === 0) {
    return (
      <div className="text-center py-16 px-6 text-text-muted">
        <span className="text-5xl block mb-4">📭</span>
        <p>No records were successfully imported.</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      id="imported-table-scroll"
      className="overflow-auto"
      style={{ height: Math.min(records.length * 44 + 48, 480) }}
    >
      <div className="w-max min-w-full">
        <div className="flex sticky top-0 z-10 bg-bg-secondary border-b border-accent/10">
          <div className="min-w-[50px] max-w-[50px] py-3 px-2 font-bold text-[0.68rem] text-accent/50 uppercase tracking-widest sticky left-0 z-[11] bg-bg-secondary flex items-center">
            #
          </div>
          {CRM_COLUMNS.map((col) => (
            <div
              key={col.key}
              className={`py-3 px-3.5 font-bold text-[0.68rem] text-accent/50 uppercase tracking-widest whitespace-nowrap ${col.wide ? "min-w-[200px]" : "min-w-[130px]"} max-w-[260px]`}
            >
              {col.label}
            </div>
          ))}
        </div>

        <div className="relative" style={{ height: rowVirtualizer.getTotalSize() }}>
          {rowVirtualizer.getVirtualItems().map((vRow) => {
            const rec = records[vRow.index];
            const isEven = vRow.index % 2 === 0;
            return (
              <div
                key={vRow.key}
                className={`
                  absolute top-0 left-0 w-full flex items-center
                  border-b border-border-subtle transition-colors duration-150
                  hover:bg-accent/[0.03]
                  ${isEven ? "bg-transparent" : "bg-border-subtle"}
                `}
                style={{
                  height: vRow.size,
                  transform: `translateY(${vRow.start}px)`,
                }}
              >
                <div className="min-w-[50px] max-w-[50px] px-2 text-[0.76rem] text-text-muted font-medium font-mono sticky left-0 bg-[inherit] z-[5]">
                  {vRow.index + 1}
                </div>
                {CRM_COLUMNS.map((col) => (
                  <div
                    key={col.key}
                    className={`px-3.5 text-[0.83rem] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis ${col.wide ? "min-w-[200px]" : "min-w-[130px]"} max-w-[260px]`}
                    title={rec[col.key]}
                  >
                    {rec[col.key] || (
                      <span className="text-text-muted/40 italic">—</span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skipped Table                                                      */
/* ------------------------------------------------------------------ */
function SkippedTable({ records }: { records: SkippedRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-16 px-6 text-text-muted">
        <span className="text-5xl block mb-4">🎉</span>
        <p>All records were successfully imported!</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[400px]">
      <table className="w-full border-collapse text-[0.85rem]">
        <thead>
          <tr className="sticky top-0 bg-bg-secondary z-[5]">
            <th className="py-3 px-4 text-left font-bold text-[0.68rem] uppercase tracking-widest text-accent/50 border-b border-accent/10 w-[100px]">
              Row #
            </th>
            <th className="py-3 px-4 text-left font-bold text-[0.68rem] uppercase tracking-widest text-accent/50 border-b border-accent/10">
              Reason
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr
              key={rec.sourceRowNumber}
              className="border-b border-border-subtle transition-colors duration-150 hover:bg-accent/[0.03]"
            >
              <td className="py-2.5 px-4 font-mono text-text-muted font-medium text-sm">
                {rec.sourceRowNumber}
              </td>
              <td className="py-2.5 px-4 text-error">
                {rec.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CSV Export                                                         */
/* ------------------------------------------------------------------ */
function exportToCsv(records: CrmRecord[]) {
  const headers = CRM_COLUMNS.map((c) => c.label);
  const csvRows = [
    headers.join(","),
    ...records.map((rec) =>
      CRM_COLUMNS.map((c) => {
        const val = rec[c.key];
        return `"${(val ?? "").replace(/"/g, '""')}"`;
      }).join(","),
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `groweasy_import_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================================================================== */
/*  Results Dashboard                                                  */
/* ================================================================== */
export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"imported" | "skipped">("imported");
  const { records, skippedRecords, summary } = result;

  const summaryCards = [
    {
      label: "Total Rows",
      value: summary.totalRows,
      icon: "📊",
      colorClass: "text-accent-cyan",
      glowClass: "",
      glowStyle: { boxShadow: '0 0 20px rgba(13, 148, 136, 0.12)' },
      borderClass: "border-accent-cyan/15",
    },
    {
      label: "Imported",
      value: summary.imported,
      icon: "✅",
      colorClass: "text-accent",
      glowClass: "",
      glowStyle: { boxShadow: '0 0 20px var(--accent-glow)' },
      borderClass: "border-accent/15",
    },
    {
      label: "Skipped",
      value: summary.skipped,
      icon: "⚠️",
      colorClass: summary.skipped > 0 ? "text-warning" : "text-accent",
      glowClass: "",
      glowStyle: summary.skipped > 0 ? { boxShadow: '0 0 20px rgba(255,170,0,0.12)' } : { boxShadow: '0 0 20px var(--accent-glow)' },
      borderClass: summary.skipped > 0 ? "border-warning/15" : "border-accent/15",
    },
  ];

  return (
    <div className="animate-slide-up w-full">
      {/* Title row */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h2 className="text-[clamp(1.2rem,3vw,1.6rem)] font-bold text-text-primary tracking-tight">
          Import Results
        </h2>
        <div className="flex gap-2.5">
          {records.length > 0 && (
            <button
              id="export-csv-btn"
              onClick={() => exportToCsv(records)}
              className="
                py-2.5 px-5 rounded-xl border border-border-default bg-transparent
                text-text-secondary font-semibold text-[0.85rem] cursor-pointer
                transition-all duration-200
                hover:border-accent/40 hover:text-accent hover:bg-accent/5
                flex items-center gap-2
              "
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export
            </button>
          )}
          <button
            id="import-another-btn"
            onClick={onReset}
            className="
              py-2.5 px-6 rounded-xl border-none accent-gradient
              text-white font-bold text-[0.85rem] cursor-pointer
              transition-all duration-200 hover:-translate-y-0.5
              flex items-center gap-2
            "
            style={{ boxShadow: '0 0 16px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.2)' }}
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Import Another
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-7">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`glass-card rounded-2xl py-6 px-5 text-center relative overflow-hidden ${card.glowClass} ${card.borderClass} border`}
            style={card.glowStyle}
          >
            {/* Background icon */}
            <span className="absolute top-3 right-4 text-[36px] opacity-[0.06]">
              {card.icon}
            </span>

            {/* Corner accents */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-accent/20 rounded-tl-sm" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-accent/20 rounded-br-sm" />

            <p className="hex-badge text-text-muted mb-2">
              {card.label}
            </p>
            <p className={`text-[2.2rem] font-extrabold leading-none animate-count-up ${card.colorClass}`}>
              <AnimatedCounter target={card.value} />
            </p>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-0 bg-bg-secondary rounded-t-xl overflow-hidden border-b border-accent/10">
        <button
          id="tab-imported"
          onClick={() => setActiveTab("imported")}
          className={`
            flex-1 py-3 px-5 border-none font-bold text-[0.85rem] cursor-pointer transition-all duration-200
            ${activeTab === "imported"
              ? "bg-bg-card text-accent border-b-2 border-accent shadow-[inset_0_-2px_8px_rgba(0,255,136,0.06)]"
              : "bg-transparent text-text-muted border-b-2 border-transparent hover:text-text-secondary"
            }
          `}
        >
          ✅ Imported ({summary.imported})
        </button>
        <button
          id="tab-skipped"
          onClick={() => setActiveTab("skipped")}
          className={`
            flex-1 py-3 px-5 border-none font-bold text-[0.85rem] cursor-pointer transition-all duration-200
            ${activeTab === "skipped"
              ? "bg-bg-card text-warning border-b-2 border-warning shadow-[inset_0_-2px_8px_rgba(255,170,0,0.06)]"
              : "bg-transparent text-text-muted border-b-2 border-transparent hover:text-text-secondary"
            }
          `}
        >
          ⚠️ Skipped ({summary.skipped})
        </button>
      </div>

      {/* Table panel */}
      <div className="glass-card rounded-t-none rounded-b-2xl overflow-hidden border-t-0">
        {activeTab === "imported" ? (
          <ImportedTable records={records} />
        ) : (
          <SkippedTable records={skippedRecords} />
        )}
      </div>
    </div>
  );
}
