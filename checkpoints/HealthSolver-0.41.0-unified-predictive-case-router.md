# HealthSolver 0.41.0 — Unified Predictive Case Router

Date: 2026-10-08.

## Release goal
Add a single-case predictive routing layer above the functioning 0.40 multi-outcome engine, without removing any previous Clinical Coach, Clinical Intelligence, Massive Public Data or manual per-model functionality.

## Baseline audit before development
The complete 0.40 release was re-audited before 0.41 work:
- main and release/v0.40.0-multi-outcome-predictive-engine pointed to the same checkpoint;
- 0.40 multi-outcome smoke: PASS;
- GitHub Pages deployment: PASS;
- published-release HTTP smoke: PASS;
- all three model artifacts and registry were present and consistent.

No unresolved baseline defect was carried into 0.41.

## New functionality
New browser module:
`predictive/unified-case-router.js`

Published as:
`unified-case-router.js`

The router:
- loads the existing versioned registry;
- loads all three predictive models;
- builds one unified feature form from the union of registered model features;
- groups inputs into General, Cardiovascular, Kidney/Laboratory and Breast FNA sections;
- continuously measures per-model feature coverage;
- labels each model as applicable or abstaining;
- applies the model-specific missing-feature threshold;
- runs all currently applicable models in one action;
- retains each model's imputation, training-set standardization and Platt calibration;
- reports missing-value imputation;
- flags feature values outside observed training ranges when metadata is available;
- reports top model contributions;
- produces explicit abstention cards when evidence is insufficient;
- preserves the original 0.40 model-specific selector as an alternative manual mode.

## Registered models
- HS-UCI-HD-001 — angiographic heart-disease research prediction
- HS-UCI-CKD-001 — chronic kidney disease research prediction
- HS-UCI-BC-001 — malignant versus benign breast FNA feature-pattern research prediction

No model was retrained in 0.41; the validated software artifacts from 0.40 are reused unchanged.

## Interpretation rule
The router MUST NOT rank the three output probabilities as a differential diagnosis.

The model tasks are different, use different feature domains and source datasets, and are not mutually exclusive. Probabilities must not be added, normalized across models, or interpreted as competing posterior diagnosis probabilities.

## Qualification
- 0.40 baseline audit: PASS
- existing 0.39 predictive smoke after router addition: PASS
- existing 0.40 multi-outcome smoke after router addition: PASS
- 0.41 JavaScript syntax gate: PASS
- registry coverage test: PASS
- empty-case all-model abstention test: PASS
- complete-case all-model routing test: PASS
- deterministic inference for all models: PASS
- GitHub Pages deployment: PASS
- public live 0.41 HTTP smoke: PASS on rerun after release correction

## Defect caught during final audit
The first published 0.41 smoke failed even though the Pages release metadata and root loader identity were already 0.41.

Root cause:
the new `unified-case-router.js` file had been published, but the loader reconstruction step still injected only `predictive-engine.js`, so the router was not actually loaded into the reconstructed application.

Fix:
gh-pages commit
`4ca863612bc678936f5d68d9fe5970afbd130338`

The loader now injects both:
- `predictive-engine.js`
- `unified-case-router.js`

The corrected deployment completed successfully and the published-release smoke passed on attempt 2.

## Deployment
Public URL:
https://ricscar2570.github.io/HealthSolver/

Published metadata version:
`0.41.0`

Base standalone 0.38 payload remains SHA-256 verified:
`c1bef787551183db369643036e9fc9a7f64ddec515ad804066b9a37279df6b68`

## Research boundary
The unified router improves workflow and model applicability selection. It does not create a clinically validated multi-disease diagnostic engine. Each probability remains an experimental model-specific estimate within the source dataset domain. No external prospective validation, triage authorization, treatment recommendation, regulatory approval or medical-device claim is made.

## Next macrostep
Before any 0.42 work, rerun the full release audit. Only after a clean baseline should the next macrostep add a materially new complete capability.
