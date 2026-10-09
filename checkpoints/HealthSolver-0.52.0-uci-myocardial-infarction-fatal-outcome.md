# HealthSolver 0.52.0 — UCI Myocardial Infarction Fatal Outcome Integration

Date: 2026-10-09.

## Macrostep

This release integrates exactly one new database:

**UCI Myocardial Infarction Complications — UCI ID 579**

Database macrostep: **#9**

Frozen input baseline:

**HealthSolver 0.51.1 — Sepsis Audit & Scientific Semantics Remediation**

Baseline commit:

`21719ddc73cb5b297dfc548c89c219dfcc8296b5`

Baseline model count:

`11`

0.52 model count:

`12`

No second database is introduced in this macrostep.

## Source

Dataset:

**Myocardial infarction complications**

UCI ID:

`579`

DOI:

`10.24432/C53P5M`

License:

**CC BY 4.0**

Instances:

`1700`

Input features:

`111`

Outcome variables:

`12`

Collection site:

Krasnoyarsk Interdistrict Clinical Hospital, Russia

Collection period:

1992–1995

UCI source:

https://archive.ics.uci.edu/dataset/579/myocardial+infarction+complications

## Profiling gate

Workflow:

`HealthSolver 0.52 MI Admission Profile`

Run:

`37908824149`

Result:

PASS

Verified directly from UCI:

- X shape: 1700 x 111
- target shape: 1700 x 12
- source file dimensions: 1700 x 124 including ID, predictors and outcomes
- admission-time input domain
- nine dynamic post-admission input columns excluded:
  - 93
  - 94
  - 95
  - 100
  - 101
  - 102
  - 103
  - 104
  - 105
- 102 source inputs remain admissible at hospital admission under UCI timing guidance
- 95 admission-time features have <=25% missingness and at least two observed values
- exact LET_IS distribution:
  - 0: 1429
  - 1: 110
  - 2: 18
  - 3: 54
  - 4: 23
  - 5: 12
  - 6: 27
  - 7: 27

## Target

Source outcome:

`LET_IS`

UCI coding:

- 0 = unknown (alive)
- 1 = cardiogenic shock
- 2 = pulmonary edema
- 3 = myocardial rupture
- 4 = progression of congestive heart failure
- 5 = thromboembolism
- 6 = asystole
- 7 = ventricular fibrillation

HealthSolver binary mapping:

`fatal outcome = LET_IS != 0`

Counts:

- nonfatal/source 0: 1429
- fatal/source 1–7: 271
- fatal prevalence: 0.15941176470588236

The output is a source-label research classifier for hospitalized MI records.

It is not:

- a general-population mortality probability;
- a clinically validated mortality score;
- a treatment recommendation;
- a triage authorization;
- a clinical intervention cutoff.

## Admission-time feature policy

The browser model uses a compact 21-feature admission-time subset:

1. AGE — source column 2
2. SEX — 3
3. INF_ANAM — 4
4. STENOK_AN — 5
5. FK_STENOK — 6
6. IBS_POST — 7
7. GB — 9
8. SIM_GIPERT — 10
9. ZSN_A — 12
10. S_AD_ORIT — 37
11. D_AD_ORIT — 38
12. O_L_POST — 39
13. K_SH_POST — 40
14. MP_TP_POST — 41
15. FIB_G_POST — 44
16. IM_PG_P — 49
17. K_BLOOD — 84
18. NA_BLOOD — 86
19. L_BLOOD — 90
20. ROE — 91
21. TIME_B_S — 92

No source outcome column 113–124 is used as a predictor.

The UCI dynamic day-1/day-2/day-3 input columns 93,94,95,100,101,102,103,104,105 are excluded.

Medication/treatment variables are also excluded from the compact browser model.

## Feature-selection limitation

The exploratory profiling workflow computed descriptive univariate associations with LET_IS on the full dataset before the 21-feature shortlist was frozen.

