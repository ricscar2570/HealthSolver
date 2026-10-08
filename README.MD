# HealthSolver 0.39 — Predictive Engine + Clinical Coach Research Edition

**HealthSolver** is a browser-based clinical reasoning research application designed to structure complex clinical information and support transparent, evidence-aware analysis.

> **Research software only.** HealthSolver is not a medical device, does not provide a clinical diagnosis, does not prescribe treatment, and must not be used as a substitute for qualified medical judgement.

## Live application

**GitHub Pages:**  
https://ricscar2570.github.io/HealthSolver/

The current public build is deployed from the `gh-pages` branch and corresponds to the HealthSolver 0.39 line.

## What HealthSolver does

HealthSolver guides the user through the construction of a structured clinical case and helps organise the information that may affect interpretation.

The Clinical Coach can progressively collect and reason over:

- symptoms and symptom characteristics;
- medical history and risk factors;
- vital signs;
- laboratory results;
- clinical findings and observations;
- medications and relevant drug information;
- missing information that could materially change interpretation;
- longitudinal visit information;
- structured evidence from supported public datasets.

The application then produces a structured research-oriented analysis of the case, including differential considerations, evidence summaries, uncertainty, missing-data prompts and provenance-aware supporting information.

HealthSolver is designed to make its reasoning inputs visible rather than presenting an unexplained black-box answer.

## Browser-based architecture

The current Research Edition is designed to run directly in the browser.

For the deployed GitHub Pages build:

- no AWS backend is required;
- no local server is required;
- no Docker installation is required;
- the main application can be opened directly from the public web page;
- core application state, backup and recovery workflows are handled client-side;
- large static resources are packaged for browser delivery.

The repository also contains historical backend, Docker and experimental components from earlier generations of HealthSolver. They should not be confused with the current browser-based 0.38 application.

## Clinical Coach

The Clinical Coach is the guided case-entry layer of HealthSolver.

Instead of forcing the user to complete a large form all at once, it accompanies the user through the case and helps identify clinically relevant gaps.

Current capabilities include structured collection of:

- demographics and context;
- chief complaint;
- symptom onset, duration and evolution;
- associated symptoms;
- past medical history;
- family and social history;
- risk factors;
- vital signs;
- laboratory values;
- physical or observational findings;
- medications;
- additional information still needed.

The Coach is intended to improve completeness and consistency of the case representation before downstream analysis.

## Clinical Intelligence

HealthSolver includes a Clinical Intelligence layer that combines structured case data with local clinical knowledge and supported external/public evidence sources.

The goal is not to output a definitive diagnosis. The system is designed to help answer questions such as:

- Which findings support or weaken a diagnostic hypothesis?
- Which clinically relevant data are missing?
- Which alternative explanations should still be considered?
- Which evidence comes from the current case and which comes from population-level datasets?
- How strong or weak is the available evidence?
- Where is uncertainty still high?

## Massive Public Data layer

HealthSolver 0.38 expands the research evidence layer with large, freely available healthcare datasets.

### CDC BRFSS

The 2024 Behavioral Risk Factor Surveillance System public-use dataset is processed as population-level evidence.

Current pipeline:

- **457,670 real survey interviews processed**
- weighted prevalence/association evidence
- stratification by age, sex, BMI, smoking and exercise
- nine supported self-reported/history targets
- **10,579 embedded weighted evidence cells**

BRFSS data are used strictly as population survey evidence.

They are **not individual diagnostic probabilities**.

### CMS DE-SynPUF

HealthSolver includes support for the CMS DE-SynPUF synthetic Medicare dataset.

Current compact research pack includes:

- **116,352 synthetic beneficiaries**
- **66,773 inpatient claims**
- **790,790 outpatient claims**
- **5,552,421 prescription drug events**

These records are synthetic and must not be interpreted as observations from real identifiable patients.

### openFDA / FAERS

HealthSolver can optionally query openFDA for drug-related evidence.

Privacy design:

- the query is optional;
- only an explicitly entered drug name is transmitted;
- the endpoint is restricted to `https://api.fda.gov`;
- the clinical case itself is not uploaded as part of that query.

FAERS reports do **not** establish causality, incidence or personal risk.

### Synthea / FHIR

HealthSolver supports bounded local import of compatible Synthea/FHIR Bundle data.

Imported information is mapped into the application only after explicit user action.

### Additional public-data pipelines

The repository also contains research workflows for additional freely available sources and extraction experiments, including:

- NHANES;
- UCI datasets;
- chronic kidney disease datasets;
- eICU-related research preparation;
- CMS synthetic claims pipelines;
- multi-year BRFSS processing.

Availability of a workflow in the repository does not imply that every source is embedded in the public browser build.

## Predictive Engine 0.39

HealthSolver 0.39 adds its first supervised predictive model that runs directly in the browser.

**HS-UCI-HD-001** is a calibrated logistic model trained from the UCI Heart Disease dataset (UCI ID 45, CC BY 4.0) to estimate the research probability of angiographic heart-disease presence (>50% diameter narrowing) versus absence within the dataset's feature domain.

The model uses 13 documented clinical/exercise-test features and a deterministic pipeline with training-median imputation, training-set standardization, logistic regression and held-out Platt calibration. The browser engine displays the estimated probability, major model contributions, missing/imputed inputs, model/version metadata and an abstention result when more than three required features are missing.

