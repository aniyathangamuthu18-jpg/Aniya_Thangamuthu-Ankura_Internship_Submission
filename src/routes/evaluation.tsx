import { createFileRoute } from "@tanstack/react-router";
import { ENQUIRIES } from "@/lib/medinfo/data";
import { decide } from "@/lib/medinfo/engine";
import { PageHeader, Panel, RouteBadge } from "@/components/desk/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Evaluation · MedInfo Desk" },
      { name: "description", content: "Live routing results on 23 synthetic enquiries, including failures and limits." },
      { property: "og:title", content: "Evaluation · MedInfo Desk" },
      { property: "og:description", content: "Core and challenge test sets run live against the same rules staff use." },
    ],
  }),
  component: Evaluation,
});

function Evaluation() {
  const rows = ENQUIRIES.map((e) => ({ e, d: decide(e.query) }));
  const stat = (set: string) => {
    const r = rows.filter((x) => x.e.set === set);
    return { n: r.length, ok: r.filter((x) => x.d.route === x.e.expected).length };
  };
  const core = stat("core");
  const ch = stat("challenge");
  const answers = rows.filter((x) => x.d.route === "answer");
  const cited = answers.filter((x) => x.d.draft.length > 0 && x.d.draft.every((s) => s.cite)).length;
  const unsafe = rows.filter((x) => x.e.expected !== "answer" && x.d.route === "answer").length;
  const missedExpert = rows.filter((x) => x.e.expected === "expert" && x.d.route !== "expert").length;

  return (
    <>
      <PageHeader kicker="Run live in your browser" title="Evaluation">
        These tests call exactly the same functions as the desk. The core set checks the designed routes. The challenge
        set was written afterwards to probe paraphrases and is kept here even where it fails.
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat big={`${core.ok}/${core.n}`} label="Core set routed as expected" />
        <Stat big={`${ch.ok}/${ch.n}`} label="Challenge set routed as expected" tone={ch.ok < ch.n ? "warn" : undefined} />
        <Stat big={`${unsafe}`} label="Drafts produced where none should be (unsafe errors)" tone={unsafe ? "bad" : "good"} />
        <Stat big={`${cited}/${answers.length}`} label="Drafts with a citation on every sentence" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Missed expert escalations: <b className="text-foreground">{missedExpert}</b>. Every failure is a safe failure
        (abstain instead of answer), because the lexical retriever misses paraphrases such as “freezer” vs “freeze” and
        “cloudy” vs “clear”. That is the case for semantic retrieval in a next stage, behind the same gate.
      </p>

      <Panel title="Case-by-case results" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="font-mono text-[11px] uppercase text-muted-foreground">
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-3">Case</th><th className="pr-3">Set</th><th className="pr-3">Enquiry</th><th className="pr-3">Expected</th><th className="pr-3">Actual</th><th className="pr-3">Result</th><th>Why</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ e, d }) => {
                const ok = d.route === e.expected;
                return (
                  <tr key={e.id} className={cn("border-b border-border align-top", !ok && "bg-abstain-soft/50")}>
                    <td className="whitespace-nowrap py-2 pr-3 font-mono text-xs">{e.id}</td>
                    <td className="pr-3 text-xs text-muted-foreground">{e.set}</td>
                    <td className="pr-3">{e.query}</td>
                    <td className="pr-3"><RouteBadge route={e.expected} /></td>
                    <td className="pr-3"><RouteBadge route={d.route} /></td>
                    <td className={cn("pr-3 font-mono text-xs", ok ? "text-answer" : "text-abstain")}>{ok ? "PASS" : "FAIL"}</td>
                    <td className="max-w-xs text-xs text-muted-foreground">{d.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="What this does not show" className="mt-6">
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Hand-authored fixtures by the same person who wrote the rules. This is not an independent holdout set.</li>
          <li>No medical expert has judged whether drafts are complete or correctly scoped.</li>
          <li>No staff usability, handling-time or savings test has been run, so no value claim is made.</li>
          <li>Keyword triggers can miss new phrasings of risky questions. A live pilot needs a larger, expert-labelled set.</li>
        </ul>
      </Panel>
    </>
  );
}

function Stat({ big, label, tone }: { big: string; label: string; tone?: "good" | "bad" | "warn" | undefined }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className={cn("font-serif text-5xl", tone === "bad" ? "text-abstain" : tone === "warn" ? "text-expert" : tone === "good" ? "text-answer" : "text-foreground")}>{big}</div>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
