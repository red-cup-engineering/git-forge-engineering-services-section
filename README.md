# @red-cup-engineering/git-forge-engineering-services-section

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

Git-specific, effect-free source proposal boundary downstream of Software Forge and upstream of GitHub Engineering.

Groups tooling for git hosting forges. Use when adding or finding integrations with services that host git repositories.

## Source-qualified Git Forge seam

Git Forge is the intermediate **Git-specific source proposal boundary** between
the existing Software Forge package and provider-specific GitHub Engineering.
It does not replace the native Git Services tree/read/write implementation.
The upstream package is explicitly consumed at
`./from-software-forge`; Git-specific proposal admission is at
`./source-proposal`, using Software Forge qualification and the original
SignCell retained carrier.

`gitForgeSourceProposal({candidate,target,sourceSelection})` consumes the
**original Software Forge** `qualifyForgeSourceCandidate` operation, not a
second hand-written SignCraft/path/code-digest validator. The original Work,
SignCraft revision, Code producer and candidate content digest must be selected
**independently of the transported candidate** by the actual source/Work
receiver. A candidate cannot vouch for its own source by re-hashing its body.
Git Forge adds only its Git-specific branch/ref, repository, expected source
revision and message boundary, retaining immutable
`git-forge.source-proposal.v1` bytes through the original SignCell carrier.
Software Forge retains ownership of artifact and protected-path admission.

The result is **not** a branch, commit, executed Run, self-granted approval,
received source, or completed Work. It contains no Git transport method and
has an empty `effects` list. The GitHub Engineering owner independently
qualifies and converts this into the existing
`github.review-call.plan.v1` before its installed, authorized provider
operation may take an effect. A Git provider failing to read the branch, a
source whose SHA has moved, or an unadmitted Office is a held/refused effect.

## Dependencies and tests

Git Forge depends on two packages, each as a compatible range from
`registry.561.group`: Software Forge, whose candidates it turns into Git
proposals, and SignCell, whose retained carrier holds the proposal. SignCraft
is a development dependency: the tests build a real synthesis with it.

`npm test` runs the three suites that need only those packages:
`test/source-proposal.test.mjs` (positive, different and adverse cases),
`test/integration-from-software-forge.test.mjs` and
`test/native-signcraft-chain.test.mjs`. CI installs the declared dependencies
and runs them on pull requests and on `main`. The tests neither publish Git
Forge nor execute a GitHub write.

## The whole chain, from a specification to a GitHub review plan

`test/native-published-github-planner.test.mjs` exercises the chain end to
end: Specification Engineering's architecture-description candidate JSON Schema
→ the Code maker's JavaScript generation → SignCraft → Software Forge → Git
Forge → GitHub Engineering's guarded review planner. The whole schema is read
from its Git source at an exact commit and the generated JavaScript is imported
as a real module. The architecture description is a **candidate**, not a
conformant ISO/IEC/IEEE 42010:2022 architecture or formal refinement proof.

That test imports GitHub Engineering, the Code maker and the Git source reader,
and reads checkouts of the Specification and Code repositories beside this one.
GitHub Engineering is downstream of Git Forge, so the test belongs at that end
of the chain and is to move there. Until it does, run it here with
`npm run test:github-compatibility` where those packages and checkouts are
present; CI does not run it.

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

Git Forge's own publication, an installed GitHub effect host and beneficiary
Work receiving remain separate boundaries.
