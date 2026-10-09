# HealthSolver 0.49.0 — UCI Heart Failure Clinical Records Integration

Date: 2026-10-09.

## Macrostep rule

This release integrates exactly one new immediately usable public database:

**UCI Heart Failure Clinical Records — UCI ID 519**

This is database macrostep #6 after the frozen HealthSolver 0.48 baseline.

No other database is introduced in this macrostep.

## Frozen baseline

Development started from the audited HealthSolver 0.48.0 release:

- public application: 0.48.0
- predictive registry: 0.48.0
- predictive model count: 8
- full static audit: PASS
- full browser E2E: PASS
- published release smoke: PASS
- GitHub Pages synchronized with main predictive assets

## Source database

- Name: UCI Heart Failure Clinical Records
- UCI ID: 519
- DOI: 10.24432/C5Z89R
- License: CC BY 4.0
- Instances: 299 patients
- Source predictors: 12
- Source target: DEATH_EVENT
- Missing values: none declared by UCI
- Source:
  https://archive.ics.uci.edu/dataset/519/heart+failure+clinical+records

UCI describes the source as medical records of patients with heart failure collected during their follow-up period.

## Leakage control

The source predictor:

`time`

is the follow-up duration in days.

HealthSolver deliberately excludes `time` from model inputs because it is observation-time information rather than a baseline clinical predictor. Using it to predict whether death occurred during follow-up could introduce post-index temporal leakage.

The model artifact records:

`excluded_source_features = ["time"]`

and the browser UI does not expose any `time` control for this model.

## New predictive model

Model ID:

`HS-UCI-HFDEATH-001`

Title:

**Mortalità nel follow-up · insufficienza cardiaca**

Task:

Binary research prediction of death during the source follow-up period among patients with heart failure in UCI 519, excluding follow-up duration from predictors.

Research only:

true

Clinically validated:

false

## Predictors

The model uses 11 source baseline/clinical predictors:

1. age
2. anaemia
3. creatinine_phosphokinase
4. diabetes
5. ejection_fraction
6. high_blood_pressure
7. platelets
8. serum_creatinine
9. serum_sodium
10. sex
11. smoking

Age and sex are reused from the HealthSolver dossier.

Compatible creatinine and sodium values can be reused from the general dossier. Remaining source-domain values are entered through the dedicated heart-failure specialist panel.

## Training design

- total: 299
- training: 179
- calibration: 60
- held-out test: 60
- positive prevalence: 0.3210702341
- class-balanced regularized logistic regression
- training-derived standardization
- held-out Platt calibration
- decision threshold selected only on calibration data using Youden J
- independent held-out test used once for final internal metrics

## Held-out test metrics

- AUROC: 0.7437500000
- AUPRC: 0.6591610311
- Accuracy: 0.6833333333
- Brier score: 0.1883336196
- Sensitivity: 0.7000000000
- Specificity: 0.6750000000
- Decision threshold: 0.2995763462
- TN: 27
- FP: 13
- FN: 6
- TP: 14

These are internal held-out results from the same UCI source cohort.

They are not external or prospective clinical validation.

## Registry

Predictive registry version:

`0.49.0`

Registered model count:

`9`

Registered models:

1. HS-UCI-HD-001
2. HS-UCI-CKD-001
3. HS-UCI-BC-001
4. HS-UCI-HCV-001
5. HS-NHANES-DM-001
6. HS-NHIS-HYP-001
7. HS-UCI-DMREADM-001
8. HS-UCI-THYREC-001
9. HS-UCI-HFDEATH-001

No previous predictive artifact was retrained or replaced.

## Predictive-First UI integration

HealthSolver 0.49 keeps all prediction inside the existing Expert Mode dossier.

The predictive header reports:

**9 MODELLI SUPERVISIONATI**

New specialist section:

`#hs49HeartFailureDetails`

The section is titled:

**Insufficienza cardiaca · mortalità nel follow-up**

Behavior:

- age reused from dossier;
- sex reused from dossier;
- compatible creatinine and sodium values reused when available;
- remaining source-domain variables entered in the specialist panel;
- `time` is not rendered;
- the common readiness/abstention logic is preserved;
- the result uses the common predictive result-card system;
- the probability is not normalized against or ranked with the other eight outcomes.

## CI regression-gate remediation

Immediately after registry expansion, several historical smoke workflows failed because they still hard-coded older registry versions/model counts.

These were compatibility failures in the test definitions, not application regressions.

The historical regression gates were changed to preserve their original-model assertions while allowing later registry versions.

Successful reruns:

- HealthSolver 0.40 Multi-Outcome Smoke: run 37887625696 — PASS
- HealthSolver 0.44 UCI HCV Smoke: run 37887629073 — PASS
- HealthSolver 0.45 NHANES Smoke: run 37887631666 — PASS
- HealthSolver 0.46 NHIS Smoke: run 37887634151 — PASS
- HealthSolver 0.47 UCI Diabetes Readmission Smoke: run 37887637573 — PASS
- HealthSolver 0.48 Static and Model Integrity: run 37887640171 — PASS
- HealthSolver 0.48 UCI Thyroid Recurrence Smoke: run 37887643166 — PASS

