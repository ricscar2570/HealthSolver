# HealthSolver 0.51.1 — Sepsis Audit & Scientific Semantics Remediation

Date: 2026-10-09.

## Purpose

HealthSolver 0.51.1 is a post-release audit/remediation of the UCI Sepsis Survival integration introduced in 0.51.0.

It adds no new database and no new predictive model.

It does not retrain HS-UCI-SEPSISDEATH-001 and does not change its numerical inference core.

The goals are:

1. independently reproduce the stored model from the UCI source;
2. clarify the source-cohort scope;
3. clarify the paper's approximately 9.351-day wording versus variable individual length of stay;
4. distinguish independent external-dataset evaluation from clinical/prospective validation;
5. verify the browser sex-encoding conversion in both directions;
6. pin the scientific Python environment for future reproducibility;
7. constrain the septic-episode UI input to the source-observed range;
8. requalify repository, packaging and live deployment before database #9.

## Frozen 0.51.0 baseline

Frozen 0.51.0 commit:

`f3c16504c723792c55a5fed0adc092ce1e42e424`

Frozen release branch:

`release/v0.51.0-uci-sepsis-survival`

0.51.0 full browser E2E:

`37905728164`

Result:

PASS

Markers:

- `11-model integrated prediction PASS`
- `ALL_BROWSER_ERRORS []`
- `FULL ACTIVE-APP E2E PASS`

## Source

Dataset:

**Sepsis Survival Minimal Clinical Records**

UCI ID:

`827`

DOI:

`10.24432/C53C8N`

License:

**CC BY 4.0**

Associated paper DOI:

`10.1038/s41598-020-73558-3`

Source URL:

https://archive.ics.uci.edu/dataset/827/sepsis+survival+minimal+clinical+records

## Audit finding 1 — primary cohort scope

The 0.51.0 label **“coorte sepsi”** was too easy to read as if every one of the 110,204 primary-cohort admissions were necessarily later-definition Sepsis-3 cases.

The source/paper instead distinguishes:

- a broad Norwegian primary cohort containing infection, SIRS, microbiological-sepsis and septic-shock records under pre-Sepsis-3-era criteria;
- a 19,051-admission study cohort selected from the primary cohort for later Sepsis-3-compatible analysis.

### 0.51.1 remediation

Model task and source metadata now state explicitly that not every primary-cohort admission can be asserted to satisfy the later Sepsis-3 definition.

Registry title changed to:

**Esito ospedaliero · primary cohort infezioni/SIRS/sepsi**

UI title changed to:

**Infezione / SIRS / sepsi · esito ospedaliero**

The specialist panel explicitly identifies the broad primary-cohort scope.

## Audit finding 2 — time-horizon semantics

The associated paper describes prediction at approximately **9.351 days after record collection**.

The same paper reports that:

- 9.351 days is the **mean hospital length of stay**;
- individual hospital length of stay ranges from **0 to 499 days**;
- length of stay is excluded from the predictors because it is strongly related to survival.

The 0.51.0 HealthSolver wording correctly rejected a literal fixed “9-day mortality” interpretation, but it did not explicitly preserve the paper's own approximately-9.351-day wording.

### 0.51.1 remediation

HealthSolver now states both facts:

- the paper uses approximately 9.351 days because this is the mean LOS;
- individual LOS spans 0–499 days.

HealthSolver therefore does **not** reinterpret the mean LOS as a fixed per-patient follow-up horizon.

The model remains:

- a binary hospital-outcome source-label classifier;
- `fixed_horizon = false`;
- `survival_probability = false`.

It is not presented as:

- fixed 9-day mortality;
- fixed 9.351-day mortality;
- a censoring-aware survival probability;
- a time-to-event model.

## Audit finding 3 — external-validation wording

The generic 0.51 result-card line said:

> Nessuna validazione clinica esterna/prospettica.

The same sepsis result card then displayed an independent South Korean external evaluation.

