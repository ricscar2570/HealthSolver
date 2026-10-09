# HealthSolver 0.54 — eICU Demo Hospital Death Integration + Predictive-First UI

**HealthSolver** is a browser-based clinical reasoning research application designed to structure complex clinical information and support transparent, evidence-aware analysis.

> **Research software only.** HealthSolver is not a medical device, does not provide a clinical diagnosis, does not prescribe treatment, and must not be used as a substitute for qualified medical judgement.

## Live application

**GitHub Pages:**  
https://ricscar2570.github.io/HealthSolver/

The current public build is deployed from the `gh-pages` branch and corresponds to **HealthSolver 0.54.0**.

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

The repository also contains historical backend, Docker and experimental components from earlier generations of HealthSolver. They should not be confused with the current browser-based 0.53 application.

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

## Predictive Engine 0.40 — Multi-Outcome

HealthSolver 0.40 expands the first predictive release into a multi-model browser engine with a versioned registry and three independently trained supervised models.

### 1. HS-UCI-HD-001 — angiographic heart disease

- Dataset: UCI Heart Disease (UCI ID 45, CC BY 4.0)
- Task: heart-disease presence (>50% diameter narrowing) versus absence within the supported UCI domain
- Features: 13
- Test set: 61 / 303 total records
- AUROC: **0.895**
- AUPRC: **0.904**
- Accuracy: **0.836**
- Sensitivity: **0.750**
- Specificity: **0.909**
- Brier score: **0.128**

### 2. HS-UCI-CKD-001 — chronic kidney disease

- Dataset: UCI Chronic Kidney Disease (UCI ID 336, CC BY 4.0)
- Task: CKD versus not-CKD within the supported UCI domain
- Features: 14
- Test set: 80 / 400 total records
- AUROC: **0.998**
- AUPRC: **0.999**
- Accuracy: **0.975**
- Sensitivity: **1.000**
- Specificity: **0.933**
- Brier score: **0.025**

### 3. HS-UCI-BC-001 — breast FNA malignancy pattern

- Dataset: UCI Breast Cancer Wisconsin (Diagnostic) (UCI ID 17, CC BY 4.0)
- Task: malignant versus benign FNA-derived feature pattern within the supported WDBC domain
- Features: 10 mean nuclear features
- Test set: 114 / 569 total records
- AUROC: **0.975**
- AUPRC: **0.965**
- Accuracy: **0.921**
- Sensitivity: **0.857**
- Specificity: **0.958**
- Brier score: **0.060**

### Multi-model browser behavior

The public browser application now loads a versioned predictive registry, lets the user select the predictive task, dynamically builds the corresponding feature form, performs deterministic local inference, applies held-out Platt calibration, reports missing-value imputation, flags inputs outside the observed training range, shows ranked feature contributions, and withholds a prediction when too many required inputs are missing.

Population-level BRFSS evidence remains separate from model-derived individual research estimates.

All three models are research models only. The reported test metrics are internal held-out measurements from the same dataset family used for development. They are not external or prospective clinical validation.

## Unified Predictive Case Router 0.41

HealthSolver 0.41 adds a unified predictive intake layer above the three-model 0.40 engine.

Instead of requiring the user to choose and complete one model-specific form at a time, the router builds a single combined case form from the union of all currently registered model features. It then:

- measures feature coverage for every registered model in real time;
- marks each model as currently applicable or abstaining;
- applies each model's own missing-data threshold;
- runs all applicable models with one action;
- preserves model-specific imputation, standardization and calibration;
- flags input values outside the observed training range;
- shows the strongest per-feature model contributions;
- reports explicit abstentions for models that do not have enough information;
- keeps every outcome in a separate result card.

The output is intentionally **not** presented as a ranked differential diagnosis. The three probabilities refer to different model tasks and source datasets, are not mutually exclusive, and must not be summed or compared as if they were competing diagnoses.

The original 0.40 model selector remains available as a manual model-specific mode.

## Integrated Predictive UI 0.42

HealthSolver 0.42 removes the separate predictive panels introduced by the 0.40/0.41 experiments and integrates supervised prediction directly into the existing **Expert Mode** page.

The predictive engine now reuses the same clinical dossier already being compiled in HealthSolver. There is no second full case form.

Inside Expert Mode, the section **“Predizione dai dati già inseriti”**:

- automatically reads reusable demographic, cardiovascular and laboratory fields already present in the dossier;
- shows per-model data coverage before inference;
- asks only for specialist fields that are not part of the general dossier;
- keeps a collapsible cardiac specialist supplement for four model-specific variables when needed;
- keeps a collapsible FNA breast specialist supplement for the ten WDBC mean nuclear features;
- executes the registered supervised models from the same page;
- reports model-specific calibrated research probabilities;
- reports explicit abstention when the current dossier is insufficient;
- shows imputed inputs, out-of-domain warnings and strongest model contributions;
- preserves the interpretation rule that probabilities from different model tasks are not a ranked differential diagnosis.

The legacy standalone predictive panel `#hs-pe040` and the standalone unified router `#hs-router041` are removed from the rendered application. The model artifacts and routing logic remain internal services.

A final Playwright browser audit on the live GitHub Pages build verifies that:
- Expert Mode contains exactly one integrated predictive section;
- the legacy 0.40 and 0.41 panels are absent;
- the integrated FNA specialist inputs can be completed;
- the `HS-UCI-BC-001` model runs successfully;
- a numeric predictive percentage is rendered inside Expert Mode.

## Predictive-First UI 0.43

HealthSolver 0.43 makes supervised prediction a primary, visually prominent function of Expert Mode rather than a secondary block hidden lower in the dossier.

The predictive area now appears as a large highlighted section titled **“Predizioni cliniche di ricerca”** with:

- a clear **Motore predittivo · HealthSolver 0.43** identity;
- a visible badge showing **3 modelli supervisionati**;
- three large model coverage cards for angiographic heart disease, CKD and breast FNA malignancy;
- a large primary action button: **CALCOLA PREDIZIONI**;
- a separate secondary action to refresh available dossier data;
- specialist cardiac and FNA inputs kept collapsible so the main predictive workflow stays readable;
- a dedicated **Risultati predittivi** area;
- larger numeric probability output when a model runs;
- a visible **PREDITTIVO** badge in the Expert Mode navigation item.

