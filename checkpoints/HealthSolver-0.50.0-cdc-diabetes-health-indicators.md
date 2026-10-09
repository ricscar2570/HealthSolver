# HealthSolver 0.50.0 — CDC Diabetes Health Indicators Integration

Date: 2026-10-09.

## Macrostep rule

This release integrates exactly one new database:

**CDC Diabetes Health Indicators / BRFSS-derived processed dataset — UCI external dataset ID 891**

This is database macrostep #7 after the frozen HealthSolver 0.49.1 scientific-semantics baseline.

No second database is introduced in this macrostep.

## Frozen baseline

Development started from:

**HealthSolver 0.49.1 — Scientific Semantics Remediation**

Frozen commit:

`1849b8ec13e0618d5c1a9898b042ace84f59cc9e`

Baseline predictive model count:

`9`

Baseline qualification included:

- published release smoke: PASS
- scientific-semantics smoke: PASS
- live-browser semantics audit: PASS
- full static release audit: PASS
- full browser E2E: PASS
- numerical freeze of HS-UCI-HFDEATH-001 against 0.49.0: PASS

## Database #7

Name:

**CDC Diabetes Health Indicators**

UCI external dataset ID:

`891`

DOI:

`10.24432/C53919`

Upstream source:

**CDC Behavioral Risk Factor Surveillance System (BRFSS)**

Distributed processed table:

- instances: **253,680**
- features: **21**
- target: `Diabetes_binary`
- missing values: none in the distributed table

UCI source record:

https://archive.ics.uci.edu/dataset/891/cdc+diabetes+health+indicators

## Licensing / provenance

The current UCI page is an external-dataset record and states:

**See linked dataset for licensing information.**

HealthSolver therefore does not treat the UCI external record itself as a CC0 grant.

The release records the licensing provenance conservatively:

- UCI external record: follow linked dataset licensing;
- linked processed dataset: reported as CC0 / Public Domain;
- upstream CDC BRFSS federal data/materials: generally public domain;
- attribution retained to UCI, the linked processed dataset and CDC BRFSS.

This avoids broadening any license claim beyond the available source metadata.

## Target semantics

The model target is:

`Diabetes_binary`

Source coding:

- `0` = no diabetes
- `1` = **prediabetes OR diabetes combined**

This is deliberately represented in HealthSolver as a **cross-sectional source-label classification**.

It is not represented as:

- a clinical diagnosis of diabetes;
- a distinction between prediabetes and diabetes;
- incident diabetes;
- future diabetes risk;
- a prospective probability;
- a fixed-time-horizon risk;
- a replacement for glucose, HbA1c, oral glucose tolerance testing or medical evaluation.

## Leakage / semantic review

No direct target field is present among model predictors.

However, several source indicators are comorbidities, health-status measures or healthcare-use variables and can partly reflect correlates or consequences of already existing disease or diagnosis.

For that reason, HealthSolver does not label the output as an etiologic or prospective diabetes-risk score.

The model metadata explicitly records:

- `future_risk = false`
- `clinical_diagnosis = false`
- `prediabetes_and_diabetes_combined = true`
- cross-sectional temporal semantics
- leakage-review warning

## Model

Model ID:

`HS-CDC-DIABIND-001`

Registry title:

**Diabete/prediabete · label BRFSS**

Version:

`1.0.0`

Registry version:

`0.50.0`

Total registered supervised models:

`10`

## Predictors

The model uses all 21 distributed source indicators after deterministic key normalization:

1. high_bp
2. high_chol
3. chol_check
4. bmi
5. smoker_100
6. stroke_history
7. heart_disease_or_attack
8. physical_activity
9. fruits_daily
10. veggies_daily
11. heavy_alcohol
12. any_healthcare
13. no_doctor_due_cost
14. general_health
15. mental_health_days
16. physical_health_days
17. difficulty_walking
18. sex
19. age_category
20. education
21. income

Age is deterministically mapped from the HealthSolver dossier into the BRFSS age-category encoding.

Sex is reused from the dossier.

BMI is reused when available in the compatible dossier field.

The remaining survey-domain variables are collected in the dedicated CDC/BRFSS specialist panel.

## Training design

- total: **253,680**
- training: **152,208**
- calibration: **50,736**
- held-out test: **50,736**
- positive prevalence: **0.13933301797540207**
- regularized logistic regression
- class weighting enabled
- training-only standardization
- held-out Platt calibration
- decision threshold selected only on calibration data using Youden J
- independent held-out test used once for final internal metrics

No SMOTE or synthetic oversampling was used to manufacture a balanced held-out result.

## Held-out metrics

