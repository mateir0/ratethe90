export function RatingPill({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-[#94A3B8]">No rating</span>;
  const color = rating >= 8 ? "bg-emerald-500" : rating >= 6 ? "bg-lime-500" : rating >= 4 ? "bg-amber-500" : "bg-rose-500";
  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold text-black ${color}`}>{rating.toFixed(1)}</span>;
}
