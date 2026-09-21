import assert from 'node:assert/strict';
import {chainGoal,rateRun,isBetterResult} from './dist/scoring.mjs';
const l={n:5,par:3};assert.equal(chainGoal(l),15);
assert.equal(rateRun(l,4,14).stars,2);
assert.equal(rateRun(l,4,15).stars,3);
assert.equal(rateRun(l,5,15).stars,2);
assert.equal(rateRun(l,3,50).stars,3);
assert.equal(rateRun(l,3,50).chainAward,true);
assert.equal(rateRun(l,3,50).bonus,0);
assert.equal(rateRun(l,4,15,true).assisted,true);
assert.equal(rateRun({...l,planning:true},8,20).stars,3);
assert(isBetterResult({stars:3,taps:4,bestChain:18},{medal:'Silver',taps:3}));
assert(isBetterResult({stars:3,taps:4,bestChain:20},{stars:3,taps:3,bestChain:15}));
assert(!isBetterResult({stars:3,taps:2,bestChain:50,assisted:true},{medal:'Silver',taps:4}));
assert(isBetterResult({stars:2,taps:4},{medal:'Assisted',taps:1}));
for(let taps=3;taps<=5;taps++){let stars=0;for(let chain=0;chain<100;chain++){const r=rateRun(l,taps,chain);assert(r.stars>=stars&&r.stars<=3);stars=r.stars}}
console.log('Star thresholds, cap, planning, assisted labels, legacy records and better-result retention passed.');