The predictive engine still uses the same dossier already completed in HealthSolver. No second full case form is introduced.

A live Playwright audit verifies that the predictive block is visible, the Expert Mode navigation exposes the predictive badge, all three model cards are present, and the primary predictive CTA is visually large enough to function as a main action.

## UCI HCV Data integration 0.44

HealthSolver 0.44 adds one complete database-level predictive expansion: **UCI HCV Data** (UCI ID 571, DOI `10.24432/C5D612`, CC BY 4.0).

The database provides age, sex and a biochemical liver panel together with supervised outcome categories.

### New predictive model

**HS-UCI-HCV-001 — Pattern epatico HCV / malattia epatica**

Research task:

- negative reference: blood donor;
- positive class: hepatitis / fibrosis / cirrhosis categories;
- ambiguous `suspect blood donor` rows are excluded from model development;
- 12 features: age, sex, albumin, ALP, ALT, AST, bilirubin, cholinesterase, cholesterol, creatinine, GGT and total protein.

Training pipeline:

- total usable records: **608**
- training: **364**
- calibration: **122**
- held-out test: **122**
- training-median missing-value imputation;
- training-set standardization;
- class-balanced logistic regression;
- held-out Platt probability calibration.

Held-out test metrics:

- AUROC: **0.925**
- AUPRC: **0.712**
- Accuracy: **0.918**
- Brier score: **0.078**
- Sensitivity at 0.5 threshold: **0.533**
- Specificity at 0.5 threshold: **0.972**

The modest sensitivity is explicitly retained in the documentation rather than hidden. This model remains a research classifier within the UCI HCV Data domain and is not a clinical HCV diagnosis.

### Browser integration

HealthSolver now exposes **4 supervised predictive models** in the predictive-first Expert Mode:

1. `HS-UCI-HD-001` — angiographic heart disease;
2. `HS-UCI-CKD-001` — chronic kidney disease;
3. `HS-UCI-BC-001` — breast FNA malignant/benign pattern;
4. `HS-UCI-HCV-001` — liver-disease/HCV dataset pattern.

For the HCV model, age and sex are reused from the existing dossier. The ten biochemical values are entered in a collapsible specialist hepatic/HCV panel using the exact units expected by the source dataset, avoiding silent unit conversion from unrelated fields.

A live Playwright test on GitHub Pages verifies that the fourth model is visible, accepts a complete hepatic panel, executes without abstention and renders a numeric probability.

## NHANES 2017–2018 integration 0.45

HealthSolver 0.45 adds a complete database-level integration of the **CDC/NCHS NHANES 2017–2018 public-use files**.

The supervised cohort is built by joining:

- `DEMO_J.XPT` — demographics and MEC sample weights;
- `BMX_J.XPT` — BMI and waist circumference;
- `BPX_J.XPT` — measured systolic blood pressure;
- `TCHOL_J.XPT` — total cholesterol;
- `HDL_J.XPT` — HDL cholesterol;
- `DIQ_J.XPT` — diabetes questionnaire outcome.

### New predictive model

**HS-NHANES-DM-001 — Diabete riferito diagnosticato (NHANES)**

The target is deliberately narrow and explicit:

- positive: adult respondent reports that a doctor told them they have diabetes (`DIQ010=1`);
- negative: respondent reports no doctor-diagnosed diabetes (`DIQ010=2`);
- excluded: borderline diabetes, refused, don't know, age under 20, invalid MEC survey weight.

This is therefore **not a clinical diabetes diagnosis model**. It predicts membership in the NHANES self-reported doctor-diagnosed diabetes group.

Features:

- age;
- sex;
- BMI;
- waist circumference;
- mean systolic blood pressure;
- total cholesterol;
- HDL cholesterol.

Training cohort:

- total usable adults: **5,393**
- training: **3,235**
- calibration: **1,079**
- held-out test: **1,079**

NHANES MEC examination weights (`WTMEC2YR`) are used as sample weights for model fitting, probability calibration and weighted discrimination/calibration metrics. The implementation explicitly notes that this does not reproduce the full complex-survey variance design.

Performance on the held-out test set:

- weighted AUROC: **0.804**
- weighted AUPRC: **0.346**
- weighted Brier score: **0.088**
- calibration-selected decision threshold: **0.105**
- sensitivity at that threshold: **0.858**
- specificity at that threshold: **0.596**
- unweighted accuracy at that threshold: **0.639**

The decision threshold is selected only on the held-out calibration split using the weighted Youden J criterion and is then evaluated once on the independent test split. The calibrated probability itself is unchanged by threshold selection.

### Browser integration

HealthSolver 0.45 exposes **5 supervised predictive models**.

The NHANES model reuses age and sex from the existing dossier and can reuse compatible BMI, waist, systolic blood pressure, total cholesterol and HDL values when available. A collapsible NHANES supplement allows the user to enter those values explicitly in the source-model units when required.

The live GitHub Pages browser audit verifies that `HS-NHANES-DM-001` executes from Expert Mode with complete input and renders a numeric probability without abstention.

## NHIS 2023 integration 0.46

HealthSolver 0.46 adds a third complete database macrostep: **CDC/NCHS NHIS 2023 Sample Adult public-use data**.

### New predictive model

**HS-NHIS-HYP-001 — Ipertensione riferita**

Research task:

- positive class: respondent reports ever being told they had hypertension;
- negative class: respondent reports no such hypertension history;
- ambiguous / refused / not ascertained responses are excluded;
- public-use annual sample weights are used during fitting, calibration and weighted performance metrics.

Model inputs:

- age;
- sex;
- obesity category;
- current smoking;
- self-reported fair/poor general health.

Training cohort:

- total usable adults: **29,471**
- training: **17,682**
- calibration: **5,894**
- held-out test: **5,895**

Held-out test metrics:

- weighted AUROC: **0.810**
- weighted AUPRC: **0.657**
- weighted Brier score: **0.162**
- unweighted sensitivity: **0.818**
- unweighted specificity: **0.632**
- decision threshold: **0.298**, chosen only on the held-out calibration split using the weighted Youden J criterion.

