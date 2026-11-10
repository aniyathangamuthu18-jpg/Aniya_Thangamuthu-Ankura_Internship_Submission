import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ENQUIRIES, type Route as RouteT } from "@/lib/medinfo/data";
import { decide, draftText } from "@/lib/medinfo/engine";
import { addCustom, updateCase, useDesk, type Handover } from "@/lib/medinfo/store";
import { Btn, PageHeader, Panel, RouteBadge, StatusTag } from "@/components/desk/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Enquiry desk · MedInfo Desk" },
      { name: "description", content: "Triage fictional medical information enquiries with cited drafts, risk routing and human approval." },
      { property: "og:title", content: "Enquiry desk · MedInfo Desk" },
      { property: "og:description", content: "Cited drafts, risk routing and human approval for synthetic medical information enquiries." },
    ],
  }),
  component: Desk,
});

const FILTERS: { key: "all" | RouteT; label: string }[] = [
  { key: "all", label: "All" },
  { key: "answer", label: "Drafts" },
  { key: "expert", label: "Expert" },
  { key: "abstain", label: "Abstain" },
];

function Desk() {
  const desk = useDesk();
  const all = useMemo(
    () => [
      ...desk.custom.map((c) => ({ id: c.id, query: c.query, channel: "Web form", requester: "Staff entry", set: "custom" as const })),
      ...ENQUIRIES.filter((e) => e.set === "core"),
      ...ENQUIRIES.filter((e) => e.set === "challenge"),
    ],
    [desk.custom],
  );
  const [selected, setSelected] = useState(all[0]!.id);
  const [filter, setFilter] = useState<"all" | RouteT>("all");
  const [newQ, setNewQ] = useState("");

  const enquiry = all.find((e) => e.id === selected) ?? all[0]!;
  const d = useMemo(() => decide(enquiry.query), [enquiry.query]);
  const cs = desk.cases[enquiry.id] ?? { status: "New" as const };
  const list = all.filter((e) => filter === "all" || decide(e.query).route === filter);

  return (
    <>
      <PageHeader kicker="Information officer workspace" title="Enquiry desk">
        Every enquiry passes a risk gate first, then retrieval from approved, versioned sources. A draft is only
        produced when evidence is strong enough, every sentence is quoted and cited, and nothing leaves the team without
        a staff decision.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <form
            className="rounded-md border border-dashed border-primary/40 bg-accent/40 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newQ.trim()) return;
              const id = addCustom(newQ.trim());
              setNewQ("");
              setFilter("all");
              setSelected(id);
            }}
          >
            <label className="font-mono text-[11px] uppercase tracking-wider text-primary">Try your own enquiry</label>
            <div className="mt-2 flex gap-2">
              <input
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
                placeholder="e.g. Can the pen be stored in the door of the fridge?"
                className="min-w-0 flex-1 rounded-sm border border-input bg-card px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Btn variant="primary" type="submit">Log</Btn>
            </div>
          </form>

          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn("rounded-sm px-2.5 py-1 text-xs", filter === f.key ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:bg-muted")}
              >
                {f.label}
              </button>
            ))}
          </div>

          <ul className="max-h-[70vh] divide-y divide-border overflow-auto rounded-md border border-border bg-card">
            {list.map((e) => {
              const r = decide(e.query).route;
              const st = desk.cases[e.id]?.status ?? "New";
              return (
                <li key={e.id}>
                  <button
                    onClick={() => setSelected(e.id)}
                    className={cn("w-full px-3 py-2.5 text-left transition-colors hover:bg-muted", e.id === enquiry.id && "bg-accent/60")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {e.id}
                        {e.set === "challenge" && " · challenge"}
                      </span>
                      <RouteBadge route={r} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground">{e.query}</p>
                    {st !== "New" && <div className="mt-1"><StatusTag>{st}</StatusTag></div>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="rounded-md border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span>{enquiry.id}</span>·<span>{enquiry.channel}</span>·<span>{enquiry.requester}</span>
              <span className="ml-auto"><StatusTag>{cs.status}</StatusTag></span>
            </div>
            <p className="mt-3 font-serif text-2xl leading-snug text-foreground">“{enquiry.query}”</p>
          </div>

          <Pipeline route={d.route} reason={d.reason} />

          {d.route === "answer" && <DraftEditor key={enquiry.id} id={enquiry.id} saved={cs.draft} generated={draftText(d)} approved={cs.status === "Approved"} cites={d.draft.map((s) => s.cite)} />}
          {d.route !== "answer" && (
            <Escalate key={enquiry.id} id={enquiry.id} route={d.route} trigger={d.trigger} done={cs.status === "Escalated" || cs.status === "Expert answered"} />
          )}

          <Panel title="Retrieved approved passages" aside={<span className="font-mono text-[11px] text-muted-foreground">BM25 · approved versions only</span>}>
            {d.passages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No approved passage shares key terms with this enquiry.</p>
            ) : (
              <ol className="space-y-3">
                {d.passages.map((p) => (
                  <li key={p.id} className="rounded-sm border border-border p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{p.docTitle} · {p.section}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{p.id} · score {p.score.toFixed(2)}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                    <p className="mt-1.5 font-mono text-[11px] text-primary">matched: {p.matched.join(", ")}</p>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 text-xs text-muted-foreground">A text match prompts staff review. It is not evidence of medical accuracy or completeness.</p>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Pipeline({ route, reason }: { route: RouteT; reason: string }) {
  const steps = [
    { k: "1", t: "Risk gate", on: true, warn: route === "expert" },
    { k: "2", t: "Retrieve", on: route !== "expert" },
    { k: "3", t: "Evidence check", on: route !== "expert", warn: route === "abstain" },
    { k: "4", t: "Cited draft", on: route === "answer" },
    { k: "5", t: "Human decision", on: true },
  ];
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {steps.map((s, i) => (
          <div key={s.k} className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-sm px-2 py-1 font-mono text-[11px]",
                s.warn ? (route === "expert" ? "bg-expert-soft text-expert" : "bg-abstain-soft text-abstain") : s.on ? "bg-ink text-ink-foreground" : "bg-muted text-muted-foreground line-through",
              )}
            >
              {s.k} {s.t}
            </span>
            {i < steps.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
        <span className="ml-auto"><RouteBadge route={route} /></span>
      </div>
      <p className="mt-3 text-sm text-foreground">{reason}</p>
    </div>
  );
}

function DraftEditor({ id, saved, generated, approved, cites }: { id: string; saved?: string | undefined; generated: string; approved: boolean; cites: string[] }) {
  const [text, setText] = useState(saved ?? generated);
  useEffect(() => setText(saved ?? generated), [saved, generated]);
  const missing = [...new Set(cites)].filter((c) => !text.includes(c));
  const edited = text !== generated;
  return (
    <Panel title="Draft for staff review" aside={<span className="font-mono text-[11px] text-muted-foreground">quoted from approved text · not sent</span>}>
      <textarea
        value={text}
        disabled={approved}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full rounded-sm border border-input bg-background p-3 font-mono text-[13px] leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
      />
      {missing.length > 0 && (
        <p className="mt-2 rounded-sm bg-abstain-soft px-2 py-1.5 text-xs text-abstain">
          Citation removed: {missing.join(", ")}. Restore it, or note why, before approving.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Btn
          disabled={approved || !edited}
          onClick={() => {
            updateCase(id, { draft: text }, { actor: "Information officer", action: "Edited draft", detail: `${text.length} chars` });
            toast("Edits saved");
          }}
        >
          Save edits
        </Btn>
        <Btn
          variant="primary"
          disabled={approved || missing.length > 0}
          onClick={() => {
            updateCase(id, { draft: text, status: "Approved" }, { actor: "Information officer", action: "Approved response", detail: `${edited ? "Edited" : "Unedited"} draft · sources ${[...new Set(cites)].join(", ")}` });
            toast("Approval recorded. In this demo, nothing is sent.");
          }}
        >
          {approved ? "Approved" : "Approve response"}
        </Btn>
        <Btn
          variant="ghost"
          disabled={approved}
          onClick={() => {
            updateCase(id, { status: "Escalated", handover: { category: "Staff judgement", urgency: "Routine", checked: "Draft reviewed; officer unsure it fully answers.", note: text } }, { actor: "Information officer", action: "Escalated despite draft", detail: "Officer override" });
            toast("Sent to expert queue");
          }}
        >
          Escalate instead
        </Btn>
      </div>
    </Panel>
  );
}

function Escalate({ id, route, trigger, done }: { id: string; route: RouteT; trigger?: string | undefined; done: boolean }) {
  const [h, setH] = useState<Handover>({
    category: trigger ?? "Not covered by approved sources",
    urgency: trigger?.includes("Dosing") || trigger?.includes("adverse") ? "Urgent" : "Routine",
    checked: route === "abstain" ? "Searched approved library; no passage covers the question." : "Risk trigger fired before drafting.",
    note: "",
  });
  return (
    <Panel
      title={route === "expert" ? "Structured handover to medical expert" : "No supported answer: hand over or close"}
      aside={<span className="font-mono text-[11px] text-muted-foreground">draft withheld</span>}
    >
      {trigger?.includes("adverse") && (
        <p className="mb-3 rounded-sm bg-abstain-soft px-2 py-1.5 text-xs text-abstain">
          Possible adverse event: in a live process this would also start the pharmacovigilance reporting procedure.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Category"><input disabled={done} value={h.category} onChange={(e) => setH({ ...h, category: e.target.value })} className={inputCls} /></Field>
        <Field label="Urgency">
          <select disabled={done} value={h.urgency} onChange={(e) => setH({ ...h, urgency: e.target.value as Handover["urgency"] })} className={inputCls}>
            <option>Routine</option><option>Same day</option><option>Urgent</option>
          </select>
        </Field>
        <Field label="What I already checked" wide><input disabled={done} value={h.checked} onChange={(e) => setH({ ...h, checked: e.target.value })} className={inputCls} /></Field>
        <Field label="Note for expert (context, requester need)" wide>
          <textarea disabled={done} rows={2} value={h.note} onChange={(e) => setH({ ...h, note: e.target.value })} className={inputCls} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <Btn
          variant="expert"
          disabled={done}
          onClick={() => {
            updateCase(id, { status: "Escalated", handover: h }, { actor: "Information officer", action: "Escalated to expert", detail: `${h.category} · ${h.urgency}` });
            toast("Handover sent to expert queue");
          }}
        >
          {done ? "In expert queue" : "Send to expert queue"}
        </Btn>
        {route === "abstain" && !done && (
          <Btn onClick={() => { updateCase(id, { status: "Abstained" }, { actor: "Information officer", action: "Closed as out of scope", detail: "No approved source" }); toast("Closed as out of scope"); }}>
            Close: out of scope
          </Btn>
        )}
      </div>
    </Panel>
  );
}

const inputCls = "w-full rounded-sm border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-70";

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn("block", wide && "sm:col-span-2")}>
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
