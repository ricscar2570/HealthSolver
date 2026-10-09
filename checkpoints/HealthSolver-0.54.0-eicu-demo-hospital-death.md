# HealthSolver 0.54.0 — eICU Demo Hospital Death Integration

**Date:** 2026-10-09  
**Database macrostep:** #11  
**Database:** eICU Collaborative Research Database Demo v2.0.1  
**DOI:** 10.13026/4mxk-na84  
**License:** Open Data Commons Open Database License v1.0  
**Model:** `HS-EICU-DEMO-HOSPDEATH-001`  
**Status:** QUALIFIED RESEARCH-SOFTWARE BASELINE — NOT CLINICALLY VALIDATED

## Frozen input baseline

HealthSolver 0.53.1 — Code Audit Remediation.

Frozen release branch:

`release/v0.53.1-code-audit-remediation`

Frozen baseline commit:

`bbe7d40a978bbf907f527f9e33798cabaab8894e`

Baseline predictive model count:

`13`

HealthSolver 0.54.0 predictive model count:

`14`

No second database is introduced in this macrostep.

## Source and acquisition

Primary source:

**PhysioNet — eICU Collaborative Research Database Demo v2.0.1**

Release source:

`https://physionet.org/content/eicu-crd-demo/2.0.1/`

Direct-file base:

`https://physionet.org/files/eicu-crd-demo/2.0.1/`

Files used for the released model:

- `patient.csv.gz`
- `apacheApsVar.csv.gz`

Additional tables were inspected during profiling for leakage review:

- `apachePatientResult.csv.gz`
- `admissionDx.csv.gz`
- `hospital.csv.gz`

The workflow downloads PhysioNet's official `SHA256SUMS.txt`, verifies the two model-source files against it, downloads the license text and verifies the Open Database License marker before training.

## Source profile

Verified source dimensions:

- patient rows / ICU unit stays: **2,520**
- unique patients: **1,841**
- unique hospital stays: **2,174**
- `apacheApsVar` rows: **2,205**
- `apachePatientResult` rows: **3,676**
- `admissionDx` rows: **7,578**

Source hospital-discharge status across patient rows:

- Alive: **2,280**
- Expired: **212**
- missing: **28**

Repeated ICU visits are present:

- unit visit 1: 2,119
- unit visit 2: 318
- unit visit 3: 66
- unit visit 4: 14
- unit visit 5: 3

This made a naïve row-level random split unacceptable because the same patient could otherwise cross development partitions.

## Development cohort

The cohort is defined before outcome-aware modelling:

1. first ICU stay of each hospital admission: `unitvisitnumber = 1`;
2. known `hospitalDischargeStatus`;
3. available `apacheApsVar` row.

Final development cohort:

- admissions: **2,004**
- unique patients: **1,713**
- unique hospital stays: **2,004**
- Alive: **1,831**
- Expired: **173**
- hospital-death prevalence: **0.08632734530938124**

Multiple separate hospital admissions for one unique patient may remain in the cohort, but every row belonging to that patient is assigned to the same development partition.

## Target

Source target:

`hospitalDischargeStatus`

Mapping:

- Alive → 0
- Expired → 1

The model predicts the **source hospital-discharge outcome class** after the indexed ICU stay.

It is not:

- mortality within 24 hours;
- 30-day mortality;
- 90-day mortality;
- a fixed-horizon mortality probability;
- a survival probability;
- a validated ICU mortality score;
- a treatment or triage rule.

## Prediction index

The prediction index is:

**end of the first APACHE day / first 24 hours after ICU admission**

The physiologic variables in `apacheApsVar` are treated according to their source semantics as worst values from the first APACHE day.

The model is therefore not described as an admission-time classifier.

## Missing-value semantics

For continuous APACHE APS source variables, the distributed value `-1` is treated as unavailable/missing rather than as a physiologic measurement.

Age is source-top-coded:

`> 89`

HealthSolver encodes this as:

- `age_numeric = 90`;
- `age_over_89 = 1`.

Training-only medians are used for missing numeric values.

## Split-first / patient-disjoint protocol

HealthSolver uses:

`StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=5401)`

Group:

`uniquePID`

Assignment:

- fold 0 → untouched test;
- fold 1 → calibration;
- folds 2–4 → training.

Partition sizes and outcomes:

### Training

- n = **1,200**
- hospital deaths = **103**
- prevalence = **0.08583333333333333**

### Calibration

- n = **402**
- hospital deaths = **35**
- prevalence = **0.08706467661691543**

### Test

- n = **402**
- hospital deaths = **35**
- prevalence = **0.08706467661691543**

Verified:

**no unique patient occurs in more than one partition.**

## Feature-selection policy

No feature/outcome association is computed or used to select the released compact feature set.

Selection is based on:

1. source semantics;
2. prediction-time availability;
3. leakage review;
4. training-partition missingness;
5. browser portability.

High-missingness alternatives excluded before fitting include:

- urine;
- WBC;
- BUN.

The model also excludes intervention flags such as intubation, ventilation and dialysis from the compact set rather than treating treatment status as an ordinary physiologic risk feature.

## Raw browser inputs

The released model uses 11 raw inputs:

1. age;
2. sex;
3. GCS total;
4. GCS unscorable because of medication;
5. temperature;
6. respiratory rate;
7. heart rate;
8. mean arterial pressure;
9. glucose;
10. sodium;
11. creatinine.

Encoded numerical model features:

`12`

They are:

- age_numeric
- age_over_89
- male
- gcs_total
- gcs_unscorable_meds
- temperature
- respiratoryrate
- heartrate
- meanbp
- glucose
- sodium
- creatinine

Only **age and sex** may be reused automatically from the common dossier.

All first-APACHE-day GCS and physiologic values must be entered explicitly in the eICU specialist panel. Generic dossier heart rate, sodium, creatinine, temperature or other values are not silently substituted because the common dossier does not encode the required first-24-hour timepoint.

## Leakage exclusions

Explicitly excluded include:

- hospital discharge status/location/time fields as predictors;
- unit discharge status/location/time fields;
- discharge weight;
- hospital and ward identifiers;
- ethnicity;
- admission diagnosis text;
- APACHE score;
- acute physiology score;
- APACHE version;
- predicted ICU mortality;
- actual ICU mortality;
- predicted hospital mortality;
- actual hospital mortality;
- predicted ICU/hospital length of stay;
- actual ICU/hospital length of stay;
- ventilation-day outcomes;
- high-missingness auxiliary physiology not used in the compact model;
- intervention flags excluded from the final compact feature set.

The `apachePatientResult` score/prediction/outcome fields are inspected to identify leakage candidates and are never model inputs.

## Training design

Pinned environment:

- Python 3.13
- NumPy 2.5.3
- pandas 3.0.6
- scikit-learn 1.9.1

Classifier:

- regularized logistic regression;
- class_weight = balanced;
- C = 0.5;
- solver = lbfgs;
- training-only median imputation;
- training-only standardization.

Calibration:

- Platt scaling;
- calibration partition only.

Threshold:

- Youden J;
- calibration partition only.

The untouched patient-disjoint test partition is evaluated only after fitting, calibration and threshold definition.

## Held-out test metrics

Test n:

**402**

Hospital deaths:

**35**

Metrics:

- AUROC: **0.8224990268586998**
- AUPRC: **0.3516680940352904**
- Brier: **0.06929920452285196**
- accuracy: **0.8159203980099502**
- sensitivity for hospital death: **0.6571428571428571**
- specificity for hospital survival: **0.8310626702997275**
- threshold: **0.09266448469789074**

Confusion matrix:

- TN survived: **305**
- FP death: **62**
- FN death: **12**
- TP death: **23**

