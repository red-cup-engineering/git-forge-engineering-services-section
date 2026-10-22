/**
 * A pure Git SOURCE proposal between Software Forge and a provider adapter.
 * This is not a commit/branch, credential grant, PR, approved deployment or
 * executed Git action. Native Git Services owns repository tree mechanics.
 */
import {createHash} from "node:crypto";
const SHA=/^[0-9a-f]{40}$/u;
const REPO=/^[a-z0-9][a-z0-9.-]*\/[a-z0-9][a-z0-9._-]*$/u;
const REF=/^(?!\/|.*\.\.|.*\/\.)(?!.*\.lock(?:\/|$))[A-Za-z0-9][A-Za-z0-9._\/-]{0,199}$/u;
const PATH=/^(?!\/)(?!.*\/\/)[A-Za-z0-9._\/-]+$/u;
const named=x=>typeof x==="string"&&x.trim()!==""&&x.length<=512&&!/[\u0000-\u001f\u007f]/u.test(x);
const only=(x,names)=>x&&typeof x==="object"&&!Array.isArray(x)&&Object.keys(x).every(k=>names.includes(k));

export function gitForgeSourceProposal({candidate,target}) {
  if (!only(candidate,["kind","admission","workRef","signcraft","artifact","receiving","effects"]) ||
      candidate.kind!=="software-forge.source-candidate.v1" ||
      candidate.admission!=="provisional-source-candidate" ||
      !named(candidate.workRef) ||
      !only(candidate.signcraft,["source","construction"]) ||
      candidate.signcraft.construction?.kind!=="signcraft.semioticSynthesis.v1" ||
      candidate.signcraft.construction?.admissionLevel!=="counterfactual" ||
      candidate.signcraft.construction?.complete!==true ||
      candidate.signcraft.construction?.searchTruncated!==false ||
      !Array.isArray(candidate.signcraft.construction?.openRequirements) ||
      candidate.signcraft.construction.openRequirements.length!==0 ||
      !Array.isArray(candidate.signcraft.construction?.violatedExclusions) ||
      candidate.signcraft.construction.violatedExclusions.length!==0 ||
      candidate.signcraft.source?.repository!=="red-cup-engineering/signcraft" ||
      !SHA.test(candidate.signcraft.source?.commitSha??"") ||
      candidate.signcraft.source?.exportPath!=="./inference/generate" ||
      !only(candidate.artifact,["path","content","contentSha256","producer"]) ||
      !named(candidate.artifact.path) || !PATH.test(candidate.artifact.path) ||
      candidate.artifact.path.split("/").some(p=>p==="."||p===".."||p==="") ||
      /^(?:\.git(?:\/|$)|\.github\/(?:workflows|CODEOWNERS|dependabot\.ya?ml)(?:\/|$))/iu.test(candidate.artifact.path) ||
      typeof candidate.artifact.content!=="string" || !candidate.artifact.content.trim() ||
      Buffer.byteLength(candidate.artifact.content)>1_000_000 ||
      !/^[0-9a-f]{64}$/u.test(candidate.artifact.contentSha256??"") ||
      candidate.artifact.contentSha256!==createHash("sha256").update(candidate.artifact.content,"utf8").digest("hex") ||
      !only(candidate.artifact.producer,["repository","commitSha","sourceRef"]) ||
      !REPO.test(candidate.artifact.producer.repository) ||
      !SHA.test(candidate.artifact.producer.commitSha) ||
      !named(candidate.artifact.producer.sourceRef) ||
      !Array.isArray(candidate.effects) || candidate.effects.length!==0)
    throw new TypeError("exact bounded nonauthorizing software forge candidate required");
  if (!only(target,["repository","branch","expectedBranchSha","expectedBlobSha","message"]) ||
      !REPO.test(target.repository??"") || !REF.test(target.branch??"") ||
      target.branch.endsWith("/") || !SHA.test(target.expectedBranchSha??"") ||
      !(target.expectedBlobSha===null || SHA.test(target.expectedBlobSha??"")) ||
      !named(target.message) || target.message.length>240)
    throw new TypeError("exact named Git source and immutable expected revision required");

  return Object.freeze({
    kind:"git-forge.source-proposal.v1",
    workRef:candidate.workRef,
    source:Object.freeze({
      signcraft:Object.freeze({...candidate.signcraft.source}),
      codeProducer:Object.freeze({...candidate.artifact.producer})
    }),
    git:Object.freeze({repository:target.repository,branch:target.branch,
      expectedBranchSha:target.expectedBranchSha,
      expectedBlobSha:target.expectedBlobSha,
      path:candidate.artifact.path,content:candidate.artifact.content,
      contentSha256:candidate.artifact.contentSha256,message:target.message}),
    status:"proposal-only",
    sourceReceiving:"unverified",
    effectAuthority:"not-admitted",
    installedGitConsumer:"not-observed",
    effects:Object.freeze([])
  });
}
