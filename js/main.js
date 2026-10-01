(()=>{
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mob=()=>innerWidth<=900;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* image fallback (Unsplash -> local) */
document.addEventListener('error',e=>{const t=e.target;if(t.tagName==='IMG'&&t.dataset.fb){t.src=t.dataset.fb;delete t.dataset.fb}},true);
$('#yr').textContent=new Date().getFullYear();

/* header + menu */
const hd=$('#hd'),burger=$('#burger'),menu=$('#menu');
const setMenu=o=>{burger.classList.toggle('o',o);menu.classList.toggle('o',o);burger.setAttribute('aria-expanded',o);menu.setAttribute('aria-hidden',!o);document.body.style.overflow=o?'hidden':''};
burger.onclick=()=>setMenu(!menu.classList.contains('o'));
$$('a',menu).forEach(a=>a.onclick=()=>setMenu(false));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

/* generic progress for tall sticky wrappers */
const prog=el=>{const r=el.getBoundingClientRect(),t=el.offsetHeight-innerHeight;return t>0?clamp(-r.top/t):0};

/* elements */
const heroWrap=$('#heroWrap'),hero=$('#hero'),heroC=$('#heroC');
const svc=$('#services'),svs=$$('.sv'),navLi=$$('.svc-nav li'),bn=$('#bn'),svBar=$('#svBar');
const ly=$('#layers'),lyA=$('#lyA'),lyB=$('#lyB'),lyC=$('#lyC'),lyG=$('#lyGlow'),l1=$('#l1'),l2=$('#l2'),l3=$('#l3');
const hss=$$('.hs');
let cur=-1;

/* horizontal scroll sizing */
function sizeHS(){hss.forEach(h=>{const t=$('.hs-t',h);if(mob()){h.style.height='';t.style.transform='';return}
  h.style.height=Math.max(innerHeight*3,t.scrollWidth-innerWidth+innerHeight)+'px'})}

/* service state */
function setSv(i){if(i===cur)return;cur=i;
  svs.forEach((s,k)=>s.classList.toggle('on',k===i));
  navLi.forEach((l,k)=>l.classList.toggle('on',k===i));
  bn.textContent='0'+(i+1);bn.animate([{transform:'translateY(14px)',opacity:.2},{transform:'none',opacity:1}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)'})}

function update(){
  const y=scrollY,vh=innerHeight,m=mob();
  hd.classList.toggle('s',y>40);
  /* hero */
  const hp=clamp(y/vh);
  if(y<vh*2){
    hero.style.setProperty('--s',1+hp*.2);
    hero.style.setProperty('--o',(hp*.75).toFixed(3));
    hero.style.setProperty('--g',1+hp*1.3);
    heroC.style.transform=`translate3d(0,${-hp*70}px,0)`;heroC.style.opacity=1-hp*.7;
  }
  /* services */
  if(!m){
    const p=prog(svc),f=p*4,i=Math.min(3,Math.floor(f));
    setSv(i);
    svs.forEach((s,k)=>s.style.setProperty('--lp',k===i?(f-i).toFixed(3):.5));
    svBar.style.transform=`scaleX(${p})`;
  }
  /* layers */
  if(ly.getBoundingClientRect().top<vh&&ly.getBoundingClientRect().bottom>0){
    const p=prog(ly);
    lyA.style.transform=`translate3d(${-p*12}vw,${-p*130}vh,0) scale(${1+p*.1})`;
    lyA.style.opacity=clamp(1.4-p*1.4);
    lyB.style.transform=`translate3d(${p*6}vw,${-p*40}vh,0)`;
    lyC.style.opacity=clamp((p-.2)*2.5);
    lyC.style.transform=`translate3d(0,${(1-clamp((p-.2)*1.6))*30}vh,0) scale(${.85+p*.25})`;
    lyG.style.setProperty('--gx',30+p*50);lyG.style.setProperty('--gy',60-p*30);
    l1.style.transform=`translateX(${-p*14}vw)`;l2.style.transform=`translateX(${(p-.3)*8}vw)`;l3.style.transform=`translateX(${p*16}vw)`;
  }
  /* horizontal sections */
  if(!m)hss.forEach(h=>{
    const r=h.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
    const t=$('.hs-t',h),p=prog(h),max=t.scrollWidth-innerWidth;
    t.style.transform=`translate3d(${-p*max}px,0,0)`;
    $('.hsBar',h).style.transform=`scaleX(${p})`;
    $$('.fr img',h).forEach(im=>{const b=im.parentElement.getBoundingClientRect();im.style.transform=`translate3d(${(b.left+b.width/2-innerWidth/2)*-.09}px,0,0) scale(1.05)`});
  });
}
let tick=false;
const req=()=>{if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;update()})}};
addEventListener('scroll',req,{passive:true});
addEventListener('resize',()=>{sizeHS();if(mob()){svs.forEach(s=>s.style.removeProperty('--lp'));$$('.fr img').forEach(i=>i.style.transform='')}req()});
addEventListener('load',()=>{sizeHS();update()});
sizeHS();update();

/* IntersectionObserver reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
$$('.rv:not(.in),.rl,.rr,.clip,.sp').forEach(el=>io.observe(el));
/* mobile service reveal */
const io2=new IntersectionObserver(es=>es.forEach(e=>{if(mob()&&e.isIntersecting){e.target.classList.add('on');io2.unobserve(e.target)}}),{threshold:.25});
svs.forEach(s=>io2.observe(s));
/* counters */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,n=+el.dataset.count,t0=performance.now();
  (function f(t){const k=clamp((t-t0)/1800);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)}),{threshold:.5});
