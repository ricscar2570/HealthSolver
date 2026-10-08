# HealthSolver 0.40.0 — Multi-Outcome Predictive Engine

Date: 2026-10-08.

## Release goal
Expand the functioning 0.39 predictive engine into a multi-outcome predictive research system while preserving the complete browser-based Clinical Coach and Massive Public Data application.

## Predictive registry
Registry: `predictive/model-registry-v2.json`
Schema: `healthsolver.predictive_registry.v2`
Registry version: `0.40.0`

### Model 1 — HS-UCI-HD-001
- Dataset: UCI Heart Disease, UCI ID 45, CC BY 4.0
- Task: angiographic heart-disease presence (>50% diameter narrowing) versus absence
- Features: 13
- Total records: 303
- Train / calibration / test: 181 / 61 / 61
- AUROC: 0.8950216450
- AUPRC: 0.9042968121
- Accuracy: 0.8360655738
- Sensitivity: 0.7500000000
- Specificity: 0.9090909091
- Brier: 0.1276478585

### Model 2 — HS-UCI-CKD-001
- Dataset: UCI Chronic Kidney Disease, UCI ID 336, CC BY 4.0
- DOI: 10.24432/C5G020
- Task: CKD versus not-CKD
- Features: 14
- Total records: 400
- Train / calibration / test: 240 / 80 / 80
- AUROC: 0.9980000000
- AUPRC: 0.9988307692
- Accuracy: 0.9750000000
- Sensitivity: 1.0000000000
- Specificity: 0.9333333333
- Brier: 0.0247623221

### Model 3 — HS-UCI-BC-001
- Dataset: UCI Breast Cancer Wisconsin (Diagnostic), UCI ID 17, CC BY 4.0
- DOI: 10.24432/C5DW2B
- Task: malignant versus benign FNA-derived feature pattern
- Features: 10 mean nuclear features
- Total records: 569
- Train / calibration / test: 341 / 114 / 114
- AUROC: 0.9745370370
- AUPRC: 0.9653093931
- Accuracy: 0.9210526316
- Sensitivity: 0.8571428571
- Specificity: 0.9583333333
- Brier: 0.0595773176

## Browser engine
HealthSolver 0.40:
- loads a versioned predictive model registry;
- exposes one model selector;
- dynamically creates the feature form for the selected model;
- performs deterministic local browser inference;
- uses training-median imputation;
- uses training-set standardization;
- applies held-out Platt calibration;
- reports major per-feature log-odds contributions;
- flags input values outside the model training range;
- abstains when too many required features are missing;
- keeps BRFSS population evidence separate from model probability output.

## Audit before macrostep
The complete 0.39 baseline was audited before 0.40 development:
- main / release branch consistency checked;
- training gate PASS;
- predictive smoke PASS;
- GitHub Pages deployment PASS;
- new live HTTP smoke added;
- live 0.39 assets verified PASS.

## 0.40 qualification
- 0.40 multi-outcome training workflow: PASS
- JavaScript syntax gate: PASS
- registry integrity: PASS
- all three model artifacts: PASS
- deterministic inference for all models: PASS
- abstention metadata: PASS
- GitHub Pages native deployment: PASS
- public live HTTP smoke: PASS

## Defect caught during final audit
The first public 0.40 smoke correctly failed because the root Pages loader still displayed the 0.39 identity. The issue was an incorrect version-string replacement in the release update. It was corrected in gh-pages commit:
`a333a6a1ae82842965a258db47cc2eb1e0371c5c`

After redeployment, the published-release smoke was rerun and completed successfully.

## Deployment
Public URL:
https://ricscar2570.github.io/HealthSolver/

Published version metadata: `0.40.0`

The verified 0.38 standalone application remains the immutable base payload:
`c1bef787551183db369643036e9fc9a7f64ddec515ad804066b9a37279df6b68`

The 0.40 predictive layer is loaded on top of that base without removing the previous Clinical Coach, Clinical Intelligence, backup/recovery, visit, laboratory, Massive Public Data, BRFSS, CMS DE-SynPUF, Synthea/FHIR, or openFDA functionality.

## Research boundary
All predictive outputs are experimental research estimates within the domain of their source datasets. The held-out tests are internal splits from the same dataset family used for model development. None of the three models has external or prospective clinical validation. No diagnosis, triage, treatment recommendation, medical-device authorization, or regulatory approval is claimed.

## Next macrostep
Before any 0.41 work, rerun the full release audit. Only after a clean baseline should 0.41 add a materially new working predictive capability.