These are internal research measurements on the open eICU demo development cohort.

They are not external, prospective or clinical validation.

## Abstention policy

The browser runtime requires:

- age;
- sex.

Maximum missing raw first-day inputs tolerated:

**2**

If age or sex is absent, or more than two raw first-day inputs are unavailable, the eICU model abstains.

Missing values inside the permitted policy use training-only imputation.

## Browser integration

New specialist panel:

`#hs54EicuDetails`

Visible section:

**eICU Demo · decesso ospedaliero · first APACHE day**

HealthSolver 0.54.0 displays:

**14 MODELLI SUPERVISIONATI**

The result card explicitly states:

- target is `hospitalDischargeStatus`;
- positive class is Expired;
- index is first APACHE day;
- no fixed mortality horizon;
- APACHE scores/predicted mortality are excluded;
- split is patient-disjoint;
- validation is internal on the demo.

## Profiling qualification

Workflow:

**HealthSolver 0.54 eICU Demo Profile**

Final run:

`37945402429`

Result:

**PASS**

Markers include:

- cohort definition;
- source-value audit;
- patient-group split;
- training-only missingness;
- `EICU_DEMO_PROFILE_V2_PASS`.

## Training qualification

Workflow:

**HealthSolver 0.54 eICU Demo Hospital Death**

Run:

`37945811452`

Result:

**PASS**

Generated commit:

`810175271c573619407a0b6fa11f69b47f947638`

Markers include:

- `EICU SOURCE + LICENSE PASS`;
- `EICU 0.54 TRAINING PASS`.

## Model-specific smoke

Workflow:

**HealthSolver 0.54 eICU Demo Smoke**

Run:

`37946330592`

Result:

**PASS**

Verified:

- registry 0.54.0;
- 14 unique model IDs;
- eICU provenance/license;
- target/time semantics;
- patient-disjoint split disclosure;
- leakage exclusions;
- raw/encoded feature shape;
- held-out metrics;
- deterministic finite inference;
- 0.54 UI markers and explicit first-day inputs.

## Independent reproduction

Workflow:

**HealthSolver 0.54 eICU Independent Reproduction**

Run:

`37946594813`

Result:

**PASS**

A clean workflow independently re-downloads the two model-source tables and reproduces:

- source dimensions;
- cohort;
- patient-group-disjoint split;
- imputation medians;
- standardization;
- logistic coefficients/intercept;
- Platt slope/intercept;
- calibration-selected threshold;
- held-out test metrics.

Markers:

- `EICU SOURCE PASS`
- `COHORT PASS`
- `PATIENT-GROUP SPLIT PASS`
- `MODEL COEFFICIENTS PASS`
- `IMPUTATION STANDARDIZATION PASS`
- `CALIBRATION THRESHOLD PASS`
- `METRICS PASS`
- `EICU INDEPENDENT REPRODUCTION PASS`

## Historical regression

After the 14th-model registry expansion, historical model-specific smokes for prior datasets remained green. The SUPPORT2 0.53.1 smoke initially failed because it required the registry to contain exactly 13 models and SUPPORT2 to be the final registry element. That historical assertion was made forward-compatible without weakening any SUPPORT2-specific numerical/semantic check.

Corrected SUPPORT2 regression run:

`37946273504`

Result:

**PASS**

Other prior model smokes and the legacy/static integrity workflow triggered by the 0.54 UI expansion also passed.

## Full static release audit

Workflow:

**HealthSolver 0.54 Full Static Release Audit**

Final run:

`37946873060`

Result:

**PASS**

Verified:

- repository integrity;
- JavaScript/JSON parsing;
- all **24 pre-eICU model/report JSON artifacts** byte-for-byte preserved from the frozen 0.53.1 baseline;
- current 14-model registry;
- eICU feature policy and leakage exclusions;
- metric integrity;
- 0.54 UI wiring;
- 0.54 packaging and published-smoke configuration.

