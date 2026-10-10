# HealthSolver 0.56.1 — Complete In-App Guide

**Date:** 2026-10-10  
**Status:** QUALIFIED COMPLETE IN-APP GUIDE RELEASE  
**Base predictive registry:** 0.54.1 · 14 supervised models preserved  
**Ensemble:** 0.55 unchanged  
**Common-Outcome Transport:** 0.56 unchanged · WEAK_TRANSPORT_GENERALIZATION  
**Guide:** 1.0.0

## Objective

Add a complete in-application user guide suitable for a person who has never seen or used HealthSolver.

The documentation must explain:

- what the application is and is not;
- the recommended first-use workflow;
- Clinical Coach;
- Expert Mode / Intelligence;
- the fourteen supervised predictions;
- abstention and missing-data behavior;
- Ensemble Intelligence 0.55;
- Common-Outcome Transport 0.56;
- all other application sections;
- correct interpretation of results;
- worked usage examples;
- troubleshooting;
- FAQ;
- glossary;
- quick-reference rules.

## Integrated access points

The guide is available through:

1. a dedicated **Guida completa** navigation item;
2. a persistent floating **? Guida** button;
3. an inline **Apri guida completa** button in the predictive area;
4. a first-visit onboarding prompt.

The onboarding prompt is stored as seen in browser localStorage and is suppressed during automated audit runs.

## Guide structure

The release contains 15 major guide sections, including:

- overview;
- five-minute quick start;
- full workflow;
- Clinical Coach;
- Expert Mode;
- fourteen predictions;
- Common-Outcome Transport;
- Ensemble Intelligence;
- other application areas;
- interpretation;
- examples;
- troubleshooting;
- FAQ;
- glossary;
- quick reference.

The guide also includes:

- internal text search;
- direct buttons from documentation to real application sections;
- responsive mobile behavior;
- tables and semantic reference material;
- multiple step-by-step sequences;
- three or more visual flow diagrams.

## Live screenshots

Eight screenshots were captured automatically from the published HealthSolver 0.56 application with Playwright:

1. Clinical Coach;
2. Expert Mode top;
3. predictive results;
4. Common-Outcome Transport;
5. Ensemble Intelligence;
6. Hub;
7. Validation;
8. Archive.

Source files are preserved in:

`guide/assets/`

The published 0.56.1 standalone payload embeds copies of all eight PNG screenshots as `data:image/png;base64` URIs.

This was necessary because the frozen application CSP allows:

`img-src data:`

and intentionally does not allow same-origin image loading.

The CSP was **not weakened**.

## Embedded documentation architecture

The guide HTML is read from:

`guide/in-app-guide.html`

The interactive loader is:

`guide/in-app-guide.js`

During the Pages repack:

- guide HTML is loaded;
- all eight screenshot paths are replaced with base64 data URIs;
- the resulting complete HTML is injected into `window.__HS_GUIDE_HTML__`;
- the guide loader itself is embedded beside the predictive overlay;
- the public source guide directory is also copied to `gh-pages/guide/` for provenance/parity verification.

The resulting guide therefore does not depend on Fetch API calls and does not require network access for guide text or screenshot rendering after the standalone payload has loaded.

## Defects caught during qualification

### 1. Standalone bootstrap timing

Initial implementation waited for `DOMContentLoaded`.

Because HealthSolver replaces the loader page using `document.open/document.write/document.close`, relying only on a late DOMContentLoaded listener was not sufficiently robust.

Remediation:

- start immediately when `aside` and the main application container already exist;
- otherwise fall back to DOMContentLoaded;
- protect startup with a one-shot boot guard.

### 2. CSP blocked guide Fetch

The initial guide loader attempted:

`fetch('guide/in-app-guide.html')`

The live CSP is:

`default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; worker-src blob:; child-src blob: about:; frame-src about:; connect-src https://api.fda.gov; object-src 'none'; base-uri 'none'; form-action 'none'`

Therefore the guide Fetch was correctly blocked.

Remediation:

- remove runtime guide Fetch;
- embed guide HTML directly in the standalone payload.

### 3. CSP blocked external screenshots

The guide source initially referenced the public PNG paths.

Because `img-src` permits only `data:`, those screenshots could not render in the standalone application.

Remediation:

- preserve the public PNG source files;
- embed their bytes as data URIs in the guide HTML at repack time;
- leave the CSP unchanged.

## Qualification

Final dedicated guide browser audit verifies:

- release metadata 0.56.1;
- guide integration/version flags;
- embedded guide flag;
- embedded screenshot flag;
- guide runtime state;
- 15 guide sections;
- dedicated navigation item;
- floating help button;
- complete guide text;
- flow diagrams;
- step cards;
- FAQ/details;
- reference tables;
- exactly eight screenshots;
- screenshots are data URIs and load successfully;
- meaningful alt text;
- internal search;
- guide-to-application navigation;
- floating-button reopening;
- mobile layout;
- no serious browser errors.

Final result:

`GUIDE_ERRORS []`

`GUIDE_STATE {"loaded":true,"version":"1.0.0","sections":15,"missing_images":[]}`

`HS0561 COMPLETE IN-APP GUIDE PASS`

## Regression and publication

The 0.56 transport smoke remains PASS.

The 0.55 full static audit remains PASS.

The predictive core remains frozen:

- registry 0.54.1;
- 14 base models;
- no changes to model coefficients, calibration, thresholds, preprocessing or model semantics.

Published release parity is PASS after final Pages propagation.

The master release audit is PASS after the guide fixes.

## Release conclusion

HealthSolver 0.56.1 now contains a complete first-user documentation and onboarding system directly inside the application.

The guide is:

- searchable;
- visual;
- screenshot-based;
- workflow-oriented;
- mobile-compatible;
- CSP-safe;
- embedded in the standalone payload;
- separated from the predictive numerical core;
- qualified by dedicated live-browser tests.
