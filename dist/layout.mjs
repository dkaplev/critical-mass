// Grid symmetries preserve adjacency, minimum taps and shield requirements.
export function orientLevel(base,turn=0,mirror=false){
 const n=base.n,map=i=>{let r=Math.floor(i/n),c=i%n;for(let k=0;k<turn;k++)[r,c]=[c,n-1-r];if(mirror)c=n-1-c;return r*n+c};
 const l=structuredClone(base);l.orbs=Array(n*n).fill(0);base.orbs.forEach((v,i)=>l.orbs[map(i)]=v);
 for(const key of ['targets','pads','solution','indirectSolution'])if(base[key])l[key]=base[key].map(map);
 if(base.required)l.required=Object.fromEntries(Object.entries(base.required).map(([i,v])=>[map(+i),v]));return l;
}
