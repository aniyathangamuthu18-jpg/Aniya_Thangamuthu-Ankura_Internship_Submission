import { useSyncExternalStore } from "react";

export type CaseStatus = "New" | "Approved" | "Escalated" | "Expert answered" | "Abstained";

export interface Handover {
  category: string;
  urgency: "Routine" | "Same day" | "Urgent";
  checked: string;
  note: string;
}

export interface CaseState {
  status: CaseStatus;
  draft?: string;
  handover?: Handover;
  expertAnswer?: string;
  sourceUpdate?: boolean;
}

export interface AuditEntry {
  at: string;
  caseId: string;
  actor: "Information officer" | "Medical expert" | "System";
  action: string;
  detail: string;
}

export interface CustomEnquiry {
  id: string;
  query: string;
}

interface State {
  cases: Record<string, CaseState>;
  audit: AuditEntry[];
  custom: CustomEnquiry[];
}

const KEY = "medinfo-desk-v3";
const EMPTY: State = { cases: {}, audit: [], custom: [] };
let state: State = EMPTY;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupt storage */
  }
}

function set(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
  subs.forEach((f) => f());
}

export function useDesk() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => {
      load();
      return state;
    },
    () => EMPTY,
  );
}

export function updateCase(id: string, patch: Partial<CaseState>, log?: Omit<AuditEntry, "at" | "caseId">) {
  const prev = state.cases[id] ?? { status: "New" };
  set({
    ...state,
    cases: { ...state.cases, [id]: { ...prev, ...patch } },
    audit: log ? [{ at: new Date().toISOString(), caseId: id, ...log }, ...state.audit] : state.audit,
  });
}

export function addCustom(query: string) {
  const id = `MI-U${String(state.custom.length + 1).padStart(2, "0")}`;
  set({
    ...state,
    custom: [...state.custom, { id, query }],
    audit: [{ at: new Date().toISOString(), caseId: id, actor: "Information officer", action: "Logged new enquiry", detail: query }, ...state.audit],
  });
  return id;
}

export function resetDesk() {
  set(EMPTY);
}
