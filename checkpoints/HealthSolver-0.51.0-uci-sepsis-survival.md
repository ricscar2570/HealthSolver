# HealthSolver 0.51.0 — UCI Sepsis Survival Integration

Date: 2026-10-09.

## Macrostep rule

This release integrates exactly one new database:

**UCI Sepsis Survival Minimal Clinical Records — UCI ID 827**

This is database macrostep #8 after the frozen HealthSolver 0.50.0 baseline.

No second database is introduced in this macrostep.

## Frozen baseline

Baseline release:

**HealthSolver 0.50.0 — CDC Diabetes Health Indicators Integration**

Frozen commit:

`cd576fe89c9c7a16b793ac99d07b503172dc142a`

Baseline predictive model count:

`10`

The 0.51 full static audit verifies that all ten prior predictive artifacts remain byte-for-byte identical to this frozen baseline.

## Source

Dataset:

**Sepsis Survival Minimal Clinical Records**

UCI ID:

`827`

DOI:

`10.24432/C53C8N`

License:

**CC BY 4.0**

Introductory paper:

Davide Chicco & Giuseppe Jurman, *Survival prediction of patients with sepsis from age, sex, and septic episode number alone*, Scientific Reports 10, 17156 (2020).

Paper DOI:

`10.1038/s41598-020-73558-3`

UCI source:

https://archive.ics.uci.edu/dataset/827/sepsis+survival+minimal+clinical+records

## Source package structure

The UCI downloadable artifact is a nested ZIP.

Outer archive contains:

`s41598-020-73558-3_sepsis_survival_dataset.zip`

The inner archive contains:

1. `s41598-020-73558-3_sepsis_survival_primary_cohort.csv`
2. `s41598-020-73558-3_sepsis_survival_study_cohort.csv`
3. `s41598-020-73558-3_sepsis_survival_validation_cohort.csv`

HealthSolver explicitly unpacks both archive layers and validates file names, schemas and row counts.

## Cohorts

### Norwegian primary cohort

- admissions: **110,204**
- hospitalized subjects: **84,811**
- period: **2011–2012**
- domain: admissions with infections, systemic inflammatory response syndrome, sepsis by causative microbes, or septic shock under pre-Sepsis-3-era definitions

This cohort is used for training, calibration and internal held-out testing.

### Norwegian study cohort

- admissions: **19,051**
- Sepsis-3-compatible subset of the primary cohort

The study cohort is **not appended** to the primary cohort because it is nested inside it.

This prevents duplicate inclusion of the same admissions.

### South Korean external validation cohort

- patients: **137**
- period: **2007–2015**
- 113 survived
- 24 deceased
- independent critically ill validation cohort with compatible age, sex, septic-episode and hospital-outcome fields

This cohort is kept completely outside training, calibration, threshold selection and internal testing.

## Source variables

The source table contains exactly:

1. `age_years`
2. `sex_0male_1female`
3. `episode_number`
4. `hospital_outcome_1alive_0dead`

Predictors:

- `age_years`
- `sex_0male_1female`
- `episode_number`

Target:

`hospital_outcome_1alive_0dead`

Source encoding:

- `1 = alive`
- `0 = dead`

HealthSolver inverts the target only for display/training semantics so that:

`death = 1`

The original source value is not redefined.

## Model

Model ID:

`HS-UCI-SEPSISDEATH-001`

Version:

`1.0.0`

Registry title:

**Esito ospedaliero · decesso · coorte sepsi**

Registry version:

`0.51.0`

Total registered supervised models:

`11`

## Dossier mapping

HealthSolver reuses:

- age from the common dossier;
- sex from the common dossier.

HealthSolver's common sex encoding is:

- female = 0
- male = 1

The UCI sepsis source encoding is:

- male = 0
- female = 1

The Predictive-First mapping explicitly converts:

- HealthSolver male 1 -> UCI male 0
- HealthSolver female 0 -> UCI female 1

The user supplies only:

`episode_number`

