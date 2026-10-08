# HealthSolver 0.48.0 — UCI Differentiated Thyroid Cancer Recurrence Integration

Date: 2026-10-08.

## Macrostep rule

This release integrates exactly one new immediately usable public database:

**UCI Differentiated Thyroid Cancer Recurrence — UCI ID 915**

No other database is included in this macrostep.

## Baseline audit

Development started only after HealthSolver 0.47.1 Full Audit Remediation was frozen.

Baseline:
- main = release/v0.47.1-full-audit-remediation
- public application = 0.47.1
- predictive registry = 0.47.0
- predictive model count = 7
- full static audit = PASS
- full browser E2E = PASS
- preserved visit E2E = PASS
- preserved laboratory E2E = PASS
- published release smoke = PASS

## Source database

- Name: UCI Differentiated Thyroid Cancer Recurrence
- UCI ID: 915
- DOI: 10.24432/C5632J
- License: CC BY 4.0
- Instances: 383 individual patients
- Missing values: none declared by UCI
- Source:
  https://archive.ics.uci.edu/dataset/915/differentiated+thyroid+cancer+recurrence

UCI documents that:
- the dataset contains clinicopathologic features for recurrence prediction;
- it was collected over 15 years;
- each patient was followed for at least 10 years.

## Leakage control

The source feature:

`Response`

was deliberately excluded from the predictive input set.

Reason:
`Response` is a post-treatment field and could create obvious temporal/target leakage for a recurrence model.

The target remains:
`Recurred`

No target-derived field is manually reintroduced into browser inference.

## New predictive model

Model ID:

`HS-UCI-THYREC-001`

Task:

Binary research prediction of differentiated-thyroid-cancer recurrence versus no recurrence within the UCI 915 cohort, excluding the post-treatment Response field.

Research only:
true

Clinically validated:
false

## Raw model inputs

Raw predictor fields after excluding Response:

15

The model uses:

- Age
- Gender
- Smoking
- Hx Smoking
- Hx Radiothreapy
- Thyroid Function
- Physical Examination
- Adenopathy
- Pathology
- Focality
- Risk
- T
- N
- M
- Stage

Age and sex are reused from the existing HealthSolver dossier.

All other source categories are entered through the thyroid specialist panel.

## Encoding

Categorical predictors are encoded deterministically with source-category one-hot columns.

Encoded model feature count:

51

The model artifact stores:
- raw feature schema;
- source categories;
- deterministic encoding map;
- encoded feature order;
- training medians;
- standardization parameters;
- logistic coefficients;
- Platt calibration parameters;
- threshold;
- source provenance and limits.

## Training design

- total: 383
- training: 229
- calibration: 77
- held-out test: 77
- positive recurrence prevalence: 0.2819843342
- class-balanced regularized logistic regression
- training-derived standardization
- held-out Platt probability calibration
- decision threshold selected only on calibration data using Youden J
- independent held-out test used once for final internal metrics

## Held-out test metrics

- AUROC: 0.9056122449
- AUPRC: 0.8342042546
- Accuracy: 0.8441558442
- Brier score: 0.1024647414
- Sensitivity: 0.9047619048
- Specificity: 0.8214285714
- Decision threshold: 0.2084570683
- TN: 46
- FP: 10
- FN: 2
- TP: 19

These are internal held-out results from the same UCI source cohort.

They are not external or prospective clinical validation.

## Registry

Predictive registry version:

`0.48.0`

Registered model count:

`8`

Registered models:

1. HS-UCI-HD-001
2. HS-UCI-CKD-001
3. HS-UCI-BC-001
4. HS-UCI-HCV-001
5. HS-NHANES-DM-001
6. HS-NHIS-HYP-001
7. HS-UCI-DMREADM-001
8. HS-UCI-THYREC-001

## Predictive-First UI integration

HealthSolver 0.48 keeps prediction integrated inside Expert Mode.

The main predictive header now reports:

**8 MODELLI SUPERVISIONATI**

New specialist section:

`#hs48ThyroidDetails`

The section is titled:

**Carcinoma tiroideo differenziato · recidiva**

Behavior:
- age reused from dossier;
- sex reused from dossier;
- remaining source clinicopathologic fields rendered as categorical controls;
- exact source categories are preserved as encoded values;
- `Response` is not rendered;
- all raw thyroid inputs must be supplied before the model is considered ready;
- result is rendered through the common predictive result-card system;
- probability is not normalized against the other seven outcomes.

