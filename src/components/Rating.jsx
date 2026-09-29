import { StarIcon } from "./Icons";

export default function Rating({ value, count, size = "h-4 w-4" }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} filled={n <= rounded} className={size} />
        ))}
      </div>
      <span className="text-xs text-muted">
        {value.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}
