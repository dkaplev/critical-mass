import {resolve} from './engine.mjs';
export function recordBursts(level,hits,odometer){return hits.map((v,i)=>Math.min(level.required?.[i]||1,v+(odometer[i]||0)))}
export function challengeSolved(level,hits){return level.targets.every(i=>hits[i]>=(level.required?.[i]||1))}
export function solveChallenge(level,max=8){let nodes=0;function visit(a,hits,left,start,path){if(challengeSolved(level,hits))return path;if(!left)return null;for(let k=start;k<level.pads.length;k++){nodes++;const i=level.pads[k],r=resolve(level.n,a,i);const p=visit(r.board,recordBursts(level,hits,r.odometer),left-1,k,[...path,i]);if(p)return p}return null}for(let d=1;d<=max;d++){const solution=visit(level.orbs,Array(level.n**2).fill(0),d,0,[]);if(solution)return {par:d,solution,nodes}}return null}
