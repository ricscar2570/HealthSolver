# HealthSolver 0.44.0 — UCI HCV Data Integration

Date: 2026-10-08.

## Macrostep rule
This release is one complete database integration macrostep.

Database integrated:
**UCI HCV Data** — UCI ID 571.

No second database is started until this release is fully working, tested, documented, committed and deployed to GitHub Pages.

## Baseline audit
Before 0.44 development, HealthSolver 0.43 was re-audited.

- main and release/v0.43.0-predictive-first-ui: consistent
- 0.43 predictive-first visual browser audit: PASS
- GitHub Pages deployment: PASS
- predictive-first Expert Mode UI: PASS

## Source database
- Name: UCI HCV Data
- UCI ID: 571
- DOI: 10.24432/C5D612
- License: CC BY 4.0
- Public source: https://archive.ics.uci.edu/dataset/571/hcv+data

The first training attempt correctly failed because the actual UCI feature is named `CGT`, not `GGT`.
The pipeline was corrected to map source column `CGT` to internal feature `ggt` without changing the source data semantics.

## Target definition
Model ID:
`HS-UCI-HCV-001`

Research task:
binary prediction of liver-disease category versus blood-donor reference within the UCI HCV Data domain.

Negative class:
- Blood Donor

Positive class:
- Hepatitis
- Fibrosis
- Cirrhosis

Excluded:
- suspect Blood Donor

The suspect-donor category is deliberately excluded rather than forced into either binary class.

## Features
12 model features:

- age
- sex
- albumin
- alkaline phosphatase
- ALT
- AST
- bilirubin
- cholinesterase
- cholesterol
- creatinine
- GGT (source column CGT)
- total protein

## Training design
- total usable records: 608
- training: 364
- calibration: 122
- held-out test: 122
- positive prevalence: 0.1233552632
- training-median imputation
- training-set standardization
- class-balanced logistic regression
- held-out Platt calibration

## Held-out test metrics
- AUROC: 0.9249221184
- AUPRC: 0.7118493312
- Accuracy: 0.9180327869
- Brier score: 0.0776655824
- Sensitivity at threshold 0.5: 0.5333333333
- Specificity at threshold 0.5: 0.9719626168
- Confusion matrix:
  - TN 104
  - FP 3
  - FN 7
  - TP 8

The relatively modest sensitivity is explicitly recorded and is not hidden by the high accuracy/specificity.

## Registry
Predictive registry version:
`0.44.0`

Registered models:
1. HS-UCI-HD-001
2. HS-UCI-CKD-001
3. HS-UCI-BC-001
4. HS-UCI-HCV-001

Published `version.json` derives the predictive model list and model count from the registry to prevent metadata drift.

Published model count:
`4`

## UI integration
HealthSolver 0.44 retains the Predictive-First Expert Mode introduced in 0.43.

The large predictive area now shows:
- **4 MODELLI SUPERVISIONATI**
- cardiopatia angiografica
- malattia renale cronica
- malignità su caratteristiche FNA
- pattern epatico HCV / malattia epatica

HCV-specific integration:
- age and sex are reused from the dossier;
- ten biochemical measurements are entered in a collapsible **Dati specialistici epatici / HCV** panel;
- exact UCI units are displayed;
- no silent conversion from potentially incompatible dossier units is performed.

## Qualification
Training pipeline:
- first attempt: FAIL due to source-column name mismatch CGT/GGT
- corrected attempt: PASS

Software gates:
- legacy Heart Disease predictive smoke: PASS
- expanded multi-outcome registry smoke: PASS
- 0.44 HCV model + registry smoke: PASS
- integrated UI HCV reference checks: PASS
- 0.44 standalone repack: PASS
- GitHub Pages native deployment: PASS

Final live browser audit:
- published metadata version = 0.44.0: PASS
- published predictive_model_count = 4: PASS
- HS-UCI-HCV-001 present in published metadata: PASS
- Expert Mode available: PASS
- fourth HCV coverage card visible: PASS
- hepatic/HCV specialist supplement visible: PASS
- complete HCV input accepted: PASS
- HS-UCI-HCV-001 result card rendered: PASS
- numeric predictive percentage rendered: PASS
- unexpected abstention with complete input: NO
- screenshot capture from live GitHub Pages: PASS

Final successful live audit workflow:
`HealthSolver 0.44 UCI HCV Live Browser Audit`

Final successful run:
`37816890690`

## Deployment
Public URL:
https://ricscar2570.github.io/HealthSolver/

Latest synchronized Pages deployment commit:
`0f072f649f5402b877014b6688dc91db8ce903e6`

Published standalone source SHA-256:
`a87aa668b9a7e86bc6270d52ed810da3ea6387779721d8bad182eb71aabd00f4`

Payload parts:
7

## Research boundary
HS-UCI-HCV-001 is not a clinical HCV diagnostic test.

It estimates the probability of belonging to the positive disease-category grouping defined from the UCI HCV Data dataset versus the blood-donor reference group.

It is not externally or prospectively validated, does not replace laboratory interpretation, serology, imaging, histology or medical judgement, and is not authorized for clinical diagnosis, treatment or triage.

## Next database macrostep
Before integrating the next immediately usable database:
1. re-audit the complete 0.44 release;
2. keep one database per macrostep;
3. produce a new fully working release;
4. update main, GitHub Pages, README, checkpoint and release branch;
5. run a live browser end-to-end test of the new model before freezing the release.
