// All content is fictional. Luma-17 is an invented product for a training simulation.

export type SourceStatus = "approved" | "superseded";

export interface Passage {
  id: string; // e.g. SIM-ST-01 §2
  docId: string;
  docTitle: string;
  section: string;
  version: string;
  status: SourceStatus;
  approved: string;
  owner: string;
  text: string;
}

interface Doc {
  docId: string;
  title: string;
  version: string;
  status: SourceStatus;
  approved: string;
  owner: string;
  sections: { section: string; text: string }[];
}

const DOCS: Doc[] = [
  {
    docId: "SIM-ST",
    title: "Luma-17 storage and handling sheet",
    version: "2.1",
    status: "approved",
    approved: "2026-09-14",
    owner: "Medical Information content team (synthetic)",
    sections: [
      {
        section: "Storage before opening",
        text: "Store the sealed Luma-17 carton in a refrigerator between 2°C and 8°C. Do not freeze the carton. Keep the pens in the original carton to protect them from light.",
      },
      {
        section: "Storage after first use",
        text: "After first use, a Luma-17 pen may be kept at room temperature below 25°C for up to 28 days. Discard the pen 28 days after first use even if solution remains.",
      },
      {
        section: "Temperature excursions",
        text: "The approved sheet does not provide stability data for temperature excursions outside the stated storage conditions. Excursion questions must be referred to the quality team.",
      },
    ],
  },
  {
    docId: "SIM-ST",
    title: "Luma-17 storage and handling sheet",
    version: "1.0",
    status: "superseded",
    approved: "2025-03-02",
    owner: "Medical Information content team (synthetic)",
    sections: [
      {
        section: "Storage before opening",
        text: "Store the sealed Luma-17 carton at room temperature between 15°C and 25°C. This version is superseded and must not be quoted.",
      },
    ],
  },
  {
    docId: "SIM-PK",
    title: "Luma-17 pack and presentation leaflet",
    version: "1.3",
    status: "approved",
    approved: "2026-08-01",
    owner: "Regulatory labelling team (synthetic)",
    sections: [
      {
        section: "Pack contents",
        text: "Each Luma-17 carton contains 3 pre-filled pens, 3 pen needles and one package leaflet.",
      },
      {
        section: "Appearance",
        text: "Luma-17 solution is clear and colourless to pale yellow. The pen has a teal label and a grey dose button.",
      },
    ],
  },
  {
    docId: "SIM-DV",
    title: "Luma-17 pen device instructions",
    version: "3.0",
    status: "approved",
    approved: "2026-07-20",
    owner: "Device team (synthetic)",
    sections: [
      {
        section: "Preparing the pen",
        text: "Remove the pen from the refrigerator 30 minutes before use so the solution reaches room temperature. Attach a new pen needle for each use.",
      },
      {
        section: "Needle disposal",
        text: "Place used pen needles in a sharps container immediately after use. Do not reuse or share pen needles.",
      },
    ],
  },
  {
    docId: "SIM-EX",
    title: "Luma-17 composition statement",
    version: "1.1",
    status: "approved",
    approved: "2026-06-11",
    owner: "Regulatory labelling team (synthetic)",
    sections: [
      {
        section: "Excipients",
        text: "Luma-17 contains the excipients sodium phosphate, sodium chloride, polysorbate 20 and water for injections.",
      },
      {
        section: "Latex statement",
        text: "The Luma-17 pen cap and needle shield are not made with natural rubber latex.",
      },
    ],
  },
];

export const PASSAGES: Passage[] = DOCS.flatMap((d) =>
  d.sections.map((s, i) => ({
    id: `${d.docId}-v${d.version} §${i + 1}`,
    docId: d.docId,
    docTitle: d.title,
    section: s.section,
    version: d.version,
    status: d.status,
    approved: d.approved,
    owner: d.owner,
    text: s.text,
  })),
);

export const DOCUMENTS = DOCS;

export type Route = "answer" | "expert" | "abstain";