The model predicts membership in the NHIS self-reported hypertension-history group. It does **not** diagnose hypertension from blood pressure measurements.

### Browser integration

HealthSolver 0.46 now exposes **6 supervised predictive models**:

1. HS-UCI-HD-001 — angiographic heart disease;
2. HS-UCI-CKD-001 — chronic kidney disease;
3. HS-UCI-BC-001 — breast FNA malignant/benign pattern;
4. HS-UCI-HCV-001 — liver disease/HCV dataset pattern;
5. HS-NHANES-DM-001 — self-reported doctor-diagnosed diabetes;
6. HS-NHIS-HYP-001 — self-reported hypertension history.

The NHIS inputs are integrated in a collapsible specialist panel inside the same predictive-first Expert Mode. Age and sex are reused from the existing dossier.

A live Playwright test on GitHub Pages verifies published version metadata, six-model availability, NHIS inputs, model execution and numeric probability rendering.

## Full audit remediation 0.47.1

Before starting the next database macrostep, the complete application was audited end to end rather than limiting qualification to the predictive models.

The audit covered:

- repository integrity and syntax across Python, JavaScript, JSON and YAML;
- all seven supervised predictive model artifacts and registry consistency;
- GitHub Pages payload reconstruction and public-asset synchronization;
- Clinical Coach creation, local resume, backup and restore;
- Expert Mode extraction, dossier editing, seven-model prediction and encrypted backup/restore;
- Multi-Model Hub;
- Massive Public Data including BRFSS, openFDA response handling and local FHIR import;
- single-model case, report and archive workflows;
- client-side training and validation exports;
- external frozen-model validation workflow;
- preserved respiratory visit workspace and encrypted browser vault;
- preserved Real Data Laboratory including WDBC classification, training, evaluation, exports, backup/restore, NHAMCS intake surface and external-cohort surface.

### Defects found and remediated

The audit identified real release-quality defects and fixed them before further dataset integration:

1. the separately published predictive registry on GitHub Pages was stale and still exposed only the old three-model registry;
2. the generic published-release smoke workflow was still tied to HealthSolver 0.41;
3. a local `.env` file was tracked and the repository had no `.gitignore`;
4. several legacy FastAPI/CNN/ML paths contained import/runtime defects and missing direct dependencies;
5. the preserved visit iframe could not reliably use its browser-local encrypted vault because sandbox storage permissions were incomplete;
6. the nested preserved Real Data Laboratory iframe lacked `allow-forms`, which meant its visible form buttons could be blocked by the browser, and it also lacked same-origin storage permission required by its local workspace features.

The two sandbox issues were fixed only for trusted embedded HealthSolver srcdoc workspaces; no remote third-party page was granted these permissions.

### Qualification result

Final release gates:

- full static release audit: **PASS**
- predictive-model and registry integrity: **PASS**
- all historical predictive smokes: **PASS**
- full active-app browser E2E: **PASS**
- external validation E2E: **PASS**
- preserved visit/vault E2E: **PASS**
- preserved laboratory full E2E: **PASS**
- GitHub Pages deployment: **PASS**
- published release smoke against the live site: **PASS**

Application release version is **0.47.1**. The predictive registry remains semantically versioned **0.47.0** because no predictive model coefficients, features, datasets or metrics changed in this remediation patch.

## UCI Diabetes 130-US Hospitals integration 0.47

HealthSolver 0.47 adds the UCI **Diabetes 130-US Hospitals for Years 1999-2008** dataset as a complete predictive database macrostep.

### New predictive model

**HS-UCI-DMREADM-001 — Riammissione <30 giorni nel diabete**

This model does **not** predict whether a patient has diabetes. It predicts the research probability of hospital readmission within 30 days among encounters contained in the UCI diabetes hospital dataset.

Dataset:

- UCI ID: 296
- DOI: `10.24432/C5230J`
- license: CC BY 4.0
- total encounters: **101,766**

Model inputs include:

- age band midpoint;
- length of stay;
- number of laboratory procedures;
- number of procedures;
- number of medications;
- previous outpatient visits;
- previous emergency visits;
- previous inpatient admissions;
- number of diagnoses;
- HbA1c result category;
- maximum glucose category;
- diabetes-medication status;
- medication-change status.

Training design:

- training: **61,059**
- calibration: **20,353**
- held-out test: **20,354**
- positive class prevalence: **11.16%**
- class-balanced logistic regression;
- held-out Platt calibration;
- decision threshold selected only on calibration data using Youden J.

Held-out test performance:

- AUROC: **0.640**
- AUPRC: **0.199**
- Brier score: **0.096**
- sensitivity: **0.618**
- specificity: **0.587**

These metrics are intentionally reported without embellishment: this is a substantially harder outcome and the model has only modest discrimination. It remains useful as a research baseline, not as a clinical readmission decision tool.

### Browser integration

HealthSolver 0.47 now contains **7 supervised models** in the Predictive-First Expert Mode.

The readmission model has its own collapsible hospital-episode panel and uses the same global Predictive Engine, registry, calibration, abstention and result-card system.

A live browser audit verifies that the public GitHub Pages build exposes seven models, accepts a complete readmission episode, runs `HS-UCI-DMREADM-001` and renders a numeric probability without abstention.

## UCI Differentiated Thyroid Cancer Recurrence integration 0.48

HealthSolver 0.48 adds one complete database macrostep based on the **UCI Differentiated Thyroid Cancer Recurrence** cohort (UCI ID 915, DOI `10.24432/C5632J`, CC BY 4.0).

The source contains **383 individual patients**, clinicopathologic variables and a recurrence target. UCI documents that the cohort was collected over 15 years and that each patient was followed for at least 10 years.

### New predictive model

**HS-UCI-THYREC-001 — Recidiva carcinoma tiroideo differenziato**

Research task:

- positive class: recurrence in the UCI source;
- negative class: no recurrence;
- the source feature `Response` is **deliberately excluded** from prediction to reduce obvious post-treatment temporal leakage;
- age and sex are reused from the existing HealthSolver dossier;
- the remaining clinicopathologic inputs are entered only in the specialist thyroid panel;
- categorical variables are deterministically one-hot encoded before browser inference.

