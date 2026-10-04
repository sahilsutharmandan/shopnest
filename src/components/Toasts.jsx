"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissToast } from "@/store/toastSlice";
import { CheckIcon, CloseIcon } from "./Icons";

function Toast({ toast }) {
  const dispatch = useDispatch();
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setTimeout(() => dispatch(dismissToast(toast.id)), 3000);
    return () => clearTimeout(timer.current);
  }, [dispatch, toast.id]);

  const tone = toast.type === "error" ? "bg-red-600" : "bg-gray-900";

  return (
    <div
      role="status"
      onMouseEnter={() => clearTimeout(timer.current)}
      className={`${tone} flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg`}
    >
      {toast.type !== "error" && <CheckIcon className="h-4 w-4 shrink-0 text-emerald-400" />}
      <span className="whitespace-nowrap">{toast.message}</span>
      <button onClick={() => dispatch(dismissToast(toast.id))} className="ml-2 text-white/70 hover:text-white" aria-label="Dismiss">
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Toasts() {
  const toasts = useSelector((state) => state.toast.list);
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}