Although “external dataset validation” and “clinical/prospective validation” are methodologically different concepts, the two adjacent phrases were linguistically ambiguous.

### 0.51.1 remediation

Generic result cards now say:

> Le metriche interne non costituiscono validazione clinica/prospettica.

The sepsis-specific row now says:

> Validazione esterna indipendente del dataset

and explicitly adds:

> non equivale a validazione clinica/prospettica.

The weak-generalization warning remains visible.

## Audit finding 4 — reproducibility environment

The 0.51 training workflow initially installed unpinned latest scientific-Python dependencies.

This could allow future library changes to alter coefficients or solver behavior even though the random seeds and source data were fixed.

### Independent environment identification

An independent source re-download/reproduction run recorded the exact environment that reproduces the stored model:

- Python: **3.13**
- NumPy: **2.5.3**
- pandas: **3.0.6**
- scikit-learn: **1.9.1**

### 0.51.1 remediation

The manual training/reproduction workflow is now pinned to:

`numpy==2.5.3 pandas==3.0.6 scikit-learn==1.9.1`

The model artifact stores the same runtime environment.

The workflow remains manual:

`workflow_dispatch`

and idempotent.

## Audit finding 5 — septic episode input domain

The released training data expose septic episode number over the range:

`1–5`

0.51.0 used `min=1` but did not constrain the browser maximum.

### 0.51.1 remediation

The browser input is now:

`min=1 max=5 step=1`

Out-of-source episode numbers cannot be entered through the normal numeric-control UI.

## Audit finding 6 — sex encoding

HealthSolver common dossier encoding:

- female = 0
- male = 1

UCI sepsis source encoding:

- male = 0
- female = 1

The 0.51 browser mapping was:

- HealthSolver male 1 -> source male 0
- HealthSolver female 0 -> source female 1

The code appeared correct, but the prior live test only exercised one direction.

### 0.51.1 qualification

The live audit now:

1. obtains the public sepsis model JSON;
2. computes expected probability using source sex = 0;
3. selects male in HealthSolver;
4. verifies the displayed rounded probability;
5. computes expected probability using source sex = 1;
6. selects female in HealthSolver;
7. verifies the displayed rounded probability.

Final marker:

`SEX_MAPPING PASS`

## Model identity

Model ID:

`HS-UCI-SEPSISDEATH-001`

0.51.1 model version:

`1.0.1`

Registry version:

`0.51.1`

Total models:

`11`

## Numerical core

0.51.1 does not alter:

- features;
- field metadata;
- imputations;
- standardization;
- logistic intercept;
- logistic coefficients;
- Platt calibration;
- threshold;
- threshold-selection method;
- internal held-out metrics;
- external-validation metrics;
- abstention policy;
- split limitation;
- leakage review;
- model report JSON.

### Numerical freeze

The full static audit compares these fields against frozen 0.51.0 commit:

`f3c16504c723792c55a5fed0adc092ce1e42e424`

Result marker:

`0.51 SEPSIS NUMERICAL FREEZE PASS`

## Internal model metrics — unchanged

Norwegian primary cohort:

- total admissions: **110,204**
- training: **66,122**
- calibration: **22,041**
- test: **22,041**
- death prevalence: **0.07354542484846285**
- AUROC: **0.7039151900164407**
- AUPRC death-positive: **0.13346066542506296**
- Accuracy: **0.5422621478154349**
- Brier: **0.06584055395345341**
- sensitivity death: **0.7822331893892659**
- specificity survival: **0.5232125367286974**
- threshold: **0.06872795821072762**

## Independent South Korean evaluation — unchanged

- n: **137**
- survived: **113**
- deceased: **24**
- death prevalence: **0.17518248175182483**
- AUROC: **0.5484882005899706**
- AUPRC death-positive: **0.20949205455985004**
- Accuracy: **0.6642335766423357**
- Brier: **0.15793181873895518**
- sensitivity death: **0.4166666666666667**
- specificity survival: **0.7168141592920354**