Raw predictor fields after excluding `Response`: **15**.

Encoded model features: **51**.

Training design:

- total patients: **383**
- training: **229**
- calibration: **77**
- held-out test: **77**
- class-balanced regularized logistic regression;
- held-out Platt calibration;
- decision threshold selected only on the calibration split using Youden J.

Held-out test metrics:

- AUROC: **0.906**
- AUPRC: **0.834**
- Accuracy: **0.844**
- Brier score: **0.102**
- Sensitivity: **0.905**
- Specificity: **0.821**
- decision threshold: **0.208**

These are internal held-out results from the same source cohort. They are not external or prospective clinical validation.

### Browser integration

HealthSolver 0.48 exposes **8 supervised predictive models** in the Predictive-First Expert Mode.

The thyroid recurrence model adds a collapsible specialist section for:

- smoking;
- previous smoking;
- previous radiotherapy;
- thyroid function;
- physical examination;
- adenopathy;
- pathology;
- focality;
- source risk class;
- T;
- N;
- M;
- stage.

Age and sex remain shared dossier fields. The post-treatment `Response` field is not exposed in the UI and is not present among the model predictors.

A live Playwright audit on GitHub Pages verifies that:

- public release metadata report 0.48.0;
- the public predictive registry contains eight models;
- `HS-UCI-THYREC-001` is present;
- the thyroid specialist panel is visible;
- `Response` is absent;
- a complete thyroid case reaches **PRONTO ALLA PREDIZIONE**;
- the model executes without abstention;
- a numeric probability is rendered;
- the result card reports the held-out AUROC.

## UCI Heart Failure Clinical Records integration 0.49

HealthSolver 0.49 adds one complete database macrostep based on **UCI Heart Failure Clinical Records** (UCI ID 519, DOI `10.24432/C5Z89R`, CC BY 4.0).

The source contains **299 patients**, 12 source predictors and the binary target `DEATH_EVENT`. The cohort was collected in 2015 at Faisalabad Institute of Cardiology and Allied Hospital in Faisalabad, Pakistan. All 299 patients had left ventricular systolic dysfunction and previous heart failure classified NYHA III or IV. UCI reports no missing values in the source dataset.

### Leakage control

The source variable `time` is follow-up duration in days. HealthSolver deliberately excludes it from model inputs because using observation duration as a predictor would leak post-index information. Follow-up is variable (4–285 days; mean about 130 days), so the binary classifier does **not** estimate mortality at 30, 90, 365 days or any fixed horizon and is **not** a survival model.

The browser model therefore uses **11 baseline/source clinical variables**:

- age;
- anaemia;
- creatine phosphokinase / CPK;
- diabetes;
- ejection fraction;
- high blood pressure;
- platelets;
- serum creatinine;
- serum sodium;
- sex;
- smoking.

### New predictive model

**HS-UCI-HFDEATH-001 — DEATH_EVENT UCI 519 · insufficienza cardiaca**

Research task:

- positive class: `DEATH_EVENT=1`, death recorded during the source follow-up;
- negative class: `DEATH_EVENT=0`;
- `time` excluded from predictors;
- age and sex reused from the existing dossier;
- compatible creatinine and sodium values may be reused from the dossier;
- remaining source variables are entered in the dedicated heart-failure specialist panel.

Training design:

- total: **299**
- training: **179**
- calibration: **60**
- held-out test: **60**
- class-balanced regularized logistic regression;
- training-derived standardization;
- held-out Platt calibration;
- decision threshold selected only on the calibration split using Youden J.

Held-out test metrics:

- AUROC: **0.744**
- AUPRC: **0.659**
- Accuracy: **0.683**
- Brier score: **0.188**
- Sensitivity: **0.700**
- Specificity: **0.675**
- threshold: **0.300**

These are internal held-out results from the same source cohort. They are not external or prospective clinical validation and must not be presented as a validated heart-failure mortality score.

### Browser integration

HealthSolver 0.49 exposes **9 supervised predictive models** in Predictive-First Expert Mode.

The remediated section **“Insufficienza cardiaca · DEATH_EVENT coorte UCI 519”** makes both leakage control and output semantics visible. It never exposes `time` as an input and explicitly states that the percentage is a source-cohort `DEATH_EVENT` estimate, not a fixed-horizon mortality or survival probability.

The release qualification includes a model-specific smoke test, a live Playwright audit against GitHub Pages, a full static release audit, a published-release synchronization smoke and a complete browser E2E regression audit.

## Scientific Semantics Remediation 0.49.1

HealthSolver 0.49.1 does **not retrain** `HS-UCI-HFDEATH-001`. Coefficients, standardization, imputation, calibration, threshold, split sizes and held-out metrics remain unchanged from 0.49.0.

The remediation adds explicit metadata and UI language for:

- Faisalabad, Pakistan, April–December 2015 source setting;
- two source hospitals;
- left ventricular systolic dysfunction in all 299 patients;
- previous NYHA III–IV heart failure in all 299 patients;
- variable follow-up of 4–285 days, mean about 130 days;
- `DEATH_EVENT` as the binary source label;
- no fixed mortality horizon;
- no censoring/time-to-event modeling;
- no interpretation as a survival probability or general heart-failure mortality-risk score.

## CDC Diabetes Health Indicators integration 0.50

HealthSolver 0.50 adds one complete database macrostep based on **CDC Diabetes Health Indicators** (UCI ID 891, DOI `10.24432/C53919`) derived from the CDC Behavioral Risk Factor Surveillance System.

The processed dataset contains **253,680 survey respondents** and **21 health/demographic indicators**, with no missing values in the distributed table.

### Source and licensing

- UCI external dataset record: CDC Diabetes Health Indicators
- UCI ID: **891**
- DOI: **10.24432/C53919**
- upstream source: **CDC BRFSS**
- current UCI external record: **“See linked dataset for licensing information”**;
- linked processed dataset: reported as **CC0 / Public Domain**;
- CDC BRFSS federal survey data/materials: generally public-domain source material.

HealthSolver retains attribution to **UCI, the linked processed dataset, and CDC BRFSS**. This deliberately avoids treating the UCI external-record page itself as the source of a CC0 grant.