Therefore the final feature shortlist is **not fully outcome-blind**.

No iterative feature changes were made after inspecting the held-out test performance.

The held-out test is independent of:

- model fitting;
- standardization fitting;
- imputation fitting;
- probability calibration;
- threshold selection.

However, it is **not fully independent of feature-screening knowledge**.

Consequently the internal held-out metrics may be optimistic and are explicitly treated as exploratory until external validation is available.

This limitation is stored in the model artifact, documented in README and displayed in the live UI.

## Baseline-severity / target-proximity limitation

The admission-time feature set intentionally retains:

- pulmonary edema at ICU admission;
- cardiogenic shock at ICU admission;
- paroxysmal AF at admission/pre-hospital stage;
- ventricular fibrillation at admission/pre-hospital stage.

UCI defines these as available at admission or pre-hospital.

They are therefore temporally admissible baseline predictors.

However, shock, edema and ventricular fibrillation are conceptually close to several eventual LET_IS lethal-cause labels.

The model must therefore not be interpreted as an etiologic or independent causal-risk model.

## New model

Model ID:

`HS-UCI-MIFATAL-001`

Registry title:

**Esito letale acuto post-IMA · admission**

Model version:

`1.0.0`

Registry version:

`0.52.0`

Model file:

`predictive/model-mi-fatal-outcome-v1.json`

Report:

`predictive/model-mi-fatal-outcome-v1-report.json`

## Reproducible environment

- Python 3.13
- NumPy 2.5.3
- pandas 3.0.6
- scikit-learn 1.9.1

The training workflow is frozen as:

`workflow_dispatch`

and is idempotent for either a 0.51.1 baseline registry or an already-0.52.0 registry.

## Training design

- total: 1700
- training: 1020
- calibration: 340
- held-out test: 340
- fatal prevalence: 0.15941176470588236
- training-only median imputation
- training-only standardization
- class-balanced regularized logistic regression
- Platt calibration on the held-out calibration set
- decision threshold selected on calibration only using Youden J
- test evaluated after model/calibration/threshold definition

## Held-out test metrics

- AUROC: 0.8258223258223258
- AUPRC: 0.5819335960079924
- Brier: 0.0980345363742157
- Accuracy at calibration-selected threshold: 0.5588235294117647
- Sensitivity for fatal outcome: 0.9074074074074074
- Specificity for nonfatal outcome: 0.493006993006993
- Threshold: 0.09213198859855104

Confusion matrix:

- TN nonfatal: 141
- FP fatal: 145
- FN fatal: 5
- TP fatal: 49

The low threshold and high sensitivity are an internal research operating point.

The threshold is not a clinical triage cutoff.

## Independent reproduction

Workflow:

`HealthSolver 0.52 MI Independent Reproduction Audit`

Final run:

`37910789418`

Result:

PASS

The audit re-downloads UCI 579 and independently reproduces:

- source shape 1700 x 124;
- LET_IS class counts;
- exact 21-feature source-column mapping;
- deterministic 1020/340/340 split;
- training missingness;
- training medians;
- standardization;
- logistic coefficients;
- Platt calibration;
- threshold;
- held-out metrics;
- confusion matrix.

Markers:

- `SOURCE_SHAPE PASS`
- `LET_IS_COUNTS PASS`
- `ADMISSION_FEATURE_POLICY PASS`
- `MODEL_COEFFICIENTS PASS`
- `IMPUTATION_STANDARDIZATION PASS`
- `CALIBRATION PASS`
- `THRESHOLD PASS`
- `METRICS PASS`
- `MI INDEPENDENT REPRODUCTION PASS`

## Training run

Workflow:

`HealthSolver 0.52 UCI MI Fatal Outcome`

Run:

`37909162115`

Result:

PASS

The successful workflow generated the model, report and registry 0.52.0.

The workflow was subsequently changed from automatic push execution to manual `workflow_dispatch`.

## Model smoke

Workflow:

