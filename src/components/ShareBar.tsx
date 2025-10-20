"use client";

import { useEffect, useState } from "react";
import { compressToEncodedURIComponent } from "lz-string";
import { useSplitStore } from "@/store/useSplitStore";

export default function ShareBar() {
  const event = useSplitStore((state) => state.event);
  const [shareUrl, setShareUrl] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !event) {
      return;
    }
    const state = encodeURIComponent(
      compressToEncodedURIComponent(JSON.stringify(event)),
    );
    const url = `${window.location.origin}?s=${state}`;
    setShareUrl(url);
    setCopyState("idle");
  }, [event]);

  if (!event) return null;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Share your event</h3>
        <p className="text-sm text-slate-600">
          Send this link to teammates and they will see the latest expenses instantly.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={shareUrl}
          readOnly
        />
        <button
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => {
            if (!shareUrl) return;
            if (typeof navigator !== "undefined" && navigator.clipboard) {
              navigator.clipboard.writeText(shareUrl);
              setCopyState("copied");
              setTimeout(() => setCopyState("idle"), 2000);
            }
          }}
          disabled={!shareUrl}
        >
          {copyState === "copied" ? "Copied!" : "Copy link"}
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Link stores state in the URL. Guests can save a copy or continue where you left off.
      </p>
    </section>
  );
}
