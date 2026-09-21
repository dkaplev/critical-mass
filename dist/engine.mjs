export const directions=[[-1,0],[0,1],[1,0],[0,-1]];
export function neighbours(n,i){return directions.map(([dr,dc],d)=>({r:Math.floor(i/n)+dr,c:i%n+dc,d})).filter(v=>v.r>=0&&v.r<n&&v.c>=0&&v.c<n).map(v=>({i:v.r*n+v.c,d:v.d}));}
export function bound(n){return 2*n*(n-1);}
export function resolve(n,original,tap){
 const a=original.slice();a[tap]++;return resolveBoard(n,a);
}
export function resolveBoard(n,original){const a=original.slice();
 if(a.reduce((s,v)=>s+v,0)>=bound(n))throw Error('Safe orb limit exceeded');
 const waves=[],odometer=a.map(()=>0);
 for(let w=0;w<200;w++){
  const firing=a.flatMap((v,i)=>v>=neighbours(n,i).length?[i]:[]);
  if(!firing.length)return {board:a,waves,odometer,bursts:odometer.reduce((s,v)=>s+v,0)};
  const transfers=[];for(const i of firing){const ns=neighbours(n,i);a[i]-=ns.length;odometer[i]++;for(const q of ns){a[q.i]++;transfers.push({from:i,to:q.i,d:q.d});}}
  waves.push({firing,transfers,board:a.slice()});
 }throw Error('Cascade exceeded 200 waves');
}
export function solve(level,max=level.par??4){
 const targets=level.targets;let nodes=0;
 function search(a,hit,remaining,start,path){if(targets.every(i=>hit.has(i)))return path;if(!remaining)return null;
  for(let i=start;i<a.length;i++){nodes++;const r=resolve(level.n,a,i),h=new Set(hit);r.odometer.forEach((v,k)=>{if(v)h.add(k)});const p=search(r.board,h,remaining-1,i,[...path,i]);if(p)return p;}return null;}
 for(let k=1;k<=max;k++){const p=search(level.orbs,new Set(),k,0,[]);if(p)return {par:k,solution:p,nodes};}return null;
}