## Qualification

### Training pipeline

Workflow:
`HealthSolver 0.48 UCI Thyroid Cancer Recurrence`

Run:
`37844646680`

Result:
PASS

### Thyroid-specific smoke

Workflow:
`HealthSolver 0.48 UCI Thyroid Recurrence Smoke`

Run:
`37845009221`

Result:
PASS

Verified:
- registry 0.48.0;
- model count 8;
- source UCI ID / DOI / CC BY 4.0;
- 383 records;
- Response exclusion;
- 15 raw predictor fields;
- 51 encoded features;
- deterministic encoding map;
- model metrics;
- deterministic browser-compatible inference;
- UI eighth-model references.

### Predictive static/model integrity

Workflow:
`HealthSolver 0.48 Static and Model Integrity`

Run:
`37845066489`

Result:
PASS

### Historical model regression gates

After registry expansion:
- base multi-outcome smoke: PASS
- UCI HCV smoke: PASS
- NHANES smoke: PASS
- NHIS smoke: PASS
- UCI diabetes readmission smoke: PASS

No previous predictive model was retrained or modified.

### Repack

Workflow:
`HealthSolver 0.48 UCI Thyroid Recurrence Repack`

Run:
`37845107458`

Result:
PASS

### GitHub Pages deployment

Run:
`37845128006`

Result:
PASS

### Published release smoke

Workflow:
`HealthSolver Published Release Smoke`

Run:
`37845239585`

Result:
PASS

Verified:
- public release version 0.48.0;
- public registry version 0.48.0;
- eight public predictive models;
- public registry equals main registry;
- all public model JSON artifacts equal main artifacts;
- integrated predictive UI public asset equals main asset.

### Thyroid live browser audit

Workflow:
`HealthSolver 0.48 Thyroid Recurrence Live Browser Audit`

Run:
`37845289867`

Result:
PASS

Verified:
- 0.48.0 metadata;
- 8-model badge;
- thyroid coverage card;
- thyroid specialist panel;
- Response absent;
- complete raw source inputs accepted;
- model reaches PRONTO ALLA PREDIZIONE;
- HS-UCI-THYREC-001 result card rendered;
- numeric probability rendered;
- no unexpected abstention;
- AUROC 0.906 shown in result card;
- live screenshots captured.

### Full browser regression audit

Workflow:
`HealthSolver 0.48 Full Browser E2E Audit`

Run:
`37845395407`

Result:
PASS

This re-exercised the complete active browser application, including all eight predictive models in one dossier and the existing non-predictive workflows.

### Full static release audit

Workflow:
`HealthSolver 0.48 Full Static Release Audit`

Run:
`37845516778`

Result:
PASS

Verified:
- git/repository integrity;
- no tracked .env;
- Python syntax;
- JavaScript syntax;
- JSON/YAML parsing;
- frontend JSX bundling;
- all eight predictive artifacts;
- mathematical inference integrity;
- thyroid raw schema and encoding map;
- safe legacy FastAPI import;
- Pages packaging invariants;
- trusted iframe sandbox remediations remain present.

## Published release

Public URL:

https://ricscar2570.github.io/HealthSolver/

Published application version:

`0.48.0`

Published predictive registry version:

`0.48.0`

Published model count:

`8`

GitHub Pages commit:

`1aec8f1ce5649ad84d37da82be3d4302277ae6a9`

Published standalone source SHA-256:

`f7488492ffefcaa5d812330683ff0b4c169cb77fdacd9431e92d47aebdd33483`

Payload parts:

7

## Research boundary

HS-UCI-THYREC-001 is not a validated clinical recurrence score.

It must not be interpreted as:
- an autonomous cancer prognosis;
- a treatment-selection tool;
- an indication for radioactive iodine, surgery or surveillance;
- a substitute for pathology, staging, molecular testing, imaging or specialist assessment;
- an externally or prospectively validated individual probability.

The model estimates a source-dataset-defined recurrence outcome within the UCI 915 cohort.

## Gate for database #6

Before the next database macrostep:
1. use this 0.48 release as the frozen baseline;
2. audit the baseline before new development;
3. integrate exactly one new immediately usable database;
4. train/calibrate its model without altering previous model artifacts;
5. integrate it into the same Predictive-First dossier;
6. run specific smoke, static audit, full browser regression and live browser audit;
7. publish GitHub Pages;
8. verify the live public release;
9. update README/checkpoint/release branch before moving on.
