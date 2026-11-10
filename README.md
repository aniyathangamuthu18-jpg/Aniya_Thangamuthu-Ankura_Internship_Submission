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

