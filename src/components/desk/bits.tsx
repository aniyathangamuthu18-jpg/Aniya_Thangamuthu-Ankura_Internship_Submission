import type { ReactNode } from "react";
import type { Route } from "@/lib/medinfo/data";
import { cn } from "@/lib/utils";

const ROUTE_STYLE: Record<Route, { label: string; cls: string }> = {
  answer: { label: "Draft with sources", cls: "bg-answer-soft text-answer border-answer/30" },
  expert: { label: "Expert review", cls: "bg-expert-soft text-expert border-expert/40" },
  abstain: { label: "Abstain", cls: "bg-abstain-soft text-abstain border-abstain/30" },
};

export function RouteBadge({ route }: { route: Route }) {
  const s = ROUTE_STYLE[route];
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider", s.cls)}>
      {s.label}
    </span>
  );
}

export function StatusTag({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{children}</span>
  );
}

export function PageHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{kicker}</p>
      <h1 className="mt-2 text-4xl text-foreground md:text-5xl">{title}</h1>
      {children && <div className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{children}</div>}
    </header>
  );
}

export function Panel({ title, aside, children, className }: { title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-md border border-border bg-card", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{title}</h3>
        {aside}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Btn({ variant = "default", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" | "expert" | "ghost" }) {
  const v = {
    default: "border border-border bg-card hover:bg-muted text-foreground",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    expert: "bg-expert text-primary-foreground hover:bg-expert/90",
    ghost: "text-muted-foreground hover:text-foreground",
  }[variant];
  return <button {...p} className={cn("inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40", v, className)} />;
}
