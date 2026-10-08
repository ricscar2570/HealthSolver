# HealthSolver 0.45.0 — NHANES 2017–2018 Integration

Date: 2026-10-08.

## Macrostep rule
This release is one complete database integration macrostep.

Database integrated:
**CDC/NCHS NHANES 2017–2018 public-use files**.

The next database is not started until this release is fully working, tested, documented, committed and deployed.

## Baseline audit
HealthSolver 0.44 was audited before 0.45 development.

- main and release/v0.44.0-uci-hcv-integration: consistent
- published version: 0.44.0
- predictive model count: 4
- UCI HCV live browser audit: PASS

## Source files
The 0.45 cohort is assembled from public-use NHANES 2017–2018 files:

- DEMO_J.XPT
- BMX_J.XPT
- BPX_J.XPT
- TCHOL_J.XPT
- HDL_J.XPT
- DIQ_J.XPT

The first pipeline attempt used an obsolete NHANES URL path that returned HTML rather than SAS XPORT data.
The workflow was corrected to the current public data path:

`https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2017/DataFiles/`

## New model
Model ID:
`HS-NHANES-DM-001`

Title:
**Diabete riferito diagnosticato (NHANES)**

Research task:
binary prediction of self-reported doctor-diagnosed diabetes versus no diabetes among adults in NHANES 2017–2018.

### Target definition
Positive:
- DIQ010 = 1
- respondent reports that a doctor told them they have diabetes

Negative:
- DIQ010 = 2
- respondent reports no doctor-diagnosed diabetes

Excluded:
- borderline
- refused
- don't know
- age <20
- invalid MEC examination weight

This is not a clinical diabetes diagnosis model.

## Features
Seven features:

- age
- sex
- BMI
- waist circumference
- mean systolic blood pressure
- total cholesterol
- HDL cholesterol

## Survey weighting
NHANES MEC examination weights:
`WTMEC2YR`

Weights are applied as sample weights during:
- logistic-regression fitting;
- Platt probability calibration;
- weighted AUROC;
- weighted AUPRC;
- weighted Brier scoring.

This does not reproduce the full NHANES complex-survey variance design and the limitation is recorded in the model artifact.

## Cohort and splits
- total usable adults: 5,393
- training: 3,235
- calibration: 1,079
- held-out test: 1,079
- positive prevalence unweighted: 0.1624327832

## Probability model
- training-median imputation
- training-set standardization
- class-balanced logistic regression
- held-out Platt calibration

## Decision threshold
The default 0.5 threshold produced poor sensitivity and was rejected as an arbitrary operating point.

Final threshold:
`0.10482057798374526`

Selection:
weighted Youden J maximum on the calibration split only.

The threshold is then evaluated once on the independent held-out test split.

Threshold selection does not alter the calibrated probability output.

## Held-out test metrics
- weighted AUROC: 0.8035039958
- weighted AUPRC: 0.3461496910
- weighted Brier score: 0.0875480547
- sensitivity at selected threshold: 0.8579545455
- specificity at selected threshold: 0.5957918051
- unweighted accuracy at selected threshold: 0.6385542169

Unweighted confusion matrix:
- TN 538
- FP 365
- FN 25
- TP 151

## Registry
Predictive registry:
`0.45.0`

Registered supervised models:
1. HS-UCI-HD-001
2. HS-UCI-CKD-001
3. HS-UCI-BC-001
4. HS-UCI-HCV-001
5. HS-NHANES-DM-001

Published predictive model count:
`5`

## Expert Mode integration
HealthSolver 0.45 retains the Predictive-First UI.

The visible predictive block now displays:
**5 MODELLI SUPERVISIONATI**

NHANES integration:
- age and sex are reused from the clinical dossier;
- compatible BMI, waist, systolic BP, total cholesterol and HDL fields are reused when present;
- a collapsible NHANES supplement allows explicit entry in the exact model units;
- the UI explicitly states that the outcome is self-reported doctor-diagnosed diabetes and not a clinical diagnosis.

The result renderer was generalized to support both:
- standard metrics (`auroc`, `brier`);
- survey-weighted metrics (`auroc_weighted`, `brier_weighted`).

## Qualification
Data/training:
- initial obsolete-URL attempt: FAIL, correctly blocked
- corrected CDC public-use download: PASS
- initial 0.5-threshold model: technically valid but rejected due low sensitivity
- calibration-selected threshold retraining: PASS

Software:
- HealthSolver 0.39 predictive smoke: PASS
- generalized multi-outcome registry smoke: PASS
- UCI HCV smoke after registry expansion: PASS
- NHANES 0.45 model + registry smoke: PASS
- JavaScript integrated UI syntax: PASS
- registry model count = 5: PASS
- weighted metric schema rendering: PASS
- standalone repack: PASS
- GitHub Pages native deployment: PASS

## Final live browser audit
Workflow:
`HealthSolver 0.45 NHANES Live Browser Audit`

Successful run:
`37818368307`

Verified on the public GitHub Pages build:
- version = 0.45.0: PASS
- predictive model count = 5: PASS
- HS-NHANES-DM-001 present in published metadata: PASS
- Expert Mode available: PASS
- five-model predictive badge visible: PASS
- NHANES model coverage card visible: PASS
- NHANES supplemental input panel visible: PASS
- complete NHANES input accepted: PASS
- model executes without abstention: PASS
- numeric probability rendered: PASS
- metric summary rendered: PASS
- screenshots captured: PASS

## Deployment
Public URL:
https://ricscar2570.github.io/HealthSolver/

Pages deployment commit:
`ba97a8d691776fd0014effa7ca1d9c414199f4cd`

Standalone source SHA-256:
`4c88759518074067236894126dd23c5e3d6d419fbcf3e3315b30e03a95a85e79`

Payload parts:
7

## Research boundary
HS-NHANES-DM-001 predicts a survey-defined self-reported outcome.

It does not diagnose diabetes, detect undiagnosed diabetes, or replace HbA1c, glucose testing or medical evaluation.

The model is not externally or prospectively clinically validated and is not authorized for diagnosis, triage or treatment.

## Next database macrostep
Before the next database:
1. audit the complete 0.45 live release;
2. integrate exactly one additional immediately usable public database;
3. produce a new complete release;
4. update main and GitHub Pages;
5. run a live browser end-to-end prediction;
6. update README, checkpoint and release branch.
