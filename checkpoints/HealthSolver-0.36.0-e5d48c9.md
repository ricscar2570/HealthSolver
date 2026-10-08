# HealthSolver 0.36.0 — Clinical Intelligence Research Edition

Complete local source commit: `e5d48c950cebb1b7e2de31b8cf3e91939675aaf9`
Local tag: `v0.36.0-clinical-intelligence`
Date: 2026-10-08.

This checkpoint records the completed local Research Edition. It does NOT claim that the full 0.36 application tree or local Git history has been pushed to this branch or to main.

Software-complete research scope:
- one Clinical Intelligence dossier for structured clinical facts, symptoms, measurements, laboratory values, specialist findings and free text;
- deterministic text parser that extracts reviewable facts only and does not invent diagnoses or treatments;
- orchestration of all compatible specialist models without fusing incompatible probabilities;
- eight preserved observed-data cohorts, 69,104 modeled records/visits/stays across separate sources;
- model-specific provenance, thresholds, internal metrics, contributions, abstentions and missing-input priorities;
- arbitrary observations compared only with user-supplied reference intervals;
- frozen external-validation center with no retraining/recalibration and exact-overlap checks;
- reports, audit IDs, backup/restore and encrypted export where WebCrypto is available;
- all 0.32–0.35 visit, laboratory, training and research workflows retained.

Final extracted-delivery verification:
- 309 Python tests PASS
- 30 recovery tests PASS
- 367 JavaScript checks PASS
- 87 Chromium workflow checks PASS (64 regression + 23 Clinical Intelligence)
- 38 installed-wheel HTTP/process/persistence checks PASS
- git fsck PASS
- extracted working tree clean before verification builds
- standalone HTML byte-identical to packaged repository asset

Final artifacts:
- HealthSolver-0.36.0-APP-COMPLETA.zip — SHA256 1b6a7c0b94d60f57742ffef77f14ff0ace39ae05ba2710f45f009ef67b9b4dc3
- HealthSolver-0.36.0-REPOSITORY-COMPLETA.zip — SHA256 982f09e56f0a621d2fdf425a13f9c67b6bb8029c13d404400daaea9b87d1e96a
- HealthSolver-0.36.0.html — SHA256 b4cd1da2d4b470c003680feef41c79a56767e0d68959ffc5452c471fac1a797d
- HealthSolver-0.36.0-Rapporto-Macrostep.md — SHA256 4a0d1c202e1dc9334f3630215f410e6b1fc27f1bf5901c86c356c86f2c28f7ed

BOUNDARY: software research feature completion is not clinical validation or medical-device approval. Remaining work is independent clinical evidence, clinician/human-factors evaluation, secure professional deployment and applicable regulatory/privacy qualification. Do not implement a clinical activation flag.
