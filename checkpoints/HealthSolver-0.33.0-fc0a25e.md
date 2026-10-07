# HealthSolver 0.33.0 — complete local research workspace

Date: 2026-10-07. Local source commit: fc0a25e74f901d46920b0014ad06f54853a8df8b.
Local tag: v0.33.0-observed-differential. Baseline 0.32 commit daaff5fa4434c39fe6a986ff43c2f398f437a6c5 preserved.

THIS CHECKPOINT IS NOT PUBLICATION OF THE COMPLETE APPLICATION ON THIS BRANCH OR MAIN.
The current Git network path cannot resolve github.com. Connector writes can save this status and the acquisition workflows, not a claim that the full local history and 10 MB HTML have been pushed.

Delivered artifacts:
- HealthSolver-0.33.0-APP-COMPLETA.zip, 1179382 bytes, SHA256 9636615c4886d61423a8b8537a6a50ae710137bb410b2b9e133d00cdd77ce7ca.
- HealthSolver-0.33.0-REPOSITORY-COMPLETA.zip, 60323260 bytes, SHA256 7464cfb58de7b449941fdc1fd37504e82d081ae9aa2980dcce9197bc3f34b31c.
- HealthSolver-0.33.0.html, 10453268 bytes, SHA256 e103e97982d5a538b666c3be83a754575669c90124efb189db34b4dc08b041e8.

The downloadable complete repository includes original public source archives, source receipts, derived cohorts, fitted models, independent tests, browser evidence, prior application and full local Git history. Preserve that archive for resumption; do not substitute main's 2025 code.

Observed data, not synthetic substitutes:
- NHAMCS ED 2016-2022: 123040 original visits, 52935 retained, train39185 (2016-2020), calibration7045 (2021), descriptive test6705 (2022), 32 inputs, 13 nonexclusive recorded-code groups.
- UCI thyroid0387: 9172 original records, 8457 retained, train5021/cal1754/test1682, 8 inputs including five historical lab values, five comment groups. Clinical units/methods not harmonized; NOT for modern lab reports.
- No merging of incompatible sources. No patient-independent or clinical external validation claim. Text notes are not model features.

Real source acquisition:
- NHAMCS run37657064899/artifact11499206296, SHA256 70b9d2d465198745cc85ac6ecb92923c0898eae7df040ac823e65168f388ac8c.
- UCI run37656515977/artifact11499210543, SHA256 1a411a64fa392b84ece692bd037a7347921d311668b50fd33ad69e1ad876a03c.
Artifacts have retention limits. Exact copies and acquisition receipts are preserved in the delivered repository.

Implemented: actual full-cohort logistic multilabel training in browser, learned missing-value coding, calibration-only threshold selection, descriptive temporal/internal tests, per-category false positives/negatives, exact log-odds contributions, training-only neighbors, case revisions, reports and encrypted-export option. Original 0.32 visit and WDBC labs retained, exercised inside nested app. New backend path /differential/; migration head unchanged0026.

Local tests executed: 303 Python, 76 new JS plus256 prior JS, 30 recovery, 56 Chromium workflow checks, 35 installed-wheel HTTP checks. Independent Python reconstruction compares95575 test probabilities against actual JS, plus independent UCI training. Full source-cohort replay is byte-identical. Browser native file://, Windows/Android and native file-origin crypto are NOT qualified; opaque context fails closed. No new full dependency resolution, Ruff, PostgreSQL or clinical qualification.

Model quality is insufficient for care: NHAMCS pneumonia at its research threshold0.10 detects47/129 recorded positives, with229 false positives and82 false negatives (PPV17.03%). Exact multilabel accuracy is below the all-zero baseline; macroAUC must not be described as clinical accuracy. No diagnosis, treatment or triage authorization.

Next macrostep: improve observed-model quality/reference labels, contemporary harmonized lab sources, external/clinical evaluation and secure workflow. Deliver a COMPLETE application every time and retain prior working features. No regressions to a synthetic-only replacement; no clinical activation flag.
