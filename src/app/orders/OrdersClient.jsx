"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/format";
import { CheckIcon, TruckIcon } from "@/components/Icons";

function currentStatus(order) {
  const placed = new Date(order.placedAt).getTime();
  const hours = (Date.now() - placed) / 36e5;
  if (hours < 2) return { label: "Order placed", step: 0 };
  if (hours < 24) return { label: "Packed", step: 1 };
  return { label: "Shipped", step: 2 };
}

export default function OrdersClient() {
  const orders = useSelector((state) => state.orders.list);
  const params = useSearchParams();
  const highlight = params.get("highlight");

  if (orders.length === 0) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-card">
          <TruckIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted">Your orders will show up here after your first checkout.</p>
          <Link href="/products" className="btn-primary mt-6 inline-flex">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">My orders</h1>
      <ul className="mt-6 space-y-4">
        {orders.map((order) => {
          const status = currentStatus(order);
          return (
            <li key={order.id} className={`rounded-2xl bg-white p-6 shadow-card ${highlight === order.id ? "ring-2 ring-brand-500" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">Placed {formatDate(order.placedAt)}</p>
                  <p className="text-lg font-bold">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Total</p>
                  <p className="text-lg font-bold">{formatPrice(order.totals.total)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${status.step >= i ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                      {status.step > i ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={status.step === i ? "font-semibold" : "text-muted"}>
                      {["Placed", "Packed", "Shipped"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                    <img src={item.thumbnail} alt="" className="h-10 w-10 rounded object-cover" />
                    <span>{item.title} × {item.qty}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
