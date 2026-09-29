import { Suspense } from "react";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-static";

export default function Page() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-muted">Loading...</div>}>
      <OrdersClient />
    </Suspense>
  );
}
