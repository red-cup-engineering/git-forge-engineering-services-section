# Forge work processing: requirements

Processing the Group's open pull requests and issues (merging, rebasing, closing, labelling) is decided by
deterministic rules over evidence of each item's state. This document states what that processing must satisfy.
It lives in Git Forge because the decision logic is forge-neutral: GitHub is one forge adapter, and a local forge
is the target of record.

The current implementation is in [red-cup-engineering/github-engineering-services-section](https://github.com/red-cup-engineering/github-engineering-services-section)
(`scripts/process-pull-requests.mjs`, `scripts/process-issues.mjs`, `src/pull-request-*.mjs`, `src/issue-processor.mjs`)
and runs from [red-cup-engineering/pull-request-processor-runner](https://github.com/red-cup-engineering/pull-request-processor-runner).

## Requirements

| ID | Requirement | Status (2026-11-01) |
| --- | --- | --- |
| FWP-1 | An item is merged, rebased, closed or changed only by evidence of its own state: its content against its base, its checks against its base's checks, its links. Elapsed time never decides. | Met. |
| FWP-2 | Processing starts from events: an item or a base changing, checks completing, or a previous run's own effects. No timer, schedule or poll starts it. | Partly met. Each run that changes something starts the next, until a run changes nothing. Checks completing in a private repository start nothing yet. |
| FWP-3 | A read of open items finishes while other actors change them: keyset pagination by creation time, never offsets. | Met. |
| FWP-4 | Git work uses objects only, with no working tree. There is one object store per repository per run, fetched blobless, and the run removes it on completion, failure or interruption. | Met for rebase (`git merge-tree`, `git commit-tree`, `git cherry`). |
| FWP-5 | Every tool removes the temporary state it creates when it is done. Temporary state lives under the owning section's `data/state/temporary-state/`, in a directory named for what it holds. | Met by the processors and `absorb-github-repository`. |
| FWP-6 | Processing reduces load, not relocates it: it does only the work a change requires, never re-tests a tree already proven, and holds one copy of each input. | Not met. Pull requests are verified by full CI suites, some on the Bare Cedar Fog self-hosted runner. Affected-only testing and a result cache keyed by tree are not built. |
| FWP-7 | Processing works disconnected from the Web: the forge of record is local, GitHub is a mirror, and the same decision logic runs against either through one forge interface. | Not met. The decision logic reads pull-request state through GitHub's API only. The forge interface belongs in this section, with GitHub as one adapter. |
| FWP-8 | A real conflict, which no rule can resolve honestly, is named on the item with its exact paths and left for a producer. | Met. On 2026-11-01 the 84 conflicting paths sampled from four organizations were mostly source files, `package.json`, `SKILL.md` and READMEs. No file-type merge rule would resolve them honestly. |

## Sources

- Leader, 2026-11-01: "I *hate* - as a rule - HATE arbitrary timers." (FWP-1, FWP-2)
- Leader, 2026-11-01: "We need tools to remove what they create when they're done with it if it's not data we need to keep around" and "Temporary state is ... meant to go under data/state/temporary-state/". (FWP-5)
- Leader, 2026-11-01: "Why are we continuing to accept disc-choking technologies?" (FWP-4)
- Leader, 2026-11-01: "Ideally, we'll stop running behind on CI/CD on this box not by distributing the load elsewhere, but by reducing the load by architecting better systems. We ideally would eventually like all this to work disconnected from the Web." (FWP-6, FWP-7)
- Rules `machine-work-runs-as-mape-k-loops-not-clocks` and `host-storage-reclaims-itself` (561-group/internal-services-section).
