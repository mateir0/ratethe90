import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-[#0B1220] text-[#E5E7EB] pb-20 px-4 pt-4">
      {children}
    </div>
  );
}
