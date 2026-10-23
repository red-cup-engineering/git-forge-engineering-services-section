import {synthesizeForgeSource} from "@red-cup-engineering/software-forge-services-section/signcraft-source";
import {gitForgeSourceProposal} from "./source-proposal.mjs";

/**
 * Actual SignCraft construction -> Software Forge -> Git Forge.
 * SignCraft's counterfactual reading, code producer assertion and Git target
 * still do not grant a GitHub/host effect. The native GitHub owner must
 * independently receive source, standing and authorized Work.
 */
export function synthesizeGitForgeProposal({softwareSynthesis,target}) {
  const candidate=synthesizeForgeSource(softwareSynthesis);
  if (candidate.kind!=="software-forge.source-candidate.v1") {
    return Object.freeze({kind:"git-forge.refusal.v1",
      code:"UPSTREAM_SIGNCRAFT_CONSTRUCTION_REFUSED",
      original:candidate,effects:Object.freeze([])});
  }
  return gitForgeSourceProposal({candidate,target});
}
