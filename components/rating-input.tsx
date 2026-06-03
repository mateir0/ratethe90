"use client";

type Props = {
  value: number;
  onChange: (v: number) => void;
};

function clamp(v: number) {
  return Math.max(0, Math.min(10, Math.round(v * 2) / 2));
}

export function RatingInput({ value, onChange }: Props) {
  const color = value >= 8 ? "text-emerald-400" : value >= 6 ? "text-lime-400" : value >= 4 ? "text-amber-400" : "text-rose-400";
  return (
    <div className="space-y-2">
      <p className={`text-3xl font-bold ${color}`}>{value.toFixed(1)}</p>
      <input
        aria-label="Rating"
        type="range"
        min={0}
        max={10}
        step={0.5}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="w-full"
      />
      <div className="flex gap-2">
        <button type="button" className="rounded bg-[#22304A] px-3 py-1" onClick={() => onChange(clamp(value - 0.5))}>-</button>
        <button type="button" className="rounded bg-[#22304A] px-3 py-1" onClick={() => onChange(clamp(value + 0.5))}>+</button>
      </div>
    </div>
  );
}
