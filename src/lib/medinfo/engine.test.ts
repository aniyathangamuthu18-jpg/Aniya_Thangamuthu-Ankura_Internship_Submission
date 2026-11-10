import { describe, expect, it } from "vitest";
import { ENQUIRIES } from "./data";
import { decide, retrieve } from "./engine";

describe("MedInfo routing rules", () => {
  it("routes every core enquiry to its expected route", () => {
    for (const e of ENQUIRIES.filter((x) => x.set === "core")) {
      expect(decide(e.query).route, e.id).toBe(e.expected);
    }
  });

  it("never produces a draft for expert or abstain routes", () => {
    expect(decide("Can I use Luma-17 while pregnant?").draft).toHaveLength(0);
    expect(decide("What is the list price of a Luma-17 carton?").draft).toHaveLength(0);
  });

  it("every draft sentence carries a citation", () => {
    const d = decide("How many pens and needles are in one carton?");
    expect(d.draft.length).toBeGreaterThan(0);
    for (const s of d.draft) expect(s.cite).toMatch(/^SIM-/);
  });

  it("never retrieves a superseded document version", () => {
    const hits = retrieve("sealed carton room temperature 15 25 storage", 10);
    expect(hits.every((h) => h.status === "approved")).toBe(true);
  });
});
