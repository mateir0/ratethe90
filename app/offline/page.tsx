import { AppShell } from "@/components/app-shell";

export default function OfflinePage() {
  return (
    <AppShell>
      <main className="pt-16 text-center space-y-2">
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-[#94A3B8]">Core app shell is available. Match data will refresh when connection returns.</p>
      </main>
    </AppShell>
  );
}