The 0.50 training workflow first uses the UCI interface and includes a public-dataset fallback so a temporary UCI API failure does not prevent reproducible acquisition. The successful release training run used `ucimlrepo:891`.

### Target semantics

New model:

**HS-CDC-DIABIND-001 — Diabete/prediabete · label BRFSS**

The source target is `Diabetes_binary`:

- **0** = no diabetes in the processed source label;
- **1** = **prediabetes OR diabetes combined**.

This distinction is critical.

The model does **not**:

- diagnose diabetes;
- distinguish prediabetes from diabetes;
- predict incident/future diabetes;
- provide a future-risk horizon;
- replace glucose, HbA1c or other diagnostic assessment.

It is a cross-sectional classifier of the source BRFSS-derived label.

Some predictors, including healthcare-use and comorbidity variables, may partly reflect consequences or correlates of already existing disease. For this reason HealthSolver explicitly avoids describing the output as etiologic or prospective diabetes risk.

### Predictors

The model uses all 21 distributed source indicators:

- high blood pressure;
- high cholesterol;
- cholesterol check in the previous five years;
- BMI;
- lifetime smoking threshold (≥100 cigarettes);
- stroke history;
- coronary heart disease / heart attack history;
- physical activity;
- daily fruit intake;
- daily vegetable intake;
- heavy alcohol consumption;
- healthcare coverage;
- inability to see a doctor because of cost;
- general-health rating;
- days of poor mental health;
- days of poor physical health;
- difficulty walking/climbing stairs;
- sex;
- BRFSS age category;
- education;
- income.

Age, sex and BMI are reused from the HealthSolver dossier where definitions are compatible. The remaining survey-domain values are collected in the dedicated CDC/BRFSS panel.

### Training design

- total: **253,680**
- training: **152,208**
- calibration: **50,736**
- held-out test: **50,736**
- positive prevalence: **13.93%**
- regularized class-balanced logistic regression;
- training-only standardization;
- held-out Platt calibration;
- decision threshold chosen only on the calibration partition using Youden J.

Held-out test metrics:

- AUROC: **0.824**
- AUPRC: **0.409**
- Accuracy: **0.694**
- Brier score: **0.099**
- Sensitivity: **0.821**
- Specificity: **0.674**
- threshold: **0.117**

These are internal held-out measurements from the same processed survey dataset, not external or prospective clinical validation.

### Relationship to the existing NHANES diabetes model

HealthSolver now contains two diabetes-related research outputs with materially different semantics:

- **HS-NHANES-DM-001**: self-reported doctor-diagnosed diabetes among NHANES adults;
- **HS-CDC-DIABIND-001**: BRFSS-derived binary label combining **prediabetes + diabetes**.

Their probabilities must not be ranked, averaged, summed or interpreted as estimates of the same clinical endpoint.

### Browser integration

HealthSolver 0.50 exposes **10 supervised predictive models** in Predictive-First Expert Mode.

The new section:

**CDC/BRFSS · diabete/prediabete**

contains the survey-domain inputs and shows the target limitation both before prediction and again on the result card.

## UCI Sepsis Survival Minimal Clinical Records integration 0.51 / audit remediation 0.51.1

HealthSolver 0.51 adds one complete database macrostep based on **Sepsis Survival Minimal Clinical Records** (UCI ID 827, DOI `10.24432/C53C8N`, CC BY 4.0). HealthSolver 0.51.1 is a post-integration scientific-semantics and reproducibility remediation: it does not retrain the model or change its numerical core.

The source package contains three related files:

- **Norwegian primary cohort:** 110,204 admissions from 84,811 hospitalized subjects, 2011–2012;
- **Norwegian study cohort:** 19,051 admissions satisfying the later Sepsis-3-compatible selection and nested inside the primary cohort;
- **South Korean validation cohort:** 137 independent patients, collected 2007–2015.

The study cohort is **not appended** to the primary cohort during training because it is a subset of it.

### Predictors

The source model uses only three admission-level fields:

- age in years;
- sex, source-coded `0=male, 1=female`;
- septic episode number.

HealthSolver reuses age and sex from the common dossier and explicitly converts its own sex encoding to the UCI source encoding. The user supplies only the septic episode number in the dedicated panel.

### Target semantics

The source target is:

`hospital_outcome_1alive_0dead`

with:

- `1 = alive`
- `0 = dead`

HealthSolver inverts this solely for risk-oriented display so that its positive class is **hospital-outcome death**.

The associated publication describes survival/death prediction at approximately **9.351 days after record collection** because **9.351 days is the mean hospital length of stay**. Individual hospital length of stay ranges from **0 to 499 days**. Length of stay is excluded from the predictors because it is strongly related to survival.

HealthSolver 0.51.1 therefore preserves the paper's wording while avoiding a stronger claim than the source supports: 9.351 days is **not treated as a fixed per-patient prediction horizon**. The browser output is presented as the hospital-outcome source label observed over variable hospitalization duration, not as fixed 9-day mortality and not as a time-to-event/survival probability.

### Internal split limitation

The primary cohort contains more admissions than unique subjects. The minimal released table does not expose a patient identifier, so HealthSolver cannot perform a subject-grouped internal split.

The internal train/calibration/test split is therefore **admission-level**. Repeated admissions from the same subject cannot be guaranteed to remain in only one partition.

This limitation is recorded explicitly in the model artifact.

### Training design

Primary cohort only:

- total admissions: **110,204**
- training: **66,122**
- calibration: **22,041**
- held-out internal test: **22,041**
- death prevalence: **7.35%**
- class-balanced regularized logistic regression;
- training-derived standardization;
- held-out Platt calibration;
- threshold selected only on the Norwegian calibration partition using Youden J.

Internal held-out test:

- AUROC: **0.704**
- AUPRC (death-positive): **0.133**
- Accuracy: **0.542**
- Brier: **0.066**
- Sensitivity for death: **0.782**
- Specificity for survival: **0.523**
- threshold: **0.0687**

### Independent external validation

The trained Norwegian model is also applied, without retraining or threshold reselection, to the **137-patient South Korean cohort**.

External results:

- death prevalence: **17.52%**
- AUROC: **0.548**
- AUPRC (death-positive): **0.209**
- Accuracy: **0.664**
- Brier: **0.158**
- sensitivity for death: **0.417**
- specificity for survival: **0.717**

This external discrimination is **weak and close to chance by ROC AUC**.

HealthSolver therefore labels the model:

`WEAK_GENERALIZATION`

and the UI explicitly says not to generalize its probability clinically.

The original Chicco/Jurman paper likewise reported only modest external ROC AUC values when models trained on the Norwegian cohorts were tested on the South Korean validation cohort, despite higher precision-recall values when survival was treated as the positive majority class.

### Browser integration

New model:

**HS-UCI-SEPSISDEATH-001 — Esito ospedaliero · primary cohort infezioni/SIRS/sepsi**

HealthSolver 0.51.1 exposes **11 supervised predictive models** in Predictive-First Expert Mode.

The new section:

**Infezione / SIRS / sepsi · esito ospedaliero**

requires only the septic episode number because age and sex are reused from the common dossier.

Both the specialist panel and the result card display:

- the paper's approximately 9.351-day wording together with the 0–499 day individual LOS range;
- that the mean LOS is not treated as a fixed per-patient horizon;
- not a survival probability;
- external validation n=137;
- external AUROC 0.548;
- explicit weak-generalization warning;
- the distinction between an independent external-dataset evaluation and clinical/prospective validation.

### 0.51.1 audit remediation

The post-release audit found **no numerical model defect**. It did identify three release-quality semantic/reproducibility issues and corrected them:

- the generic result-card sentence could be read as denying the existence of the independently evaluated South Korean cohort; it now says that the **internal metrics** are not clinical/prospective validation, while the sepsis-specific row explicitly identifies the independent external-dataset evaluation and states that it is not equivalent to clinical/prospective validation;
- the primary Norwegian cohort label was too easy to read as “all admissions are Sepsis-3”; 0.51.1 explicitly states that the primary cohort contains infection, SIRS, microbiological-sepsis and septic-shock records under pre-Sepsis-3-era definitions, while the 19,051-admission study cohort is the later Sepsis-3-compatible subset;
- the scientific-Python dependencies were previously unpinned. The reproducible workflow is now pinned to **Python 3.13, NumPy 2.5.3, pandas 3.0.6 and scikit-learn 1.9.1**, the exact environment that independently regenerated the stored model.

The septic-episode input is also constrained to the source-observed range **1–5**.

A fresh independent audit re-downloaded the UCI source package and reproduced the source counts, train/calibration/test split, coefficients, standardization, Platt calibration, threshold, internal metrics and external metrics. The live browser audit additionally verifies the HealthSolver-to-UCI sex conversion in **both directions**: male maps to source 0 and female maps to source 1.

The 0.51.1 static freeze compares the numerical/core fields against the frozen 0.51.0 model and confirms that there is no model drift.

## UCI Myocardial Infarction Complications integration 0.52

HealthSolver 0.52 adds one database macrostep based on **UCI Myocardial Infarction Complications** (UCI ID 579, DOI `10.24432/C53P5M`, CC BY 4.0). The dataset contains **1,700 hospitalized myocardial-infarction records**, **111 input features** and **12 outcome variables**, with missing values in many source fields.

### Target

New model:

**HS-UCI-MIFATAL-001 — Esito letale acuto post-IMA · admission**

The source outcome is `LET_IS`:

- `0` = unknown/alive in the source coding;
- `1` = cardiogenic shock;
- `2` = pulmonary edema;
- `3` = myocardial rupture;
- `4` = progression of congestive heart failure;
- `5` = thromboembolism;
- `6` = asystole;
- `7` = ventricular fibrillation.

HealthSolver maps `LET_IS != 0` to the positive **fatal-outcome source label**. This is not a general-population mortality probability, not a clinically validated mortality score and not a triage cutoff.

Source counts independently verified:

- nonfatal/source 0: **1,429**
- fatal/source 1–7: **271**
- positive prevalence: **15.94%**

### Admission-time leakage policy

UCI documents two intended prediction moments: at hospital admission and on the third hospital day. For the admission model HealthSolver excludes the nine UCI input columns that are only available dynamically after admission:

`93, 94, 95, 100, 101, 102, 103, 104, 105`.

HealthSolver also excludes treatment/medication variables from its compact browser model.

The selected feature set was frozen **before model fitting**, but the exploratory profiling step that preceded the shortlist included descriptive univariate correlations with `LET_IS` on the full dataset. Therefore the feature shortlist was **not fully outcome-blind**. The held-out test remains separate from fitting, calibration and threshold selection, but it is not fully independent of feature-screening knowledge; internal performance may consequently be optimistic and is treated as exploratory until external validation.

The compact set contains 21 admission-time variables:

- age and sex;
- prior MI count;
- exertional-angina history and functional class;
- recent coronary-heart-disease status;
- essential and symptomatic hypertension;
- chronic heart-failure history;
- systolic and diastolic pressure at ICU admission;
- pulmonary edema at ICU admission;
- cardiogenic shock at ICU admission;
- paroxysmal atrial fibrillation at admission/pre-hospital stage;
- ventricular fibrillation at admission/pre-hospital stage;
- right-ventricular MI;
- potassium;
- sodium;
- leukocyte count;
- ESR;
- symptom/CHD-attack-to-hospital time category.

No feature was added or removed in response to held-out test performance after the 21-feature shortlist was frozen.

Shock, pulmonary edema and arrhythmias present at admission are retained because UCI explicitly defines them as admission/pre-hospital variables. They are strong baseline severity markers and are conceptually close to several eventual lethal causes, so the model must **not** be interpreted causally.

### Training

Pinned environment:

- Python **3.13**
- NumPy **2.5.3**
- pandas **3.0.6**
- scikit-learn **1.9.1**

Split:

- total: **1,700**
- training: **1,020**
- calibration: **340**
- held-out test: **340**

Model:

- class-balanced regularized logistic regression;
- training-only median imputation;
- training-only standardization;
- held-out Platt calibration;
- threshold selected only on calibration data using Youden J.

Held-out test:

- AUROC: **0.826**
- AUPRC: **0.582**
- Brier: **0.098**
- accuracy at the calibration-selected threshold: **0.559**
- sensitivity for fatal outcome: **0.907**
- specificity for nonfatal outcome: **0.493**
- threshold: **0.0921**

The threshold deliberately reflects the calibration-set Youden operating point and favors sensitivity. It is **not a clinical intervention or triage cutoff**. Because the exploratory shortlist was informed by full-dataset profiling, the AUROC/AUPRC and other internal held-out metrics should not be presented as a clean external validation result.

### Independent reproduction

The release model is independently reproducible from the UCI `MI.data` file. A separate workflow re-downloads the source and reproduces:

- source dimensions and `LET_IS` distribution;
- the exact predeclared 21-feature policy;
- deterministic train/calibration/test split;
- training medians and missingness;
- standardization;
- logistic coefficients;
- Platt calibration;
- Youden threshold;
- held-out metrics and confusion matrix.

### Browser integration

HealthSolver 0.52 exposes **12 supervised models** in Predictive-First Expert Mode.

The new panel:

**Infarto miocardico acuto · esito letale sorgente**

reuses compatible dossier fields for age, sex, blood pressure, sodium and potassium and exposes source-specific admission fields for the remaining predictors. The result card explicitly identifies the output as the `LET_IS` source label and warns that the threshold is not a triage cutoff.

## SUPPORT2 integration 0.53

HealthSolver 0.53 adds one complete database macrostep based on **SUPPORT2**, a multicenter cohort of **9,105 seriously ill hospitalized adults** from **five U.S. academic medical centers**. The cohort spans study periods 1989–1991 and 1992–1994 and includes major diagnostic groups such as acute respiratory failure/MOSF with sepsis, COPD, CHF, cirrhosis, coma and cancer.

### Source and permission

The data are distributed by the Vanderbilt University Department of Biostatistics as `support2.csv`. The Vanderbilt dataset page explicitly grants permission to anyone wishing to use the datasets, asks users to cite the original paper and to acknowledge the Vanderbilt/hbiostat.org source.

Primary release source:

- https://hbiostat.org/data/
- `support2csv.zip`

UCI also exposes an external SUPPORT2 record (dataset 880), but HealthSolver records Vanderbilt/hbiostat.org as the actual download and permission source.

### Target

New model:

**HS-SUPPORT2-HOSPDEATH-001 — SUPPORT2 · decesso intraospedaliero · day 3**

Target:

`hospdead`

- 0 = survived hospitalization;
- 1 = death in hospital.

Source distribution:

- survived hospitalization: **6,745**
- died in hospital: **2,360**
- prevalence of hospital death: **25.92%**

This is a source in-hospital outcome label. It is **not** 30-day or 90-day mortality and it is not a survival probability.

### Time index

The SUPPORT prognostic work used diagnosis, age, days in hospital before study entry and physiologic measurements recorded on **study day 3**. HealthSolver therefore labels this model explicitly as a **day-3/baseline hospital-outcome classifier**, not an admission-time model.

### Split-first protocol

The 0.53 development protocol fixes the split before any data-driven feature screening:

- training: **5,463**
- calibration: **1,821**
- untouched held-out test: **1,821**

Only the training partition is used to inspect missingness and derive numeric imputations.

Unlike the exploratory MI 0.52 shortlist, SUPPORT2 feature selection uses source semantics and training-partition missingness only; **no target association from calibration/test or full-dataset outcome profiling is used to choose the 0.53 feature set**.

### Predictor policy

The browser model uses **16 raw clinical variables**, encoded into **25 numeric model features**:

- age;
- sex;
- SUPPORT diagnosis group;
- number of comorbidities;
- SUPPORT coma score day 3;
- day in hospital at study entry;
- diabetes;
- dementia;
- cancer status;
- mean arterial pressure day 3;
- white blood cell count day 3;
- heart rate day 3;
- respiratory rate day 3;
- temperature day 3;
- creatinine day 3;
- sodium day 3.

HealthSolver deliberately excludes:

- `death`, `slos`, `d.time`;
- charges and costs;
- average TISS days 3–25;
- 2-month functional outcome;
- SUPPORT and APACHE physiology scores (`sps`, `aps`);
- precomputed SUPPORT survival probabilities (`surv2m`, `surv6m`);
- physician survival estimates (`prg2m`, `prg6m`);
- DNR variables;
- race, income and education;
- high-missing auxiliary physiologic fields not needed by the compact browser model.

Race, income and education are excluded for portability/fairness rather than because of their outcome association.

### Training

Pinned environment:

- Python **3.13**
- NumPy **2.5.3**
- pandas **3.0.6**
- scikit-learn **1.9.1**

Model:

- class-balanced regularized logistic regression;
- training-only numeric median imputation;
- training-only standardization;
- deterministic one-hot encoding for sex, disease group and cancer status;
- held-out Platt calibration;
- decision threshold selected on calibration only using Youden J.

Held-out test metrics:

- AUROC: **0.819**
- AUPRC: **0.622**
- Brier: **0.142**
- Accuracy: **0.738**
- Sensitivity for hospital death: **0.769**
- Specificity for hospital survival: **0.727**
- threshold: **0.243**

These are internal held-out measurements from the historical SUPPORT cohort, not contemporary external clinical validation.

### Independent reproduction

A separate release workflow re-downloads `support2csv.zip` from hbiostat.org and reproduces the source counts, split, encoding, numeric imputation, standardization, coefficients, calibration, threshold and final test metrics.

### Browser integration

HealthSolver 0.53 exposes **13 supervised predictive models**.

The new panel:

**SUPPORT2 · decesso intraospedaliero · stato clinico giorno 3**

reuses only compatible age and sex from the common dossier. All SUPPORT2 day-3 physiologic values — including heart rate, creatinine and sodium — must be entered explicitly in the SUPPORT2 panel so generic measurements from another timepoint cannot be substituted.

Both the panel and result card state that:

- the index is study day 3;
- the target is `hospdead`;
- there is no fixed 30/90-day horizon;
- prior prognostic scores and predictions are excluded;
- race/income/education are not predictors;
- performance is an internal historical validation only.

