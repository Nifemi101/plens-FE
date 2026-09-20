// app/components/results.tsx
type ResourceCategory = {
  type: string;
  requestCount: number;
  transferSize: number;
};
type ResourceItem = { url: string; resourceType: string; transferSize: number };
type Recommendation = {
  severity: "warning" | "info";
  title: string;
  description: string;
};

export type AnalysisResult = {
  url: string;
  score: number | null;
  resources: {
    totalTransferSize: number;
    totalRequestCount: number;
    byCategory: ResourceCategory[];
    largestResources: ResourceItem[];
  };
  recommendations: Recommendation[];
};

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.round(bytes / 1000)} KB`;
}

function scoreColor(score: number | null): string {
  if (score === null) return "text-ink";
  if (score >= 90) return "text-signal";
  if (score >= 50) return "text-caution";
  return "text-alert";
}

export function Results({ result }: { result: AnalysisResult }) {
  const nonEmptyCategories = result.resources.byCategory.filter(
    (c) => c.requestCount > 0,
  );

  return (
    <div className="mt-16 text-left border border-line rounded-xl p-8">
      <div className="text-center mb-12">
        <p className="text-ink mb-1">{result.url}</p>
        <p
          className={`font-body font-bold text-8xl text-ink ${(result.score)}`}
        >
          {result.score ?? "—"}
        </p>
        <p className="text-ink">out of 100</p>
      </div>
      <div className="border-t border-line pt-6 mb-10">
        <h2 className="font-body font-medium mb-4">
          {formatBytes(result.resources.totalTransferSize)} across{" "}
          {result.resources.totalRequestCount} requests
        </h2>
        <ul>
          {nonEmptyCategories.map((c) => (
            <li
              key={c.type}
              className="flex justify-between border-b border-line py-2"
            >
              <span className="capitalize">{c.type}</span>
              <span className="font-data text-ink/70">
                {formatBytes(c.transferSize)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line pt-6 mb-10">
        <h2 className="font-body font-medium mb-4">Largest resources</h2>
        <ul>
          {result.resources.largestResources.map((r, i) => (
            <li
              key={i}
              className="flex justify-between gap-4 border-b border-line py-2"
            >
              <span className="truncate text-ink/70">{r.url}</span>
              <span className="font-data shrink-0">
                {formatBytes(r.transferSize)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {result.recommendations.length > 0 && (
        <div className="border-t border-line pt-6">
          <h2 className="font-body font-medium mb-4">Recommendations</h2>
          <ul className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <li key={i}>
                <p
                  className={
                    rec.severity === "warning" ? "text-alert" : "text-caution"
                  }
                >
                  {rec.title}
                </p>
                <p className="text-ink/70 text-sm mt-1">{rec.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