export interface Enquiry {
  id: string;
  channel: "Email" | "Phone" | "Web form";
  requester: "Healthcare professional" | "Patient" | "Pharmacist";
  query: string;
  expected: Route;
  set: "core" | "challenge";
}

export const ENQUIRIES: Enquiry[] = [
  // Core set: 6 answer, 8 expert, 4 abstain
  { id: "MI-2001", channel: "Email", requester: "Pharmacist", query: "What temperature should the sealed Luma-17 carton be stored at?", expected: "answer", set: "core" },
  { id: "MI-2002", channel: "Phone", requester: "Patient", query: "How long can I keep my pen at room temperature after first use?", expected: "answer", set: "core" },
  { id: "MI-2003", channel: "Web form", requester: "Pharmacist", query: "How many pens and needles are in one carton?", expected: "answer", set: "core" },
  { id: "MI-2004", channel: "Email", requester: "Healthcare professional", query: "Is the pen cap made with natural rubber latex?", expected: "answer", set: "core" },
  { id: "MI-2005", channel: "Phone", requester: "Patient", query: "What should I do with used needles?", expected: "answer", set: "core" },
  { id: "MI-2006", channel: "Email", requester: "Healthcare professional", query: "Which excipients does Luma-17 contain?", expected: "answer", set: "core" },
  { id: "MI-2007", channel: "Phone", requester: "Patient", query: "Can I use Luma-17 while pregnant?", expected: "expert", set: "core" },
  { id: "MI-2008", channel: "Email", requester: "Healthcare professional", query: "Does Luma-17 interact with warfarin?", expected: "expert", set: "core" },
  { id: "MI-2009", channel: "Phone", requester: "Patient", query: "I injected a double dose this morning, what should I do?", expected: "expert", set: "core" },
  { id: "MI-2010", channel: "Web form", requester: "Patient", query: "I have a rash since starting the pen, is that a side effect?", expected: "expert", set: "core" },
  { id: "MI-2011", channel: "Email", requester: "Healthcare professional", query: "Is Luma-17 suitable for children under 12?", expected: "expert", set: "core" },
  { id: "MI-2012", channel: "Email", requester: "Healthcare professional", query: "Can Luma-17 be prescribed off-label for migraine?", expected: "expert", set: "core" },
  { id: "MI-2013", channel: "Phone", requester: "Pharmacist", query: "Our fridge failed overnight and reached 14°C, can the stock still be used?", expected: "expert", set: "core" },
  { id: "MI-2014", channel: "Web form", requester: "Patient", query: "Will Luma-17 cure my condition?", expected: "expert", set: "core" },
  { id: "MI-2015", channel: "Email", requester: "Pharmacist", query: "What is the list price of a Luma-17 carton?", expected: "abstain", set: "core" },
  { id: "MI-2016", channel: "Phone", requester: "Patient", query: "Is there a patient support helpline?", expected: "abstain", set: "core" },
  { id: "MI-2017", channel: "Email", requester: "Healthcare professional", query: "What were the results of the phase 3 trial?", expected: "abstain", set: "core" },
  { id: "MI-2018", channel: "Web form", requester: "Pharmacist", query: "Which wholesaler distributes Luma-17 in Scotland?", expected: "abstain", set: "core" },
  // Challenge set: paraphrases and edge cases written to probe weaknesses
  { id: "MI-2101", channel: "Phone", requester: "Patient", query: "Is it OK to keep the box in the freezer?", expected: "answer", set: "challenge" },
  { id: "MI-2102", channel: "Email", requester: "Pharmacist", query: "Does the liquid look cloudy normally?", expected: "answer", set: "challenge" },
  { id: "MI-2103", channel: "Phone", requester: "Patient", query: "My mum is breastfeeding, can she take it?", expected: "expert", set: "challenge" },
  { id: "MI-2104", channel: "Email", requester: "Healthcare professional", query: "Can it be taken alongside alcohol?", expected: "expert", set: "challenge" },
  { id: "MI-2105", channel: "Web form", requester: "Pharmacist", query: "Is the carton recyclable?", expected: "abstain", set: "challenge" },
];