## eICU Collaborative Research Database Demo integration 0.54

HealthSolver 0.54 adds database macrostep **#11** using the open-access **eICU Collaborative Research Database Demo v2.0.1** from PhysioNet (DOI `10.13026/4mxk-na84`, Open Data Commons ODbL 1.0).

The source demo contains **2,520 ICU unit stays from 1,841 unique patients**. HealthSolver defines its development cohort before model fitting as the first ICU stay of each hospital admission (`unitvisitnumber=1`), a known hospital-discharge outcome, and an available `apacheApsVar` first-APACHE-day row. This yields **2,004 hospital admissions from 1,713 unique patients**, with **173 hospital deaths** and **1,831 survivors**.

### Target and time index

New model:

**HS-EICU-DEMO-HOSPDEATH-001 — eICU Demo · decesso ospedaliero · first APACHE day**

Target:

`hospitalDischargeStatus`

- `Alive` = negative class;
- `Expired` = positive class.

The prediction index is the **end of the first APACHE day**, i.e. the first 24 hours after ICU admission. Physiologic predictors are source-defined worst values from that first APACHE day. The model is therefore **not an admission-time model**, not 24-hour mortality, not 30/90-day mortality and not a survival probability.

### Patient-disjoint split

Because the demo contains repeat encounters, HealthSolver does not randomly split individual ICU rows. It uses a deterministic **StratifiedGroupKFold** assignment grouped by `uniquePID`, so the same patient can never occur in more than one development partition:

- training: **1,200** admissions, 103 deaths;
- calibration: **402** admissions, 35 deaths;
- untouched test: **402** admissions, 35 deaths.

### Compact first-day feature policy

The browser model uses 11 raw clinical inputs encoded into 12 numeric model features:

- age, including the eICU `> 89` top-code represented by a separate indicator;
- sex;
- GCS total and whether GCS was unscorable because of medication;
- temperature;
- respiratory rate;
- heart rate;
- mean arterial pressure;
- glucose;
- sodium;
- creatinine.

The feature set was declared from source semantics and **training-partition missingness**, without feature/outcome association screening. High-missingness urine, WBC and BUN were excluded. HealthSolver also excludes APACHE/acute-physiology scores, predicted mortality/LOS, actual outcome fields, discharge fields, hospital identifiers, diagnosis text, ethnicity, and intervention flags such as ventilation/intubation/dialysis.

Only age and sex can be reused from the generic dossier. All first-APACHE-day physiology must be entered explicitly in the eICU panel, preventing accidental substitution with measurements from an incompatible timepoint.

### Held-out research metrics

On the patient-group-disjoint test partition:

- AUROC: **0.8225**
- AUPRC: **0.3517**
- Brier score: **0.0693**
- accuracy at the calibration-selected threshold: **0.8159**
- sensitivity for hospital death: **0.6571**
- specificity for hospital survival: **0.8311**
- threshold: **0.09266**

These are internal research metrics on the open demo dataset, **not external, prospective or clinical validation**.

### Reproducibility

The 0.54 workflow verifies the PhysioNet checksums and license, uses a pinned scientific-Python stack, and independently re-downloads the source in a second workflow that reproduces the cohort, patient-group split, training medians, standardization, coefficients, Platt calibration, threshold and held-out metrics.

HealthSolver 0.54 exposes **14 supervised predictive models** in the Predictive-First Expert Mode.

### 0.54.1 semantic remediation

A post-release audit identified two non-numerical issues and one provenance ambiguity:

- the eICU panel previously allowed a numeric GCS together with “GCS non valutabile per farmaci”; eICU source semantics make those states mutually exclusive, so the runtime now ignores/disables numeric GCS when medication makes GCS unscorable;
- stale README deployment text still referred to 0.53.1/13 models and an older SUPPORT2 fallback policy; both are corrected;
- PhysioNet's demo landing page describes the sample as selected from 20 larger hospitals, while the distributed v2.0.1 `patient.csv.gz` and `hospital.csv.gz` inspected by HealthSolver contain 186 distinct `hospitalid` values. Because those two source descriptions conflict, HealthSolver does not use or advertise a hospital-count claim for this model. Hospital identifiers are excluded from prediction.

The model coefficients, preprocessing, calibration, decision threshold and held-out metrics are unchanged from 0.54.0.

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

The 0.53.1 audit gate verified repository integrity, Python compilation, legacy React bundling/linting, isolated Python tests, default and optional legacy API behavior, CORS, PACS timeout handling, fail-closed CNN/EHR invariants, dashboard regressions, predictive numerical-core freeze and SUPPORT2 runtime wiring. The current 0.54.1 qualification additionally covers eICU source/checksum verification, patient-disjoint development splits, independent model reproduction, eICU semantic edge cases, full static freeze of earlier model artifacts, live browser behavior and public-assets-vs-`main` parity.

## GitHub Pages deployment

The public application is deployed at:

https://ricscar2570.github.io/HealthSolver/

The current deployment uses the native GitHub Pages pipeline and publishes the qualified **0.54.1** Research Edition with the 14-model predictive registry, eICU Demo integration, SUPPORT2 remediation and Predictive-First UI.

The release pipeline preserves the verified standalone payload, and the published-release smoke test compares the public registry, every public predictive model artifact and the integrated predictive UI against the authoritative files on `main`.

## Repository structure

This repository contains several generations of HealthSolver.

Important areas include:

- `checkpoints/` — release and verification records;
- `.github/workflows/` — public-data acquisition and processing workflows;
- `gh-pages` branch — deployed browser application;
- historical backend/frontend/Docker components — retained for project history and experimentation.

For the current public Research Edition, the release checkpoints and the `gh-pages` deployment are the authoritative references.

## Current release

**HealthSolver 0.54.1 — Scientific Semantics Remediation / eICU Demo Hospital Death Integration / Predictive-First UI / Multi-Outcome Predictive Engine / Clinical Coach Research Edition**

The current predictive release is represented by the 0.54.1 scientific-semantics remediation built on the frozen 0.54.0 eICU checkpoint and 0.53.1 remediation baseline, the Predictive-First Expert Mode UI, the versioned predictive registry and **fourteen** supervised model artifacts under `predictive/`.

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
