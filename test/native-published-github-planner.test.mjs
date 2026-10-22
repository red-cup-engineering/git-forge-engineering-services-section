import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {makeMachineState} from "@red-cup-engineering/signcraft/inference/kernel";
import {synthesizeGitForgeProposal} from "../src/from-signcraft.mjs";
import {planBoundedReviewCall} from "@red-cup-engineering/github-repository-hosting-service/review-call";

const signcraftCommit="84ca51d35a7749eb4dc86e2f6845b71ae910940d";
const workRef="ni:///sha-256;N2B0dn3jHK7-wH7j6URwNpu2C0ofnY9zWH6saAYxI7w";
const sha="a".repeat(40),branchSha="b".repeat(40);
const machine=()=>makeMachineState({
  objects:["a-only","b-only","both"],attributes:["a","b"],
  incidencePairs:[["a-only","a"],["b-only","b"],["both","a"],["both","b"]]
});
function source(options={required:["a","b"]}){
  const m=machine();
  return synthesizeGitForgeProposal({
    softwareSynthesis:{
      ctx:m.ctx,basis:m.basis,complex:m.cx,valuation:m.v,
      object:"design",options,workRef,
      artifact:{path:"src/qualified.mjs",content:"export const witness = true;\n",
        producer:{repository:"red-cup-engineering/computer-code-engineering-services-section",
          commitSha:sha,sourceRef:"original-code-fabrication-fixture"}},
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
