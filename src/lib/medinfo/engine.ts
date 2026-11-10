import { PASSAGES, type Passage, type Route } from "./data";

// Risk triggers: anything needing clinical or quality judgement goes to an expert, before retrieval.
export const TRIGGERS: { label: string; re: RegExp }[] = [
  { label: "Pregnancy / breastfeeding", re: /pregnan|breast.?feed|lactat/i },
  { label: "Interaction", re: /interact|alongside|together with|warfarin|alcohol/i },
  { label: "Dosing error / overdose", re: /over.?dose|double dose|extra dose|missed dose|too much/i },
  { label: "Possible adverse event", re: /side effect|adverse|reaction|rash|symptom|swelling/i },
  { label: "Special population", re: /child|paediatric|pediatric|elderly|kidney|liver|under \d+/i },
  { label: "Off-label use", re: /off.?label|unlicensed/i },
  { label: "Quality / temperature excursion", re: /excursion|fridge failed|reached \d+|left out|warm(ed)? up/i },
  { label: "Treatment outcome / advice", re: /cure|diagnos|should i take|safe for me|treatment/i },
];

const STOP = new Set(
  "a an the is are was be it its of to in on for with and or what which how many much does do can could i my me our we this that there any at as by from should will would long keep luma 17 one used use".split(" "),
);

// Tiny suffix stemmer so "needles"/"needle", "stored"/"storage" meet.
export function stem(t: string) {
  return t.replace(/(ings|ing|ed|es|s|age)$/, "");
}

export function tokens(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length > 1 && !STOP.has(t)).map(stem);
}

export interface Scored extends Passage {
  score: number;
  matched: string[];
}

// BM25 over approved passages only; superseded versions are never indexed (version control).
const INDEX = PASSAGES.filter((p) => p.status === "approved").map((p) => ({
  p,
  toks: tokens(`${p.text} ${p.section}`),
}));
const AVG = INDEX.reduce((n, d) => n + d.toks.length, 0) / INDEX.length;

export function retrieve(query: string, k = 3): Scored[] {
  const q = [...new Set(tokens(query))];
  const N = INDEX.length;
  const k1 = 1.2;
  const b = 0.75;
  return INDEX.map(({ p, toks }) => {
    let score = 0;
    const matched: string[] = [];
    for (const t of q) {
      const tf = toks.filter((x) => x === t).length;
      if (!tf) continue;
      const df = INDEX.filter((d) => d.toks.includes(t)).length;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * toks.length) / AVG)));
      matched.push(t);
    }
    return { ...p, score, matched };
  })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export const MIN_SCORE = 1.5;
// Share of the question's key terms the top passage must cover, so one generic word ("carton") can't trigger a draft.
export const MIN_COVERAGE = 0.5;

export interface Decision {
  route: Route;
  reason: string;
  trigger?: string | undefined;
  passages: Scored[];
  draft: { sentence: string; cite: string }[];
}

export function decide(query: string): Decision {
  const trig = TRIGGERS.find((t) => t.re.test(query));
  if (trig) {
    return {
      route: "expert",
      trigger: trig.label,
      reason: `Risk trigger "${trig.label}" matched. No draft is produced; route to a medical expert.`,
      passages: retrieve(query),
      draft: [],
    };
  }
  const passages = retrieve(query);
  const top = passages[0];
  const qTerms = new Set(tokens(query)).size || 1;
  const coverage = top ? top.matched.length / qTerms : 0;
  if (!top || top.score < MIN_SCORE || coverage <= MIN_COVERAGE) {
    return {
      route: "abstain",
      reason: !top
        ? "No approved passage shares terms with this enquiry. Abstain."
        : top.score < MIN_SCORE
          ? `Best passage scored ${top.score.toFixed(2)}, below the ${MIN_SCORE} evidence threshold. Abstain and check the library.`
          : `Best passage covers only ${Math.round(coverage * 100)}% of the question's key terms (needs more than ${MIN_COVERAGE * 100}%). Abstain.`,
      passages,
      draft: [],
    };
  }
  // Draft = quoted sentences from passages within 70% of the top score; every sentence carries its source.
  const used = passages.filter((p) => p.score >= top.score * 0.7).slice(0, 2);
  const draft = used.flatMap((p) =>
    p.text
      .split(/(?<=\.)\s+/)
      .filter((s) => tokens(s).some((t) => p.matched.includes(t)))
      .map((sentence) => ({ sentence, cite: p.id })),
  );
  return {
    route: "answer",
    reason: `Top passage ${top.id} scored ${top.score.toFixed(2)} (threshold ${MIN_SCORE}). Draft quotes approved text only.`,
    passages,
    draft,
  };
}

export function draftText(d: Decision) {
  if (!d.draft.length) return "";
  return (
    "Thank you for your enquiry. According to the approved Luma-17 information:\n\n" +
    d.draft.map((s) => `${s.sentence} [${s.cite}]`).join("\n") +
    "\n\nThis response is based on approved product information only and does not constitute medical advice."
  );
}
