import {generateLevel} from './generator.mjs';
// Select and orient verified layouts. No solver or worker can block the UI.
export async function getLevel(index){const l=generateLevel(index+1);if(!Number.isInteger(l.budget)||l.budget<1)throw Error('Invalid level budget');return l;}
