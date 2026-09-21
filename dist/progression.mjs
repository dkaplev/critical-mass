export function canAddTap(level,board,used,bonus){return board.reduce((a,b)=>a+b,0)+(level.budget+bonus-used)+1<2*level.n*(level.n-1)}
export function markCompletion(completed,key){if(completed.includes(key))return {completed,adDue:false};const next=[...completed,key];return {completed:next,adDue:next.length%5===0}}
