"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen bg-[#020a04] text-[#e0fff0]">
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-[#3a7a55] mb-8">{error.message}</p>
        <button
          onClick={() => reset()}
          className="py-3 px-8 rounded-xl bg-[linear-gradient(135deg,#00cc6a,#00ff88,#00ffcc)] text-black font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