$$('[data-count]').forEach(el=>cio.observe(el));

/* marquee */
const areas='LA JOLLA,PACIFIC BEACH,MISSION BEACH,OCEAN BEACH,NORTH PARK,HILLCREST,DOWNTOWN SAN DIEGO,GASLAMP QUARTER,LITTLE ITALY,POINT LOMA,CORONADO,CARLSBAD,ENCINITAS,DEL MAR,CHULA VISTA,MISSION VALLEY,CLAIREMONT,MIRA MESA,RANCHO BERNARDO,POWAY'.split(',');
$$('.mq-t').forEach((t,k)=>{const list=k?[...areas].reverse():areas;const h=list.map(a=>`<span>${a}</span>`).join('');t.innerHTML=h+h});

/* testimonial slider */
const sls=$$('.sl'),tsBar=$('#tsBar'),tsN=$('#tsN'),ts=$('#testimonials');let ti=0,timer;
function go(n){const o=sls[ti];ti=(n+sls.length)%sls.length;o.classList.remove('on');o.classList.add('out');setTimeout(()=>o.classList.remove('out'),900);
  sls[ti].classList.add('on');tsN.textContent=`0${ti+1} / 0${sls.length}`;prog2()}
function prog2(){clearTimeout(timer);tsBar.style.transition='none';tsBar.style.transform='scaleX(0)';tsBar.offsetWidth;
  tsBar.style.transition='transform 7s linear';tsBar.style.transform='scaleX(1)';timer=setTimeout(()=>go(ti+1),7000)}
$('#tsP').onclick=()=>go(ti-1);$('#tsX').onclick=()=>go(ti+1);
ts.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(ti-1);if(e.key==='ArrowRight')go(ti+1)});
let sx=0;ts.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
ts.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)go(ti+(d<0?1:-1))});
prog2();

/* FAQ */
$$('.fi').forEach(f=>{const b=$('button',f),a=$('.fa',f);
  b.onclick=()=>{const open=f.classList.contains('o');
    $$('.fi.o').forEach(o=>{o.classList.remove('o');$('button',o).setAttribute('aria-expanded',false);$('.fa',o).style.height=0});
    if(!open){f.classList.add('o');b.setAttribute('aria-expanded',true);a.style.height=a.scrollHeight+'px'}}});
})();
