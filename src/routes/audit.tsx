import { createFileRoute } from "@tanstack/react-router";
import { resetDesk, useDesk } from "@/lib/medinfo/store";
import { Btn, PageHeader } from "@/components/desk/bits";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit log · MedInfo Desk" },
      { name: "description", content: "Every staff and expert decision with the sources used." },
      { property: "og:title", content: "Audit log · MedInfo Desk" },
      { property: "og:description", content: "A trace of approvals, edits and escalations in the prototype." },
    ],
  }),
  component: Audit,
});

function Audit() {
  const { audit } = useDesk();
  return (
    <>
      <PageHeader kicker="Traceability" title="Audit log">
        Each action records who did it, when, and the source versions used. In this demo the log is stored in your
        browser only, so it is not a compliant audit trail. A live system would use a tamper-evident store.
      </PageHeader>
      <div className="mb-4 flex justify-end">
        <Btn onClick={() => confirm("Clear all demo activity?") && resetDesk()}>Reset demo</Btn>
      </div>
      {audit.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <table className="w-full rounded-md border border-border bg-card text-sm">
          <thead className="font-mono text-[11px] uppercase text-muted-foreground">
            <tr className="border-b border-border text-left"><th className="p-3">Time</th><th>Case</th><th>Actor</th><th>Action</th><th>Detail</th></tr>
          </thead>
          <tbody>
            {audit.map((a, i) => (
              <tr key={i} className="border-b border-border">
                <td className="p-3 font-mono text-xs">{new Date(a.at).toLocaleString()}</td>
                <td className="font-mono text-xs">{a.caseId}</td>
                <td>{a.actor}</td>
                <td className="text-foreground">{a.action}</td>
                <td className="text-muted-foreground">{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
