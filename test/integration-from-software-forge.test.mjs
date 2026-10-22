import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {gitProposalFromSoftwareForge} from "../src/from-software-forge.mjs";

const sha="a".repeat(40), b="b".repeat(40), c="c".repeat(40);
const fixture=()=>({
  softwareCandidateInput:{
    synthesis:{
      kind:"signcraft.semioticSynthesis.v1",
      admissionLevel:"counterfactual",object:"source-change",
      requirements:["source-reviewed"],exclusions:[],
      complete:true,openRequirements:[],violatedExclusions:[],
      searchTruncated:false,statesExplored:1,steps:[],
      continuationEnergy:0,projectedReadings:[],note:"hypothetical"
    },
    signcraftSource:{repository:"red-cup-engineering/signcraft",commitSha:sha,exportPath:"./inference/generate"},
    workRef:"ni:///sha-256;original-work",
    artifact:{path:"src/qualified.mjs",content:"export const tested = true;\n",
      producer:{repository:"red-cup-engineering/computer-code-engineering-services-section",commitSha:b,
        sourceRef:"actual-source-produced-artifact"}}
  },
  target:{repository:"red-cup-engineering/forge-consumer",branch:"integration/source",
    expectedBranchSha:c,expectedBlobSha:null,message:"Propose original source change"}
});
test("original Software Forge is imported and Git Forge preserves its actual content digest",()=>{
  const x=fixture(),before=structuredClone(x),out=gitProposalFromSoftwareForge(x);
  assert.equal(out.kind,"git-forge.source-proposal.v1");
  assert.equal(out.workRef,x.softwareCandidateInput.workRef);
  assert.equal(out.git.path,x.softwareCandidateInput.artifact.path);
  assert.equal(out.git.content,x.softwareCandidateInput.artifact.content);
  assert.equal(out.git.contentSha256,createHash("sha256").update(out.git.content).digest("hex"));
  assert.equal(out.git.expectedBranchSha,c);
  assert.deepEqual(out.effects,[]);
  assert.equal(out.effectAuthority,"not-admitted");
  assert.deepEqual(x,before);
});
test("an opposed or incomplete real upstream construction is a refused proposal",()=>{
  const x=fixture();x.softwareCandidateInput.synthesis.complete=false;
  x.softwareCandidateInput.synthesis.openRequirements=["source-reviewed"];
  const result=gitProposalFromSoftwareForge(x);
  assert.equal(result.kind,"git-forge.refusal.v1");
  assert.equal(result.original.kind,"software-forge.refusal.v1");
  assert.equal(result.code,"UPSTREAM_CANDIDATE_REFUSED");
  assert.deepEqual(result.effects,[]);
});
test("upstream source path and producer validation still refuse, not self-authorize",()=>{
  const x=fixture();x.softwareCandidateInput.artifact.path=".github/workflows/run.yml";
  assert.throws(()=>gitProposalFromSoftwareForge(x),/source-authored code artifact/u);
  const y=fixture();y.softwareCandidateInput.artifact.producer.commitSha="not-a-sha";
  assert.throws(()=>gitProposalFromSoftwareForge(y),/source-authored code artifact/u);
});
