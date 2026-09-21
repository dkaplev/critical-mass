import {resolve} from './engine.mjs';
import {campaign} from './campaign.mjs';
import {orientLevel} from './layout.mjs';
import {bank} from './level-bank.mjs';
import {bound} from './engine.mjs';
import {graph,fastTap,assess,greedy,profile} from './difficulty.mjs';
export const GENERATOR_VERSION=2;
function random(seed){let s=seed>>>0;return n=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return Math.floor(s/4294967296*n)}}
export function candidate(number,attempt){const p=profile(number),n=p.n,ns=graph(n),rnd=random(Math.imul(number+31,2654435761)^Math.imul(attempt+1,2246822519));
 const orbs=Array(n*n).fill(0),patch=[rnd(n*n)],seen=new Set(patch);let fuel=0,limit=bound(n)-p.par-3-(n===6?10:0)-rnd(3);
 while(patch.length){const i=patch.shift(),v=Math.min(ns[i].length-1,limit-fuel);if(v<=0)break;orbs[i]=v;fuel+=v;const next=ns[i].slice();for(let j=next.length-1;j>0;j--){const k=rnd(j+1);[next[j],next[k]]=[next[k],next[j]]}for(const j of next)if(!seen.has(j)){seen.add(j);patch.push(j)}}
 const active=orbs.flatMap((v,i)=>v?[i]:[]);
 // Underfilled junctions interrupt otherwise loaded routes without stranding targets.
 const junctions=active.filter(i=>orbs[i]>1&&ns[i].filter(j=>orbs[j]>0).length>=2);
 for(let k=0;k<p.par+1+rnd(3);k++){const i=junctions[rnd(junctions.length)];if(orbs[i]>1)orbs[i]--}
 const route=[];let a=orbs.slice(),fired=new Set(),longest=0,quiet=0;
 for(let k=0;k<p.par;k++){const choices=k<p.par-1?junctions:active;const i=choices[rnd(choices.length)];route.push(i);const r=fastTap(n,a,i);a=r.board;longest=Math.max(longest,r.bursts);if(r.bursts===0)quiet++;for(const j of r.fired)fired.add(j)}
 const pool=[...fired].filter(i=>orbs[i]>0&&!route.includes(i));if(longest<(p.relief?10:8)||pool.length<4||new Set(route).size<2)return null;
 const targets=pool.slice(-Math.min(p.phase?8:6,pool.length));const l={n,orbs,targets,name:p.relief?'Let it flow':['Bridge the gap','Cross current','Convergence','Shared spark','Find the connection','Ripple effect'][number%6],hint:'Find the connections. Burst every amber target.',seed:number,generatorVersion:2,budget:p.par+2,indirectSolution:route,difficulty:p.label,relief:p.relief};
 const s=assess(l,p.par);if(!s||s.par!==p.par)return null;
 const g=greedy(l);
 return {...l,...s,quality:{longest,quiet,greedyTaps:Number.isFinite(g)?g:null,attempt}};
}
function transform(base,turn,mirror){const n=base.n,map=i=>{let r=Math.floor(i/n),c=i%n;for(let k=0;k<turn;k++)[r,c]=[c,n-1-r];if(mirror)c=n-1-c;return r*n+c};const orbs=Array(n*n).fill(0);base.orbs.forEach((v,i)=>orbs[map(i)]=v);return {...base,orbs,targets:base.targets.map(map),indirectSolution:base.indirectSolution.map(map)};}
function validate(l,p){let a=l.orbs,hit=new Set(),longest=0,quiet=0;for(const i of l.indirectSolution){const r=fastTap(l.n,a,i);a=r.board;for(const j of r.fired)hit.add(j);longest=Math.max(longest,r.bursts);if(!r.bursts)quiet++}
 if(!l.targets.every(i=>hit.has(i))||longest<(p.relief?10:8))return null;
 const s=assess(l,p.par);if(!s||s.par!==p.par||s.openingRatio>(p.relief?.7:p.par===2?.32:.44))return null;
 const g=greedy(l);if(!p.relief&&g<=p.par)return null;
 return {...l,...s,quality:{longest,quiet,greedyTaps:Number.isFinite(g)?g:null}};
}
// Strengthen verified layouts without changing their minimum: the original
// optimal route is still valid, while added restrictions cannot shorten it.
const specialBank=bank.flatMap(base=>{
 let a=base.orbs,hits=a.map(()=>0);
 for(const i of base.solution){const r=resolve(base.n,a,i);a=r.board;hits=hits.map((v,j)=>v+r.odometer[j])}
 const shield=hits.findIndex((v,i)=>v>=2&&!base.solution.includes(i));if(shield<0)return [];
 const l=structuredClone(base);l.targets=[...new Set([...l.targets,shield])];l.required={[shield]:2};l.challenge=true;l.pads=[...new Set(l.solution)];
 for(let i=0;i<l.orbs.length&&l.pads.length<7;i++)if(l.orbs[i]&&!l.targets.includes(i)&&!l.pads.includes(i))l.pads.push(i);
 l.hint='Tap bright outlines. Break the shields.';return [l];
});
export function generateLevel(number){
 const p=profile(number);
 // Continue the learned mechanics, with a planning challenge every eighth round.
 const stage=Math.min(14,9+Math.floor((number-17)/4));
 const pool=[...campaign.filter((l,i)=>i>=8&&i<=stage&&!l.planning&&Object.values(l.required||{}).includes(2)),...specialBank.filter(l=>l.n===(stage>=11&&number%3!==0?6:5))];
 if(number%8===0)pool.splice(0,pool.length,campaign[15]);
 if(!pool.length)throw Error('No verified layouts for this difficulty');
 const cycle=Math.floor((number-17)/5),choice=((cycle+number)%pool.length+pool.length)%pool.length;
 const l=orientLevel(pool[choice],((number+Math.floor(number/4))%4),Math.floor(number/3)%2===0);
 return {...l,seed:number,generatorVersion:3,difficulty:l.planning?'PLANNING':l.n===6?'SHIELDS + RELAYS':'SHIELD ROUTES',name:l.planning?'Silent ignition':['Bridge the gap','Cross current','Convergence','Shared spark','Find the connection','Ripple effect'][number%6]};
}