`HealthSolver 0.52 UCI MI Fatal Outcome Smoke`

Initial run:

`37909640886`

Result:

FAIL — test-definition issue only.

Cause:

a case-sensitive assertion searched for lower-case “dynamic source columns” while the artifact text began with “Dynamic source columns”.

No model/application defect was involved.

Corrected run:

`37909894679`

Result:

PASS

After the final feature-selection provenance correction, a transient run occurred while files were being updated; the final relevant smoke remained green and the release was independently qualified by final static/reproduction/live/E2E gates.

## Predictive-First UI

HealthSolver 0.52 displays:

**12 MODELLI SUPERVISIONATI**

New panel:

`#hs52MiFatalDetails`

Visible label:

**Infarto miocardico acuto · esito letale sorgente**

Shared dossier values reused only where source coding/units are compatible:

- age
- sex
- systolic pressure
- diastolic pressure
- potassium
- sodium

The remaining MI fields are entered in the dedicated admission-time panel.

The panel explicitly displays:

- 21 admission-time feature scope;
- exclusion of nine dynamic later-hospital variables;
- exclusion of medication/treatment variables;
- LET_IS source-label semantics;
- baseline severity / target-proximity warning;
- feature-screening reuse limitation;
- nonclinical research boundary.

The result card states:

- LET_IS source label, not a clinical score;
- internal metrics are exploratory;
- threshold is not a triage cutoff.

## Historical regression gates

Registry/UI expansion initially caused old 0.49 and 0.50 smoke jobs to fail because their marker regexes did not yet accept the 0.52 UI marker.

They were made forward-compatible without weakening their model-specific assertions.

Corrected runs include:

- 0.49 Heart Failure Smoke: `37909435187` — PASS
- 0.50 CDC Diabetes Smoke: `37909441566` — PASS
- 0.51.1 Sepsis Smoke: `37909533338` — PASS

Additional historical gates, including 0.40 Multi-Outcome, 0.44 HCV, 0.45 NHANES, 0.46 NHIS, 0.47 readmission, 0.48 thyroid and 0.48 static/model integrity, remained or returned green after expansion.

## Full static audit

Workflow:

`HealthSolver 0.52 Full Static Release Audit`

Final run:

`37910781187`

Result:

PASS

Verified:

- git/source integrity;
- Python, JavaScript, JSON and YAML syntax;
- legacy frontend bundling;
- all eleven 0.51.1 predictive model artifacts byte-for-byte unchanged;
- all twelve current model artifacts mathematically valid;
- MI UCI provenance;
- 21-feature admission-time policy;
- excluded dynamic columns;
- pinned runtime;
- LET_IS target;
- MI metrics;
- safe legacy FastAPI import;
- 0.52 packaging markers;
- training workflow manual/idempotent/pinned.

Markers:

- `0.51.1 MODEL ARTIFACT FREEZE PASS`
- `TWELVE MODEL STATIC INTEGRITY PASS`
- `Legacy FastAPI safe import PASS`

## Live browser audit

Workflow:

`HealthSolver 0.52 MI Live Browser Audit`

Initial run:

`37910097846`

Result:

FAIL — test typography issue only.

Cause:

the test searched for a typographic apostrophe while the live UI used a straight apostrophe in the admission disclosure.

No application defect was identified.

A corrected live audit passed before the final provenance caveat.

Final live run after final provenance/repack:

`37910866497`

Result:

PASS

Verified live:

- version 0.52.0;
- 12 models;
- UCI 579 provenance;
- 21-feature model;
- dynamic-column exclusion metadata;
- 12-model badge;
- MI coverage card;
- MI specialist panel;
- admission-time disclosure;
- LET_IS semantics;
- nonclinical-score warning;
- dynamic-variable exclusion;
- causal/proxy warning;
- feature-screening reuse warning;
- 21/21 readiness;
- numeric result without abstention;
- AUROC 0.826 / Brier 0.098 display;
- threshold-not-triage warning;
- exploratory-metrics warning;
- no serious browser errors.