Status remains:

`WEAK_GENERALIZATION`

## Independent reproduction audit

Workflow:

`HealthSolver 0.51 Independent Reproduction Audit`

Final pinned run:

`37907740045`

Result:

PASS

The workflow independently:

- downloads the UCI source from scratch;
- verifies the outer and inner ZIP structure;
- verifies exact CSV names;
- verifies exact primary/study/external dimensions;
- verifies no missing values;
- verifies primary death/survival counts;
- verifies primary sex counts;
- verifies external 24/113 death/survival counts;
- reproduces the exact deterministic train/calibration/test split;
- retrains the model from source;
- recomputes Platt calibration;
- recomputes the Youden threshold;
- recomputes internal metrics;
- recomputes external metrics;
- compares all values with the stored model.

Markers:

- `SOURCE_COUNTS PASS`
- `MODEL_COEFFICIENTS PASS`
- `CALIBRATION PASS`
- `THRESHOLD PASS`
- `INTERNAL_METRICS PASS`
- `EXTERNAL_METRICS PASS`
- `INDEPENDENT REPRODUCTION PASS`

Runtime output:

`{'numpy': '2.5.3', 'pandas': '3.0.6', 'scikit_learn': '1.9.1'}`

## 0.51.1 model-specific smoke

Workflow:

`HealthSolver 0.51.1 Sepsis Audit Remediation Smoke`

An initial run:

`37907472401`

failed because the newly edited **test itself** contained literal `\n` characters inside Python source.

No application/model defect was involved.

The test formatting was corrected.

Final run:

`37907680791`

Result:

PASS

## 0.51.1 live browser audit

Workflow:

`HealthSolver 0.51.1 Sepsis Audit Live Browser`

Run:

`37907524987`

Result:

PASS

Verified on the public application:

- public version 0.51.1;
- registry 0.51.1;
- 11 models;
- sepsis remediation metadata;
- broad primary-cohort label;
- Sepsis-3 scope warning;
- approximately-9.351-day / 0–499-day semantic disclosure;
- source episode range 1–5;
- 3/3 readiness;
- numeric sepsis output;
- internal AUROC display;
- external n=137 / AUROC / AUPRC / Brier display;
- weak-generalization warning;
- external-dataset versus clinical/prospective-validation distinction;
- male -> UCI source 0 probability match;
- female -> UCI source 1 probability match;
- no serious browser errors.

Markers:

`SEX_MAPPING PASS`

`SEPSIS LIVE PASS`

## Full static / numerical freeze

Workflow:

`HealthSolver 0.51.1 Full Static Release Audit`

First remediation run:

`37907563631`

Result:

PASS

A final run after README and reproduction-workflow pinning:

`37908233131`

Result:

PASS

The final run verifies:

- git/source integrity;
- Python syntax;
- JavaScript syntax;
- JSON/YAML parsing;
- legacy frontend bundling;
- all ten 0.50 model artifacts byte-for-byte preserved;
- all eleven current model artifacts mathematically valid;
- 0.51.1 sepsis runtime metadata;
- primary cohort scope;
- time-horizon semantics;
- external generalization status;
- exact 0.51 -> 0.51.1 numerical freeze;
- safe legacy FastAPI import;
- 0.51.1 packaging invariants.

Markers include:

- `0.50 MODEL ARTIFACT FREEZE PASS`
- `ELEVEN MODEL STATIC INTEGRITY PASS`
- `0.51 SEPSIS NUMERICAL FREEZE PASS`
- `Legacy FastAPI safe import PASS`

## Full application E2E coverage

Immediately before this semantics/reproducibility remediation, the complete 0.51 application passed:

Run:

`37905728164`

Result:

PASS

Markers:

