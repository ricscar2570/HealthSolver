# HealthSolver 0.47.0 — UCI Diabetes 130-US Hospitals Readmission Integration

Date: 2026-10-08.

## Macrostep rule
This release integrates exactly one new database:
**UCI Diabetes 130-US Hospitals for Years 1999-2008**.

No additional database is part of this macrostep.

## Baseline audit
Before starting 0.47:
- main and release/v0.46.0-nhis-integration matched;
- published version was 0.46.0;
- published predictive model count was 6;
- the NHIS live browser audit had passed.

## Source database
- UCI ID: 296
- Name: Diabetes 130-US Hospitals for Years 1999-2008
- DOI: 10.24432/C5230J
- License: CC BY 4.0
- Total encounters: 101,766
- Public source:
  https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008

## Predictive task
Model ID:
`HS-UCI-DMREADM-001`

Target:
hospital readmission within 30 days.

Positive:
`readmitted=<30`

Negative:
`readmitted=>30` or `NO`

This model does not predict diabetes diagnosis.

## Features
13 numerical / encoded features:
- age midpoint of UCI decade band
- time in hospital
- number of laboratory procedures
- number of procedures
- number of medications
- previous outpatient visits
- previous emergency visits
- previous inpatient admissions
- number of diagnoses
- abnormal HbA1c category
- abnormal maximum glucose category
- diabetes-medication status
- medication-change status

## Training design
- total encounters: 101,766
- training: 61,059
- calibration: 20,353
- held-out test: 20,354
- positive prevalence: 0.1115991589
- training-median imputation
- training-set standardization
- class-balanced logistic regression
- held-out Platt calibration
- decision threshold selected on calibration data with Youden J
- test data not used for threshold selection

## Held-out metrics
- AUROC: 0.6399775801
- AUPRC: 0.1987235694
- Brier score: 0.0961206186
- accuracy: 0.5908420949
- sensitivity: 0.6179577465
- specificity: 0.5874350183
- threshold: 0.1019151942
- TN: 10,622
- FP: 7,460
- FN: 868
- TP: 1,404

The modest performance is explicitly retained in the release record. The model is a research baseline, not a clinically validated readmission tool.

## Registry
Registry version:
`0.47.0`

Registered models:
1. HS-UCI-HD-001
2. HS-UCI-CKD-001
3. HS-UCI-BC-001
4. HS-UCI-HCV-001
5. HS-NHANES-DM-001
6. HS-NHIS-HYP-001
7. HS-UCI-DMREADM-001

Published model count:
`7`

## UI integration
HealthSolver 0.47 retains the Predictive-First Expert Mode.

A new collapsible section:
`#hs47ReadmDetails`

collects UCI hospital-episode features.

Age is reused from the dossier and converted to the midpoint of the corresponding UCI decade band.

The result is rendered through the same common predictive result system used by all other models.

## Qualification
Training pipeline:
- PASS

Legacy gates after registry expansion:
- base predictive smoke: PASS
- HCV smoke: PASS
- NHANES smoke: PASS
- NHIS smoke: PASS

0.47-specific smoke:
- model artifact: PASS
- registry version/count: PASS
- deterministic inference: PASS
- UI seventh-model references: PASS

Deployment:
- standalone repack: PASS
- GitHub Pages deployment: PASS

Live browser audit:
- version 0.47.0: PASS
- predictive model count 7: PASS
- HS-UCI-DMREADM-001 in metadata: PASS
- Expert Mode available: PASS
- seven-model badge visible: PASS
- readmission coverage card visible: PASS
- readmission specialist panel available: PASS
- complete episode inputs accepted: PASS
- readmission model result card rendered: PASS
- numeric probability rendered: PASS
- unexpected abstention: NO

Live audit workflow:
`HealthSolver 0.47 UCI Diabetes Readmission Live Audit`

## Deployment
Public URL:
https://ricscar2570.github.io/HealthSolver/

Published version:
`0.47.0`

Pages deployment commit:
`c261bdd4f7cce2a121dbc82afd7e0d85931ccff8`

Published standalone source SHA-256:
`f4797f8880f5ee2281ae4cce1fbc1f5eea9164b0f2aa7fe16592bdd1f82aa017`

## Research boundary
This model estimates a dataset-defined 30-day readmission outcome.

It must not be interpreted as:
- a diabetes diagnosis;
- a clinical discharge decision;
- a hospitalization authorization;
- a treatment recommendation;
- a validated individual readmission-risk score for real-world care.

## Next macrostep
Before the next immediately usable database:
1. audit the full 0.47 release;
2. integrate only one new database;
3. release a fully working version;
4. update main and GitHub Pages;
5. perform a live browser audit;
6. update README, checkpoint and release branch before continuing.
