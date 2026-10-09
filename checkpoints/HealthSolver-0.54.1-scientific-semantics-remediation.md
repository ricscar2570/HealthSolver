# HealthSolver 0.54.1 — Scientific Semantics Remediation

**Date:** 2026-10-09  
**Repository:** `ricscar2570/HealthSolver`  
**Parent release:** HealthSolver 0.54.0 — eICU Demo Hospital Death Integration  
**Database macrostep:** #11 (unchanged)  
**Model:** `HS-EICU-DEMO-HOSPDEATH-001` v1.0.1  
**Registry:** 0.54.1  
**Status:** QUALIFIED SOFTWARE/RESEARCH BASELINE — NOT CLINICALLY VALIDATED

## Why this remediation exists

A post-release audit of the frozen 0.54.0 baseline found no numerical-model defect, but identified three semantics/documentation issues:

1. the browser eICU panel allowed a numeric GCS to coexist with “GCS non valutabile per farmaci”;
2. the README still contained stale active-release text referring to 0.53.1/0.54.0 and an outdated SUPPORT2 timepoint fallback description;
3. PhysioNet’s eICU demo landing page describes the demo as selected from 20 larger hospitals, while the actual v2.0.1 distributed files inspected by HealthSolver contain 186 distinct `hospitalid` values.

The first issue was a real runtime semantic inconsistency. The second was documentation drift. The third is an upstream metadata/file-content discrepancy that HealthSolver must not silently resolve by choosing one number.

## eICU GCS semantics remediation

Official eICU APACHE APS documentation states that when the GCS cannot be scored because of medication, `meds=1` and a valid GCS score is not available for that APACHE day.

The 0.54.0 development pipeline already represented this correctly:

- when `meds=1`, `gcs_total` is missing;
- `gcs_unscorable_meds=1`;
- missing `gcs_total` is handled under the training-only imputation policy.

The 0.54.0 browser UI, however, allowed a user to enter both:

- a numeric GCS;
- “GCS non valutabile per farmaci = Sì”.

HealthSolver 0.54.1 now enforces the source-consistent state:

- selecting “GCS non valutabile per farmaci = Sì” clears the numeric GCS field;
- the numeric GCS control becomes disabled;
- the runtime collector treats `gcs_total` as missing whenever the medication flag is 1, even if a stale DOM value were somehow present;
- the result remains usable under the model’s allowed missing-input policy and explicitly imputes `gcs_total` with the frozen training median.

The model metadata now records this in `input_consistency_policy`.

## eICU provenance ambiguity

Verified source files:

- `patient.csv.gz`
- `apacheApsVar.csv.gz`

Their SHA-256 values match PhysioNet’s official `SHA256SUMS.txt` exactly:

- `patient.csv.gz` — `15e1eb52169828e3cfff3b67132a087298de4d0365bbb31bb294f6043bffd474`
- `apacheApsVar.csv.gz` — `2dc6d63f9807c7e663ffa253998691605d527b702ac1db8cc5dda92308061e78`

Direct inspection of the distributed demo files produced:

- patient rows: 2,520;
- unique patients: 1,841;
- distinct `hospitalid` values in `patient.csv.gz`: 186;
- rows / distinct `hospitalid` values in `hospital.csv.gz`: 186.

PhysioNet’s demo page states that the demo contains over 2,500 unit stays selected from 20 of the larger hospitals.

Because those statements conflict, 0.54.1 adopts the conservative policy:

- no hospital-count claim is used by the model;
- no hospital-count claim is shown in the UI;
- `hospitalid` remains excluded from prediction;
- model metadata records the discrepancy in `dataset.source_metadata_note`;
- future documentation must distinguish landing-page metadata from direct file-derived counts.

This discrepancy does not affect the released model coefficients because hospital identifiers were never predictors.

## SUPPORT2 documentation correction

The current SUPPORT2 runtime does **not** reuse generic pulse, creatinine or sodium values from the common dossier for day-3 physiology.

The README is corrected to match the 0.53.1 remediation behavior:

- age and sex may be reused when compatible;
- all SUPPORT2 day-3 physiologic values must be explicitly entered in the SUPPORT2 panel;
- generic dossier measurements from an unspecified or incompatible timepoint are not silently substituted.

No SUPPORT2 model artifact was changed.

## README/release identity correction

The README now consistently identifies the current public release as:

**HealthSolver 0.54.1 — Scientific Semantics Remediation**

Corrected stale text included:

- top README release heading;
- Live application version;
- GitHub Pages deployment section;
- active model count;
- SUPPORT2 browser-input policy.

## Numerical freeze

There was **no retraining** in 0.54.1.

The full static audit compares the 0.54.1 eICU model against the frozen 0.54.0 release commit:

