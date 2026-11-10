import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ENQUIRIES } from "@/lib/medinfo/data";
import { updateCase, useDesk } from "@/lib/medinfo/store";
import { Btn, PageHeader, Panel, StatusTag } from "@/components/desk/bits";

export const Route = createFileRoute("/experts")({
  head: () => ({
    meta: [
      { title: "Expert queue · MedInfo Desk" },
      { name: "description", content: "Medical experts review structured handovers for judgement-sensitive enquiries." },
      { property: "og:title", content: "Expert queue · MedInfo Desk" },
      { property: "og:description", content: "Structured handovers and expert answers, with feedback into source governance." },
    ],
  }),
  component: Experts,
});

function Experts() {
  const desk = useDesk();
  const items = Object.entries(desk.cases).filter(([, c]) => c.handover);
  const q = (id: string) => ENQUIRIES.find((e) => e.id === id)?.query ?? desk.custom.find((c) => c.id === id)?.query ?? id;
  return (
    <>
      <PageHeader kicker="Medical expert workspace" title="Expert queue">
        Experts get a complete handover instead of a forwarded email: the question, why it was routed, what the officer
        already checked, and urgency. Answers can be flagged for content owners so recurring questions get approved
        source text.
      </PageHeader>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nothing escalated yet. Open an expert-route enquiry on the <Link to="/" className="text-primary underline">desk</Link> and send the handover.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map(([id, c]) => <Item key={id} id={id} query={q(id)} c={c} />)}
        </div>
      )}
    </>
  );
}

function Item({ id, query, c }: { id: string; query: string; c: ReturnType<typeof useDesk>["cases"][string] }) {
  const [ans, setAns] = useState(c.expertAnswer ?? "");
  const [flag, setFlag] = useState(c.sourceUpdate ?? false);
  const done = c.status === "Expert answered";
  const h = c.handover!;
  return (
    <Panel title={`${id} · ${h.category}`} aside={<span className="flex gap-2"><StatusTag>{h.urgency}</StatusTag><StatusTag>{c.status}</StatusTag></span>}>
      <p className="font-serif text-xl text-foreground">“{query}”</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="font-mono text-[11px] uppercase text-muted-foreground">Officer checked</dt><dd className="text-foreground">{h.checked}</dd></div>
        <div><dt className="font-mono text-[11px] uppercase text-muted-foreground">Officer note</dt><dd className="text-foreground">{h.note || "None"}</dd></div>
      </dl>
      <textarea disabled={done} rows={3} value={ans} onChange={(e) => setAns(e.target.value)} placeholder="Expert response (fictional)…" className="mt-3 w-full rounded-sm border border-input bg-background p-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-70" />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" disabled={done} checked={flag} onChange={(e) => setFlag(e.target.checked)} />
          Flag for content owners: create approved source text for this question
        </label>
        <Btn variant="primary" className="ml-auto" disabled={done || !ans.trim()} onClick={() => {
          updateCase(id, { status: "Expert answered", expertAnswer: ans, sourceUpdate: flag }, { actor: "Medical expert", action: "Answered escalation", detail: flag ? "Flagged for source update" : "No source change" });
          toast("Expert answer logged");
        }}>
          {done ? "Answered" : "Sign off answer"}
        </Btn>
      </div>
    </Panel>
  );
}
