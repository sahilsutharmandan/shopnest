"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { placeOrder } from "@/store/ordersSlice";
import { showToast } from "@/store/toastSlice";
import { useCartItems, useCartTotals } from "@/hooks/useCart";
import { formatPrice, salePrice } from "@/lib/format";
import { shippingMethods } from "@/data/coupons";
import { CheckIcon } from "@/components/Icons";

const steps = ["Address", "Shipping", "Payment", "Review"];

export default function CheckoutClient() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useCartItems();
  const user = useSelector((state) => state.auth.user);
  const [step, setStep] = useState(0);
  const [shippingId, setShippingId] = useState("standard");
  const shipping = shippingMethods.find((s) => s.id === shippingId);
  const totals = useCartTotals(shipping.price);
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [payment, setPayment] = useState({ card: "", name: "", expiry: "", cvv: "" });
  const [paymentErrors, setPaymentErrors] = useState({});

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-lg font-medium">Nothing to check out</p>
        <Link href="/products" className="btn-primary mt-4 inline-flex">Browse products</Link>
      </div>
    );
  }

  function validateAddress() {
    const errors = {};
    if (!address.fullName.trim()) errors.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(address.email)) errors.email = "A valid email is required";
    if (!address.phone.trim()) errors.phone = "Phone is required";
    if (!address.line1.trim()) errors.line1 = "Street address is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!/^\d{4,6}$/.test(address.zip)) errors.zip = "ZIP must be 4-6 digits";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validatePayment() {
    const errors = {};
    const clean = payment.card.replace(/\s/g, "");
    if (!/^\d{16}$/.test(clean)) errors.card = "Card number must be 16 digits";
    if (!payment.name.trim()) errors.name = "Cardholder name is required";
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) errors.expiry = "Use MM/YY";
    if (!/^\d{3,4}$/.test(payment.cvv)) errors.cvv = "3-4 digits";
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function updateAddress(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function updatePayment(field, value) {
    setPayment((prev) => ({ ...prev, [field]: value }));
    if (paymentErrors[field]) {
      setPaymentErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleNext() {
    if (step === 0) {
      if (!validateAddress()) return;
    } else if (step === 2) {
      if (!validatePayment()) return;
    }
    setStep((s) => Math.min(3, s + 1));
  }

  function handlePlace() {
    if (!validateAddress()) {
      setStep(0);
      return;
    }
    if (!validatePayment()) {
      setStep(2);
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const clean = payment.card.replace(/\s/g, "");
      if (clean.startsWith("4000")) {
        setProcessing(false);
        setPaymentErrors({ card: "Your card was declined. Try a different one." });
        setStep(2);
        return;
      }
      const order = {
        id: "SN-" + Date.now(),
        placedAt: new Date().toISOString(),
        items: items.map((item) => ({ ...item, priceAt: salePrice(item) })),
        totals,
        address,
        shipping: shipping.label,
        status: "placed",
      };
      dispatch(placeOrder(order));
      dispatch(clearCart());
      dispatch(showToast("Order placed successfully"));
      setProcessing(false);
      router.push(`/orders?highlight=${order.id}`);
    }, 1500);
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <ol className="mt-6 flex flex-wrap gap-3 text-sm">
        {steps.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${step >= i ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {step > i ? <CheckIcon className="h-4 w-4" /> : i + 1}
            </span>
            <span className={step === i ? "font-semibold" : "text-muted"}>{label}</span>
            {i < steps.length - 1 && <span className="mx-2 text-muted">→</span>}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl bg-white p-6 shadow-card">
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-lg font-semibold">Shipping address</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={address.fullName} error={addressErrors.fullName} onChange={(v) => updateAddress("fullName", v)} />
                <Field label="Email" type="email" value={address.email} error={addressErrors.email} onChange={(v) => updateAddress("email", v)} />
                <Field label="Phone" value={address.phone} error={addressErrors.phone} onChange={(v) => updateAddress("phone", v)} />
                <Field label="Country" value={address.country} onChange={(v) => updateAddress("country", v)} />
                <div className="sm:col-span-2">
                  <Field label="Street address" value={address.line1} error={addressErrors.line1} onChange={(v) => updateAddress("line1", v)} />
                </div>
                <Field label="City" value={address.city} error={addressErrors.city} onChange={(v) => updateAddress("city", v)} />
                <Field label="State" value={address.state} error={addressErrors.state} onChange={(v) => updateAddress("state", v)} />
                <Field label="ZIP" value={address.zip} error={addressErrors.zip} onChange={(v) => updateAddress("zip", v)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-lg font-semibold">Shipping method</p>
              {shippingMethods.map((method) => (
                <label key={method.id} className={`flex cursor-pointer items-start justify-between rounded-xl border p-4 ${shippingId === method.id ? "border-brand-500 bg-brand-50" : "border-gray-200"}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={shippingId === method.id} onChange={() => setShippingId(method.id)} />
                      <span className="font-semibold">{method.label}</span>
                    </div>
                    <p className="ml-6 text-sm text-muted">{method.eta}</p>
                  </div>
                  <span className="font-semibold">{method.price === 0 ? "Free" : formatPrice(method.price)}</span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-lg font-semibold">Payment</p>
              <p className="text-sm text-muted">Use <strong>4242 4242 4242 4242</strong> to succeed or <strong>4000 0000 0000 0002</strong> to test a decline.</p>
              <Field label="Card number" placeholder="4242 4242 4242 4242" value={payment.card} error={paymentErrors.card} onChange={(v) => updatePayment("card", v.replace(/[^\d ]/g, "").slice(0, 19))} />
              <Field label="Name on card" value={payment.name} error={paymentErrors.name} onChange={(v) => updatePayment("name", v)} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry (MM/YY)" placeholder="04/29" value={payment.expiry} error={paymentErrors.expiry} onChange={(v) => updatePayment("expiry", v.replace(/[^\d/]/g, "").slice(0, 5))} />
                <Field label="CVV" placeholder="123" value={payment.cvv} error={paymentErrors.cvv} onChange={(v) => updatePayment("cvv", v.replace(/\D/g, "").slice(0, 4))} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-lg font-semibold">Review order</p>
              <div className="grid gap-3 rounded-xl bg-gray-50 p-4 text-sm">
                <div><p className="font-semibold">Ship to</p><p className="text-muted">{address.fullName}, {address.line1}, {address.city}, {address.state} {address.zip}</p></div>
                <div><p className="font-semibold">Delivery</p><p className="text-muted">{shipping.label} — {shipping.eta}</p></div>
                <div><p className="font-semibold">Payment</p><p className="text-muted">Card ending in {payment.card.replace(/\s/g, "").slice(-4)}</p></div>
              </div>
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 p-3">
                    <img src={item.thumbnail} alt="" className="h-14 w-14 rounded-lg bg-gray-100 object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted">Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(salePrice(item) * item.qty)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-outline disabled:opacity-40">Back</button>
            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary">Continue</button>
            ) : (
              <button onClick={handlePlace} disabled={processing} className="btn-primary">
                {processing ? "Processing..." : `Pay ${formatPrice(totals.total)}`}
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-xl bg-white p-6 shadow-card">
          <p className="font-semibold">Summary</p>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span className="line-clamp-1">{item.title} × {item.qty}</span>
                <span className="ml-3 shrink-0">{formatPrice(salePrice(item) * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