Marker:

`MI LIVE PASS`

## Full browser E2E

Workflow:

`HealthSolver 0.52 Full Browser E2E Audit`

Final run:

`37910874590`

Result:

PASS

Verified:

- navigation across active pages;
- Clinical Coach;
- Expert extraction and analysis;
- 12 predictive coverage cards;
- 12 predictive result cards;
- complete MI 21/21 readiness;
- numeric MI prediction;
- MI semantic/threshold/feature-selection warnings;
- Multi-Model Hub;
- Massive Public Data / BRFSS;
- local FHIR import;
- single-model workflow;
- dataset/schema export;
- client-side training;
- validation/export;
- archive surface;
- preserved previous-module marker;
- browser error collection.

Markers:

- `12-model registry/result surface PASS`
- `ALL_BROWSER_ERRORS []`
- `FULL ACTIVE-APP E2E PASS`

The earlier frozen 0.51 full E2E remains the stronger all-11-model complete-dossier test for the preceding models. 0.52 static freeze proves those eleven numerical model artifacts are unchanged.

## Repack and deployment

Final repack:

`HealthSolver 0.52 UCI MI Fatal Outcome Repack`

Run:

`37910751544`

Result:

PASS

Final GitHub Pages deployment:

`37910770938`

Result:

PASS

GitHub Pages commit:

`2a2648fc7181da724088987d7ad90378a54f087b`

## Published release smoke

Workflow:

`HealthSolver Published Release Smoke`

The first attempt after the provenance-only predictive update ran before the final repack had propagated and correctly detected a public/main mismatch.

The failed jobs were rerun after Pages deployment.

Run:

`37910644885`

Attempt:

`2`

Result:

PASS

Verified:

- public version 0.52.0;
- public registry 0.52.0;
- exact 12 model IDs;
- public registry equals main;
- public predictive model files equal main;
- public integrated Predictive-First UI equals main;
- loader identifies 0.52.0.

## Public build

Public URL:

https://ricscar2570.github.io/HealthSolver/

Version:

`0.52.0`

Predictive model count:

`12`

Published source SHA-256:

`55df7ac97c85ef26055153303262d698fe493ce2839f3b85974a8c8aeb9501e3`

Payload parts:

`7`

GitHub Pages commit:

`2a2648fc7181da724088987d7ad90378a54f087b`

Loader expected hash equals version.json source hash:

PASS

Predictive files main <-> gh-pages:

`26`

Differences:

`0`

## Research boundary

HS-UCI-MIFATAL-001 remains research-only.

The output must not be interpreted as:

- a diagnosis of myocardial infarction;
- a validated mortality score;
- a general-population mortality probability;
- a causal estimate;
- a medication/treatment recommendation;
- a triage cutoff;
- ICU admission/discharge guidance;
- prospective clinical validation;
- external clinical validation.

The internal held-out metrics are additionally limited by the fact that exploratory full-dataset profiling included univariate target associations before the final 21-feature shortlist was frozen.

## Gate for database #10

Database #10 may begin only from this frozen 0.52.0 baseline.

Before the next macrostep:

1. preserve all twelve current model numerical artifacts;
2. verify source license/provenance;
3. define target semantics before model development;
4. split subjects/encounters before any outcome-informed feature screening when possible;
5. perform feature selection only inside the development partition;
6. reserve a truly untouched test or external cohort;
7. pin the runtime environment before training;
8. exclude post-index leakage variables;
9. document baseline predictors that are close proxies to outcome components;
10. independently reproduce the model from source;
11. integrate exactly one database;
12. qualify model-specific smoke;
13. run historical regression gates;
14. run full static/model freeze;
15. run live browser audit;
16. run full browser E2E;
17. repack/deploy Pages;
18. compare public predictive assets against main;
19. freeze checkpoint and release branch before proceeding further.
