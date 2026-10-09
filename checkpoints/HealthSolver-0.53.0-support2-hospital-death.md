# HealthSolver 0.53.0 — SUPPORT2 Hospital Death Integration

Date: 2026-10-09.

## Macrostep

This release integrates exactly one new database:

**SUPPORT2**

Database macrostep: **#10**

Frozen input baseline:

**HealthSolver 0.52.0 — UCI Myocardial Infarction Fatal Outcome Integration**

Baseline commit:

`8a2815f80edf7f34d728da6efdfbf66d7dc59a9f`

Baseline model count:

`12`

0.53 model count:

`13`

No second database is introduced in this macrostep.

## Source

Dataset:

**SUPPORT2**

Primary download source:

https://hbiostat.org/data/

Download artifact:

`support2csv.zip`

UCI external record:

https://archive.ics.uci.edu/dataset/880/support2

Instances:

`9105`

Columns in distributed SUPPORT2 CSV:

`47`

Study centers:

`5`

Country:

United States

Study periods:

- 1989–1991
- 1992–1994

Original SUPPORT paper:

SUPPORT Principal Investigators. JAMA. 1995;274(20):1591–1598.

Associated SUPPORT prognostic-model paper:

Knaus WA, Harrell FE Jr, Lynn J, et al. Ann Intern Med. 1995;122:191–203.

## Permission / attribution

The Vanderbilt University Department of Biostatistics dataset page explicitly states that permission is granted to anyone wishing to use the datasets provided there.

It asks users to:

1. reference the original paper;
2. acknowledge that the data were obtained from hbiostat.org courtesy of the Vanderbilt University Department of Biostatistics.

HealthSolver records this permission/provenance directly in the model artifact.

The UCI page is treated as an external record, not as the primary licensing source.

## Source cohort

SUPPORT enrolled seriously ill hospitalized adults with life-threatening disease across five U.S. academic medical centers.

The SUPPORT2 diagnosis groups distributed in the source include:

- ARF/MOSF with sepsis;
- COPD;
- CHF;
- cirrhosis;
- coma;
- colon cancer;
- lung cancer;
- MOSF with malignancy.

## Target

Source field:

`hospdead`

Target semantics:

- 0 = survived hospitalization
- 1 = death in hospital

Source counts independently verified:

- hospdead=0: **6745**
- hospdead=1: **2360**

Hospital-death prevalence:

`0.2591982427237781`

The model target is a source in-hospital outcome.

It is not:

- 30-day mortality;
- 90-day mortality;
- 180-day mortality;
- a time-to-event model;
- a survival probability;
- a general-population mortality probability;
- a clinically validated mortality score.

## Time index

The SUPPORT prognostic literature specifies that key physiologic measures were recorded on **study day 3**.

The model is therefore explicitly framed as:

**day-3/baseline hospital-outcome classifier**

and not as an admission-time model.

Field `hday` is the day in hospital at which the patient entered the SUPPORT study.

The released `hospdead` field does not provide one fixed mortality horizon.

## Split-first protocol

The 0.53 development split is created before any data-driven feature screening:

- train: **5463**
- calibration: **1821**
- test: **1821**

Random seeds:

- first split: 5301
- calibration/test split: 5302
- logistic model: 5303
- Platt calibration: 5304

The target is stratified at both split stages.

The held-out test is not used for:

- feature selection;
- missingness selection;
- imputation;
- standardization;
- model fitting;
- calibration;
- threshold selection.

## Profiling workflow

Workflow:

`HealthSolver 0.53 SUPPORT2 Profile`

Run:

`37925825130`

Result:

PASS

Verified:

- ZIP download from hbiostat.org;
- inner file `support2.csv`;
- shape 9105 x 47;
- hospdead distribution 6745 / 2360;
- split 5463 / 1821 / 1821;
- candidate source fields after semantic exclusions;
- training-partition-only missingness profile.

No target association is computed or used to choose the 0.53 feature set.

## Excluded variables

HealthSolver deliberately excludes source fields that would cause outcome/post-index leakage, model-on-model prediction, poor portability or unnecessary sensitive-data dependence.

Excluded outcome/follow-up:

- id
- death
- slos
- d.time
- sfdm2

Excluded future resource/cost fields:

- charges
- totcst
- totmcst
- avtisst

Excluded previous prognostic systems / model outputs:

- sps
- aps
- surv2m
- surv6m

Excluded physician prognosis:

- prg2m
- prg6m

Excluded end-of-life decision variables:

- dnr
- dnrday

Excluded for portability/fairness:

- race
- income
- edu

Also excluded from the compact browser model:

- dzclass
- pafi
- alb
- bili
- ph
- glucose
- bun
- urine
- adlp
- adls
- adlsc

The source documentation specifically warns that models intended to be independent of prior prognostic findings should not use `aps`, `sps`, `surv2m` or `surv6m`, and generally should avoid physician prognosis and DNR variables.

## Raw feature set

The model uses 16 raw clinical fields:

