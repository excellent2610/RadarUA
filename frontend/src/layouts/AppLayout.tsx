import type { PropsWithChildren } from "react";

export function AppLayout({ children }: PropsWithChildren) {
  return <main className="min-h-screen overflow-hidden bg-radar-black text-slate-100">{children}</main>;
}

