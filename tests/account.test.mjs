import test from 'node:test';
import assert from 'node:assert/strict';
import {loadData,saveData,setStorageScope,hasStudyProgress,getStorageScope} from '../public/js/core/storage.js';
import {loginEnabled,sendLoginLink} from '../public/js/core/auth.js';
const backing=new Map();
globalThis.localStorage={getItem:k=>backing.get(k)||null,setItem:(k,v)=>backing.set(k,v),removeItem:k=>backing.delete(k)};
test('Guest mode is the historical storage key and retains legacy progress',()=>{
 setStorageScope();assert.equal(getStorageScope(),'lernloop_v4_local');
 const d=loadData();d.stats.answered=11;saveData(d);
 assert.equal(loadData().stats.answered,11);
 assert.ok(hasStudyProgress(loadData()));
});
test('Account-scoped progress is separate from guest data',()=>{
 setStorageScope('00000000-0000-4000-8000-000000000001');
 assert.equal(loadData().stats.answered,0);
 const d=loadData();d.stats.answered=44;saveData(d);
 setStorageScope();assert.equal(loadData().stats.answered,11);
 setStorageScope('00000000-0000-4000-8000-000000000001');assert.equal(loadData().stats.answered,44);
});
test('Different account profile does not reveal previous account local data',()=>{
 setStorageScope('00000000-0000-4000-8000-000000000002');
 assert.equal(loadData().stats.answered,0);
});
test('Empty profile does not count as studied',()=>{
 assert.equal(hasStudyProgress(loadData()),false);
});
test('No pseudo-login when Supabase has not been configured',async()=>{
 assert.equal(loginEnabled,false);
 await assert.rejects(()=>sendLoginLink('test@example.org'),/noch nicht eingerichtet/);
});
