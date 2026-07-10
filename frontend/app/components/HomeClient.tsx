"use client";

import { useCallback, useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import UploadZone from "./UploadZone";
import PreviewTable from "./PreviewTable";
import ProcessingOverlay from "./ProcessingOverlay";
import ResultsDashboard from "./ResultsDashboard";
import { parseCsvFile, type ParseResult } from "@/app/lib/csvParser";
import { importCsv } from "@/app/lib/api";
import type { AppStep, ImportResult } from "@/app/lib/types";
import Link from "next/link";

export default function HomeClient() {
  const [step, setStep] = useState<AppStep>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [retryInfo, setRetryInfo] = useState<{
    attempt: number;
    maxRetries: number;
  } | null>(null);

  const handleFileSelected = useCallback(async (selectedFile: File) => {
    setError(null);
    setIsParsing(true);
    try {
      const result = await parseCsvFile(selectedFile);
      if (result.rows.length === 0) {
        setError("The CSV file has no data rows.");
        setIsParsing(false);
        return;
      }
      setFile(selectedFile);
      setParseResult(result);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV file.");
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!file) return;
    setStep("processing");
    setError(null);
    setRetryInfo(null);

    try {
      const result = await importCsv(file, (attempt, maxRetries) => {
        setRetryInfo({ attempt, maxRetries });
      });
      setImportResult(result);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed. Please try again.");
      setStep("preview");
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setStep("idle");
    setFile(null);
    setParseResult(null);
    setImportResult(null);
    setError(null);
    setRetryInfo(null);
  }, []);

  return (
    <>
      {step === "processing" && <ProcessingOverlay retryInfo={retryInfo} />}

      {/* Cyber grid background */}
      <div className="cyber-grid" />

      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.04)_0%,transparent_60%)] blur-[80px]" />
        <div className="absolute bottom-[-30%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(0,255,204,0.03)_0%,transparent_60%)] blur-[80px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[30%] rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.02)_0%,transparent_70%)] blur-[100px]" />
      </div>

      {/* Scanline overlay */}
      <div className="scanline" />

      {/* Main layout */}
      <div className="relative z-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="
          py-3.5 px-6 flex items-center justify-between
          border-b border-accent/10 bg-bg-card/80 backdrop-blur-xl
          sticky top-0 z-100
        ">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo */}
            <div className="
              w-9 h-9 rounded-lg accent-gradient
              flex items-center justify-center
              text-white font-extrabold text-base
            "
              style={{ boxShadow: '0 0 16px var(--accent-glow)' }}
            >
              G
            </div>
            <div>
              <h1 className="text-[1rem] font-bold text-text-primary leading-tight tracking-tight">
                GrowEasy
              </h1>
              <p className="hex-badge text-text-muted">
                ai csv importer
              </p>
            </div>
          </Link>

          {/* Status indicator + toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 hex-badge text-accent/60">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" style={{ boxShadow: '0 0 6px var(--accent-glow)' }} />
              system online
            </div>
            <DarkModeToggle />
          </div>
        </header>

        {/* Content */}
        <main
          className={`
            flex-1 flex flex-col items-center py-10 px-6 pb-16
            w-full mx-auto transition-[max-width] duration-500
            ${step === "idle" ? "max-w-[720px]" : "max-w-[1200px]"}
          `}
        >
          {/* Hero (idle only) */}
          {step === "idle" && (
            <div className="animate-fade-in text-center mb-14">
              {/* Hex label */}
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-accent/6 border border-accent/15 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                <span className="hex-badge text-accent">ai-powered import engine</span>
              </div>

              <h2 className="gradient-text text-[clamp(2rem,5.5vw,3.2rem)] font-extrabold leading-[1.1] mb-5 tracking-tight">
                Import Any CSV.
                <br />
                AI Does the Mapping.
              </h2>
              <p className="text-[clamp(0.9rem,2vw,1.05rem)] text-text-secondary max-w-[520px] mx-auto leading-relaxed">
                Upload CSV files from any source — Facebook Leads, Google Ads,
                CRM exports, spreadsheets — and let our AI map them to GrowEasy
                CRM format automatically.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {["Facebook Leads", "Google Ads", "CRM Exports", "Excel", "Custom CSVs"].map((f) => (
                  <span
                    key={f}
                    className="hex-badge py-1.5 px-3.5 rounded-lg bg-bg-card border border-border-default text-text-muted hover:border-accent/30 hover:text-accent transition-all duration-200 cursor-default"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stepper */}
          {step !== "idle" && step !== "processing" && (
            <div className="flex items-center gap-0 mb-8 w-full max-w-[480px]">
              {[
                { label: "Upload", stepKey: "idle" },
                { label: "Preview", stepKey: "preview" },
                { label: "Results", stepKey: "results" },
              ].map((s, i, arr) => {
                const stepOrder = ["idle", "preview", "results"];
                const currentIdx = stepOrder.indexOf(step);
                const thisIdx = stepOrder.indexOf(s.stepKey);
                const isDone = thisIdx < currentIdx;
                const isActive = thisIdx === currentIdx;

                return (
                  <div key={s.label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          font-bold text-[0.78rem] transition-all duration-300
                          ${isDone
                            ? "bg-accent text-white"
                            : isActive
                              ? "bg-accent/15 text-accent border border-accent/40"
                              : "bg-bg-secondary text-text-muted border border-border-default"
                          }
                        `}
                        style={isDone ? { boxShadow: '0 0 12px var(--accent-glow)' } : undefined}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                      <span className={`hex-badge ${isActive ? "text-accent" : "text-text-muted"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className={`
                          flex-1 h-px mx-3 mb-5 transition-colors duration-300
                          ${isDone ? "bg-accent" : "bg-border-default"}
                        `}
                        style={isDone ? { boxShadow: '0 0 4px var(--accent-glow)' } : undefined}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="animate-slide-down w-full max-w-[640px] mb-6 py-3.5 px-5 rounded-xl bg-error/10 border border-error/20 text-error text-sm flex items-center gap-2.5">
              <span className="text-lg">❌</span>
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="bg-transparent border-none text-error cursor-pointer text-lg p-1 hover:opacity-70 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}

          {step === "idle" && (
            <UploadZone onFileSelected={handleFileSelected} isLoading={isParsing} />
          )}

          {step === "preview" && parseResult && (
            <PreviewTable
              headers={parseResult.headers}
              rows={parseResult.rows}
              onConfirm={handleConfirm}
              onCancel={handleReset}
            />
          )}

          {step === "results" && importResult && (
            <ResultsDashboard result={importResult} onReset={handleReset} />
          )}
        </main>

        {/* Footer */}
        <footer className="
          py-4 px-6 text-center border-t border-accent/10
          hex-badge text-text-muted tracking-widest
        ">
          groweasy csv importer · ai-powered crm import
        </footer>
      </div>
    </>
  );
}
