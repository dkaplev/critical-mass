import assert from 'node:assert/strict';
import {getLevel} from './dist/level-source.mjs';
import {campaign} from './dist/campaign.mjs';
import {orientLevel} from './dist/layout.mjs';
import {resolve,bound} from './dist/engine.mjs';
function verify(l){assert(l.budget>0);assert(l.orbs.reduce((a,b)=>a+b,0)+l.budget<bound(l.n));let a=l.orbs,hits=Array(a.length).fill(0);for(const i of l.solution){const r=resolve(l.n,a,i);a=r.board;hits=hits.map((v,j)=>v+r.odometer[j]);}assert(l.targets.every(i=>hits[i]>=(l.required?.[i]||1)));}
const patterns=new Set(),start=performance.now();
for(let i=16;i<100;i++){const l=await getLevel(i);verify(l);assert.deepEqual(l,await getLevel(i));patterns.add(l.n+':'+l.targets.join(','));}
for(let i=9;i<16;i++)verify(orientLevel(campaign[i],i%4,i%3===0));
assert(patterns.size>40,'Target layouts should vary across generated rounds');
console.log('84 generated levels and 7 reoriented campaign levels solved; '+patterns.size+' target patterns; '+Math.round(performance.now()-start)+' ms including simulation.');
