/**
 * One Git-specific effect-FREE proposal boundary. Software Forge owns source
 * candidate admission, provenance replay, SignCraft synthesis and Code bytes.
 * Git Forge owns only the selected Git target and its exact revision guards;
 * GitHub provider admission and writes remain with GitHub Engineering.
 */
import {qualifyForgeSourceCandidate} from "@red-cup-engineering/software-forge-services-section/source-candidate";
import {retainedCarrier} from "@red-cup-engineering/signcraft/cell";

const SHA=/^[0-9a-f]{40}$/u;
const REPO=/^[a-z0-9][a-z0-9.-]*\/[a-z0-9][a-z0-9._-]*$/u;
const REF=/^(?!\/|.*\.\.|.*\/\.)(?!.*\.lock(?:\/|$))[A-Za-z0-9][A-Za-z0-9._\/-]{0,199}$/u;
const named=x=>typeof x==="string"&&x.trim()!==""&&x.length<=512&&!/[\u0000-\u001f\u007f]/u.test(x);
const only=(x,names)=>x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).every(k=>names.includes(k));

/** Receive source under an ORIGINAL independently selected Work/SignCraft/Code
 * producer/digest. A candidate may NOT supply its own sourceSelection, and
 * successful replay does not assert source authentication or a GitHub grant.
 * The exact Git target is checked and retained by the original SignCell data
 * carrier; executable getters never run here either. */
export function gitForgeSourceProposal({candidate,target,sourceSelection}) {
  const original=qualifyForgeSourceCandidate(candidate,sourceSelection);
  const gitTarget=retainedCarrier(target);
  if (!only(gitTarget,["repository","branch","expectedBranchSha","expectedBlobSha","message"]) ||
      !REPO.test(gitTarget.repository??"") || !REF.test(gitTarget.branch??"") ||
      gitTarget.branch.endsWith("/") || !SHA.test(gitTarget.expectedBranchSha??"") ||
      !(gitTarget.expectedBlobSha===null || SHA.test(gitTarget.expectedBlobSha??"")) ||
      !named(gitTarget.message) || gitTarget.message.length>240)
    throw new TypeError("exact named Git source and immutable expected revision required");

  return retainedCarrier({
    kind:"git-forge.source-proposal.v1",
    workRef:original.workRef,
    source:{
      signcraft:original.signcraft.source,
      codeProducer:original.artifact.producer
    },
    git:{repository:gitTarget.repository,branch:gitTarget.branch,
      expectedBranchSha:gitTarget.expectedBranchSha,
      expectedBlobSha:gitTarget.expectedBlobSha,
      path:original.artifact.path,content:original.artifact.content,
      contentSha256:original.artifact.contentSha256,message:gitTarget.message},
    status:"proposal-only",
    sourceReceiving:"unverified",
    effectAuthority:"not-admitted",
    installedGitConsumer:"not-observed",
    effects:[]
  });
}
