import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/desk/bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How to test · MedInfo Desk" },
      { name: "description", content: "A five-minute script for assessors, plus scope, assumptions and design choices." },
      { property: "og:title", content: "How to test · MedInfo Desk" },
      { property: "og:description", content: "Assessor test script, scope boundary and design trade-offs for the prototype." },
    ],
  }),
  component: About,
});

const STEPS = [
  ["Answerable question", "On the desk, open MI-2002 (pen at room temperature). Check each draft sentence against the cited passage, edit if needed, then approve."],
  ["Remove a citation", "Delete a [SIM-…] tag in a draft. Approval is blocked until the citation is restored."],
  ["Risky question", "Open MI-2009 (double dose). The risk gate fires before retrieval, no draft is produced, and you complete the structured handover."],
  ["Expert sign-off", "Go to Expert queue, answer the case and flag it for content owners."],
  ["Your own question", "Type a new enquiry on the desk, then check Evaluation and Audit log to see the results and the trace."],
];

function About() {
  return (
    <>
      <PageHeader kicker="For assessors" title="How to test in five minutes">
        No login or install is needed. All data is fictional, and activity is saved in your browser only. Use Reset demo
        on the Audit log page to start again.
      </PageHeader>
      <ol className="grid gap-3 md:grid-cols-5">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="rounded-md border border-border bg-card p-4">
            <span className="font-serif text-4xl text-primary">{i + 1}</span>
            <p className="mt-1 font-medium text-foreground">{t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Panel title="Scope and assumptions">
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Information handling and expert review only. The app never diagnoses or advises on treatment.</li>
            <li>One fictional product, 5 documents (one superseded) and 23 synthetic enquiries.</li>
            <li>The source library is assumed to be already approved by medical, legal and regulatory review.</li>
            <li>Adverse-event wording is flagged only. A live process would hand over to pharmacovigilance.</li>
          </ul>
        </Panel>
        <Panel title="Design choices and trade-offs">
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li><b className="text-foreground">Risk gate before retrieval:</b> sensitive questions never get a draft to anchor on.</li>
            <li><b className="text-foreground">Quoting, not generating:</b> no hallucination risk, but less fluent text. An LLM rewrite is a candidate next stage.</li>
            <li><b className="text-foreground">BM25 lexical search:</b> transparent and testable, but misses paraphrases (see Evaluation).</li>
            <li><b className="text-foreground">Abstain by default:</b> evidence must pass a score and term-coverage threshold.</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
