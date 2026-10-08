# HealthSolver 0.37.0 — Clinical Coach Research Edition

Complete local release commit: `1e4152a79f0501777b8cd11d0643746523594da2`
Local tag: `v0.37.0-clinical-coach`
Date: 2026-10-08.

This checkpoint records the completed local release. It does NOT claim that the full 0.37 application tree or local Git history has been pushed to this branch or to main.

Clinical Coach:
- default state-driven adaptive UI, not a rigid numbered wizard;
- 17 logical states grouped into 8 phases;
- same Clinical Intelligence case object as Expert Mode;
- one next action derived from real case state;
- direct correction from the persistent summary;
- present/absent/unknown symptoms and explicit missing-data states;
- deterministic text extraction with review before application;
- adaptive specialist sections;
- model-applicability review and explicit research analysis;
- professional decision stored separately from model output;
- report plus explicit Coach backup/restore;
- versioned integrity-checked local resume when browser storage is available;
- fail-safe operation when storage is unavailable.

Final extracted-delivery verification:
- Python 314 PASS
- JavaScript 368 PASS
- recovery/sync 30 PASS
- browser 124 PASS: differential 64, Expert Clinical Intelligence 24, Clinical Coach 32, resume fail-safe 4
- installed wheel package/HTTP smoke 20 PASS
- static sanity PASS
- release verifier PASS
- git fsck PASS
- extracted Git working tree CLEAN
- standalone/app/repository HTML identical

Final artifact SHA256:
- APP: 4325ca44e0e2bb905a39cbf212b68e9acf03b8fd9a9f9fc41e89f0ec858f09f1
- REPOSITORY: 752ee30e287df7d864a325b7a436f2a21661eb5123269b1a464b03470e811141
- HTML: b2d83af82efe7998f1ef98bd0ba903fba29d7026ce216dd3ac7e393fda87feb8
- REPORT: cfcfc8cef4fc27a450cd1d35908ae31401d9a8bae5c9bfbd676ef21056f2c186

Qualification boundary: the execution environment blocks navigation to the simulated stable HTTPS origin, so native localStorage reload persistence is not claimed as qualified. Resume payload integrity, storage-unavailable fail-safe, and explicit backup/restore are verified.

Research only. No clinical validation, diagnosis/treatment/triage authorization, or clinical activation flag.
