# HealthSolver 0.38.0 — Massive Public Data + Clinical Coach

Local complete release commit: `8c73c3617714c71d3914f31d70304823495205a1`
Local tag: `v0.38.0-massive-public-data`
Date: 2026-10-08.

This checkpoint records the completed local release. It does NOT claim that the full local 0.38 source tree/history was pushed to this branch or main.

Massive Public Data layer:
- CDC BRFSS 2024 complete public-use file: 457,670 real interviews processed.
- 10,579 embedded weighted evidence cells for age/sex/BMI/smoking/exercise strata and nine self-reported/history targets.
- openFDA / FAERS live optional query restricted to https://api.fda.gov; only explicit drug-name input is transmitted.
- CMS DE-SynPUF Sample 1 compact synthetic longitudinal pack: 116,352 synthetic 2008 beneficiaries, 66,773 inpatient claims, 790,790 outpatient claims, 5,552,421 PDE events.
- Synthea/FHIR local Bundle import with bounded mapping and explicit confirmation.
- All previous Clinical Coach / Clinical Intelligence / observed-model / visit / training / backup functionality retained.

Qualification:
- Python 321 PASS.
- Recovery 30 PASS.
- JavaScript TAP 369 PASS.
- Browser PASS: differential 64, intelligence 24, coach 32, visit 50, real-lab 43, web-lab 34, massive-public 20.
- Installed wheel checks 44 PASS.
- HTTP/SQLite 26 PASS.
- Static sanity PASS.
- Release verifier PASS.
- git fsck PASS; packaged working tree CLEAN.
- Standalone HTML SHA256: c1bef787551183db369643036e9fc9a7f64ddec515ad804066b9a37279df6b68.

GitHub Pages:
- gh-pages payload updated to HealthSolver 0.38.
- Native GitHub Pages deployment succeeds at https://ricscar2570.github.io/HealthSolver/
- Loader uses six compressed payload chunks and verifies the exact standalone HTML SHA-256 before launch.

Research boundary:
BRFSS is population survey evidence, not individual diagnosis. FAERS reports do not establish causality/incidence/personal risk. CMS DE-SynPUF and Synthea are synthetic. No clinical validation, treatment/triage authorization, or medical-device approval is claimed.
