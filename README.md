# MedInfo Desk — Ankura R105080 Summer Internship 2027 Digital AI Advisory Assessment

**Candidate:** Aniya Thangamuthu

**Live Prototype:** [https://thinking-into-slides.lovable.app/](https://thinking-into-slides.lovable.app/)  

**Access:** Public web app (no login, credentials, or installation required)

---

## Start Here: Assessor Walkthrough

For an end-to-end guided evaluation of this prototype, open the live site and click **Assessor Walkthrough** in the navigation bar (or visit directly at [`https://thinking-into-slides.lovable.app/about`](https://thinking-into-slides.lovable.app/about)).

The walkthrough page guides you through:
1. **Scenario & Architecture Selection:** Why deterministic rule gating + BM25 keyword retrieval was selected over an unconstrained conversational LLM for regulated medical communications.
2. **Testing the 3 Core Pathways:**
   - **Green Pathway:** Routine, on-label enquiry (e.g., Luma-17 storage temperature) producing an exact-quote draft with inline document citations.
   - **Amber Pathway:** Out-of-domain or off-label request (e.g., pediatric dosing or combination therapies) safely escalating to medical experts with zero ungrounded hallucination.
   - **Red Pathway:** Safety, adverse event, or pregnancy risk triggering instant hard routing to Pharmacovigilance.
3. **Audit Trail & Governance:** How the demo records routing decisions and source versions in a local browser audit trail. Entries are not immutable or production grade.

---

## Key Pages to Inspect

| Route | Page | What Assessors Can Test |
| :--- | :--- | :--- |
| `/` | **Enquiry Desk** | Submit custom or pre-set clinical enquiries; test real-time risk gating and citation generation. |
| `/about` | **Assessor Guide** | Guided walkthrough of clinical pathways, governance principles, and verification steps. |
| `/evaluation` | **Live Benchmark** | Run the automated 23-case clinical benchmark directly in-browser (18/18 core pass rate, 0 unsafe drafts). |
| `/library` | **Source Library** | Inspect active vs. superseded document versions (e.g., verified exclusion of v1.0 storage data). |
| `/experts` | **Review Queue** | Medical Information expert triage, draft editing, and compliant sign-off workflow. |
| `/audit` | **Demo Audit Trail** | Browser-local records of routing decisions, matched source IDs and versions, and human actions. Entries can be cleared; a live system would require a tamper-evident, access-controlled audit store. |

---

## Results Summary
Across 23 synthetic cases, the prototype handled all 18 core cases as expected: it drafted 6 answers, sent 8 enquiries for expert review, and abstained on 4. It produced no unsafe drafts, and every sentence in all 6 answer drafts had a citation. It achieved 3/5 on the challenge set; the two misses involved paraphrases; the keyword retriever did not match, and the system abstained rather than guessing. These results support the choice to prioritise traceability and safe abstention over answer coverage. They are promising for a controlled prototype, but do not establish clinical accuracy or time savings. Further testing should use an independently labelled, held-out set and assess whether improved retrieval can address the paraphrase misses without weakening the risk gates.

Note: Escalation stays within the demo: it creates an in-app expert-queue handover and a local audit entry. It does not contact real experts or send external messages. All products and enquiries are fictional.

---
## Submission Deliverables

- **Working Build:** Hosted and live at [https://thinking-into-slides.lovable.app/](https://thinking-into-slides.lovable.app/)
- **5-Page Slide Deck:** Attached to the email.
---

## Running Locally (Optional)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests (5/5 automated test suite)
npm test

