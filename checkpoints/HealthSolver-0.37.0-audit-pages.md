# HealthSolver 0.37.0 — Post-release audit + GitHub Pages staging

Date: 2026-10-08.

Original complete Clinical Coach release:
- source commit: 1e4152a79f0501777b8cd11d0643746523594da2
- tag: v0.37.0-clinical-coach
- standalone HTML SHA256: b2d83af82efe7998f1ef98bd0ba903fba29d7026ce216dd3ac7e393fda87feb8

Local audit remediation:
- commit: 9bf55e6ff82d002a4b35d347fa30432cdf20ddaf
- tag: v0.37.0-audit1
- application HTML unchanged byte-for-byte.

Audit remediation fixes release engineering only:
- standalone http_smoke repository-layout detection and dynamic VERSION;
- wheel_smoke dynamic installed version + /coach checks;
- CI dynamic wheel path and all current JS suites;
- Kubernetes image 0.37.0 instead of stale 0.28.0;
- OpenAPI/release metadata updated to 0.37.0;
- audit regression test guarding CI wheel selection.

Post-remediation checks:
- Python 315 PASS
- recovery 30 PASS
- JavaScript 368 PASS
- Coach browser 32 PASS
- Clinical Intelligence browser 24 PASS
- differential complete browser 64 PASS
- wheel smoke 40 PASS
- standalone HTTP/SQLite smoke 26 PASS
- static sanity / manifests / release verifier / YAML parsing PASS
- git fsck exit 0 (historical dangling tag objects only; no corruption)

GitHub Pages:
- branch pages/healthsolver-0.37 contains verified loader under site/
- branch gh-pages contains the same loader under docs/
- 5 compressed payload chunks reconstruct the exact 0.37 HTML
- gzip SHA256: 8d5b13440c1dd9204bf83336902871f620f26dab5de77204908c98974f90e55f
- GitHub Actions payload verification reconstructed 11,976,475 bytes and exact source SHA.
- deployment Action could not configure Pages because Pages is currently disabled in repository settings.
- current connector does not expose the repository Pages administration operation.

One-time manual Pages setting:
Settings -> Pages -> Build and deployment -> Source: Deploy from a branch -> Branch: gh-pages -> Folder: /docs -> Save.
Expected URL: https://ricscar2570.github.io/HealthSolver/

Research Edition only. No clinical validation, diagnosis/treatment/triage authorization, RBAC professional deployment or medical-device approval.
