import test from "node:test";
import assert from "node:assert/strict";
import {gitForgeSourceProposal} from "../src/source-proposal.mjs";
const a="a".repeat(40),b="b".repeat(40),c="c".repeat(40);
const input=()=>({
  candidate:{
    kind:"software-forge.source-candidate.v1",admission:"provisional-source-candidate",
    workRef:"ni:///sha-256;original-work",
    signcraft:{source:{repository:"red-cup-engineering/signcraft",commitSha:a,exportPath:"./inference/generate"},
      construction:{kind:"signcraft.semioticSynthesis.v1",admissionLevel:"counterfactual",
        complete:true,searchTruncated:false,openRequirements:[],violatedExclusions:[]}},
    artifact:{path:"src/bridge.mjs",content:"export const bridge=true;\n",
      producer:{repository:"red-cup-engineering/computer-code-engineering-services-section",
        commitSha:b,sourceRef:"fabricator-original"}},
    receiving:{installedConsumer:"not-observed"},effects:[]
  },
  target:{repository:"red-cup-engineering/example",branch:"feature/signcraft-source",
    expectedBranchSha:c,expectedBlobSha:null,message:"Propose reviewed source bridge"}
});
test("Git Forge preserves code bytes, source provenance, Work and revision; never executes",()=>{
  const x=input(),before=structuredClone(x),out=gitForgeSourceProposal(x);
  assert.equal(out.kind,"git-forge.source-proposal.v1");
  assert.equal(out.workRef,x.candidate.workRef);
  assert.deepEqual(out.git,{repository:x.target.repository,branch:x.target.branch,
    expectedBranchSha:c,expectedBlobSha:null,path:x.candidate.artifact.path,
    content:x.candidate.artifact.content,message:x.target.message});
  assert.deepEqual(out.source.signcraft,x.candidate.signcraft.source);
  assert.deepEqual(out.source.codeProducer,x.candidate.artifact.producer);
  assert.equal(out.effectAuthority,"not-admitted");
  assert.equal(out.installedGitConsumer,"not-observed");
  assert.deepEqual(out.effects,[]);
  assert.deepEqual(x,before);
});
test("same candidate can target distinct pinned branches without altering Work",()=>{
  const one=input(),two=input();two.target.branch="fix/different";two.target.expectedBlobSha=b;
  const a1=gitForgeSourceProposal(one),a2=gitForgeSourceProposal(two);
  assert.equal(a1.workRef,a2.workRef);
  assert.notEqual(a1.git.branch,a2.git.branch);
  assert.equal(a2.git.expectedBlobSha,b);
});
test("forged approval, synthesis blockage and executed effects refuse",()=>{
  const x=input();x.candidate.approved=true;
  assert.throws(()=>gitForgeSourceProposal(x),/nonauthorizing/u);
  const y=input();y.candidate.signcraft.construction.openRequirements=["still-open"];
  assert.throws(()=>gitForgeSourceProposal(y),/nonauthorizing/u);
  const z=input();z.candidate.effects.push({kind:"git.push"});
  assert.throws(()=>gitForgeSourceProposal(z),/nonauthorizing/u);
});
test("unsafe Git revision, invalid producer and ambiguous content refuse",()=>{
  const x=input();x.target.expectedBranchSha="main";
  assert.throws(()=>gitForgeSourceProposal(x),/immutable expected revision/u);
  const y=input();y.target.branch="../escaped";
  assert.throws(()=>gitForgeSourceProposal(y),/immutable expected revision/u);
  const z=input();z.candidate.artifact.producer.commitSha="unknown";
  assert.throws(()=>gitForgeSourceProposal(z),/nonauthorizing/u);
  const p=input();p.candidate.artifact.path=".github/workflows/release.yml";
  assert.throws(()=>gitForgeSourceProposal(p),/nonauthorizing/u);
  const e=input();e.candidate.artifact.content="";
  assert.throws(()=>gitForgeSourceProposal(e),/nonauthorizing/u);
});