The first static-audit run failed only because the test expected at least 25 prior model/report JSON files while the frozen baseline contains exactly 24. The corrected exact-count assertion passed and no product artifact was changed to satisfy it.

## GitHub Pages repack

Workflow:

**HealthSolver 0.54.0 eICU Demo Repack**

Run:

`37946414368`

Result:

**PASS**

The public build was regenerated with registry 0.54.0 and all 14 model artifacts.

## Published release smoke

Workflow:

**HealthSolver Published Release Smoke**

Final 0.54 run:

`37946495293`

Result:

**PASS**

Verified:

- public version = 0.54.0;
- public registry = 0.54.0;
- 14 model IDs;
- eICU integration flag;
- public registry equals main;
- every public predictive model artifact equals main;
- public integrated predictive UI equals main;
- public loader identifies HealthSolver 0.54.0.

A transient earlier failure occurred while main had already moved to registry 0.54.0 but the public Pages repack had not yet completed. The post-repack run above supersedes it.

## Live eICU browser audit

Workflow:

**HealthSolver 0.54 eICU Live Browser Audit**

Final run:

`37946878470`

Result:

**PASS**

Verified on the public GitHub Pages application:

- release 0.54.0;
- 14 models;
- eICU panel visible;
- target/time/leakage disclosures visible;
- all 12 encoded inputs ready when age/sex plus explicit first-day values are supplied;
- numeric prediction produced;
- AUROC/Brier rendering;
- generic dossier pulse/creatinine/sodium values deliberately set to incompatible values do not leak into the eICU first-day model;
- 14 result cards;
- no serious browser errors.

The first live-audit attempt failed only because the assertion searched for lowercase `non è mortalità...` while the rendered disclosure begins with uppercase `Non`. No application code change was required for that failure.

## Full active-app browser E2E

Workflow:

**HealthSolver 0.54 Full Browser E2E**

Run:

`37946808751`

Result:

**PASS**

Verified:

- all active navigation surfaces;
- Clinical Coach;
- Predictive-First Expert Mode;
- 14-model badge;
- 14 coverage cards;
- complete SUPPORT2 prediction;
- complete eICU prediction;
- 14 result cards;
- Multi-Model Hub;
- Massive Public Data;
- single-model surface;
- browser training surface;
- validation surface;
- archive;
- preserved previous functionality;
- browser error collection.

Marker:

`FULL ACTIVE-APP E2E PASS`

## Research boundary

`HS-EICU-DEMO-HOSPDEATH-001` must not be interpreted as:

- a validated APACHE replacement;
- an admission-time score;
- a 24-hour mortality score;
- 30-day or 90-day mortality;
- a survival probability;
- a treatment recommendation;
- a triage threshold;
- ICU admission/discharge guidance;
- contemporary external validation;
- prospective clinical validation.

The demo dataset is a small open subset intended to demonstrate the eICU data structure. A larger/full eICU analysis would require separate authorized access and a new validation/release protocol.

## Release decision

**HealthSolver 0.54.0 / Database #11 is accepted as a frozen software-research baseline.**

## Gate for database #12

Database #12 may begin only from this frozen 0.54.0 baseline.

Required protocol remains:

1. exactly one new database per macrostep;
2. license/access verification before acquisition;
3. target/index-time definition before training;
4. split before any outcome-informed screening;
5. group splitting whenever repeated patients/encounters exist;
6. training-only preprocessing;
7. explicit leakage audit;
8. untouched test or external cohort;
9. pinned environment;
10. independent reproduction;
11. preservation of all prior numerical model artifacts unless a separately documented remediation is required;
12. model-specific smoke;
13. historical regression;
14. full static audit;
15. live browser audit;
16. full browser E2E;
17. Pages repack;
18. public-assets-vs-main verification;
19. checkpoint and release branch before proceeding.
