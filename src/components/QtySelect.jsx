export default function QtySelect({ value, onChange, max = 10, className = "" }) {
  const limit = Math.max(1, Math.min(max, 10));
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm ${className}`}
    >
      {Array.from({ length: limit }, (_, i) => i + 1).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}
