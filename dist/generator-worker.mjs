import {generateLevel} from './generator.mjs';
self.onmessage=({data})=>{try{self.postMessage({id:data.id,level:generateLevel(data.number)})}catch(e){self.postMessage({id:data.id,error:e.message})}};
