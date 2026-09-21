import assert from 'node:assert/strict';import {generateLevel} from './dist/generator.mjs';import {levels} from './dist/levels.mjs';import {profile,fastTap,greedy} from './dist/difficulty.mjs';import {resolve,neighbours,bound,solve} from './dist/engine.mjs';
function route(l,moves){let a=l.orbs,hit=new Set(),best=0;for(const i of moves){const r=resolve(l.n,a,i),f=fastTap(l.n,a,i);assert.deepEqual(r.board,f.board);assert.equal(r.bursts,f.bursts);a=r.board;best=Math.max(best,r.bursts);r.odometer.forEach((v,j)=>{if(v)hit.add(j)})}assert(l.targets.every(i=>hit.has(i)));return best}
let distinct=new Set(),maxms=0,pars={},greedyGold=0,greedyClear=0,relief=0,opening=0,six=0;
for(let i=13;i<=212;i++){
 const start=performance.now(),l=generateLevel(i),p=profile(i);maxms=Math.max(maxms,performance.now()-start);
 assert.deepEqual(l,generateLevel(i));assert.equal(l.par,p.par);assert.equal(l.n,p.n);assert(l.orbs.reduce((s,v)=>s+v,0)+l.budget<bound(l.n));assert(l.targets.every(i=>l.orbs[i]>0));assert(l.indirectSolution.every(i=>!l.targets.includes(i)));route(l,l.solution);assert(route(l,l.indirectSolution)>=(p.relief?10:8));
 const active=l.orbs.flatMap((v,i)=>v?[i]:[]),seen=new Set([active[0]]),q=[active[0]];for(const i of q)for(const {i:j} of neighbours(l.n,i))if(l.orbs[j]>0&&!seen.has(j)){seen.add(j);q.push(j)}assert(active.every(i=>seen.has(i)));
 const g=greedy(l);if(!p.relief)assert(g>l.par);assert(l.openingRatio<=(p.relief?.7:p.par===2?.32:.44));greedyGold+=g<=l.par;greedyClear+=g<=l.budget;relief+=p.relief;six+=l.n===6;opening+=l.openingRatio;
 if([13,15,17,25,30,49,51].includes(i))assert.equal(solve(l,l.par).par,l.par);
 pars[l.par]=(pars[l.par]||0)+1;distinct.add(JSON.stringify([l.n,l.orbs,l.targets]));
 if(i%50===0)console.log('Checked through puzzle',i);
}
for(const l of levels)route(l,l.solution);
console.log({generated:200,distinct:distinct.size,maxGenerationMs:Math.round(maxms),pars,relief,six,greedyGold,greedyClear,meanOpeningRatio:opening/200});
