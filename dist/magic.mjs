// Additive particle trails and expanding shock fronts, independent of simulation.
export function createMagic(canvas,reduced){
 const ctx=canvas.getContext('2d');let particles=[],raf=0,last=0,width=0,height=0;
 function resize(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);width=rect.width;height=rect.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
 function draw(time){const dt=Math.min((time-last)/1000||.016,.035);last=time;ctx.clearRect(0,0,width,height);ctx.globalCompositeOperation='lighter';
  particles=particles.filter(p=>p.life>0);
  for(const p of particles){p.life-=dt;const f=Math.max(0,p.life/p.max);p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.985;p.vy+=p.gravity*dt;ctx.globalAlpha=f;
   if(p.ring){const r=p.size+(1-f)*p.reach;ctx.strokeStyle=p.color;ctx.lineWidth=1+f*5;ctx.beginPath();ctx.ellipse(p.x,p.y,r,r*.8,0,0,Math.PI*2);ctx.stroke()}
   else if(p.glow){const r=p.size*(.5+f);const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'#fff7d8');g.addColorStop(.2,p.color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(p.x-r,p.y-r,r*2,r*2)}
   else {ctx.strokeStyle=p.color;ctx.lineWidth=p.size*f+.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.045,p.y-p.vy*.045);ctx.stroke();if(p.star){ctx.fillStyle='#fff';ctx.fillRect(p.x-1,p.y-4,2,8);ctx.fillRect(p.x-4,p.y-1,8,2)}}
  }ctx.globalAlpha=1;if(particles.length)raf=requestAnimationFrame(draw);else {raf=0;ctx.clearRect(0,0,width,height)}
 }
 function blast(x,y,size,intensity=0){if(reduced.matches)return;if(!raf)resize();const colors=['#ff8b22','#ff39cf','#9e5cff','#ffd22d'],color=colors[Math.min(3,intensity)];
 const emit=p=>particles.push({x,y,vx:0,vy:0,gravity:0,life:.7,max:.7,...p});
 emit({glow:true,size:size*.75,color,life:.55,max:.55});emit({ring:true,size:4,reach:size*(1.1+intensity*.2),color,life:.65,max:.65});
 for(let k=0;k<20+intensity*6;k++){const angle=k*2.39996+Math.random()*.2,speed=size*(1.2+Math.random()*3);const life=.55+Math.random()*.8;emit({vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,gravity:size*.6,size:1.5+Math.random()*3,color:k%3?color:'#fff2a0',life,max:life,star:k%5===0})}
 if(particles.length>650)particles.splice(0,particles.length-650);if(!raf){last=performance.now();raf=requestAnimationFrame(draw)}
 }
 return {blast,clear(){cancelAnimationFrame(raf);raf=0;particles=[];ctx.clearRect(0,0,width,height)}}
}
