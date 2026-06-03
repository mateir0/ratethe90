export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#22304A] bg-[#111B2E] p-6 text-center">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-[#94A3B8]">{description}</p>
    </div>
  );
}