- AUROC: **0.8244288978240887**
- AUPRC: **0.4092952563503758**
- Accuracy: **0.6944970040996531**
- Brier: **0.09857620205633896**
- Sensitivity: **0.821332578865469**
- Specificity: **0.6739643208830467**
- Decision threshold: **0.11681655085889596**

Confusion matrix:

- TN: **29,430**
- FP: **14,237**
- FN: **1,263**
- TP: **5,806**

These are internal held-out measurements from the same processed survey-data family.

They are not external or prospective clinical validation.

## Relationship to existing NHANES diabetes model

HealthSolver now contains two diabetes-related research outputs with different targets:

### HS-NHANES-DM-001

Target:

self-reported doctor-diagnosed diabetes among NHANES adults.

### HS-CDC-DIABIND-001

Target:

processed BRFSS `Diabetes_binary=1`, combining prediabetes and diabetes.

The two probabilities must not be:

- added;
- averaged;
- ranked as competing diagnoses;
- interpreted as estimates of the same endpoint.

## Acquisition qualification

### Initial acquisition attempt

Workflow run:

`37898536945`

Result:

FAIL before dataset acquisition.

Cause:

transient UCI connection-pool timeout while `ucimlrepo` was attempting to download the external dataset.

No training had begun and no model artifact was produced.

### Resilient acquisition remediation

The acquisition workflow was changed to:

1. retry UCI acquisition up to five times;
2. retain strict row/schema/target assertions;
3. use the public linked dataset as fallback only when UCI acquisition remains unavailable.

Successful training run:

`37898691691`

Result:

PASS

Successful acquisition path:

`ucimlrepo:891`

Verified at runtime:

- 253,680 rows
- exact 21 expected features
- exact target `Diabetes_binary`
- no missing values
- registry expanded to 10 models

## Predictive-First UI

HealthSolver 0.50 reports:

**10 MODELLI SUPERVISIONATI**

New panel:

`#hs50CdcDiabetesDetails`

Visible title:

**CDC/BRFSS · diabete/prediabete**

The panel explains before inference that:

- the source contains 253,680 survey respondents;
- the target combines prediabetes and diabetes;
- the result is not a diagnosis;
- the result does not distinguish prediabetes from diabetes;
- the result is not future diabetes risk.

The result card repeats the semantic warning at the moment a percentage is displayed.

## Preservation of the nine-model baseline

Full static qualification compares the nine previous 0.49.1 predictive model artifacts and reports against frozen commit:

`1849b8ec13e0618d5c1a9898b042ace84f59cc9e`

Result:

`0.49.1 MODEL ARTIFACT FREEZE PASS`

Therefore the database #7 macrostep did not retrain or replace the nine previously frozen predictive models.

## Historical regression gates

After registry expansion, the historical heart-failure smoke initially expected exactly nine models and expected HS-UCI-HFDEATH-001 to be the final registry entry.

The gate was made forward-compatible without weakening its heart-failure assertions.

Corrected run:

`37898916944`

Result:

PASS

Other historical model gates remained green after the 0.50 expansion.

## Repack / GitHub Pages

Workflow:

`HealthSolver 0.50 CDC Diabetes Health Indicators Repack`

Final repack run:

`37899726244`

Result:

PASS

Final GitHub Pages deployment:

`37899740946`

Result:

PASS

Published GitHub Pages commit:

`0beed48fc4d48ea24be3acbb5d298b918d57a768`

Published version:

`0.50.0`

Published predictive model count:

`10`

Published standalone source SHA-256:

`681624ae174ff0f578f343739fc8a213250b9a0f64f63e9437136cc4722ac3f9`

Payload parts:

`7`

## Published Release Smoke

Workflow:

`HealthSolver Published Release Smoke`

A smoke started while the provenance-only model metadata update had not yet been repacked and correctly failed because public assets temporarily differed from main.

After the repack, failed jobs were rerun against the synchronized public deployment.

Final run:

`37899711802`

Attempt:

`2`

Result:

PASS

Verified:

- live version 0.50.0
- registry 0.50.0
- 10 model IDs
- public registry equals main
- public model JSON files equal main
- public integrated predictive UI equals main
- public loader identifies HealthSolver 0.50.0

## CDC model smoke

Workflow:

`HealthSolver 0.50 CDC Diabetes Indicators Smoke`

Final relevant run:

`37899712070`

Result:

PASS

Verified:

- UCI ID 891
- DOI
- 253,680 instances
- 21 features
- no missing-data declaration
- target semantics
- cross-sectional temporal semantics
- leakage warning
- split sizes
- held-out metrics
- deterministic finite browser inference
- registry entry
- 10-model UI marker
- CDC specialist panel
- result semantic language

