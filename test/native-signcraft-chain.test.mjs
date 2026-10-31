import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {makeMachineState} from "@red-cup-engineering/signcraft/inference/kernel";
import {withReading,readingAt} from "@red-cup-engineering/signcraft/inference/nuclei";
import {synthesizeGitForgeProposal} from "../src/from-signcraft.mjs";

const signcraftCommit="43cc43ccbca025b22749acf61dd60cab2089d47f";
const codeProducerCommit="a".repeat(40),expectedBranchSha="b".repeat(40);
const workRef="ni:///sha-256;N2B0dn3jHK7-wH7j6URwNpu2C0ofnY9zWH6saAYxI7w";
const field=()=>makeMachineState({
  objects:["a-only","b-only","both"],attributes:["a","b"],
  incidencePairs:[["a-only","a"],["b-only","b"],["both","a"],["both","b"]]
});
const artifact=()=>({path:"src/produced.mjs",content:"export const change = true;\n",
  producer:{repository:"red-cup-engineering/computer-code-engineering-services-section",
    commitSha:codeProducerCommit,sourceRef:"code-producer:original-source"}});
const selectedSource=x=>({workRef:x.workRef,signcraftSource:x.signcraftSource,
  artifact:{path:x.artifact.path,contentSha256:createHash("sha256").update(x.artifact.content).digest("hex"),
    producer:x.artifact.producer}});
const invoke=(machine,options={required:["a","b"]})=>{
  const softwareSynthesis={
    ctx:machine.ctx,basis:machine.basis,complex:machine.cx,valuation:machine.v,
    object:"design",options,workRef,artifact:artifact(),
    signcraftSource:{repository:"red-cup-engineering/signcraft",commitSha:signcraftCommit,
      exportPath:"./inference/generate"}
  };
  return synthesizeGitForgeProposal({
    softwareSynthesis,sourceSelection:selectedSource(softwareSynthesis),
    target:{repository:"red-cup-engineering/actual-consumer",branch:"review/forge",
      expectedBranchSha,expectedBlobSha:null,message:"Propose source-authored code"}
  });
};

test("actual published SignCraft and Software Forge produce an unchanged effect-free Git proposal",()=>{
  const machine=field(),original=new Map(machine.v),out=invoke(machine);
  assert.equal(out.kind,"git-forge.source-proposal.v1");
  assert.equal(out.workRef,workRef);
  assert.equal(out.git.path,artifact().path);
  assert.equal(out.git.content,artifact().content);
  assert.equal(out.git.contentSha256,createHash("sha256").update(artifact().content).digest("hex"));
  assert.equal(out.git.expectedBranchSha,expectedBranchSha);
  assert.equal(out.status,"proposal-only");
  assert.equal(out.effectAuthority,"not-admitted");
  assert.deepEqual(out.effects,[]);
  assert.deepEqual(machine.v,original);
  assert.equal(readingAt(machine.v,"design","a"),"absurd");
});

test("actual upstream bounded incompletion remains refused by the entire chain",()=>{
  const m=field();
  const one=invoke(m,{required:["a","b"],maxSteps:1});
  assert.equal(one.kind,"git-forge.refusal.v1");
  assert.equal(one.code,"UPSTREAM_SIGNCRAFT_CONSTRUCTION_REFUSED");
  assert.equal(one.original.code,"SIGNCRAFT_CONSTRUCTION_NOT_COMPLETE");
  assert.deepEqual(one.effects,[]);
  const truncated=invoke(m,{required:["a","b"],maxStates:1});
  assert.equal(truncated.code,"UPSTREAM_SIGNCRAFT_CONSTRUCTION_REFUSED");
});

test("the SignCraft negative witness does not fabricate an affirmative Git plan",()=>{
  const machine=field(),valuation=withReading(machine.v,"design","a","active");
  const softwareSynthesis={
    ctx:machine.ctx,basis:machine.basis,complex:machine.cx,valuation,
    object:"design",options:{required:["a"]},workRef,artifact:artifact(),
    signcraftSource:{repository:"red-cup-engineering/signcraft",commitSha:signcraftCommit,
      exportPath:"./inference/generate"}
  };
  const candidate=synthesizeGitForgeProposal({
    softwareSynthesis,sourceSelection:selectedSource(softwareSynthesis),
    target:{repository:"red-cup-engineering/actual-consumer",branch:"review/forge",
      expectedBranchSha,expectedBlobSha:null,message:"Unaccepted source"}
  });
  assert.equal(candidate.kind,"git-forge.refusal.v1");
  assert.equal(candidate.original.code,"SIGNCRAFT_CONSTRUCTION_NOT_COMPLETE");
  assert.equal(readingAt(valuation,"design","a"),"active");
});