1. age
2. sex
3. dzgroup
4. num.co
5. scoma
6. hday
7. diabetes
8. dementia
9. ca
10. meanbp
11. wblc
12. hrt
13. resp
14. temp
15. crea
16. sod

Encoded model features:

`25`

Categorical encodings:

- sex -> male indicator
- dzgroup -> eight deterministic indicators
- ca -> no / yes / metastatic indicators

No feature is chosen using target association.

## Missingness

Numeric missingness policy is learned from training only.

All numeric raw fields retained in the compact model have training missingness below 5%.

Training-only median imputation is used for numeric fields.

No calibration/test information is used to compute medians.

## New model

Model ID:

`HS-SUPPORT2-HOSPDEATH-001`

Registry title:

**SUPPORT2 · decesso intraospedaliero · day 3**

Model version:

`1.0.0`

Registry version:

`0.53.0`

Model file:

`predictive/model-support2-hospital-death-v1.json`

Report:

`predictive/model-support2-hospital-death-v1-report.json`

## Runtime

Pinned environment:

- Python 3.13
- NumPy 2.5.3
- pandas 3.0.6
- scikit-learn 1.9.1

Training workflow:

`workflow_dispatch`

The training workflow is idempotent for:

- registry 0.52.0;
- already-created registry 0.53.0.

## Training design

- class-balanced regularized logistic regression;
- C = 0.5;
- lbfgs solver;
- training-only numeric median imputation;
- deterministic categorical encoding;
- training-only standardization;
- Platt calibration on calibration split;
- Youden J threshold selected only on calibration split;
- held-out test evaluated after fitting/calibration/threshold definition.

## Held-out metrics

- total: **9105**
- train: **5463**
- calibration: **1821**
- test: **1821**
- hospital-death prevalence: **0.2591982427237781**
- AUROC: **0.8192116570969079**
- AUPRC: **0.622152590711349**
- Brier: **0.14216750344970988**
- accuracy: **0.7380560131795717**
- sensitivity hospital death: **0.7690677966101694**
- specificity hospital survival: **0.7272053372868792**
- threshold: **0.24330849889113282**

Confusion matrix:

- TN survived: **981**
- FP death: **368**
- FN death: **109**
- TP death: **363**

These are internal historical SUPPORT measurements.

They are not contemporary external clinical validation.

## Independent reproduction

Workflow:

`HealthSolver 0.53 SUPPORT2 Independent Reproduction`

Run:

`37926270084`

Result:

PASS

The workflow re-downloads SUPPORT2 from hbiostat.org and independently reproduces:

- source shape;
- hospdead counts;
- deterministic split;
- raw/encoded feature mapping;
- training medians;
- standardization;
- logistic coefficients;
- Platt calibration;
- threshold;
- metrics;
- confusion matrix.

Markers:

- `SUPPORT2 SOURCE PASS`
- `SPLIT-FIRST PASS`
- `MODEL_COEFFICIENTS PASS`
- `IMPUTATION_STANDARDIZATION PASS`
- `CALIBRATION PASS`
- `THRESHOLD PASS`
- `METRICS PASS`
- `SUPPORT2 INDEPENDENT REPRODUCTION PASS`

## Training run

Workflow:

`HealthSolver 0.53 SUPPORT2 Hospital Death`

Run:

`37926075368`

Result:

PASS

The workflow generated model, report and registry 0.53.0.

The workflow was subsequently converted to manual/idempotent execution.

## Model-specific smoke

Workflow:

`HealthSolver 0.53 SUPPORT2 Smoke`

Run:

`37926630263`

Result:

PASS

Verified:

- 13-model registry;
- SUPPORT2 provenance;
- permission metadata;
- 16 raw / 25 encoded features;
- hospdead target;
- split-first policy;
- no outcome-association feature screening;
- excluded prior scores/predictions/DNR/sensitive predictors;
- internal metrics;
- finite deterministic inference;
- UI marker and specialist panel.

## Historical regression gates

Predictive registry expansion initially caused marker-only failures in older smokes while the UI marker moved from 0.52 to 0.53.

Historical gates were made forward-compatible without changing their model-specific assertions.

Final corrected examples:

- 0.49 Heart Failure Smoke — run `37926506420` — PASS
- 0.50 CDC Diabetes Smoke — run `37926529741` — PASS
- 0.51.1 Sepsis Smoke — run `37926546386` — PASS
- 0.52 MI Smoke — run `37926563825` — PASS

## Full static release audit

Workflow:

`HealthSolver 0.53 Full Static Release Audit`

Run:

`37926778585`

Result:

PASS

Verified:

- repository/source integrity;
- Python/JavaScript/JSON/YAML parsing;
- legacy frontend bundling;
- all twelve 0.52 predictive artifacts byte-for-byte preserved;
- all thirteen current models mathematically valid;
- SUPPORT2 provenance;
- SUPPORT2 feature/exclusion policy;
- SUPPORT2 metrics;
- pinned runtime;
- safe legacy FastAPI import;
- training workflow manual/idempotent;
- 0.53 packaging invariants.

Markers:

