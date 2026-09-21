import assert from 'node:assert/strict';
import {campaign} from './dist/campaign.mjs';
import {pendingTutorials,tutorials,tutorialVersion} from './dist/tutorials.mjs';
let seen=[],introductions=[];
for(let i=0;i<campaign.length;i++){
 const pending=pendingTutorials({...campaign[i],powersIntro:i>=5},seen);
 for(const t of pending){introductions.push([i+1,t.id]);seen.push(t.id)}
 assert.equal(pendingTutorials({...campaign[i],powersIntro:i>=5},seen).length,0,'Acknowledged tips should not repeat on retry');
}
assert.deepEqual(introductions,[[1,'orbs'],[2,'primed'],[5,'relays'],[6,'powers2'],[9,'shields'],[16,'planning']]);
assert.deepEqual(pendingTutorials(campaign[14],[]).map(t=>t.id),['orbs','primed','relays','shields'],'Jumping ahead still explains each applicable mechanic');
assert.deepEqual(pendingTutorials(campaign[15],['orbs','primed','relays','shields']).map(t=>t.id),['planning']);
const persisted=JSON.parse(JSON.stringify({tutorialVersion,introSeen:seen}));
assert.equal(pendingTutorials({...campaign[15],powersIntro:true},persisted.introSeen).length,0);
assert.equal(tutorials.length,6,'All explanations remain available in help');
console.log('Tutorial sequence, jumping ahead, retry and saved acknowledgements passed.');
