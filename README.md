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

`gitForgeSourceProposal({candidate,target,sourceSelection})` consumes the
**original Software Forge** `qualifyForgeSourceCandidate` operation, not a
second hand-written SignCraft/path/code-digest validator. The original Work,
SignCraft revision, Code producer and candidate content digest must be selected
**independently of the transported candidate** by the actual source/Work
receiver. A candidate cannot vouch for its own source by re-hashing its body.
Git Forge adds only its Git-specific branch/ref, repository, expected source
revision, message and protected-path owner boundary, retaining immutable
`git-forge.source-proposal.v1` bytes through the original SignCell carrier.

The result is **not** a branch, commit, executed Run, self-granted approval,
received source, or completed Work. It contains no Git transport method and
has an empty `effects` list. The GitHub Engineering owner independently
qualifies and converts this into the existing
`github.review-call.plan.v1` before its installed, authorized provider
operation may take an effect. A Git provider failing to read the branch, a
source whose SHA has moved, or an unadmitted Office is a held/refused effect.

The historical merged Git Forge baseline is `0.2.0-dev.0`; this source migration
selects the exact current Software Forge `0.3.0` **source at commit
`d72facf66cd5a841b02c4750b9355ee62a359735`** and SignCraft `0.6.2`.
Its original source CI checks immutable upstream source, executes the real
Code/SignCraft/Forge integration and retains the native published GitHub review
planner. A separate published-closure job must independently install the
registry package and verify its source Git blob against the exact accepted
upstream. A source checkout is not a registered immutable release: the
manifest's requested dependency does not establish a valid installed product,
or authorize replacing the old released dependency in deployed consumers. The native dependency-free
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


## Original source-selection receipt and the publisher gate

The caller of `gitProposalFromSoftwareForge` or `synthesizeGitForgeProposal`
provides a separate `sourceSelection` (original `workRef`, SignCraft
`{repository,commitSha,exportPath}`, artifact `{path,contentSha256,producer}`).
The caller must obtain that exact selection from actual Work, source and Code
custody, not reconstruct it from a potentially tampered candidate.

Both adapters invoke the original Forge source maker and pass the original
selection into the Git source proposal function. Upstream replay, bounds,
receiving-state refusal, artifact identity and inert-carrier checks are not
reimplemented in this package. Git Forge only makes the Git-specific proposal;
a Git source reader, GitHub provider effect, publisher and beneficiary each
retain their separate receiving authority.

The source CI runs the original upstream Git checkout, real package source and
consumer tests and the existing original Code → Specification → Git provider
planner. The second CI job requires **actual published** source-identical
Software Forge package bytes rather than passing a Git checkout as a released
dependency. Until the original publisher qualifies/releases such a distinct
immutable edition and the real installed consumer passes, that job must stay
unreceived and this migration cannot be marked a supported released API.