- `11-model integrated prediction PASS`
- `ALL_BROWSER_ERRORS []`
- `FULL ACTIVE-APP E2E PASS`

That test exercised navigation, Clinical Coach, Expert extraction/analysis, all 11 predictions, Hub, Massive Public Data, FHIR import, single-model workflow, browser training, validation/export, archive surface and preserved previous modules.

0.51.1 changes only:

- sepsis model metadata/provenance text;
- registry title/task semantics;
- sepsis/predictive result wording;
- episode-number HTML maximum;
- training/reproduction dependency pinning;
- audit workflows/documentation.

No inference formula, coefficient, calibration, threshold, non-sepsis model or non-predictive application module changed.

A separate duplicate full-app 0.51.1 workflow was not added because the repository connector rejected the oversized workflow patch. The changed browser surface is instead directly qualified by the strengthened 0.51.1 live audit, while the numerical core is protected by the freeze and independent reproduction gates.

## Pages repack

Workflow:

`HealthSolver 0.51.1 Sepsis Audit Remediation Repack`

Run:

`37907395634`

Result:

PASS

## GitHub Pages deployment

Run:

`37907415902`

Result:

PASS

Published gh-pages commit:

`0377851fa4473f6aeb265b974fff78ac1ce9817d`

## Published release smoke

Workflow:

`HealthSolver Published Release Smoke`

Run:

`37907424314`

Attempt 1 failed because it executed before the 0.51.1 Pages deployment completed and correctly observed public 0.51.0.

After deployment, failed jobs were rerun.

Attempt 2:

PASS

Verified:

- live version 0.51.1;
- public registry 0.51.1;
- 11 exact model IDs;
- public registry equals main;
- all public model JSON artifacts equal main;
- public Predictive-First UI equals main;
- loader identifies 0.51.1.

## Public build

Public URL:

https://ricscar2570.github.io/HealthSolver/

Version:

`0.51.1`

Predictive model count:

`11`

Pages commit:

`0377851fa4473f6aeb265b974fff78ac1ce9817d`

Standalone source SHA-256:

`6dd0b2b62e8020151c53f8be6bcb1f77cf47e88b3868a82dfd62fd80ecdad46b`

Payload parts:

`7`

Loader expected hash:

`6dd0b2b62e8020151c53f8be6bcb1f77cf47e88b3868a82dfd62fd80ecdad46b`

Loader hash equals version.json source hash:

PASS

Predictive files synchronized main <-> gh-pages:

`24`

Differences:

`0`

## Research boundary

HS-UCI-SEPSISDEATH-001 remains research-only.

The audit reinforces that its output must not be used as:

- a sepsis diagnosis;
- a Sepsis-3 classifier;
- a validated mortality score;
- literal fixed 9-day mortality;
- literal fixed 9.351-day mortality;
- a survival probability;
- a time-to-event prediction;
- clinical triage guidance;
- ICU admission/discharge guidance;
- treatment guidance;
- a clinically transferable probability.

The independent external evaluation itself shows weak discrimination.

## Gate for database #9

Database #9 must begin from this 0.51.1 audited baseline.

Before integrating database #9:

1. preserve all 11 current numerical model cores;
2. verify source licensing and provenance;
3. define source-cohort scope precisely;
4. distinguish patients, admissions and repeated encounters;
5. use subject-grouped splitting whenever source IDs permit;
6. define target timing before training;
7. distinguish fixed-horizon classification from variable-duration hospital outcome and survival analysis;
8. screen all predictors for post-index leakage;
9. keep external cohorts outside development whenever possible;
10. pin the training environment;
11. independently reproduce the final model before release freeze;
12. test source-domain coding conversions in the browser;
13. integrate exactly one database;
14. run model-specific smoke;
15. run historical regression gates;
16. run full static/numerical freeze;
17. run live browser qualification;
18. repack/deploy Pages;
19. verify public assets byte-for-byte;
20. freeze checkpoint and release branch before database #10.
