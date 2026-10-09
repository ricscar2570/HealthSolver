# HealthSolver 0.49.1 — Scientific Semantics Remediation

Date: 2026-10-09.

## Purpose

HealthSolver 0.49.1 is a semantics-only remediation of the UCI Heart Failure Clinical Records integration introduced in 0.49.0.

No new database is added.

No predictive model is retrained for this remediation.

The purpose is to make the source-cohort scope and time-to-event limitations explicit in model metadata, registry, documentation and live UI.

## Frozen numerical baseline

Frozen 0.49.0 commit:

`14ad568fba33b6e69c399103f78dd2bbedbba6c3`

Model:

`HS-UCI-HFDEATH-001`

The following fields are required to remain byte-equivalent in meaning/value to the 0.49.0 model:

- features
- field metadata
- imputation values
- standardization means/scales
- logistic intercept and coefficients
- calibration intercept and slope
- threshold
- threshold-selection method
- held-out metrics
- abstention rule
- excluded source features

The held-out report JSON must also remain identical.

Automated numerical-freeze gates confirm that all of these remained unchanged.

## Scientific source semantics

Source:

**UCI Heart Failure Clinical Records — UCI ID 519**

DOI:

`10.24432/C5Z89R`

License:

CC BY 4.0

Instances:

299

Source cohort context recorded in 0.49.1:

- location: Faisalabad, Punjab, Pakistan
- sites:
  - Faisalabad Institute of Cardiology
  - Allied Hospital
- collection period: April–December 2015
- all 299 patients had left ventricular systolic dysfunction
- all 299 had previous heart failure classified NYHA III or IV
- 105 women
- 194 men
- age range: 40–95 years

## Follow-up semantics

The source variable:

`time`

is follow-up duration.

Source follow-up in the associated dataset publication:

- minimum: 4 days
- maximum: 285 days
- mean: about 130 days
- duration varies by patient

HealthSolver continues to exclude `time` from browser predictors to avoid post-index observation-time leakage.

However, 0.49.1 now makes the complementary limitation explicit:

**removing `time` does not turn the binary classifier into a survival model.**

The output is therefore not:

- mortality at 30 days
- mortality at 90 days
- mortality at 365 days
- mortality at any other fixed horizon
- a survival probability
- a censoring-aware time-to-event estimate
- a general heart-failure mortality-risk score

## Remediated output semantics

The output is defined as:

> Calibrated research probability of the source binary DEATH_EVENT label under the UCI 519 development setup and source-cohort distribution.

The model artifact now records:

- `cohort_scope`
- `follow_up`
- `time_to_event_limitation`
- `output_semantics`
- `fixed_horizon = false`
- `survival_model = false`
- explicit interpretation text

Model version:

`1.0.1`

Registry version:

`0.49.1`

Model count:

`9`

## UI remediation

The heart-failure model is now titled:

**DEATH_EVENT UCI 519 · insufficienza cardiaca**

The specialist section is titled:

**Insufficienza cardiaca · DEATH_EVENT coorte UCI 519**

The UI explicitly states:

- Faisalabad 2015 source context
- two-hospital source cohort
- left ventricular systolic dysfunction
- previous NYHA III–IV heart failure
- variable follow-up
- 4–285 day range
- mean follow-up about 130 days
- `time` excluded from predictors
- no fixed mortality horizon
- not a survival analysis
- not a survival probability
- not a clinically validated prognostic score

The result card itself repeats the fixed-horizon/survival limitation so it remains visible at the moment a percentage is shown.

## Training workflow safety

The historical UCI 519 training workflow was converted from automatic push-triggered execution to:

`workflow_dispatch`

This prevents an automatic rerun from overwriting the remediated 0.49.1 metadata.

If manually invoked, the workflow is configured to reproduce the same training design while writing the 0.49.1 semantics.

## Qualification

### 0.49 historical heart-failure smoke

Run:

`37893721308`

Result:

PASS

The historical 0.49 regression gate was made forward-compatible and remains green.

### Scientific Semantics + Numerical Freeze Smoke

Workflow:

`HealthSolver 0.49.1 Scientific Semantics Smoke`

Run:

`37893773910`

Result:

PASS

Verified:

- registry = 0.49.1
- model version = 1.0.1
- all numerical/core model fields equal frozen 0.49.0
- held-out report equal frozen 0.49.0
- Faisalabad cohort scope present
- source hospitals present
- collection period present
- LV systolic dysfunction / NYHA III–IV scope present
- sex counts and age range present
- follow-up 4–285 days, mean 130 days present
- fixed_horizon = false
- survival_model = false
- time-to-event limitation present
- output semantics present
- registry title remediated
- UI semantic markers present

