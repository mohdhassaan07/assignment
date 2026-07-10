"use client";

import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("./components/HomeClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary">
      <div className="w-12 h-12 border-[3px] border-border-default border-t-accent rounded-full animate-spin" />
    </div>
  ),
});

export default function Page() {
  return <HomeClient />;
}
