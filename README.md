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

The original source is merged in `main` as a declared `0.2.0-dev.0` package for `registry.561.group` under the non-default `next` tag; the public native CI does not publish it and requires independent registry receiving before a downstream application selects it. It declares an exact candidate dependency on
`@red-cup-engineering/software-forge-engineering-services-section@0.2.0-dev.0`, but this
declaration is not proof of registry publication, exact compatible installed
bytes, or source-Work receiving. The native dependency-free
`node --test test/source-proposal.test.mjs` covers positive, different and
adverse cases; the cross-package adapter additionally requires the actual
published upstream release. No GitHub Gitlink is reparented until exact
producer and consumer custody has been independently received.

## Independently qualified source and published source-reader consumption

The public Forge native CI exercises the original source pipeline:
Specification Engineering's **merged** architecture-description candidate
JSON Schema (actual original Git commit and schema blob) → original Code maker's
real executable JavaScript generation → SignCraft → Software Forge → Git Forge
→ the **released** GitHub guarded review planner. The entire Specification
schema, not a handwritten pseudorecord, is loaded from its exact Git source
and the resulting JavaScript is imported as a real module. The Git primitive
that authenticates this source is consumed from original registry release
`@red-cup-engineering/git-source-reading-service@0.1.2`, with exact
`pinned-source-files.mjs` content checked against the source-owning
main revision already independently received; a source symlink cannot silently
stand in for the actual published dependency.

The public tests run both as pull-request checks and after landing on main;
they neither publish Git Forge nor execute a GitHub write. The architecture
description is a **candidate**, not a conformant ISO/IEC/IEEE 42010:2022
architecture or formal refinement proof. Current unclosed boundaries remain
the original Code/Forges' exact released package closure, the private GitHub
Engineering effect host and real beneficiary-accepted Work.

Original 561 Group Work:
`ni:///sha-256;N2B0dn3jHK7-wH7j6URwNpu2C0ofnY9zWH6saAYxI7w`.
