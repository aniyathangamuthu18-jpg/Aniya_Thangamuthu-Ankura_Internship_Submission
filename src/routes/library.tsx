import { createFileRoute } from "@tanstack/react-router";
import { DOCUMENTS } from "@/lib/medinfo/data";
import { PageHeader } from "@/components/desk/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Source library · MedInfo Desk" },
      { name: "description", content: "Fictional approved, versioned Luma-17 documents used for retrieval." },
      { property: "og:title", content: "Source library · MedInfo Desk" },
      { property: "og:description", content: "Approved and superseded fictional documents with owners and versions." },
    ],
  }),
  component: Library,
});

function Library() {
  return (
    <>
      <PageHeader kicker="Governed content" title="Source library">
        Only approved versions are indexed for retrieval. Superseded versions stay visible for audit but can never be
        quoted, which the automated tests check.
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        {DOCUMENTS.map((d) => (
          <article key={d.docId + d.version} className={cn("rounded-md border bg-card p-5", d.status === "superseded" ? "border-dashed border-abstain/40 opacity-70" : "border-border")}>
            <div className="flex items-baseline justify-between gap-2 font-mono text-[11px] text-muted-foreground">
              <span>{d.docId} · v{d.version}</span>
              <span className={d.status === "approved" ? "text-answer" : "text-abstain"}>{d.status.toUpperCase()} · {d.approved}</span>
            </div>
            <h2 className="mt-2 text-2xl text-foreground">{d.title}</h2>
            <p className="text-xs text-muted-foreground">Owner: {d.owner}</p>
            <ol className="mt-3 space-y-2">
              {d.sections.map((s, i) => (
                <li key={s.section} className="text-sm">
                  <span className="font-mono text-[11px] text-primary">§{i + 1} {s.section}</span>
                  <p className="text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </>
  );
}
