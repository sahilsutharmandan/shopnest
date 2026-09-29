import Hero from "@/components/Hero";
import CategoryChips from "@/components/CategoryChips";
import DealsStrip from "@/components/DealsStrip";
import FeaturedRow from "@/components/FeaturedRow";
import { TruckIcon, ShieldIcon, CheckIcon } from "@/components/Icons";
import Link from "next/link";

const perks = [
  { icon: TruckIcon, title: "Free shipping", copy: "On orders over $50" },
  { icon: ShieldIcon, title: "Secure payments", copy: "Encrypted at checkout" },
  { icon: CheckIcon, title: "30-day returns", copy: "No questions asked" },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <DealsStrip />
      <section className="container-page py-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Shop by category</h2>
          <Link href="/products" className="text-sm font-semibold text-brand-600">View all</Link>
        </div>
        <CategoryChips />
      </section>

      <FeaturedRow />

      <section className="container-page grid gap-4 py-8 sm:grid-cols-3">
        {perks.map((perk) => (
          <div key={perk.title} className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-card">
            <perk.icon className="h-6 w-6 text-brand-600" />
            <div>
              <p className="font-semibold">{perk.title}</p>
              <p className="text-sm text-muted">{perk.copy}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
