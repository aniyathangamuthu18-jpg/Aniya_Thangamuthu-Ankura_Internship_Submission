# MedInfo Desk: build and slides plan (due Wed 11 Nov, 5:30pm GMT)

## About the Replit work
I couldn't open the invite link, but the bundle you uploaded has everything I need. It contains the finished website (compressed into a single file, without its original editable code), a 5-slide deck (PPTX and PDF), an 18-case test set, and a local server script. The plan is to rebuild that website here as one link assessors can open, with no download and no Python, keeping your features and wording. Then we upgrade it. The new deck builds on the Replit deck, which is already stronger than v2.

## What you already have and how each file gets used
- **Brief (.md)**: Scenario 3, Pharma Medical Information. That's the right pick: it's the easiest to scope, and traceable sources plus expert review show the most reasoning.
- **index.html**: your current standalone prototype (BM25 search, rule-based routing, quote template). It becomes the logic we rebuild in Lovable.
- **Draft deck v2 (5 slides)**: the structure is good, and the cautious tone is the best thing about it. We keep the 5-slide skeleton, make it denser, and add real numbers from the new tests.
- **Project2_RAG_Advanced.zip**: we take ideas from it (hybrid retrieval, chunking, an evaluation set with metrics) to strengthen the "how I tested" story.
- **project4_multi_agent_customer_support.zip**: we take its triage → draft → review handoff pattern for escalations. We describe this as a fixed workflow, not autonomous agents, which is safer and easier to defend.

## The build (hosted Lovable app, one link for the assessors)
1. **Enquiry Desk** (home page): an enquiry inbox with ~15 synthetic enquiries. You pick one and see:
   - the retrieved approved passages, each with document ID, section and version
   - a draft where every sentence links to its source
   - a route badge (Answer / Escalate to expert / Abstain) with a one-line reason
   - Approve, Edit or Escalate buttons, and escalation opens a structured handover form
2. **Source Library**: 4–5 fictional approved documents (fictional product, e.g. "Veloxin 20mg"), with versions and an expired version to show version control.
3. **Expert Queue**: escalated cases with full context, where the expert answers and the answer is logged.
4. **Evaluation**: runs the test set live and shows a results table (route accuracy, citation present, abstained correctly), including the failures. Showing failures demonstrates honest reasoning.
5. **Audit Log**: who did what, which source version was used, and what was edited.
6. **About / How to test**: a 5-step script for assessors, the assumptions, and a "synthetic data only" banner.

Optional upgrade (decide after step 1 works): add an AI-written draft through Lovable AI, limited to the retrieved passages, plus a check that removes any sentence without a citation. You can then compare "template vs AI draft" on the Evaluation page, which makes a strong tool-assessment slide. The default is keeping the rule-based version as the safe baseline.

## Slides (5 pages, information-dense, showing your reasoning)
1. **Problem and choice**: why Scenario 3 over the other three (a small 4-row comparison of value, risk and feasibility), plus the scope boundary.
2. **What I built**: a workflow diagram (Enquiry → Retrieve → Draft with citations → Route → Human decision → Log) and a screenshot.
3. **How I built it and the tools I used**: Replit, ChatGPT/Codex and Lovable, each with what it did well, where it fell short, and my verdict. Plus the design decisions and their trade-offs (lexical vs semantic search, template vs AI draft).
4. **Testing**: the results table from the Evaluation page (real counts), what failed and why, and what's still untested.
5. **Controls, people and the pilot decision**: controls mapped to risks, a before/after view of each role (info officer, expert, governance), training needs, and go/no-go criteria for a pilot.

Each slide: a takeaway headline that states the conclusion, a visual, and no more than about 60 words of body text. I'll produce `MedInfo_Desk_submission_v3.pptx` in the same style.

## Order of work (today → tomorrow)
1. Build the app with synthetic data, Desk, Library and Escalate (core)
2. Add the Evaluation page and Audit Log
3. Publish, then run the assessor test script end to end
4. Take screenshots and real numbers, then generate deck v3
5. You review, add your name, and write the email (subject line from the brief)

## Technical details
- TanStack Start app, with synthetic data in typed TS files (no database needed; the audit log and expert queue live in browser storage, which is acceptable for a demo)
- BM25 retrieval in TypeScript ported from your index.html; routing rules kept in one module, with unit tests for each route
- Evaluation runs the same functions as the Desk, so the numbers are real
- Deck built with pptxgenjs and checked visually page by page