with source-domain semantics:

- 1 = first septic episode
- 2 = second
- etc.

## Temporal semantics

The model must **not** be interpreted as “9-day mortality.”

The associated publication reports source hospital length of stay spanning:

- minimum: 0 days
- maximum: 499 days
- mean: about 9.351 days

The source authors excluded length of stay because it is strongly related to survival.

HealthSolver therefore describes the target as:

**hospital-outcome death label**

and records:

- `fixed_horizon = false`
- `survival_probability = false`

The output is not:

- mortality at 9 days;
- mortality at any fixed horizon;
- a survival probability;
- a censoring-aware time-to-event estimate.

## Internal split limitation

The primary cohort has:

- 110,204 admissions
- 84,811 subjects

The minimal released model table does not expose a patient identifier.

Therefore HealthSolver cannot guarantee a subject-grouped train/calibration/test split.

The internal split is admission-level.

Repeated admissions from one patient may theoretically occur in more than one partition.

This limitation is explicitly stored in:

`split_limitation`

and:

`leakage_review`

## Training design

Primary cohort:

- total admissions: **110,204**
- training: **66,122**
- calibration: **22,041**
- internal held-out test: **22,041**
- primary death prevalence: **0.07354542484846285**
- regularized logistic regression
- class weighting
- training-only standardization
- Platt calibration on held-out Norwegian calibration partition
- Youden J threshold selected on calibration partition only

Decision threshold:

`0.06872795821072762`

## Internal held-out test metrics

- AUROC: **0.7039151900164407**
- AUPRC, death-positive: **0.13346066542506296**
- Accuracy: **0.5422621478154349**
- Brier: **0.06584055395345341**
- Sensitivity for death: **0.7822331893892659**
- Specificity for survival: **0.5232125367286974**

Confusion matrix:

- TN survived: **10,684**
- FP death: **9,736**
- FN death: **353**
- TP death: **1,268**

## External South Korean validation

The exact Norwegian-trained model, calibration and threshold are applied without retraining to the independent South Korean cohort.

External cohort:

- n: **137**
- deaths: **24**
- death prevalence: **0.17518248175182483**

External metrics:

- AUROC: **0.5484882005899706**
- AUPRC, death-positive: **0.20949205455985004**
- Accuracy: **0.6642335766423357**
- Brier: **0.15793181873895518**
- Sensitivity for death: **0.4166666666666667**
- Specificity for survival: **0.7168141592920354**

External confusion matrix:

- TN survived: **81**
- FP death: **32**
- FN death: **14**
- TP death: **10**

## External-validation interpretation

External discrimination is weak.

The model artifact records:

`external_validation_status = WEAK_GENERALIZATION`

and explicitly states:

> External South Korean discrimination is weak (AUROC 0.548; death-positive AUPRC 0.209 with death prevalence 0.175).

The model must therefore be treated as:

- a research / methodological demonstration;
- not a clinically generalizable prognostic model.

This weak external AUROC is consistent with the associated paper's observation that models trained on the Norwegian cohorts achieved only modest external ROC AUC values on the South Korean cohort, despite higher PR AUC values when survival was used as the positive majority class.

## Predictive-First UI

HealthSolver 0.51 displays:

**11 MODELLI SUPERVISIONATI**

New specialist section:

`#hs51SepsisDetails`

Visible title:

**Sepsi / infezione · esito ospedaliero**

The panel displays:

- source-model scope;
- septic episode-number input;
- no fixed mortality horizon;
- explicit statement that the output is not 9-day mortality;
- explicit statement that the output is not a survival probability;
- external validation n=137;
- external AUROC 0.548;
- weak-generalization warning.

The result card repeats:

- internal AUROC;
- internal Brier;
- external n;
- external AUROC;
- external AUPRC;
- external Brier;
- weak external discrimination;
- “do not generalize clinically” warning.

## Acquisition / training runs

### First run

Run:

`37904705900`

Result:

FAIL before model generation.

Cause:

The UCI download endpoint returns an outer ZIP containing the actual dataset ZIP.

The initial workflow expected CSV files directly in the outer archive.

No registry/model commit occurred.

### Nested archive remediation

Workflow was corrected to:

1. download outer ZIP;
2. locate inner ZIP;
3. unpack inner ZIP;
4. locate three exact CSV names;
5. validate exact columns and row counts before training.

Successful run:

`37904806067`

Result:

PASS

Verified at runtime:

- primary: 110,204 x 4
- study: 19,051 x 4
- external: 137 x 4
- exact expected columns
- no missing values

The model and registry were committed only after these assertions passed.

### Transitional rerun

After the model had already moved the registry to 0.51.0, a transitional automatic workflow run started from an intermediate workflow revision that still required registry 0.50.0.

Run:

`37905013953`

Result:

FAIL CLOSED

Failure:

`AssertionError: 0.51.0`

No model overwrite or duplicate registry entry occurred.

The training workflow was subsequently frozen as:

`workflow_dispatch`

and made idempotent for either 0.50.0 or already-0.51.0 registry input.

## Historical regression-gate remediation

The sepsis dataset intentionally has only 3 predictors.

Two generic historical gates incorrectly assumed that every predictive model must have at least 5 features.

These were test-definition assumptions, not application defects.

The gates were changed to require at least one valid feature while preserving their mathematical/model-integrity checks.

Corrected historical runs:

### HealthSolver 0.40 Multi-Outcome Smoke

Run:

`37905311685`

Result:

PASS

### HealthSolver 0.48 Static and Model Integrity

Run:

`37905327431`

Result:

PASS

### HealthSolver 0.49 Heart Failure Smoke

Run:

`37905144520`

Result:

PASS

### HealthSolver 0.50 CDC Diabetes Smoke

Run:

`37905162080`

Result:

PASS

## Repack

Workflow:

`HealthSolver 0.51 UCI Sepsis Survival Repack`

Run:

`37905198980`

Result:

PASS

## GitHub Pages deployment

Run:

`37905214554`

Result:

PASS

GitHub Pages commit:

`bef41a7eb738a94a6d78706dc5f33b27c8629d5f`

Published version:

`0.51.0`

Published predictive model count:

`11`

Standalone source SHA-256:

`ac5cd3303fdb5ae2b82b0818664c0ae92a9e62cb52c47d4f61f725859072dc29`

Payload parts:

`7`

## Published Release Smoke

Workflow:

`HealthSolver Published Release Smoke`

Run:

`37905380271`

Result:

PASS

Verified:

- live version = 0.51.0
- registry = 0.51.0
- model count = 11
- exact model IDs
- public registry equals main
- all public model artifacts equal main
- public Predictive-First UI equals main
- loader identifies HealthSolver 0.51.0

## Model-specific smoke

Workflow:

`HealthSolver 0.51 UCI Sepsis Survival Smoke`

Run:

`37905421770`

Result:

PASS

Verified:

- UCI ID 827
- DOI and CC BY 4.0
- primary/study/external cohort metadata
- exactly three predictors
- target inversion semantics
- no fixed horizon
- no survival-probability interpretation
- admission-level split limitation
- weak-generalization flag
- internal metrics
- external metrics
- finite browser-compatible inference
- registry synchronization
- 11-model UI markers

## Live browser audit

### Initial run

Run:

`37905462669`

Result:

FAIL — test-definition issue only.

Cause:

The UI correctly displayed:

`Non è mortalità a 9 giorni`

but the test used a case-sensitive search for:

`non è mortalità a 9 giorni`

No application defect was identified.

### Corrected run

Run:

`37905700071`

Result:

PASS

Verified live:

- version 0.51.0
- 11 models
- public sepsis model
- primary cohort metadata
- external cohort metadata
- WEAK_GENERALIZATION flag
- time-semantics flags
- 11-model badge
- sepsis coverage card
- specialist panel
- fixed-horizon warning
- external-validation warning
- external AUROC disclosure
- complete 3/3 readiness
- numeric result
- no unexpected abstention
- internal AUROC 0.704 rendered
- external n=137 rendered
- external AUROC 0.548 rendered
- external AUPRC 0.209 rendered
- external Brier 0.158 rendered
- “do not generalize clinically” warning rendered

Final marker:

`SEPSIS LIVE PASS`

## Full Static Release Audit

Initial final-release run:

`37905515334`

Result:

PASS

After the training workflow was frozen/manualized, the full static audit was rerun against final main:

`37905982998`

Result:

PASS

Verified:

- repository integrity
- Python/JavaScript/JSON/YAML parse
- legacy frontend JSX bundling
- all ten 0.50 predictive model artifacts byte-for-byte frozen
- all eleven current models structurally and mathematically valid
- sepsis UCI metadata
- internal metrics
- external validation metrics
- weak-generalization status
- split limitation
- safe legacy FastAPI import
- 0.51 packaging invariants

Important markers:

`0.50 MODEL ARTIFACT FREEZE PASS`

`ELEVEN MODEL STATIC INTEGRITY PASS`

`Legacy FastAPI safe import PASS`

## Full Browser E2E

### Initial run

Run:

`37905588522`

Result:

FAIL — same case-sensitive semantic assertion issue as the initial live audit.

No application defect was identified.

### Corrected final run

Run:

`37905728164`

Result:

PASS

Verified on the live application:

- navigation
- Clinical Coach
- Expert extraction/analysis
- CDC target semantics retained
- sepsis target/time semantics
- all 11 predictive models in one dossier
- all 11 complete model cards produce numeric predictions
- sepsis external-validation result disclosure
- Multi-Model Hub
- Massive Public Data / BRFSS
- local FHIR import
- single-model workflow
- data/schema export
- client-side training
- validation metrics/export
- archive surface
- previous-module preservation
- final browser error check

Final markers:

`11-model integrated prediction PASS`

`ALL_BROWSER_ERRORS []`

`FULL ACTIVE-APP E2E PASS`

The encrypted backup/restore path remains covered by the frozen 0.49.1 full E2E and is not modified by the 0.51 predictive overlay.

## Public synchronization

Public URL:

https://ricscar2570.github.io/HealthSolver/

Published version:

`0.51.0`

Published model count:

`11`

Published source SHA-256:

`ac5cd3303fdb5ae2b82b0818664c0ae92a9e62cb52c47d4f61f725859072dc29`

GitHub Pages commit:

`bef41a7eb738a94a6d78706dc5f33b27c8629d5f`

Predictive files compared main <-> gh-pages:

`24`

Differences:

`0`

Loader expected hash equals version.json source hash:

PASS

## Research boundary

HS-UCI-SEPSISDEATH-001 must not be interpreted as:

- a sepsis diagnosis;
- a validated mortality score;
- mortality at 9 days;
- mortality at any fixed horizon;
- a survival probability;
- time-to-event prognosis;
- clinical triage guidance;
- ICU admission/discharge guidance;
- treatment guidance;
- a probability transferable to another hospital/population.

The independent external cohort specifically shows weak discrimination.

This limitation is a feature of the evidence, not something to hide.

## Gate for database #9

Database #9 may begin only from the frozen 0.51 baseline.

Before the next macrostep:

1. preserve all 11 predictive model artifacts;
2. verify source licensing;
3. define target semantics before training;
4. identify leakage/post-index variables before training;
5. distinguish admission-level, patient-level and longitudinal records;
6. use subject-grouped splits whenever patient IDs permit;
7. retain an external cohort outside model development whenever available;
8. integrate exactly one database;
9. integrate the model into the same Predictive-First dossier;
10. run model-specific smoke;
11. run historical regression gates;
12. run full static integrity;
13. run live browser audit;
14. run full browser E2E;
15. repack and deploy Pages;
16. verify public assets against main;
17. freeze a new checkpoint/release branch before proceeding.