- `0.52 MODEL ARTIFACT FREEZE PASS`
- `THIRTEEN MODEL STATIC INTEGRITY PASS`
- `Legacy FastAPI safe import PASS`

## Predictive-First browser integration

HealthSolver 0.53 displays:

**13 MODELLI SUPERVISIONATI**

Specialist panel:

`#hs53Support2Details`

Visible title:

**SUPPORT2 · decesso intraospedaliero · stato clinico giorno 3**

Shared compatible dossier values:

- age
- sex
- heart rate
- creatinine
- sodium

Source-specific panel fields:

- diagnosis group
- number of comorbidities
- SUPPORT coma score
- hospital day at study entry
- diabetes
- dementia
- cancer status
- mean arterial pressure
- WBC in 10^3/µL
- respiratory rate
- temperature

WBC is deliberately not reused from the generic dossier because the generic field uses a different scale/unit convention.

## Live browser audit

Workflow:

`HealthSolver 0.53 SUPPORT2 Live Browser Audit`

Run:

`37926834432`

Result:

PASS

Verified on public GitHub Pages:

- public version 0.53.0;
- 13 models;
- SUPPORT2 release flag;
- registry 0.53.0;
- 9105 / 5-center provenance;
- 16 raw / 25 encoded model shape;
- hospdead target;
- visible SUPPORT2 disclosures;
- 25/25 complete readiness;
- numeric prediction;
- no abstention;
- internal AUROC 0.819 / Brier 0.142 rendering;
- day-3 semantics;
- no fixed survival horizon;
- historical/internal-validation warning;
- no serious browser errors.

Marker:

`SUPPORT2 LIVE PASS`

## Compact full browser E2E

Workflow:

`HealthSolver 0.53 Compact Full Browser E2E`

Run:

`37926974288`

Result:

PASS

Verified:

- navigation across active pages;
- Clinical Coach;
- Expert Mode;
- 13-model badge;
- 13 coverage cards;
- 13 result cards;
- complete SUPPORT2 prediction;
- Multi-Model Hub;
- Massive Public Data surface;
- single-model surface;
- browser training surface;
- validation surface;
- archive surface;
- preserved previous modules;
- browser-error collection.

Markers:

- `13-model registry/result surface PASS`
- `ALL_BROWSER_ERRORS []`
- `FULL ACTIVE-APP E2E PASS`

The frozen 0.52 E2E remains the stronger prior-release regression test for the twelve preceding models. The 0.53 static freeze proves their numerical artifacts are unchanged.

## Repack

Workflow:

`HealthSolver 0.53 SUPPORT2 Hospital Death Repack`

Run:

`37926663417`

Result:

PASS

## GitHub Pages

Deployment run:

`37926681258`

Result:

PASS

Published gh-pages commit:

`eb4bcb9e8cd7f5faeecdd935e0deab08db05438b`

## Published smoke

Workflow:

`HealthSolver Published Release Smoke`

Run:

`37926709830`

Result:

PASS

Verified:

- public version 0.53.0;
- public registry 0.53.0;
- exact 13 model IDs;
- public registry equals main;
- all public predictive model artifacts equal main;
- public Predictive-First UI equals main;
- loader identifies release 0.53.0.

## Public build identity

Public URL:

https://ricscar2570.github.io/HealthSolver/

Version:

`0.53.0`

Predictive model count:

`13`

Source SHA-256:

`01a66b12cc740dbc8c9f8c3e5bc2822fe760501893d480f97e66f6060ed33201`

Loader expected hash:

`01a66b12cc740dbc8c9f8c3e5bc2822fe760501893d480f97e66f6060ed33201`

Loader hash match:

PASS

Predictive files main <-> gh-pages:

`28`

Differences:

`0`

## Research boundary

HS-SUPPORT2-HOSPDEATH-001 must not be interpreted as:

- a general mortality calculator;
- an admission-time model;
- 30-day mortality;
- 90-day mortality;
- 180-day survival;
- a survival probability;
- a treatment recommendation;
- a DNR recommendation;
- a futility decision tool;
- ICU admission/discharge guidance;
- contemporary external validation.

The source cohort is historical and seriously ill.

The model is a research classifier for the SUPPORT2 in-hospital outcome label using day-3/baseline information.

## Gate for database #11

Database #11 may begin only from this frozen 0.53 baseline.

Required protocol:

1. preserve all thirteen current numerical model artifacts;
2. verify source permission/license before acquisition;
3. define target semantics and index time before training;
4. split before any outcome-informed screening;
5. use training-only missingness/imputation/standardization;
6. exclude prior prognostic model outputs;
7. exclude post-index treatment/outcome leakage;
8. avoid sensitive predictors when they are unnecessary;
9. reserve an untouched test or external cohort;
10. pin the training environment;
11. independently reproduce from source;
12. integrate exactly one database;
13. run model-specific smoke;
14. run historical regression gates;
15. run static freeze/integrity;
16. run live browser audit;
17. run full browser E2E;
18. deploy Pages;
19. verify public predictive assets against main;
20. freeze checkpoint/release branch before proceeding.