`5af80dc6fae7603368ec4a61dc14fb5d00e3dbe1`

Frozen and verified unchanged:

- features;
- raw_features;
- encoding_map;
- abstention policy;
- field_meta;
- imputation values;
- standardization;
- logistic coefficients/intercept;
- calibration slope/intercept;
- decision threshold;
- threshold-selection method;
- held-out metrics;
- target definition;
- temporal semantics;
- cohort policy;
- patient-group split policy;
- feature policy;
- missing-value policy;
- excluded source fields.

Marker:

`EICU 0.54.0 NUMERICAL CORE FREEZE PASS`

The 24 pre-eICU model/report JSON artifacts from the 0.53.1 baseline also remain byte-for-byte unchanged.

## Qualification evidence

### eICU semantics smoke

Workflow:

**HealthSolver 0.54.1 eICU Semantics Smoke**

Run:

`37948634566`

Result:

**PASS**

Verifies:

- registry 0.54.1;
- 14 unique models;
- eICU model v1.0.1;
- unchanged dataset/cohort/metric invariants;
- GCS consistency metadata;
- upstream hospital-count discrepancy metadata;
- 0.54.1 UI marker and GCS collector behavior.

### Live eICU browser audit

Workflow:

**HealthSolver 0.54.1 eICU Live Browser Audit**

Run:

`37948665018`

Result:

**PASS**

In addition to the normal complete-input eICU case, this audit explicitly tests:

1. enter a numeric GCS;
2. set “GCS non valutabile per farmaci = Sì”;
3. verify the numeric GCS is cleared and disabled;
4. run prediction;
5. verify the model does not abstain solely because of this source-valid missing GCS;
6. verify `gcs_total` is reported as training-median imputed.

It also continues to verify that generic dossier pulse, creatinine and sodium values do not leak into the eICU first-APACHE-day model.

### Full active application E2E

Workflow:

**HealthSolver 0.54.1 Full Browser E2E**

Run:

`37948709776`

Result:

**PASS**

Verified active navigation, Clinical Coach, Predictive-First UI, 14 coverage cards, 14 result cards, complete SUPPORT2 and eICU predictions, Hub, Massive Public Data, single-model surface, training surface, validation, archive and preserved prior functions.

### SUPPORT2 regression

Workflow:

**HealthSolver 0.53.1 Code Audit SUPPORT2 Smoke**

Final forward-compatible run:

`37948788794`

Result:

**PASS**

All SUPPORT2-specific numerical and semantic assertions remain intact.

### Full static release audit

Workflow:

**HealthSolver 0.54.1 Full Static Release Audit**

Final run:

`37948841279`

Result:

**PASS**

Verified:

- git fsck;
- JavaScript parsing;
- predictive JSON parsing;
- 24 pre-eICU model/report artifacts frozen byte-for-byte;
- eICU 0.54.0 numerical/semantic core freeze;
- registry 0.54.1;
- eICU metadata remediation;
- packaging/version invariants.

An earlier remediation-run failure occurred only because one packaging grep still expected literal `0.54.0`; all substantive checks in that run had already passed. The corrected assertion passed.

### Published release

Repack workflow:

**HealthSolver 0.54.1 Scientific Semantics Remediation Repack**

Run:

`37948579445`

Result:

**PASS**

Public GitHub Pages metadata now reports:

- version: 0.54.1;
- predictive model count: 14;
- `eicu_demo_hospital_death_integrated = true`;
- `eicu_semantics_remediation = true`.

Published-release verification:

**HealthSolver Published Release Smoke**

Final run:

`37948893741`

Result:

**PASS**

Verified public registry/model/UI parity with `main`.

The immediately preceding published-smoke run occurred during Pages propagation and failed before the repacked 0.54.1 files were visible. The post-propagation PASS supersedes it.

### Independent reproduction

Workflow:

**HealthSolver 0.54 eICU Independent Reproduction**

0.54.1 rerun:

`37948951702`

Result:

**PASS**

The workflow re-downloaded the source data and reproduced the frozen model numerical core while also requiring eICU model version 1.0.1 and the GCS consistency metadata.

## Audit conclusion

After remediation, no known blocking defect remains in the active HealthSolver 0.54.1 browser release or its eICU Database #11 integration.

This statement means:

- software integrity and tested runtime behavior are qualified;
- model-development reproducibility is verified;
- numerical artifacts are frozen;
- known timepoint/leakage semantics are explicit.

It does **not** mean:

- clinical validation;
- external validation of the eICU model;
- prospective validation;
- medical-device approval;
- autonomous diagnosis;
- treatment/triage authorization.

## Next-development gate

Database #12 / HealthSolver 0.55.0 may start only from this 0.54.1 remediation baseline.

The one-database-per-macrostep and full qualification protocol remains mandatory.
