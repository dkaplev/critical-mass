import {neighbours} from './engine.mjs';
const graphs=new Map();
export function graph(n){if(!graphs.has(n))graphs.set(n,Array.from({length:n*n},(_,i)=>neighbours(n,i).map(q=>q.i)));return graphs.get(n)}
// Compact solver simulation; the presentation engine remains the gameplay authority.
export function fastTap(n,original,tap){const ns=graph(n),a=original.slice(),fired=new Set();a[tap]++;let bursts=0;
 for(let wave=0;wave<200;wave++){let unstable=[];for(let i=0;i<a.length;i++)if(a[i]>=ns[i].length)unstable.push(i);if(!unstable.length)return {board:a,fired,bursts};for(const i of unstable){a[i]-=ns[i].length;fired.add(i);bursts++;for(const j of ns[i])a[j]++}}throw Error('Unstable candidate')}
export function assess(l,max=4){let nodes=0,solution=null,openings=new Set(),count=0;const mask=new Map(l.targets.map((i,k)=>[i,1<<k])),goal=(1<<l.targets.length)-1;
 function walk(a,hit,left,start,path){if(hit===goal){count++;solution??=path;path.forEach(i=>openings.add(i));return}if(!left)return;for(let i=start;i<a.length;i++){if(++nodes>400000)throw Error('Search budget');const r=fastTap(l.n,a,i);let h=hit;for(const j of r.fired)h|=mask.get(j)||0;walk(r.board,h,left-1,i,[...path,i])}}
 for(let d=1;d<=max;d++){walk(l.orbs,0,d,0,[]);if(solution)return {par:d,solution,openingRatio:openings.size/l.orbs.length,solutionCount:count,nodes}}
 return null;
}
export function greedy(l){let a=l.orbs,hit=new Set();for(let t=1;t<=l.budget;t++){const rs=a.map((_,i)=>({i,...fastTap(l.n,a,i)})).sort((x,y)=>y.bursts-x.bursts||x.i-y.i);const r=rs[0];a=r.board;for(const i of r.fired)hit.add(i);if(l.targets.every(i=>hit.has(i)))return t}return Infinity}
export function profile(number){const phase=number<25?0:number<49?1:2,relief=(number-13)%5===4;return {phase,relief,n:phase===2&&!relief&&number%3===0?6:5,par:relief?2:phase===0?(number%3===0?2:3):phase===1?(number%3===0?4:3):4,label:relief?'FREE FLOW':phase===0?'CONNECTIONS':phase===1?'CROSSROADS':'DEEP CURRENT',maxOpen:relief?.6:phase===0?.32:.25};}