Final marker:

`SCIENTIFIC SEMANTICS + NUMERICAL FREEZE PASS`

### Repack

Workflow:

`HealthSolver 0.49.1 Scientific Semantics Repack`

Run:

`37893718923`

Result:

PASS

### GitHub Pages deployment

Run:

`37893733670`

Result:

PASS

GitHub Pages commit:

`d59d1471d9b2c26e642870a8645a23c982cb5ed6`

### Published Release Smoke

Workflow:

`HealthSolver Published Release Smoke`

Run:

`37893855097`

Result:

PASS

Verified:

- public version = 0.49.1
- public registry = 0.49.1
- public model count = 9
- public registry equals main registry
- all public predictive model artifacts equal main
- public integrated predictive UI equals main

Published standalone source SHA-256:

`e84057b7d2bb806d791fd1a8fc42f7f74571c6967b13606afb48c8f4cacfd69b`

### Scientific Semantics Live Browser Audit

Workflow:

`HealthSolver 0.49.1 Scientific Semantics Live Browser Audit`

Run:

`37893861565`

Result:

PASS

Verified on the live application:

- 0.49.1 metadata
- registry 0.49.1
- HF model 1.0.1
- semantic flags
- nine-model badge
- DEATH_EVENT UCI 519 wording
- Faisalabad scope
- NYHA III–IV scope
- 4–285 day variable follow-up disclosure
- survival-probability warning
- no `time` predictor control
- complete HF input accepted
- numeric result generated
- no unexpected abstention
- fixed-horizon warning present in result card
- survival warning present in result card
- no serious browser errors

Final marker:

`SCIENTIFIC SEMANTICS LIVE PASS`

### Full Static Release Audit

Workflow:

`HealthSolver 0.49.1 Full Static Release Audit`

Run:

`37893865660`

Result:

PASS

Verified:

- repository integrity
- no tracked .env
- no merge-conflict markers
- Python syntax
- JavaScript syntax
- JSON/YAML parse
- legacy JSX bundling
- all nine model schemas and mathematical inference
- 0.49 numerical freeze against frozen commit
- unchanged held-out report
- cohort-scope metadata
- time-to-event semantic flags
- 0.49.1 packaging markers

Final marker:

`NINE MODEL + SCIENTIFIC FREEZE PASS`

### Full Browser E2E

Workflow:

`HealthSolver 0.49.1 Full Browser E2E Audit`

Initial run:

`37893872679`

Result:

FAIL — test-definition issue only.

Cause:

The test attempted to read the full text of the heart-failure `<details>` element while it was closed, so browser `innerText` exposed only the summary.

No application defect was identified.

The test was corrected to open the details element before semantic assertions.

Corrected run:

`37893965496`

Result:

PASS

The corrected full E2E re-exercised:

- navigation
- Clinical Coach
- local resume
- Coach backup/restore
- Expert extraction and analysis
- scientific-semantics presence
- all nine predictive models
- Expert plain/encrypted backup and restore
- Multi-Model Hub
- Massive Public Data
- BRFSS
- openFDA observable response handling
- local FHIR import
- single-model workflow/report
- client training
- validation/export
- archive plain/encrypted backup/restore
- previous-module preservation
- final browser error check

## Published release

Public URL:

https://ricscar2570.github.io/HealthSolver/

Published version:

`0.49.1`

Predictive registry:

`0.49.1`

Predictive model count:

`9`

GitHub Pages commit:

`d59d1471d9b2c26e642870a8645a23c982cb5ed6`

Standalone source SHA-256:

`e84057b7d2bb806d791fd1a8fc42f7f74571c6967b13606afb48c8f4cacfd69b`

Predictive assets synchronized main ↔ gh-pages:

PASS

## Research boundary

HS-UCI-HFDEATH-001 remains research-only.

0.49.1 specifically forbids interpreting its percentage as:

- general heart-failure mortality risk
- mortality at a fixed time horizon
- survival probability
- censoring-aware prognosis
- clinical triage
- treatment guidance
- admission/discharge guidance
- device/transplant/palliative-care guidance
- externally validated prognosis

## Gate for database #7

Database #7 may begin only from this 0.49.1 frozen baseline.

Before database #7:

1. preserve all nine current model artifacts;
2. perform source-cohort and leakage review before training;
3. define target semantics before UI integration;
4. distinguish binary classification from time-to-event prediction where relevant;
5. add only one database in the macrostep;
6. run source-specific smoke;
7. run historical regression gates;
8. run numerical/model integrity audit;
9. run live-browser audit;
10. run full static audit;
11. run full browser E2E;
12. publish GitHub Pages;
13. verify public assets against main;
14. freeze a new checkpoint before proceeding further.
