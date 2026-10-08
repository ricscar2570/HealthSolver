# HealthSolver 0.43.0 — Predictive-First Integrated UI

Date: 2026-10-08.

## Release goal
Make predictive functionality visually obvious, large and primary inside the existing HealthSolver interface, without creating a separate application or a second full case form.

## UX changes
HealthSolver 0.43 keeps prediction inside Expert Mode and changes the information hierarchy:

- prominent title: **Predizioni cliniche di ricerca**
- visible release identity: **Motore predittivo · HealthSolver 0.43**
- visible badge: **3 modelli supervisionati**
- three large model-coverage cards:
  - cardiopatia angiografica
  - malattia renale cronica
  - malignità su caratteristiche FNA
- large primary CTA: **CALCOLA PREDIZIONI**
- secondary action: **Aggiorna dati disponibili**
- dedicated **Risultati predittivi** section
- large percentage output for successful model inference
- specialist cardiac and FNA inputs remain collapsible
- Expert Mode navigation now carries a **PREDITTIVO** badge

## Model architecture
No predictive model was changed in this release. The same three supervised artifacts remain active:

- HS-UCI-HD-001
- HS-UCI-CKD-001
- HS-UCI-BC-001

The release changes prominence and usability, not the model mathematics.

## Dossier integration
The predictive engine continues to reuse the same Expert Mode / Clinical Coach dossier.

There is no second complete predictive case form.

General clinical data are reused automatically; only model-specific specialist fields that are not already available remain optional expandable supplements.

## Defect found during qualification
The first 0.43 deployment failed to launch because the repacked loader still checked for the internal marker:

`HS_INTEGRATED_PREDICTIVE_042`

while the 0.43 module used:

`HS_INTEGRATED_PREDICTIVE_043`

The mismatch was corrected in main commit:
`a4d9c88b5f02789c9ccbf4fd9a87e91decee7c1b`

The Pages payload was repacked and redeployed successfully.

## Qualification
- existing 0.39 predictive smoke after UI change: PASS
- existing 0.40 multi-outcome smoke after UI change: PASS
- 0.43 payload repack: PASS
- GitHub Pages native deployment: PASS
- 0.43 Predictive-First live Playwright audit: PASS on attempt 2
- Expert Mode predictive navigation badge present: PASS
- predictive-first block visible: PASS
- title and predictive identity visible: PASS
- 3 supervised-model badge visible: PASS
- three large model coverage cards present: PASS
- primary predictive CTA height >= 50 px: PASS
- primary predictive CTA width >= 180 px: PASS
- screenshots captured from live GitHub Pages: PASS

Successful visual audit workflow:
`HealthSolver 0.43 Predictive-First Visual Audit`

Successful run:
`37813911818`, attempt 2.

## Deployment
Public URL:
https://ricscar2570.github.io/HealthSolver/

Pages deployment commit:
`d837381b3afa694255b78e7e0fa21b446a2244cf`

## Research boundary
The larger UI does not change the scientific status of the predictions.

All outputs remain experimental model-specific research estimates within the source-dataset domains. HealthSolver 0.43 does not claim autonomous diagnosis, treatment recommendation, triage authorization, external prospective clinical validation or regulatory approval.

## UX rule for future releases
Predictive functionality is a first-class HealthSolver capability and must remain:
- clearly labeled;
- visually prominent;
- directly accessible from Expert Mode;
- integrated with the same clinical dossier;
- accompanied by model scope, abstention and interpretation limits.

Future releases must not hide prediction in a secondary technical panel or recreate a separate predictive application surface.
