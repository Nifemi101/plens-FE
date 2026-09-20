// app/page.tsx
"use client";

import { useState } from "react";
import { Results, type AnalysisResult } from "./components/results";

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    "idle",
  );
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("done");
    } catch {
      setError("Could not reach the server");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-24">
      <div className="max-w-xl w-full text-center">
        <h1 className="font-body font-bold text-7xl md:text-8xl tracking-tight mb-4">
          pLens
        </h1>
        <p className="text-ink/70 text-lg mb-10">
          See what's slowing your website down.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 items-stretch"
        >
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yoursite.com"
            className="flex-1 border border-line rounded-lg bg-transparent px-4 py-3 text-lg font-body placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-ink text-paper px-6 py-3 rounded-lg font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === "loading" ? "Analyzing…" : "Analyze"}
          </button>
        </form>

        {status === "error" && <p className="mt-6 text-alert">{error}</p>}
      </div>

      {status === "done" && result && (
        <div className="max-w-xl w-full">
          <Results result={result} />
        </div>
      )}
    </main>
  );
}