## Qualification

### Training pipeline

Workflow:

`HealthSolver 0.49 UCI Heart Failure Mortality`

Run:

`37887364922`

Result:

PASS

### Repack

Workflow:

`HealthSolver 0.49 UCI Heart Failure Repack`

Run:

`37887551217`

Result:

PASS

### GitHub Pages deployment

Run:

`37887563877`

Result:

PASS

### Published release smoke

Workflow:

`HealthSolver Published Release Smoke`

Run:

`37887645542`

Result:

PASS

Verified:

- public release version 0.49.0;
- public registry version 0.49.0;
- nine public predictive models;
- public registry equals main registry;
- all public model artifacts equal main artifacts;
- public integrated predictive UI equals main asset.

### Heart-failure model smoke

Workflow:

`HealthSolver 0.49 UCI Heart Failure Smoke`

Run:

`37887675499`

Result:

PASS

Verified:

- UCI ID 519;
- DOI and CC BY 4.0 provenance;
- 299 source records;
- `time` exclusion;
- 11 model predictors;
- split counts and metrics;
- deterministic browser-compatible inference;
- registry entry;
- 0.49 UI markers.

### Heart-failure live browser audit

Workflow:

`HealthSolver 0.49 Heart Failure Live Browser Audit`

Run:

`37887703547`

Result:

PASS

Verified on the live GitHub Pages application:

- 0.49.0 metadata;
- nine-model badge;
- heart-failure coverage card;
- specialist panel;
- no `time` predictor control;
- complete source-domain inputs accepted;
- model reaches PRONTO ALLA PREDIZIONE;
- HS-UCI-HFDEATH-001 result card rendered;
- numeric probability rendered;
- no unexpected abstention;
- held-out AUROC 0.744 shown in the result card;
- no serious browser errors.

### Full static release audit

Workflow:

`HealthSolver 0.49 Full Static Release Audit`

Run:

`37887724835`

Result:

PASS

Verified:

- repository integrity;
- no tracked .env;
- Python syntax;
- JavaScript syntax;
- JSON/YAML parsing;
- frontend JSX bundling;
- all nine predictive artifacts;
- mathematical inference integrity;
- thyroid encoding invariants;
- heart-failure leakage-control invariants;
- safe legacy FastAPI import;
- Pages packaging invariants;
- 0.49 predictive UI markers.

### Full browser regression audit

Workflow:

`HealthSolver 0.49 Full Browser E2E Audit`

Run:

`37887770291`

Result:

PASS

The live application was exercised end to end.

Verified:

- navigation;
- Clinical Coach;
- local resume;
- Coach backup/restore;
- Expert text extraction and analysis;
- all nine predictive models in one dossier;
- nine numeric prediction cards with no unexpected abstentions;
- Expert plain/encrypted backup and restore;
- Multi-Model Hub;
- Massive Public Data;
- BRFSS evidence;
- openFDA observable response handling;
- FHIR local import;
- single-model case/report workflow;
- client-side data/training workflow;
- validation workflow;
- archive plain/encrypted backup/restore;
- preserved previous-module marker;
- final browser error check.

Final browser result:

`ALL_BROWSER_ERRORS []`

`FULL ACTIVE-APP E2E PASS`

## Published release

Public URL:

https://ricscar2570.github.io/HealthSolver/

Published application version:

`0.49.0`

Published predictive registry version:

`0.49.0`

Published model count:

`9`

GitHub Pages commit:

`124cb9546d22aefd4213b187504ed9d8f76ea963`

Published standalone source SHA-256:

`e23e6b299f82b0c3affa91d0db9ce12e2420237d83e6555fbe6bd9bb724e2e83`

Payload parts:

`7`

## Research boundary

HS-UCI-HFDEATH-001 is not a validated clinical mortality score.

It must not be interpreted as:

- an autonomous prognosis;
- an individual survival estimate valid outside the source cohort;
- a triage rule;
- a treatment-selection tool;
- a recommendation for admission, discharge, device therapy, transplantation or palliative care;
- an externally or prospectively validated probability;
- a substitute for cardiology assessment.

The model estimates a source-dataset-defined death-during-follow-up outcome within UCI 519 after deliberately excluding follow-up duration from predictors.

## Gate for database #7

Before the next database macrostep:

1. use this 0.49 release as the frozen baseline;
2. re-audit the baseline before new development;
3. integrate exactly one new immediately usable database;
4. preserve all nine existing model artifacts;
5. perform explicit leakage review before training;
6. integrate the new model into the same Predictive-First dossier;
7. run model smoke, historical regression gates, full static audit, live browser audit and full browser E2E;
8. publish GitHub Pages;
9. verify public registry/assets against main;
10. update README/checkpoint/release branch before proceeding.
