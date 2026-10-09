# HealthSolver 0.56.0 — Common-Outcome Transport Layer

**Date:** 2026-10-09  
**Status:** QUALIFIED RESEARCH-SOFTWARE BASELINE — WEAK TRANSPORT GENERALIZATION  
**Base predictive registry:** 0.54.1 · 14 models preserved  
**New layer:** HS-COMMON-HOSPDEATH-TRANSPORT-001

## Purpose

HealthSolver 0.56 tests whether a genuinely common hospital-outcome model can be built across already-integrated public cohorts without pretending that heterogeneous model probabilities are directly combinable.

The result is deliberately kept separate from the 14-model registry and from the 0.55 Ensemble Intelligence Layer.

## Source cohorts

The reproducible build re-downloads and harmonizes:

- UCI Sepsis Survival primary cohort;
- SUPPORT2;
- eICU Collaborative Research Database Demo.

Complete-case rows used:

- UCI Sepsis Survival: 102,389;
- SUPPORT2: 9,105;
- eICU Demo: 1,995.

Shared target: in-hospital death / expired versus survived hospitalization / alive.

The target has no fixed common time horizon and the cohorts have different inclusion criteria and index semantics.

## Predictor intersection

The only clean common predictors across all three released source cohorts are:

- age;
- sex.

No synthetic cross-model feature matrix is constructed. The 14 HealthSolver probabilities cannot be stacked because the source datasets do not contain the simultaneous raw inputs needed to compute all 14 model outputs on the same patients.

## Training protocol

- deterministic source-stratified 60/20/20 train/calibration/test partitions;
- equal total source weight during pooled fitting and calibration;
- weighted standardization learned on training only;
- logistic regression, C=0.5, lbfgs;
- Platt calibration on held-out calibration data;
- Youden-J threshold on source-balanced calibration data;
- held-out pooled test;
- per-source held-out test;
- leave-one-source-out transport evaluation.

Pinned runtime:

- Python 3.13;
- NumPy 2.5.3;
- pandas 3.0.6;
- scikit-learn 1.9.1.

## Final model parameters

Threshold: 0.14233116231535944.

Pooled source-balanced held-out test:

- AUROC: 0.5785998749545924;
- AUPRC: 0.16767510528385526;
- Brier: 0.12006046347312191;
- accuracy: 0.5363809567490218;
- sensitivity: 0.5793207084673112;
- specificity: 0.5293320136634281.

## Leave-one-source-out transport

When each source is held out entirely:

- eICU Demo unseen: AUROC 0.6778431825176977;
- UCI Sepsis unseen: AUROC 0.6688269057480055;
- SUPPORT2 unseen: AUROC 0.5298120390496412.

Minimum LOSO AUROC: **0.5298120390496412**.

This triggers the explicit qualification:

**WEAK_TRANSPORT_GENERALIZATION**

The SUPPORT2 result is close to random discrimination. The model therefore remains a methodological research baseline and must not be described as a validated hospital-mortality score.

## Browser integration

The Expert Mode predictive page now shows a separate:

**COMMON-OUTCOME TRANSPORT · 0.56**

section with:

- a large experimental model output;
- the internal research threshold;
- source-balanced pooled AUROC;
- minimum leave-one-source-out AUROC;
- explicit WEAK_TRANSPORT_GENERALIZATION warning;
- per-source LOSO metrics;
- explanation that this is not a stacker over the 14 base probabilities.

The page continues to show exactly 14 base model result cards. The 0.55 Ensemble Intelligence section remains unchanged and separate.

## Regression guarantees

The 14 base predictive models remain in registry version 0.54.1 and are not retrained or modified by 0.56.

Historical regression suites for HCV, NHANES, NHIS, diabetes readmission, thyroid recurrence, heart failure, CDC diabetes indicators, sepsis, myocardial infarction, SUPPORT2, eICU and the 0.55 ensemble remained green after the UI integration.

## Qualification gates

Passed:

- source re-download and full 0.56 rebuild;
- static artifact audit;
- 0.56 transport numerical smoke;
- 0.56 packaging audit;
- GitHub Pages 0.56 deployment;
- published release parity smoke;
- live Playwright browser audit;
- preservation of 14 base result cards;
- preservation of 0.55 Ensemble Intelligence;
- navigation regression across Coach, Hub, Massive Public Data, Case, Data, Validation, Archive and Previous Functions;
- no serious browser errors.

Representative live browser state for age 65 / male test input:

- model output: 0.13681797946682636;
- internal threshold: 0.14233116231535944;
- state: below threshold;
- qualification: WEAK_TRANSPORT_GENERALIZATION.

## Hard boundaries

This layer is:

- not a medical device;
- not clinically validated;
- not a general patient-specific mortality probability;
- not a fixed-horizon survival model;
- not a diagnostic, treatment or triage score;
- not a stacker over the fourteen HealthSolver probabilities.

## Release conclusion

HealthSolver 0.56 demonstrates that a technically valid common-outcome cross-dataset model can be built from the currently integrated datasets, but also demonstrates why the available common feature intersection is too weak for robust universal transport.

The scientific result is therefore a **qualified negative/limited result**, not a failed implementation: the software works, the validation works, and the validation correctly shows that the model should not be promoted beyond research use.
