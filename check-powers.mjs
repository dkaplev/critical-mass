import assert from 'node:assert/strict';
import {nova,rowTargets} from './dist/power-model.mjs';
import {getLevel} from './dist/level-source.mjs';
import {bound,neighbours} from './dist/engine.mjs';
for(let i=16;i<100;i++){
 const l=await getLevel(i);assert(l.challenge&&l.pads.length<l.orbs.length);assert(Object.values(l.required).includes(2));
 const original=l.orbs.slice(),r=nova(l.n,l.orbs,l.budget);
 assert.deepEqual(l.orbs,original);assert.deepEqual(r.charged,original.map(v=>v+1));
 assert(r.waves.length<=200);assert(r.board.every((v,i)=>v>=0&&v<neighbours(l.n,i).length));assert(r.board.reduce((a,b)=>a+b,0)+l.budget<bound(l.n));
 assert.deepEqual(r,nova(l.n,l.orbs,l.budget));
 for(const t of l.targets){const cleared=rowTargets(l,t);assert(cleared.includes(t));assert(cleared.every(i=>Math.floor(i/l.n)===Math.floor(t/l.n)));assert.equal(rowTargets(l,t,cleared).length,0)}
}
console.log('84 special-tile rounds: Nova charge, termination, reserved tap safety, deterministic replay and row scope verified.');
