export default function DealsStrip() {
  const items = ["Free shipping over $50", "24/7 support", "Easy 30-day returns", "Secure checkout", "New arrivals weekly"];
  const full = [...items, ...items];
  return (
    <section className="border-y border-gray-200 bg-white py-3">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap px-6 text-sm font-medium text-muted">
          {full.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
