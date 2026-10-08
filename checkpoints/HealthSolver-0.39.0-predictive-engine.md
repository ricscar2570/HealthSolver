# HealthSolver 0.39.0 — Predictive Engine v1

Date: 2026-10-08.

## Release goal
Convert HealthSolver from a reasoning-only research application into a functioning predictive research engine while preserving the complete 0.38 browser application.

## New predictive capability
- Model ID: `HS-UCI-HD-001`
- Version: `1.0.0`
- Dataset: UCI Heart Disease (UCI ID 45)
- DOI: `10.24432/C52P4X`
- License: CC BY 4.0
- Task: binary research prediction of angiographic heart-disease presence (>50% diameter narrowing) versus absence in the supported UCI feature domain.
- Features: 13 documented UCI clinical/exercise-test variables.
- Model: logistic regression after training-median imputation and training-set standardization.
- Calibration: Platt scaling fitted on a held-out calibration split.
- Browser inference: local, deterministic JavaScript.
- Abstention: prediction withheld if more than 3 required features are missing.
- Explainability: ranked per-feature log-odds contributions.
- Population BRFSS evidence remains separate and is not converted into individual probabilities.

## Data split
- Total records: 303
- Training: 181
- Calibration: 61
- Test: 61

## Held-out test metrics
- AUROC: 0.8950216450
- AUPRC: 0.9042968121
- Accuracy: 0.8360655738
- Sensitivity: 0.7500000000
- Specificity: 0.9090909091
- Brier score: 0.1276478585
- Confusion matrix: TN 30, FP 3, FN 7, TP 21

## Software qualification
- Predictive training workflow: PASS
- JavaScript syntax smoke: PASS
- Model integrity smoke: PASS
- Deterministic inference smoke: PASS
- GitHub Pages native deployment: PASS

## Deployment
- Public URL: https://ricscar2570.github.io/HealthSolver/
- Pages release metadata: 0.39.0
- Pages commit: `f565b3690d555c59286c6014f16f035ef07b6ec0`
- Base 0.38 standalone payload SHA-256 remains verified before launch:
  `c1bef787551183db369643036e9fc9a7f64ddec515ad804066b9a37279df6b68`
- 0.39 overlays the predictive engine on the verified 0.38 application without discarding previous Clinical Coach / Massive Public Data functionality.

## Research boundary
This is a functioning predictive model and probability engine, but it is not clinically validated for patient care. The available test set is small and comes from the same UCI dataset family used for model development. No external or prospective validation is claimed. Output must be interpreted as research software output, not diagnosis, triage, or treatment advice.

## Next macrostep
0.40 should add multiple supervised clinical outcome models plus a model registry and unified Predictive Engine selection layer, leaving a complete working release at the end.
