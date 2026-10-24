import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {makeMachineState} from "@red-cup-engineering/signcraft/inference/kernel";
import {synthesizeGitForgeProposal} from "../src/from-signcraft.mjs";
import {planBoundedReviewCall} from "@red-cup-engineering/github-repository-hosting-service/review-call";
import {renderJsonSchemaModule} from "@red-cup-engineering/javascript-node-code-fabrication-services-section/transform-json-schema-to-typescript";

const signcraftCommit="84ca51d35a7749eb4dc86e2f6845b71ae910940d";
const workRef="ni:///sha-256;N2B0dn3jHK7-wH7j6URwNpu2C0ofnY9zWH6saAYxI7w";
const branchSha="b".repeat(40);
const codeMakerCommit="c209dd81a265ac57fb68c17661e03a3b7bcb0fd9";
const schemaSourceRef="scripts/transform-json-schema-to-typescript.mjs@e52fad6266a101c21894a880cc62ab298fb532e9";
// The original Code-owned deterministic JSON Schema generator really produces
// these code bytes; source-only design admission is NOT proof or customer receipt.
function codeArtifact({includeOwner=false}={}){
  const properties={
    workRef:{type:"string",minLength:1},
    contentDigest:{type:"string",pattern:"^[a-f0-9]{64}$"}
  };
  if(includeOwner) properties.owner={type:"string",minLength:1};
  const schema={
    $id:"https://schemas.561.group/forge/record-v1.schema.json",
    type:"object",additionalProperties:false,
    required:["workRef","contentDigest"],properties
  };
  const content=renderJsonSchemaModule([{
    exportName:"forgeEvidenceSchema",typeName:"ForgeEvidence",schema
  }],{format:"javascript"});
  return {path:"src/qualified.mjs",content,
    producer:{repository:"red-cup-engineering/javascript-node-code-fabrication-services-section",
      commitSha:codeMakerCommit,sourceRef:schemaSourceRef}};
}
const machine=()=>makeMachineState({
  objects:["a-only","b-only","both"],attributes:["a","b"],
  incidencePairs:[["a-only","a"],["b-only","b"],["both","a"],["both","b"]]
});
function source(options={required:["a","b"]},design={}){
  const m=machine();
  return synthesizeGitForgeProposal({
    softwareSynthesis:{
      ctx:m.ctx,basis:m.basis,complex:m.cx,valuation:m.v,
      object:"design",options,workRef,
      artifact:codeArtifact(design),
      signcraftSource:{repository:"red-cup-engineering/signcraft",
        commitSha:signcraftCommit,exportPath:"./inference/generate"}
    },
    target:{repository:"red-cup-engineering/forge-consumer",
      branch:"review/signcraft-code",expectedBranchSha:branchSha,
      expectedBlobSha:null,message:"Propose admitted source code"}
  });
}
function review(proposal,requestId="forge-gh-plan"){
  return planBoundedReviewCall({
    requestId,workRef:proposal.workRef,repositoryId:456,
    effect:{kind:"file.put",branch:proposal.git.branch,path:proposal.git.path,
      content:proposal.git.content,message:proposal.git.message,
      expectedBranchSha:proposal.git.expectedBranchSha,
      expectedBlobSha:proposal.git.expectedBlobSha}
  });
}
test("native SignCraft through both forge layers reaches the RELEASED GitHub guarded planner with exact bytes",()=>{
  const p=source();
  assert.equal(p.kind,"git-forge.source-proposal.v1");
  const plan=review(p);
  assert.equal(plan.schema,"github.review-call.plan.v1");
  assert.equal(plan.effect.kind,"file.put");
  assert.equal(plan.workRef,workRef);
  assert.equal(plan.effect.branch,p.git.branch);
  assert.equal(plan.effect.path,p.git.path);
  assert.equal(plan.effect.expectedBranchSha,branchSha);
  assert.equal(plan.effect.contentDigest,p.git.contentSha256);
  assert.equal(plan.effect.contentDigest,createHash("sha256").update(p.git.content).digest("hex"));
  assert.equal(plan.effect.contentBytes,Buffer.byteLength(p.git.content));
  assert.equal(p.effectAuthority,"not-admitted");
  assert.deepEqual(p.effects,[]);
  assert.ok(!Object.hasOwn(plan,"authority"));
});
test("a different exact Git revision changes the released planner input but never grants authority",()=>{
  const p=source(), other=structuredClone(p);
  other.git.expectedBranchSha="c".repeat(40);
  const one=review(p,"forge-gh-one"),two=review(other,"forge-gh-two");
  assert.notEqual(one.effect.expectedBranchSha,two.effect.expectedBranchSha);
  assert.equal(one.effect.contentDigest,two.effect.contentDigest);
  assert.deepEqual(p.effects,[]);
});
test("the existing released GitHub planner itself refuses protected paths and missing source revisions",()=>{
  const p=source();
  const forbidden=structuredClone(p);
  forbidden.git.path=".github/workflows/unsafe.yml";
  assert.throws(()=>review(forbidden),/invalid or separately governed file path/u);
  const invalid=structuredClone(p);
  invalid.git.expectedBranchSha="main";
  assert.throws(()=>review(invalid),/exact branch tip/u);
});
test("bounded SignCraft incompletion cannot reach the released GitHub planner",()=>{
  const declined=source({required:["a","b"],maxSteps:1});
  assert.equal(declined.kind,"git-forge.refusal.v1");
  assert.deepEqual(declined.effects,[]);
  assert.throws(()=>review(declined),TypeError);
});

test("native original Code maker generates source before both Forges and the released GitHub planner",()=>{
  const generated=codeArtifact(),one=source(),replayed=source();
  const plan=review(one,"source-owned-maker-1");
  assert.equal(one.git.content,generated.content);
  assert.equal(one.git.content,replayed.git.content);
  assert.equal(one.source.codeProducer.repository,
    "red-cup-engineering/javascript-node-code-fabrication-services-section");
  assert.equal(one.source.codeProducer.commitSha,codeMakerCommit);
  assert.equal(one.source.codeProducer.sourceRef,schemaSourceRef);
  assert.match(one.git.content,/Generated from specifications/u);
  assert.match(one.git.content,/export const forgeEvidenceSchema/u);
  assert.equal(plan.effect.contentDigest,createHash("sha256").update(generated.content).digest("hex"));
  assert.equal(plan.effect.contentBytes,Buffer.byteLength(generated.content));
  assert.equal(one.effectAuthority,"not-admitted");
  assert.deepEqual(one.effects,[]);
});
test("revised design refabricates distinct code and GitHub plan without changing the original Work",()=>{
  const old=source(),updated=source(undefined,{includeOwner:true});
  assert.notEqual(old.git.content,updated.git.content);
  assert.equal(updated.git.content,codeArtifact({includeOwner:true}).content);
  assert.equal(old.workRef,updated.workRef);
  assert.equal(old.git.expectedBranchSha,updated.git.expectedBranchSha);
  assert.notEqual(review(old,"design-v1").effect.contentDigest,
    review(updated,"design-v2").effect.contentDigest);
  assert.deepEqual(old.effects,[]);assert.deepEqual(updated.effects,[]);
});
test("invalid source binding is refused by the original Code maker before any downstream effects",()=>{
  assert.throws(()=>renderJsonSchemaModule([{
    exportName:"default",typeName:"Work",schema:{type:"object"}
  }],{format:"javascript"}),/non-reserved/u);
});
