export const chainGoal=level=>Math.max(8,Math.ceil(level.n*level.n*.6));
export function rateRun(level,taps,bestChain,assisted=false){
 const tapStars=level.planning?3:taps<=level.par?3:taps===level.par+1?2:1;
 const goal=chainGoal(level),chainAward=bestChain>=goal,bonus=chainAward&&tapStars<3?1:0;
 const stars=Math.min(3,tapStars+bonus);
 return {stars,tapStars,bonus,chainAward,goal,assisted,medal:['','Bronze','Silver','Gold'][stars]};
}
export function isBetterResult(next,previous){
 if(!previous)return true;
 const assisted=p=>p.assisted??p.medal==='Assisted';
 if(assisted(next)!==assisted(previous))return !assisted(next);
 const stars=p=>p.stars??({Gold:3,Silver:2,Bronze:1,Assisted:0}[p.medal]||0);
 if(stars(next)!==stars(previous))return stars(next)>stars(previous);
 if((next.bestChain||0)!==(previous.bestChain||0))return (next.bestChain||0)>(previous.bestChain||0);
 return next.taps<previous.taps;
}