Held-out test metrics recorded for v1: AUROC 0.895, AUPRC 0.904, accuracy 0.836, sensitivity 0.750, specificity 0.909 and Brier score 0.128 (n=61 test records; total dataset n=303).

These are software/research performance measurements, not clinical validation. No prospective or external clinical validation is claimed.

## Machine learning and predictive research

HealthSolver is being developed toward a broader machine-learning research architecture in which structured symptoms, history, vital signs, laboratory data and observations can be used as model inputs.

A strict distinction is maintained between:

1. deterministic clinical logic;
2. population-level evidence;
3. synthetic data;
4. experimentally trained models;
5. clinically validated predictive models.

HealthSolver must not describe an experimental or population-derived score as a validated individual medical prediction.

Clinical validation remains a separate future milestone.

## Data provenance

A central design principle is provenance.

HealthSolver attempts to preserve the distinction between:

- information entered by the user;
- locally stored reference knowledge;
- population evidence;
- synthetic datasets;
- live external evidence queries;
- model-derived output;
- inferred or missing information.

This separation is important because these sources have very different evidential meanings.

## Privacy model

The public Research Edition is primarily browser-based.

The architecture is designed to minimise unnecessary transmission of case data.

External requests are restricted to explicitly supported operations. For example, the optional openFDA integration transmits the explicitly requested drug term rather than the complete clinical case.

Users should nevertheless avoid entering personally identifiable health information into experimental research software unless they have independently assessed the privacy implications for their use case.

## Backup and recovery

HealthSolver includes application-state backup and recovery functionality.

The recovery path is part of the automated qualification suite so that a structured case or research session can be exported and subsequently restored.

## Quality and qualification status

The HealthSolver 0.38 checkpoint records the following successful qualification results:

- **321 Python checks PASS**
- **30 recovery checks PASS**
- **369 JavaScript TAP checks PASS**
- browser differential suite: **64 PASS**
- Clinical Intelligence browser suite: **24 PASS**
- Clinical Coach browser suite: **32 PASS**
- visit workflow browser suite: **50 PASS**
- real-lab browser suite: **43 PASS**
- web-lab browser suite: **34 PASS**
- massive-public-data browser suite: **20 PASS**
- installed-wheel checks: **44 PASS**
- HTTP/SQLite checks: **26 PASS**
- static sanity: **PASS**
- release verifier: **PASS**
- `git fsck`: **PASS**
- packaged working tree: **CLEAN**

The standalone HTML recorded for the 0.38 checkpoint has SHA-256:

`c1bef787551183db369643036e9fc9a7f64ddec515ad804066b9a37279df6b68`

These are software qualification results. They are **not clinical validation**.

## GitHub Pages deployment

The public application is deployed at:

https://ricscar2570.github.io/HealthSolver/

The 0.38 deployment uses the native GitHub Pages pipeline and a chunked static payload.

The loader verifies the reconstructed standalone application against its expected SHA-256 before launch.

## Repository structure

This repository contains several generations of HealthSolver.

Important areas include:

- `checkpoints/` — release and verification records;
- `.github/workflows/` — public-data acquisition and processing workflows;
- `gh-pages` branch — deployed browser application;
- historical backend/frontend/Docker components — retained for project history and experimentation.

For the current public Research Edition, the release checkpoints and the `gh-pages` deployment are the authoritative references.

## Current release

**HealthSolver 0.39 — Predictive Engine v1 / Massive Public Data / Clinical Coach Research Edition**

Current predictive release is represented by the 0.39 checkpoint and the `HS-UCI-HD-001` model artifact under `predictive/`.

The active development baseline is `main`; the older `macrostep/v0.38.0-massive-public-data` branch remains as the completed 0.38 milestone.

## Safety and research boundary

HealthSolver currently makes **no claim of**:

- clinical validation;
- regulatory approval;
- medical-device certification;
- autonomous diagnosis;
- treatment recommendation authority;
- triage authorization;
- validated individual disease-risk prediction.

Population associations must not be converted into patient-specific probabilities without an appropriate validated model.

Synthetic records must not be represented as real-world patient observations.

Adverse-event reports must not be interpreted as proof of drug causality.

The application is intended for software research, education, structured reasoning experiments and development of future clinical decision-support methods.

## Roadmap

Major next-stage work includes:

- expansion and normalization of public clinical datasets;
- larger supervised-learning research datasets;
- reproducible feature engineering;
- model training and benchmarking;
- calibration and uncertainty analysis;
- external validation datasets;
- prospective validation methodology;
- stronger explainability and provenance reporting;
- formal privacy/security review;
- clinical expert evaluation;
- regulatory assessment if the project is ever moved toward real clinical use.

## Project status

HealthSolver is under active development.

The current goal is to explore how far a fully browser-based application can go in combining structured clinical case collection, transparent reasoning, population evidence and machine-learning research while keeping the distinction between **research output** and **validated clinical decision support** explicit.

---

**Author:** Riccardo Scaringi  
**Repository:** https://github.com/ricscar2570/HealthSolver  
**Live application:** https://ricscar2570.github.io/HealthSolver/
