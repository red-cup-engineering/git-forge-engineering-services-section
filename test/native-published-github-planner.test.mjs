import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {mkdtempSync,rmSync,writeFileSync,readFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {pathToFileURL,fileURLToPath} from "node:url";
import {makeMachineState} from "@red-cup-engineering/signcraft/inference/kernel";
import {synthesizeGitForgeProposal} from "../src/from-signcraft.mjs";
import {planBoundedReviewCall} from "@red-cup-engineering/github-repository-hosting-service/review-call";
import {renderJsonSchemaModule} from "@red-cup-engineering/javascript-node-code-fabrication-services-section/transform-json-schema-to-typescript";
import {createPinnedSourceReader} from "@red-cup-engineering/git-source-reading-service/pinned-source-files";

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
function source(options={required:["a","b"]},design={},artifact=codeArtifact(design)){
  const m=machine();
  return synthesizeGitForgeProposal({
    softwareSynthesis:{
      ctx:m.ctx,basis:m.basis,complex:m.cx,valuation:m.v,
      object:"design",options,workRef,
      artifact,
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

test("generated JavaScript really loads as a native module from an isolated output artifact",async (t)=>{
  const proposal=source();
  const root=mkdtempSync(join(tmpdir(),"git-forge-source-fabrication-"));
  t.after(()=>rmSync(root,{recursive:true,force:true}));
  const file=join(root,"qualified.mjs");
  writeFileSync(file,proposal.git.content,"utf8");
  const imported=await import(pathToFileURL(file).href);
  assert.deepEqual(imported.forgeEvidenceSchema.required,["workRef","contentDigest"]);
  assert.equal(imported.forgeEvidenceSchema.$id,
    "https://schemas.561.group/forge/record-v1.schema.json");
  assert.equal(Object.isFrozen(imported.forgeEvidenceSchema),true);
  assert.equal(proposal.git.content,codeArtifact().content);
  assert.deepEqual(proposal.effects,[]);
});

test("an actual committed Code maker is selected by the original Git primitive before native Forge review",async(t)=>{
  // The actual public upstream checkout is a finite, independently pinned
  // producer source; the reader never trusts its current worktree branch.
  const repository=fileURLToPath(new URL("../code-fabrication-upstream/",import.meta.url));
  const producerFile=fileURLToPath(new URL("../code-fabrication-upstream/scripts/transform-json-schema-to-typescript.mjs",import.meta.url));
  const originalBlob="e52fad6266a101c21894a880cc62ab298fb532e9";
  const root=mkdtempSync(join(tmpdir(),"forge-git-source-receiving-"));
  t.after(()=>rmSync(root,{recursive:true,force:true}));
  const read=createPinnedSourceReader({
    scratch:join(root,"original-git-objects"),maxRepositories:2,
    maxPaths:300,maxBytes:1024*1024,rejectSelectedNonRegular:true
  });
  const selector={
    repository,commit:codeMakerCommit,scope:"scripts",
    selectFile:p=>p==="transform-json-schema-to-typescript.mjs",
    enterDirectory:()=>false
  };
  const sourceRows=await read(selector);
  assert.equal(sourceRows.length,1);
  const row=sourceRows[0];
  assert.equal(row.path,"transform-json-schema-to-typescript.mjs");
  assert.equal(row.mode,"100644");
  assert.equal(row.source.repository,repository);
  assert.equal(row.source.commit,codeMakerCommit);
  assert.equal(row.source.object,originalBlob,"native Git object identity must equal the original maker sourceRef");
  assert.equal(row.source.path,"scripts/transform-json-schema-to-typescript.mjs");
  assert.equal(row.bytes.toString("utf8"),readFileSync(producerFile,"utf8"),
    "actual imported source and exact pinned Git bytes cannot silently differ");
  assert.equal(schemaSourceRef,"scripts/transform-json-schema-to-typescript.mjs@"+row.source.object);
  // Existing legitimate source continues through SignCraft, Software Forge,
  // Git Forge and the published GitHub planner without manufacturing effects.
  const original=source(),published=review(original,"native-git-source-reader");
  assert.equal(original.source.codeProducer.commitSha,row.source.commit);
  assert.equal(original.git.content,codeArtifact().content);
  assert.equal(published.effect.contentDigest,createHash("sha256").update(original.git.content).digest("hex"));
  assert.equal(original.effectAuthority,"not-admitted");
  assert.deepEqual(original.effects,[]);
  // A branch name is not an exact source cut, and a made-up full identity
  // cannot be silently replaced by current HEAD.
  await assert.rejects(read({...selector,commit:"main"}),/exact commit/u);
  await assert.rejects(read({...selector,commit:"f".repeat(40)}));
});

test("source-qualified Specification architecture schema is genuinely generated into GitHub review bytes",async(t)=>{
  // Consume the REAL Specification Engineering candidate schema from its
  // original merged commit through the earlier merged Git primitive.
  // These are not invented Design, Proof or 42010 conformance witnesses.
  const specRepository=fileURLToPath(new URL("../specification-upstream/",import.meta.url));
  const specPath="data/records/schema/architecture-description.schema.json";
  const specCommit="333ed53070ae37043ea021ae271039903e5e68eb";
  const specBlob="c11c025bc0aea8d7dbbd7e271519bf23b718d41f";
  const root=mkdtempSync(join(tmpdir(),"forge-original-specification-source-"));
  t.after(()=>rmSync(root,{recursive:true,force:true}));
  const read=createPinnedSourceReader({
    scratch:join(root,"objects"),rejectSelectedNonRegular:true,
    maxRepositories:2,maxPaths:2000,maxBytes:1024*1024
  });
  const selector={repository:specRepository,commit:specCommit,
    scope:"data/records/schema",
    selectFile:p=>p==="architecture-description.schema.json",
    enterDirectory:()=>false};
  const records=await read(selector);
  assert.equal(records.length,1);
  const selected=records[0];
  assert.equal(selected.path,"architecture-description.schema.json");
  assert.equal(selected.source.commit,specCommit);
  assert.equal(selected.source.object,specBlob);
  assert.equal(selected.source.path,specPath);
  assert.equal(selected.mode,"100644");
  const file=fileURLToPath(new URL("../specification-upstream/"+specPath,import.meta.url));
  assert.deepEqual(selected.bytes,readFileSync(file));
  const schema=JSON.parse(selected.bytes.toString("utf8"));
  assert.equal(schema.$schema,"https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.title,
    "Source-qualified architecture description projection (NOT a 42010:2022 conformance certificate)");
  assert.equal(schema.properties.standard.properties.conformance.const,"unassessed");
  assert.ok(schema.required.includes("upstream"));
  assert.ok(schema.required.includes("correspondences"));
  assert.ok(Object.hasOwn(schema.$defs,"refs"));
  const code=renderJsonSchemaModule([{
    exportName:"architectureDescriptionCandidateSchema",
    typeName:"ArchitectureDescriptionCandidate",schema
  }],{format:"javascript"});
  const srcRef="red-cup-engineering/specification-engineering-services-section@"+
    specCommit+":"+specPath+"#"+specBlob;
  const artifact={path:"src/architecture-description-schema.mjs",content:code,
    producer:{repository:"red-cup-engineering/javascript-node-code-fabrication-services-section",
      commitSha:codeMakerCommit,sourceRef:srcRef}};
  const one=source(undefined,{},artifact),again=source(undefined,{},artifact);
  assert.equal(one.kind,"git-forge.source-proposal.v1");
  assert.equal(one.git.content,code);
  assert.equal(one.git.path,artifact.path);
  assert.equal(one.git.content,again.git.content);
  assert.equal(one.workRef,workRef);
  assert.equal(one.source.codeProducer.sourceRef,srcRef);
  const plan=review(one,"actual-spec-to-code-to-github");
  assert.equal(plan.schema,"github.review-call.plan.v1");
  assert.equal(plan.effect.path,artifact.path);
  assert.equal(plan.effect.contentDigest,createHash("sha256").update(code).digest("hex"));
  assert.equal(plan.effect.contentBytes,Buffer.byteLength(code,"utf8"));
  const emitted=join(root,"architecture-description-schema.mjs");
  writeFileSync(emitted,one.git.content,"utf8");
  const imported=await import(pathToFileURL(emitted).href);
  assert.deepEqual(imported.architectureDescriptionCandidateSchema,schema);
  assert.equal(Object.isFrozen(imported.architectureDescriptionCandidateSchema),true);
  assert.equal(one.effectAuthority,"not-admitted");
  assert.deepEqual(one.effects,[]);
  assert.ok(!Object.hasOwn(plan,"authority"));
  await assert.rejects(read({...selector,commit:"main"}),/exact commit/u);
  await assert.rejects(read({...selector,commit:"f".repeat(40)}));
});
