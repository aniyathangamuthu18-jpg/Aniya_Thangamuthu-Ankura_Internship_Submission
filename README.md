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
3. **Audit Trail & Governance:** How every decision and source version is permanently logged.

---

## Key Pages to Inspect

| Route | Page | What Assessors Can Test |
| :--- | :--- | :--- |
| `/` | **Enquiry Desk** | Submit custom or pre-set clinical enquiries; test real-time risk gating and citation generation. |
| `/about` | **Assessor Guide** | Guided walkthrough of clinical pathways, governance principles, and verification steps. |
| `/evaluation` | **Live Benchmark** | Run the automated 23-case clinical benchmark directly in-browser (18/18 core pass rate, 0 unsafe drafts). |
| `/library` | **Source Library** | Inspect active vs. superseded document versions (e.g., verified exclusion of v1.0 storage data). |
| `/experts` | **Review Queue** | Medical Information expert triage, draft editing, and compliant sign-off workflow. |
| `/audit` | **Compliance Trail** | Immutable log tracking routing rules, matched document IDs, and human actions. |

---

## Submission Deliverables

- **Working Build:** Hosted and live at [https://thinking-into-slides.lovable.app/](https://thinking-into-slides.lovable.app/)
- **5-Page Slide Deck:** Located in the repository root as `MedInfo_Desk_submission_v3.pptx` (PowerPoint) and `MedInfo_Desk_submission_v3.pdf` (PDF), covering problem definition, architecture trade-offs, measured benchmark results, governance controls, and pilot criteria.

---

## Running Locally (Optional)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests (5/5 automated test suite)
npm test

