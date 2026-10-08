# HealthSolver 0.46.0 — NHIS 2023 Integration

Date: 2026-10-08.

## Macrostep rule
This release is one complete database integration macrostep.

Database integrated:
**CDC/NCHS NHIS 2023 Sample Adult public-use file**

No further database is considered part of this macrostep.

## Baseline audit
Before 0.46 development, HealthSolver 0.45 was already completed with:
- UCI Heart Disease
- UCI CKD
- UCI Breast Cancer Wisconsin Diagnostic
- UCI HCV Data
- NHANES 2017-2018 diabetes model

The 0.45 live browser audit had passed before NHIS development began.

## Source database
- Name: NHIS 2023 Sample Adult public-use file
- Source: CDC/NCHS NHIS
- Public-use: yes
- Download source:
  https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NHIS/2023/adult23csv.zip
- Weight variable: WTFA_A
- Target variable: HYPEV_A

The first NHIS training attempt failed because the initial feature selection expected variables not present in the public adult file.
The pipeline was corrected to use only variables actually available in the 2023 public-use file.

## Predictive model
Model ID:
`HS-NHIS-HYP-001`

Research task:
binary prediction of belonging to the group reporting ever being told they had hypertension versus reporting no such hypertension history.

Positive:
- HYPEV_A=1

Negative:
- HYPEV_A=2

Excluded:
- refused
- not ascertained
- do not know
- invalid annual sample weight

## Features
5 features:
- age
- sex
- obesity category
- current smoking
- fair/poor self-reported general health

## Training design
- total usable adults: 29,471
- training: 17,682
- calibration: 5,894
- held-out test: 5,895
- annual sample weights used during fitting and calibration
- training-median imputation
- training-set standardization
- class-balanced logistic regression
- held-out Platt calibration
- decision threshold selected only on calibration data using weighted Youden J

## Held-out test metrics
- weighted AUROC: 0.8097646832
- weighted AUPRC: 0.6570880217
- weighted Brier score: 0.1622768043
- unweighted accuracy: 0.7019508058
- unweighted sensitivity: 0.8183866607
- unweighted specificity: 0.6316648531
- decision threshold: 0.2975085318
- confusion matrix:
  - TN 2322
  - FP 1354
  - FN 403
  - TP 1816

## Registry
Predictive registry version:
`0.46.0`

Registered models:
1. HS-UCI-HD-001
2. HS-UCI-CKD-001
3. HS-UCI-BC-001
4. HS-UCI-HCV-001
5. HS-NHANES-DM-001
6. HS-NHIS-HYP-001

Published model count:
`6`

## UI integration
HealthSolver 0.46 preserves the Predictive-First Expert Mode.

The NHIS model is integrated in the same dossier workflow.

NHIS-specific inputs:
- age: reused from dossier
- sex: reused from dossier
- obesity: dossier BMI when available, otherwise specialist control
- current smoking: NHIS specialist control
- fair/poor general health: NHIS specialist control

The NHIS specialist controls are contained in:
`#hs46NhisDetails`

The model output is rendered in the common predictive result area with:
- model ID
- numeric probability
- major model contributions
- imputation / domain warnings where applicable
- research-only interpretation boundary

## Qualification
Training:
- first NHIS attempt: FAIL due to unavailable source variables
- corrected NHIS training: PASS

Software gates:
- 0.40 expanded registry smoke: PASS
- 0.44 UCI HCV smoke: PASS
- 0.45 NHANES smoke: PASS
- 0.46 NHIS smoke: PASS
- 0.46 repack: PASS
- GitHub Pages deployment: PASS

Live browser audit:
- published version 0.46.0: PASS
- published predictive model count 6: PASS
- HS-NHIS-HYP-001 present in metadata: PASS
- Expert Mode available: PASS
- six-model badge visible: PASS
- NHIS hypertension coverage visible: PASS
- NHIS specialist section available: PASS
- complete NHIS inputs accepted: PASS
- HS-NHIS-HYP-001 result card rendered: PASS
- numeric probability rendered: PASS
- unexpected abstention with complete input: NO
- screenshots captured from live GitHub Pages: PASS

First live audit attempt:
- FAIL because the automated test tried to interact with controls inside a closed details element and used one outdated field ID.

Corrected live audit:
- opens `#hs46NhisDetails`
- uses exact field IDs
- PASS

Successful live audit run:
`37822185936`

## Deployment
Public URL:
https://ricscar2570.github.io/HealthSolver/

Published version:
`0.46.0`

Latest Pages deployment at time of release:
`605dbd3d666797dc6383b3917784cf842be22537`

Published standalone source SHA-256:
`f9f2ca0fdb77e515b353733a6905c45a5d969bf46afcd20068bd0d11d26add30`

## Research boundary
HS-NHIS-HYP-001 does not diagnose current hypertension.

It predicts membership in a self-reported NHIS history group based on a limited public-use feature set.

It must not be interpreted as a blood-pressure diagnosis, autonomous medical decision, treatment recommendation or triage output.

The use of annual sample weights does not reproduce the full NHIS complex-survey variance design.

## Next database macrostep
Before integrating another database:
1. audit the complete 0.46 release;
2. add only one database in the next macrostep;
3. train and calibrate its new model(s);
4. integrate them into the predictive-first UI;
5. deploy to GitHub Pages;
6. perform a live browser end-to-end audit;
7. update README, checkpoint and release branch before moving on.
