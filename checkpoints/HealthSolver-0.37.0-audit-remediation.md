# HealthSolver 0.37.0 — Post-release audit remediation

**Date:** 2026-10-08  
**Application release:** 0.37.0 Clinical Coach Research Edition  
**Original application commit:** `1e4152a79f0501777b8cd11d0643746523594da2`  
**Audit remediation commit:** `9bf55e6ff82d002a4b35d347fa30432cdf20ddaf`  
**Tag:** `v0.37.0-audit-remediated`

The audit found no blocking defect in the browser application. Six release-engineering inconsistencies were corrected without changing the application HTML:
- standalone http_smoke layout/version assumptions;
- wheel smoke stale API version;
- CI hardcoded 0.33 wheel path and missing current JS suites;
- Kubernetes image still 0.28.0;
- OpenAPI still 0.36.0;
- release verification metadata still 0.33.0.

Remediation verification:
- 315 Python PASS;
- 30 recovery PASS;
- 368 JavaScript PASS;
- wheel smoke 40/40 PASS;
- standalone HTTP/SQLite 26/26 PASS;
- browser: differential 64, intelligence 24, coach 32, resume fail-safe 4, legacy visit 50, real-lab 43, web-lab 34 PASS;
- static sanity and release verifier PASS;
- audit repository ZIP recomposes exactly from two multipart files, Git working tree CLEAN, git fsck PASS.

GitHub Pages:
- published from `gh-pages`;
- native Pages build PASS;
- native Pages deploy PASS;
- URL: https://ricscar2570.github.io/HealthSolver/
- deployed loader reconstructs the exact 0.37 HTML payload verified at SHA-256 `b2d83af82efe7998f1ef98bd0ba903fba29d7026ce216dd3ac7e393fda87feb8`.

Research boundary unchanged: no clinical validation or diagnosis/treatment/triage authorization.
