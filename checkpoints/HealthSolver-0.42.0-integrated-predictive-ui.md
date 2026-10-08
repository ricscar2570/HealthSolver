# HealthSolver 0.42.0 — Integrated Predictive UI

Date: 2026-10-08.

## Release goal
Remove the separate predictive interfaces introduced by the 0.40/0.41 experiments and integrate supervised prediction into the existing HealthSolver main user experience.

## UX architecture
HealthSolver 0.42 keeps the existing sidebar and main application structure.

Prediction is now integrated directly into:
- **Expert Mode**
- DOM host: `#page-intelligence`

The rendered predictive block:
- DOM id: `#hs-predictive-integrated`
- heading: **Predizione dai dati già inseriti**
- message: HealthSolver reuses the existing Expert Mode dossier and does not require a second complete case form.

Legacy standalone interfaces are removed from the rendered application:
- `#hs-pe040` — removed
- `#hs-router041` — removed

Their underlying model logic and artifacts remain available internally.

## Dossier reuse
The integrated engine automatically reuses compatible fields already entered in Expert Mode / Clinical Coach, including available:
- age and sex;
- blood pressure;
- cholesterol and glucose;
- cardiac exercise/test fields;
- kidney/laboratory values.

Specialist-only features that do not belong naturally to the general dossier remain collapsible supplements rather than creating a second case workflow.

### Cardiac specialist supplement
Four fallback fields are available only when equivalent Expert Mode data are not already present:
- chest-pain type;
- resting ECG;
- ST-segment slope;
- thal status.

### Breast FNA specialist supplement
The ten WDBC mean nuclear features are exposed in a collapsible specialist section for the breast FNA model.

## Predictive models
The release retains the three supervised research models:
- `HS-UCI-HD-001` — angiographic heart disease;
- `HS-UCI-CKD-001` — chronic kidney disease;
- `HS-UCI-BC-001` — breast FNA malignant/benign feature pattern.

Registry:
`predictive/model-registry-v2.json`

Models and registry remain embedded in the standalone browser payload to avoid runtime fetch dependency.

## Published build
GitHub Pages:
https://ricscar2570.github.io/HealthSolver/

Published metadata:
- version: `0.42.0`
- release: `Integrated Predictive UI + Multi-Outcome Predictive Engine + Clinical Coach Research Edition`
- payload parts: 7
- standalone source SHA-256:
  `cfbe0077d25f2e61f2ecc34dc93a4f0bd600635767c9326f512134f3db287eb4`
- predictive modules embedded: true
- integrated predictive UI: true

## Qualification
Existing model gates after integration:
- HealthSolver 0.39 Predictive Smoke: PASS
- HealthSolver 0.40 Multi-Outcome Smoke: PASS
- HealthSolver 0.41 Unified Router Smoke: PASS
- Integrated predictive UI repack: PASS
- GitHub Pages native deployment: PASS

Final live browser audit:
- legacy 0.40 panel absent: PASS
- legacy 0.41 router absent: PASS
- Expert Mode navigation available: PASS
- integrated predictive section is inside Expert Mode: PASS
- integrated predictive section visible: PASS
- single-dossier UX message present: PASS
- specialist FNA section available: PASS
- `HS-UCI-BC-001` executed from the integrated UI: PASS
- numeric predictive percentage rendered inside Expert Mode: PASS
- screenshot capture: PASS

Final audit workflow:
`HealthSolver 0.42 Final Integrated UI Audit`

Successful run:
`37805233875`

## Research boundary
0.42 is an interface-integration and workflow release. It does not change the clinical-validation status of the models.

All probabilities remain experimental model-specific research estimates within their source-dataset domains. They are not a clinically validated diagnosis, triage decision, treatment recommendation, or regulatory-approved medical-device output.

Probabilities from different models must not be added or interpreted as mutually exclusive competing diagnoses.

## Next macrostep
Before 0.43 development, audit the complete 0.42 live release first. Any future predictive expansion should preserve the single-dossier integrated UX rather than introducing a separate predictive application surface.
