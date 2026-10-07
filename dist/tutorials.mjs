export const tutorialVersion=2;
export const tutorials=[
 {id:'orbs',title:'How to play',body:'Tap to burst the amber targets.',visual:'target'},
 {id:'primed',title:'Ready to burst',body:'Lit sockets already hold orbs. Fill the last one to start a chain.',visual:'primed'},
 {id:'relays',title:'Follow the outlines',body:'Tap bright outlines. Dim tiles get their orbs from neighbours.',visual:'relay'},
 {id:'shields',title:'Two bursts to clear',body:'Shielded targets need two bursts. Watch the number drop from 2 to 1.',visual:'shield'},
 {id:'powers2',title:'A little extra help',body:'Nova adds an orb to every tile and absorbs excess energy. Row sweep clears all targets in a chosen row. Both buttons sit below the board.',visual:'powers'},
 {id:'planning',title:'Plan first. Ignite last.',body:'Place every tap first. The final tap starts the cascade. Undo to revise your plan.',visual:'planning'}
];
export function applicableTutorials(level){return tutorials.filter(t=>t.id==='orbs'||t.id==='primed'&&!level.opening&&level.orbs.some(v=>v>0)||t.id==='relays'&&level.challenge||t.id==='shields'&&Object.values(level.required||{}).some(v=>v>1)||t.id==='powers2'&&level.powersIntro||t.id==='planning'&&level.planning)}
export function pendingTutorials(level,seen){return applicableTutorials(level).filter(t=>!seen.includes(t.id))}
