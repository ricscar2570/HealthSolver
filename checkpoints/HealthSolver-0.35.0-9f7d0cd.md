# HealthSolver 0.35.0 — Renal, Hepatic & Longitudinal Expansion

Complete local application commit: `9f7d0cd93655378da2d852b677c009101b625223`
Local tag: `v0.35.0-renal-hepatic-longitudinal`
Date: 2026-10-08.

This checkpoint records the completed local release. It does NOT claim that the full 0.35 application tree or local Git history has been pushed to this branch or to main.

New observed-data modules:
- UCI Chronic Kidney Disease: 400 raw rows, 397 unambiguously parsed/retained.
- UCI HCV: 615 raw rows, 608 retained after excluding 7 suspect blood donors.
- eICU Demo v2.0.1: 2,520 unit stays in patient.csv; 791 modeled stays after outcome/window/data rules and one stay per health-system stay.

The complete app now embeds 8 separate observed-data cohorts totaling 69,104 modeled records/visits/stays. This is not a unique-patient count and the sources are not merged into one population.

eICU is a PROGNOSTIC first-6-hour laboratory module for observed hospital mortality. APACHE scores/predictions, admission diagnoses and later data are not model features. HCV retains a fail-closed gate because historical lab units/methods are not harmonized. CKD joins the compatible diagnostic hub.

Weaknesses are intentionally visible:
- HCV fibrosis: 0/5 detected at its research threshold in the internal test.
- eICU mortality: 4/15 detected with 21 false positives; AUC about 0.598.
- CKD perfect internal test separation comes from a tiny historical single-source dataset and is not treated as external validation.

Final extracted-delivery verification:
- Python: 304 PASS
- JavaScript: 366 PASS
- Recovery: 30 PASS
- Chromium complete-app checks: 64 PASS
- Installed wheel HTTP/process/persistence: 36 PASS
- git fsck: PASS
- extracted repository clean

Research only. No diagnosis, treatment or triage authorization.
