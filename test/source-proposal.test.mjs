import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {forgeSourceCandidate} from "@red-cup-engineering/software-forge-services-section/source-candidate";
import {gitForgeSourceProposal} from "../src/source-proposal.mjs";

const a="a".repeat(40),b="b".repeat(40),c="c".repeat(40);
const original=()=>({
  synthesis:{
    kind:"signcraft.semioticSynthesis.v1",admissionLevel:"counterfactual",
    object:"source-change",requirements:["source-reviewed"],exclusions:[],
    complete:true,openRequirements:[],violatedExclusions:[],
    searchTruncated:false,statesExplored:1,steps:[],
    continuationEnergy:0,projectedReadings:[],note:"source-only"
  },
  signcraftSource:{repository:"red-cup-engineering/signcraft",commitSha:a,exportPath:"./inference/generate"},
  workRef:"ni:///sha-256;original-work",
  artifact:{path:"src/bridge.mjs",content:"export const bridge=true;\n",
    producer:{repository:"red-cup-engineering/computer-code-engineering-services-section",
      commitSha:b,sourceRef:"fabricator-original"}}
});
const selection = x => ({
  workRef:x.workRef,signcraftSource:x.signcraftSource,
  artifact:{path:x.artifact.path,
    contentSha256:createHash("sha256").update(x.artifact.content).digest("hex"),
    producer:x.artifact.producer}
});
const input=()=>{
  const x=original();
  return {
    candidate:forgeSourceCandidate(x),sourceSelection:selection(x),
    target:{repository:"red-cup-engineering/example",branch:"feature/signcraft-source",
      expectedBranchSha:c,expectedBlobSha:null,message:"Propose reviewed source bridge"}
  };
};

// The original upstream maker returns a *deeply frozen* carrier. Tampering
// requires a separately transported copy; modifying the original in-place
// must be rejected before Git Forge is even called.
const mutableTransport=()=>{const x=input();x.candidate=structuredClone(x.candidate);return x;};

test("Git Forge uses the actual upstream source-maker, preserves original bytes and never executes Git",()=>{
  const x=input(),before=structuredClone(x),out=gitForgeSourceProposal(x);
  assert.equal(out.kind,"git-forge.source-proposal.v1");
  assert.equal(out.workRef,x.candidate.workRef);
  assert.deepEqual(out.git,{repository:x.target.repository,branch:x.target.branch,
    expectedBranchSha:c,expectedBlobSha:null,path:x.candidate.artifact.path,
    content:x.candidate.artifact.content,contentSha256:x.candidate.artifact.contentSha256,
    message:x.target.message});
  assert.deepEqual(out.source.signcraft,x.candidate.signcraft.source);
  assert.deepEqual(out.source.codeProducer,x.candidate.artifact.producer);
  assert.equal(out.effectAuthority,"not-admitted");
  assert.equal(out.installedGitConsumer,"not-observed");
  assert.equal(Object.isFrozen(out.source.codeProducer),true);
  assert.deepEqual(out.effects,[]);
  assert.deepEqual(x,before);
});
test("source Work is preserved across different separately pinned Git targets",()=>{
  const one=input(),two=input();two.target.branch="fix/different";two.target.expectedBlobSha=b;
  const a1=gitForgeSourceProposal(one),a2=gitForgeSourceProposal(two);
  assert.equal(a1.workRef,a2.workRef);
  assert.notEqual(a1.git.branch,a2.git.branch);
  assert.equal(a2.git.expectedBlobSha,b);
});
test("tampering with content, digest or a recomputed digest refuses the upstream selected source",()=>{
  const changes=[
    p=>{p.artifact.content="export const bridge=false;\n";},
    p=>{p.artifact.contentSha256="0".repeat(64);},
    p=>{p.artifact.content="export const bridge=false;\n";p.artifact.contentSha256=createHash("sha256").update(p.artifact.content).digest("hex");}
  ];
  for(const change of changes){
    const x=mutableTransport();change(x.candidate);
    assert.throws(()=>gitForgeSourceProposal(x),TypeError);
  }
});
test("provisional cannot assert approval, successful synthesis or an executed effect",()=>{
  const originalCandidate=mutableTransport();
  originalCandidate.candidate.approved=true;
  assert.throws(()=>gitForgeSourceProposal(originalCandidate),TypeError);
  const y=input();y.candidate.signcraft.construction.openRequirements=["still-open"];
  assert.throws(()=>gitForgeSourceProposal(y),TypeError);
  const z=mutableTransport();z.candidate.effects.push({kind:"git.push"});
  assert.throws(()=>gitForgeSourceProposal(z),TypeError);
});
test("upstream requires independently selected original Work and Code identity",()=>{
  const inputWithoutSelection=input();delete inputWithoutSelection.sourceSelection;
  assert.throws(()=>gitForgeSourceProposal(inputWithoutSelection),TypeError);
  const moved=mutableTransport();moved.candidate.signcraft.source.commitSha="d".repeat(40);
  assert.throws(()=>gitForgeSourceProposal(moved),TypeError);
  const changedMaker=mutableTransport();changedMaker.candidate.artifact.producer.sourceRef="unwitnessed";
  assert.throws(()=>gitForgeSourceProposal(changedMaker),TypeError);
  const foreignWork=mutableTransport();foreignWork.candidate.workRef="ni:///sha-256;foreign";
  assert.throws(()=>gitForgeSourceProposal(foreignWork),TypeError);
});
test("unsafe Git revision and unsupported source paths refuse at their actual owner",()=>{
  const x=input();x.target.expectedBranchSha="main";
  assert.throws(()=>gitForgeSourceProposal(x),/immutable expected revision/u);
  const y=input();y.target.branch="../escaped";
  assert.throws(()=>gitForgeSourceProposal(y),/immutable expected revision/u);
  const z=mutableTransport();z.candidate.artifact.producer.commitSha="unknown";
  assert.throws(()=>gitForgeSourceProposal(z),TypeError);
  const p=mutableTransport();p.candidate.artifact.path=".github/workflows/release.yml";
  assert.throws(()=>gitForgeSourceProposal(p),TypeError);
  const e=mutableTransport();e.candidate.artifact.content="";
  assert.throws(()=>gitForgeSourceProposal(e),TypeError);
});
test("original target inert-data admission refuses executable Git branch getters without running them",()=>{
  const x=input();let invoked=0;
  Object.defineProperty(x.target,"branch",{enumerable:true,get(){invoked++;return "feature/sneaky";}});
  assert.throws(()=>gitForgeSourceProposal(x),/data properties, never accessors/u);
  assert.equal(invoked,0);
});
