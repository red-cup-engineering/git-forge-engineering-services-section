import {forgeSourceCandidate} from "@red-cup-engineering/software-forge-services-section/source-candidate";
import {gitForgeSourceProposal} from "./source-proposal.mjs";

/** Use the ORIGINAL upstream source maker; never recast a refusal as a Git move. */
export function gitProposalFromSoftwareForge({softwareCandidateInput,target,sourceSelection}) {
  const candidate=forgeSourceCandidate(softwareCandidateInput);
  if (candidate.kind!=="software-forge.source-candidate.v1")
    return Object.freeze({kind:"git-forge.refusal.v1",code:"UPSTREAM_CANDIDATE_REFUSED",
      original:candidate,effects:Object.freeze([])});
  return gitForgeSourceProposal({candidate,target,sourceSelection});
}
