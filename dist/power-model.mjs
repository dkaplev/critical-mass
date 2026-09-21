import {neighbours,bound} from './engine.mjs';
export function rowTargets(level,index,cleared=[]){const row=Math.floor(index/level.n);return level.targets.filter(i=>Math.floor(i/level.n)===row&&!cleared.includes(i))}
// Global magic grants every tile one orb. Overflow is visibly absorbed by the
// spell, reserving enough space for all remaining normal taps.
export function nova(n,original,reserved=0){
 const a=original.map(v=>v+1),charged=a.slice(),events=[],limit=bound(n)-1-reserved;
 let total=a.reduce((x,y)=>x+y,0),absorbed=0;
 for(let wave=0;wave<200;wave++){
  const firing=a.flatMap((v,i)=>v>=neighbours(n,i).length?[i]:[]),transfers=[];
  if(!firing.length){
   if(total>limit){const vented=[];while(total>limit){let i=a.indexOf(Math.max(...a));a[i]--;total--;absorbed++;vented.push(i)}events.push({firing:[],transfers:[],board:a.slice(),vented})}
   return {charged,waves:events,board:a,absorbed};
  }
  for(const i of firing){const ns=neighbours(n,i);a[i]-=ns.length;total-=ns.length}
  for(const i of firing)for(const q of neighbours(n,i)){
   if(total<limit){a[q.i]++;total++;transfers.push({from:i,to:q.i,d:q.d})}else absorbed++;
  }
  events.push({firing,transfers,board:a.slice()});
 }
 throw Error('Nova exceeded wave limit');
}