## CDC live-browser audit

### Initial live audit

Run:

`37899102002`

Result:

FAIL — test-definition issue only.

Cause:

the test attempted Playwright `fill()` on the shared BMI input while that input was inside a closed NHANES details panel and therefore not visible.

The input existed and the application was not defective.

### Corrected live audit

The audit was corrected to assign the shared dossier value programmatically, matching the already-qualified integrated input mechanism.

Final run:

`37899721871`

Result:

PASS

Verified on live GitHub Pages:

- version 0.50.0
- 10-model metadata
- CDC integration flag
- public registry 0.50.0
- public CDC model shape
- combined prediabetes/diabetes target semantics
- future-risk=false
- clinical-diagnosis=false
- visible 10-model badge
- visible CDC/BRFSS coverage card
- source population disclosure
- target warning
- 21/21 readiness
- numeric probability
- no unexpected abstention
- held-out AUROC 0.824 shown
- semantic warning on result card
- no serious browser errors

Final marker:

`CDC DIABETES LIVE PASS`

## Full Static Release Audit

Workflow:

`HealthSolver 0.50 Full Static Release Audit`

Final run:

`37899835905`

Result:

PASS

Verified:

- repository integrity
- Python/JavaScript/JSON/YAML parsing
- legacy frontend bundling
- all nine 0.49.1 predictive artifacts preserved
- all ten current predictive models structurally valid
- finite deterministic inference for all ten models
- CDC model semantics and dimensions
- exact train/calibration/test counts
- legacy FastAPI safe import
- 0.50 packaging markers

Important markers:

`0.49.1 MODEL ARTIFACT FREEZE PASS`

`TEN MODEL STATIC INTEGRITY PASS`

`Legacy FastAPI safe import PASS`

## Full Browser E2E

Workflow:

`HealthSolver 0.50 Full Browser E2E Audit`

Final run:

`37899841644`

Result:

PASS

Verified on the live application:

- navigation
- Clinical Coach
- Expert text extraction/analysis
- CDC target semantics
- all ten predictive models in one dossier
- all ten model cards produce numeric predictions with the complete test dossier
- CDC result semantic warning
- Multi-Model Hub
- Massive Public Data / BRFSS evidence
- local FHIR import
- single-model workflow
- data/schema export
- client-side training
- validation metrics/export
- archive surface
- preserved previous-module marker
- final browser-error check

Final markers:

`10-model integrated prediction PASS`

`ALL_BROWSER_ERRORS []`

`FULL ACTIVE-APP E2E PASS`

### Unchanged encrypted backup qualification

The 0.50 E2E does not duplicate the encrypted backup/restore sequence.

That path was fully exercised in the immediately preceding frozen 0.49.1 full E2E:

`37893965496`

The database #7 macrostep changes the predictive overlay/model bundle and does not modify the preserved backup/encryption implementation in the standalone base application.

## Training workflow freeze

After successful training, the CDC training workflow was converted to manual:

`workflow_dispatch`

It was also made idempotent for an already-0.50 registry:

- it accepts the frozen 0.50 registry state;
- removes an existing HS-CDC-DIABIND-001 entry before recreating it;
- preserves exactly the nine prior model entries;
- does not duplicate the tenth model.

A transitional automatic run:

`37899717461`

failed closed because it had started from an intermediate workflow revision that still required registry 0.49.1 while main already contained registry 0.50.0.

The failure was:

`AssertionError: 0.50.0`

It did not commit or overwrite model artifacts.

## Research boundary

HS-CDC-DIABIND-001 is a research-only classifier.

Its output must not be interpreted as:

- a diabetes diagnosis;
- a prediabetes diagnosis;
- a distinction between diabetes and prediabetes;
- future diabetes risk;
- a probability of developing diabetes;
- a screening recommendation;
- a treatment recommendation;
- an indication to start/stop medication;
- external or prospective clinical validation.

The model estimates membership in the processed source label `Diabetes_binary` under the development dataset distribution.

## Gate for database #8

Database #8 may begin only from the frozen 0.50 baseline.

Before the next macrostep:

1. preserve all ten predictive model artifacts;
2. verify source licensing/provenance before acquisition;
3. define target semantics before training;
4. perform explicit leakage review;
5. distinguish diagnosis, cross-sectional source labels, future risk and time-to-event outcomes;
6. integrate exactly one database;
7. integrate its model into the same Predictive-First dossier;
8. run source/model smoke;
9. run historical regression gates;
10. run full static integrity;
11. run live browser audit;
12. run full browser E2E;
13. repack and deploy GitHub Pages;
14. verify public predictive assets against main;
15. freeze a new checkpoint and release branch before database #9.
