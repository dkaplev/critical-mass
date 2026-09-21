import assert from 'node:assert/strict';import {resolve,neighbours,bound,solve} from './dist/engine.mjs';import {levels} from './dist/levels.mjs';
let checked=0,maxWave=0;let seed=723;const rand=n=>{seed=(1664525*seed+1013904223)>>>0;return seed%n};
for(const [li,l] of levels.entries()){
 assert(l.orbs.reduce((s,v)=>s+v,0)+l.budget<bound(l.n));assert.equal(solve(l,l.par).par,l.par);
 let a=l.orbs.slice(),hit=new Set();for(const tap of l.solution){const r=resolve(l.n,a,tap);r.odometer.forEach((v,i)=>{if(v)hit.add(i)});a=r.board;}assert(l.targets.every(i=>hit.has(i)));
 for(let k=0;k<150;k++){
 const taps=Array.from({length:l.budget},()=>rand(l.n*l.n));function run(ts){let a=l.orbs.slice(),odo=a.map(()=>0);for(const t of ts){const r=resolve(l.n,a,t);assert.deepEqual(resolve(l.n,a,t),r);const sum=a.reduce((s,v)=>s+v,0)+1;for(const w of r.waves){assert.equal(w.board.reduce((s,v)=>s+v,0),sum);assert(w.board.every(v=>v>=0));}r.odometer.forEach((v,i)=>odo[i]+=v);assert(r.board.every((v,i)=>v<neighbours(l.n,i).length));maxWave=Math.max(maxWave,r.waves.length);a=r.board;checked++}return {a,odo}}
 assert.deepEqual(run(taps),run([...taps].reverse()));
 }
}
console.log(JSON.stringify({levels:levels.length,transitions:checked,maxWave,checks:['par optimality','authored solutions','budget safety','deterministic replay','orb conservation each wave','nonnegative counts','stable final boards','abelian final state and odometer']}));
