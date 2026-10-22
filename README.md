# git-forge-services-section

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

Groups tooling for git hosting forges. Use when adding or finding integrations with services that host git repositories.

## Source-qualified Git Forge seam

Git Forge is the intermediate **Git-specific source proposal boundary** between
the existing Software Forge package and provider-specific GitHub Engineering.
It does not replace the native Git Services tree/read/write implementation.
The upstream package is explicitly consumed at
`./from-software-forge`; the dependency-free validation is at
`./source-proposal`.

`gitForgeSourceProposal({candidate,target})` takes only a currently typed
`software-forge.source-candidate.v1`, containing a counterfactual SignCraft
construction, one real source-authored code artifact and one original Work
reference. It binds a named Git repository, exact expected branch commit,
optional exact expected blob commit, authoring message and exact code bytes
into `git-forge.source-proposal.v1`.

The result is **not** a branch, commit, executed Run, self-granted approval,
received source, or completed Work. It contains no Git transport method and
has an empty `effects` list. The GitHub Engineering owner independently
qualifies and converts this into the existing
`github.review-call.plan.v1` before its installed, authorized provider
operation may take an effect. A Git provider failing to read the branch, a
source whose SHA has moved, or an unadmitted Office is a held/refused effect.

Current source declares dependency on
`@red-cup-engineering/software-forge-services-section@0.1.0`, but this
declaration is not proof of registry publication, exact compatible installed
bytes, or source-Work receiving. The native dependency-free
`node --test test/source-proposal.test.mjs` covers positive, different and
adverse cases; the cross-package adapter additionally requires the actual
published upstream release. No GitHub Gitlink is reparented until exact
producer and consumer custody has been independently received.

Original 561 Group Work:
`ni:///sha-256;N2B0dn3jHK7-wH7j6URwNpu2C0ofnY9zWH6saAYxI7w`.
