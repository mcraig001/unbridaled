/**
 * Pass 4 — Formula confidence badges
 * HIGH: Exact statutory formula, verified against official worked example
 * MEDIUM: Formula is correct but inputs may have judicial discretion
 * ESTIMATE: Approximated — see note
 */

type Confidence = "HIGH" | "MEDIUM" | "ESTIMATE";

const CONFIG: Record<Confidence, { label: string; color: string; desc: string }> = {
  HIGH: {
    label: "High confidence",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    desc: "Exact statutory formula, verified against official sources.",
  },
  MEDIUM: {
    label: "Medium confidence",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    desc: "Formula is correct; judicial discretion affects actual amount.",
  },
  ESTIMATE: {
    label: "Estimate",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    desc: "Formula approximated. Use official calculator for exact amount.",
  },
};

export function FormulaConfidenceBadge({
  level,
  className = "",
}: {
  level: Confidence;
  className?: string;
}) {
  const cfg = CONFIG[level];

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${cfg.color} ${className}`}
      title={cfg.desc}
    >
      {level === "HIGH" && "✓ "}
      {level === "MEDIUM" && "~ "}
      {level === "ESTIMATE" && "≈ "}
      {cfg.label}
    </span>
  );
}

export function formulaConfidenceForState(
  state: string,
  type: "spousal" | "child" | "property"
): Confidence {
  if (type === "property") {
    return state === "NY" ? "MEDIUM" : "HIGH";
  }
  if (type === "child") {
    return state === "CA" ? "ESTIMATE" : "HIGH";
  }
  if (type === "spousal") {
    return state === "TX" ? "HIGH" : "MEDIUM"; // TX: exact cap formula; CA/NY: judicial discretion
  }
  return "MEDIUM";
}
