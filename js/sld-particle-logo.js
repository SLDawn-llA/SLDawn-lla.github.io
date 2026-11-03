(function () {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const W = 420, H = 420;
  let mounted = false;

  // Sample the same native vector mark into particles; no font/network assets.
  function targets(mode, step) {
    const mask = document.createElement('canvas'); mask.width = W; mask.height = H;
    const c = mask.getContext('2d');
    c.strokeStyle = '#fff'; c.fillStyle = '#fff'; c.lineWidth = 15;
    c.lineJoin = 'round'; c.lineCap = 'square';
    if (mode === 0) {
      c.beginPath(); c.moveTo(183,101); c.bezierCurveTo(108,68,100,151,154,151); c.bezierCurveTo(217,151,198,231,125,203); c.stroke();
      c.beginPath(); c.moveTo(222,92); c.lineTo(245,92); c.bezierCurveTo(298,92,298,210,245,210); c.lineTo(222,210); c.closePath(); c.stroke();
      c.lineWidth = 3; c.beginPath(); c.moveTo(116,244); c.lineTo(297,244); c.stroke();
    } else {
      c.lineWidth = 11; c.beginPath(); c.arc(210,196,75,Math.PI,Math.PI * 2); c.stroke();
      c.lineWidth = 5;
      for (let i = 0; i < 7; i++) {
        const a = Math.PI + i * Math.PI / 6;
        c.beginPath(); c.moveTo(210 + Math.cos(a)*94,196+Math.sin(a)*94); c.lineTo(210+Math.cos(a)*111,196+Math.sin(a)*111); c.stroke();
      }
      for (let i=0;i<4;i++) { const inset = i*15; c.fillRect(95+inset,201+i*14,230-inset*2,5-i*.6); }
    }
    const data = c.getImageData(0,0,W,H).data, points = [];
    for (let y=65;y<260;y+=step) for(let x=72;x<348;x+=step) if(data[(Math.round(y)*W+Math.round(x))*4+3]>100) points.push({x,y,warm:mode===1 || y>235});
    return points;
  }
  function wordmark(step) {
    const mask=document.createElement('canvas'); mask.width=W;mask.height=H;
    const c=mask.getContext('2d'); c.fillStyle='#fff'; c.font='800 59px Arial, sans-serif'; c.textAlign='center'; c.fillText('SLDawn',210,327);
    const data=c.getImageData(0,0,W,H).data, points=[];
    for(let y=275;y<333;y+=step) for(let x=58;x<365;x+=step) if(data[(Math.round(y)*W+Math.round(x))*4+3]>120) points.push({x,y,word:true});
    return points;
  }
  function init() {
    if(mounted) return;
    const stage=document.querySelector('.sld-particle-stage'); if(!stage) return;
    const canvas=stage.querySelector('canvas'), c=canvas.getContext('2d'); if(!c) return;
    mounted=true;
    const small=matchMedia('(max-width: 767px)').matches;
    const forms=[targets(0,small?4.8:3.5),targets(1,small?4.8:3.5)];
    const letters=wordmark(small?3.5:2.8), count=Math.max(forms[0].length,forms[1].length);
    const particles=[];
    const pointer={x:-1000,y:-1000};
    let frame=0, visible=true, width=0, elapsed=0, last=0, mode=0;
    function make(target,index,fixed) {
      const angle=Math.random()*Math.PI*2, radius=10+Math.random()*24;
      return {x:target.x+Math.cos(angle)*radius,y:target.y+Math.sin(angle)*radius,vx:0,vy:0,target,index,fixed,phase:Math.random()*Math.PI*2,r:small ? .9 : .75+Math.random()*.65};
    }
    for(let i=0;i<count;i++) particles.push(make(forms[0][i%forms[0].length],i,false));
    letters.forEach((point,i)=>particles.push(make(point,i,true)));
    function resize() {
      const next=stage.getBoundingClientRect().width; if(!next || next===width) return;
      width=next; const dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(width*dpr);
      c.setTransform(width*dpr/W,0,0,width*dpr/H,0,0);
      draw(0,true);
    }
    function draw(time,still) {
      c.clearRect(0,0,W,H);
      const reduced=motion.matches;
      particles.forEach(p=>{
        const t=p.fixed?p.target:forms[mode][p.index%forms[mode].length];
        const drift=reduced?0:Math.sin(time*.0015+p.phase)*(p.fixed?.25:1.2);
        if(reduced) {p.x=t.x;p.y=t.y;p.vx=p.vy=0;}
        else if(!still) {
          p.vx+=(t.x+drift-p.x)*.035;p.vy+=(t.y+drift-p.y)*.035;
          const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy);
          if(d<54 && d>.01) {const f=(54-d)/54*1.35;p.vx+=dx/d*f;p.vy+=dy/d*f;}
          p.vx*=.79;p.vy*=.79;p.x+=p.vx;p.y+=p.vy;
        }
        c.fillStyle=t.word?'rgba(238,248,242,.88)':t.warm?'rgba(236,184,115,.9)':(p.index%4===0?'#d1ffe7':'#65dcb6');
        c.beginPath(); c.arc(p.x,p.y,p.r,0,Math.PI*2);c.fill();
      });
    }
    function tick(time) {
      frame=0;
      if(!visible || document.hidden || motion.matches) {last=0;return;}
      // Cap to ~30fps; avoid fast-forward when returning to a hidden tab.
      if(last && time-last<31) {frame=requestAnimationFrame(tick);return;}
      elapsed+=last?Math.min(time-last,70):0;last=time;
      const next=Math.floor(elapsed/3500)%2;
      if(next!==mode) mode=next;
      draw(time,false);frame=requestAnimationFrame(tick);
    }
    function resume() {if(!frame && visible && !document.hidden && !motion.matches) frame=requestAnimationFrame(tick);}
    function reset() {
      elapsed=0;mode=0;last=0;
      if(motion.matches) {draw(0,true);return;}
      particles.forEach(p=>{const a=Math.random()*Math.PI*2,r=90+Math.random()*160;p.x=210+Math.cos(a)*r;p.y=200+Math.sin(a)*r;p.vx=p.vy=0;});
      resume();
    }
    stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=canvas.getBoundingClientRect();pointer.x=(e.clientX-rect.left)/rect.width*W;pointer.y=(e.clientY-rect.top)/rect.height*H;});
    stage.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-1000;});
    stage.querySelector('button').addEventListener('click',reset);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0;last=0;}else resume();},{threshold:.05});observer.observe(stage);
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;last=0;}else resume();});
    motion.addEventListener('change',()=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(motion.matches){mode=0;draw(0,true);}else resume();});
    new ResizeObserver(resize).observe(stage);
    resize();stage.classList.add('is-ready');draw(0,motion.matches);resume();
    // A compact static companion keeps the same identity on inner pages.
  }
  function brand() {
    const title=document.querySelector('.site-title');if(!title || title.querySelector('.sld-brand-mark'))return;
    const img=document.createElement('img');img.src='/images/sldawn-mark.svg';img.alt='';img.width=30;img.height=30;img.className='sld-brand-mark';title.prepend(img);
  }
  window.SLDawnParticles={init};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',brand);else brand();
})();
