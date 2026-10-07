// @ts-nocheck
/* Движок карты ВСЦМ (WebGL, three.js). Перенесён из прототипа библиотеки без изменения поведения. */
import * as THREE from 'three';
import { fmt, ic, initSeg } from './helpers';

export function mountMap(root, MD, opts = {}) {
const __off=[];const __on=(el,ev,fn,o)=>{el.addEventListener(ev,fn,o);__off.push(()=>el.removeEventListener(ev,fn,o))};

let __far=1,__inited=false;MD=JSON.parse(JSON.stringify(MD));const R=MD.R,O=MD.O,OK=Object.keys(O);
const $=(s,r=root)=>r.querySelector(s),$$=(s,r=root)=>[...r.querySelectorAll(s)];
function hh(s){let x=2166136261;for(const c of s){x^=c.charCodeAt(0);x=Math.imul(x,16777619)}return ((x>>>0)%100000)/100000}
const NORM=60;
const MET=[{k:'emp',n:'Доля трудоустроенных',f:r=>55+hh(r.n+'e')*18,fmt:v=>fmt(v,1)+'%'},{k:'grd',n:'Выпускники',f:r=>Math.round(1200+Math.pow(hh(r.n+'g'),2.2)*60000+(r.n==='Москва'?190000:r.n==='Санкт-Петербург'?90000:r.n==='Московская область'?60000:0)),fmt:v=>v>=1e6?fmt(v/1e6,2)+' млн':v>=1e4?fmt(Math.round(v/1000))+' тыс.':fmt(v)},{k:'sal',n:'Зарплата выпускников',f:r=>Math.round(38+hh(r.n+'s')*44+(r.n==='Москва'?30:0)),fmt:v=>fmt(v)+'\u00a0тыс. ₽'}];
R.forEach(r=>{r.v={};MET.forEach(m=>r.v[m.k]=m.f(r));r.tr=[0,1,2,3,4].map(i=>r.v.emp-3.6+i*.9+(hh(r.n+i)-.5)*2)});
const ON=o=>o==='НР'?'Новые регионы':O[o].n+' ФО',ONF=o=>o==='НР'?'Новые регионы':O[o].n+' федеральный округ';
let MI=0;const met=()=>MET[MI];
function okv(o,k){const rs=R.filter(r=>r.o===o),w=rs.reduce((s,r)=>s+r.v.grd,0);return k==='grd'?w:rs.reduce((s,r)=>s+r.v[k]*r.v.grd,0)/w}

/* ---------- геометрия ---------- */
function polys(d){const out=[];d.split('M').filter(Boolean).forEach(seg=>{const pts=seg.replace('Z','').split('L').map(p=>p.trim().split(/\s+/).map(Number)).filter(p=>p.length===2&&!isNaN(p[0]));if(pts.length>2)out.push(pts)});return out}
const X=x=>x-453,Z=y=>y-247;
function inPoly(x,y,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c}

/* ---------- сцена ---------- */
const stage=$('#stage'),canvas=$('#cv3');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(38,1,1,5000);
scene.add(new THREE.HemisphereLight('#ffffff','#C9CFEA',1.6));
const dl=new THREE.DirectionalLight('#ffffff',1.1);dl.position.set(-250,700,500);scene.add(dl);
const pl={position:new THREE.Vector3(),intensity:0};
const dotTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#fff';g.beginPath();g.arc(32,32,26,0,Math.PI*2);g.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();

/* регионы */
const C_LO=new THREE.Color('#E1E5FD'),C_MID=new THREE.Color('#97A4FF'),C_HI=new THREE.Color('#1B2D83');
function rampColor(t){const c=new THREE.Color();return t<.5?c.copy(C_LO).lerp(C_MID,t*2):c.copy(C_MID).lerp(C_HI,(t-.5)*2)}
const lineMat=new THREE.LineBasicMaterial({color:'#ffffff',transparent:true,opacity:.9});
const meshes=[];const WHITE=new THREE.Color('#ffffff'),HOV=new THREE.Color('#5266F4');
R.forEach(r=>{const P=polys(r.d);r.P=P;r.big=P.reduce((a,b)=>b.length>a.length?b:a,P[0]);
  const shapes=P.map(p=>new THREE.Shape(p.map(([x,y])=>new THREE.Vector2(X(x),-Z(y)))));
  const geo=new THREE.ExtrudeGeometry(shapes,{depth:1,bevelEnabled:false});geo.rotateX(-Math.PI/2);
  const mat=new THREE.MeshLambertMaterial({color:'#97A4FF',transparent:true,opacity:1});
  const m=new THREE.Mesh(geo,mat);m.scale.y=.01;m.userData.r=r;r.mesh=m;scene.add(m);meshes.push(m);
  P.forEach(p=>{const g=new THREE.BufferGeometry().setFromPoints(p.map(([x,y])=>new THREE.Vector3(X(x),1.001,Z(y))));const l=new THREE.LineLoop(g,lineMat);m.add(l)});
  r.h=.01;r.hT=1;r.lift=0;r.liftT=0;r.col=new THREE.Color('#2E5BE4');r.colT=new THREE.Color('#2E5BE4');r.em=.25;r.emT=.25;r.op=1;r.opT=1});
/* точки организаций и сеть между ними */
const PTS=[];R.forEach(r=>{const n=40;const b=r.b;let k=0,t=0;r.pts=[];
  while(k<n&&t<4000){t++;const x=b[0]+Math.random()*(b[2]-b[0]),y=b[1]+Math.random()*(b[3]-b[1]);if(!r.P.some(p=>inPoly(x,y,p)))continue;r.pts.push([X(x),Z(y)]);k++}});
/* вузы: только точки */
const KNOWN={'Москва':['МГУ имени М.В. Ломоносова','НИУ ВШЭ','РАНХиГС','МГТУ им. Н.Э. Баумана','РТУ МИРЭА','Финансовый университет','РУДН','РЭУ им. Г.В. Плеханова'],'Московская область':['МФТИ','Технологический университет'],'Санкт-Петербург':['СПбГУ','ИТМО','СПбПУ Петра Великого'],'Республика Татарстан':['Казанский федеральный университет','Казанский медуниверситет'],'Татарстан':['Казанский федеральный университет','Казанский медуниверситет'],'Свердловская область':['УрФУ','УГМУ'],'Новосибирская область':['НГУ'],'Томская область':['ТГУ','ТПУ'],'Воронежская область':['Воронежский госуниверситет'],'Нижегородская область':['ННГУ им. Н.И. Лобачевского'],'Самарская область':['Самарский университет','Самарский политех'],'Челябинская область':['ЮУрГУ'],'Тюменская область':['Тюменский госуниверситет'],'Красноярский край':['СФУ'],'Ростовская область':['ЮФУ'],'Краснодарский край':['КубГУ'],'Волгоградская область':['ВолгГТУ'],'Приморский край':['ДВФУ'],'Хабаровский край':['ТОГУ'],'Республика Саха (Якутия)':['СВФУ'],'Ставропольский край':['СКФУ'],'Дагестан':['ДГУ'],'Северная Осетия - Алания':['СОГУ'],'Калининградская область':['БФУ им. И. Канта'],'Архангельская область':['САФУ'],'Пермский край':['ПНИПУ']};
const GEN=['Государственный университет','Технический университет','Медицинский университет','Педагогический университет','Аграрный университет','Экономический университет','Университет культуры и искусств','Юридический институт'];
const U=[];R.forEach(r=>{const n=Math.max(1,Math.min(10,Math.round(Math.sqrt(r.v.grd)/22)));const kn=KNOWN[r.n]||[];r.U=[];
  const sp=[];if(r.pts.length){sp.push(r.pts[0]);while(sp.length<Math.min(n,r.pts.length)){let best=null,bd=-1;r.pts.forEach(p=>{if(sp.includes(p))return;const d=Math.min(...sp.map(q=>(q[0]-p[0])**2+(q[1]-p[1])**2));if(d>bd){bd=d;best=p}});sp.push(best)}}
  for(let i=0;i<sp.length;i++){const nm=kn[i]||GEN[(i+kn.length)%GEN.length];const u={n:nm,r,p:sp[i],i:U.length};u.v={grd:Math.round(r.v.grd/n*(0.5+hh(nm+r.n)*1.2)),emp:Math.max(48,Math.min(86,r.v.emp+(hh(nm+'e'+r.n)-.5)*14)),sal:Math.round(r.v.sal*(0.85+hh(nm+'s')*.35))};u.tr=[0,1,2,3,4].map(k=>u.v.emp-3.4+k*.85+(hh(nm+k+r.n)-.5)*2);r.U.push(u);U.push(u)}});
const discG=new THREE.CircleGeometry(1,28);discG.rotateX(-Math.PI/2);const ringG=new THREE.CircleGeometry(1.6,28);ringG.rotateX(-Math.PI/2);
const uDot=new THREE.InstancedMesh(discG,new THREE.MeshBasicMaterial({color:'#ffffff',depthTest:false,depthWrite:false,transparent:true,opacity:.95}),U.length),uRing=new THREE.InstancedMesh(ringG,new THREE.MeshBasicMaterial({color:'#ffffff'}),U.length);uDot.renderOrder=10;uRing.visible=false;uDot.frustumCulled=false;uRing.frustumCulled=false;
U.forEach((u,i)=>{uDot.setColorAt(i,new THREE.Color('#ffffff'));u.s=0;u.sT=0});uDot.instanceColor.needsUpdate=true;scene.add(uRing,uDot);
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_v=new THREE.Vector3(),_s=new THREE.Vector3();
function syncU(dt){const base=CAM.dist*2*Math.tan(19*Math.PI/180)/Math.max(300,stage.clientHeight)*4.2;let ch=false;U.forEach((u,i)=>{const vis=!!ST.r&&ST.r===u.r&&!ST.fl;u.sT=vis?(ST.u===u?1.8:ST.hu===u?1.45:1):0;const k=1-Math.pow(1-.18,dt/16.7);if(Math.abs(u.sT-u.s)>.002){u.s+=(u.sT-u.s)*k;ch=true}
  const s=Math.max(.0001,u.s*base),y=u.r.h+u.r.lift*3+.25;_m.compose(_v.set(u.p[0],y+.05,u.p[1]),_q,_s.set(s,1,s));uDot.setMatrixAt(i,_m);_m.compose(_v.set(u.p[0],y,u.p[1]),_q,_s.set(s,1,s));uRing.setMatrixAt(i,_m)});
  uDot.instanceMatrix.needsUpdate=true;uRing.instanceMatrix.needsUpdate=true}
function colorU(){U.forEach((u,i)=>uDot.setColorAt(i,new THREE.Color('#ffffff')));uDot.instanceColor.needsUpdate=true}
const ptGeo=new THREE.BufferGeometry(),lnGeo=new THREE.BufferGeometry();let NP=0,NL=0;
{R.forEach(r=>{NP+=r.pts.length;NL+=r.pts.length*2});ptGeo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(NP*3),3));lnGeo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(NL*6),3))}
R.forEach(r=>{r.links=[];r.pts.forEach((p,i)=>{const d=r.pts.map((q,j)=>[j,(q[0]-p[0])**2+(q[1]-p[1])**2]).filter(x=>x[0]!==i).sort((a,b)=>a[1]-b[1]).slice(0,2);d.forEach(([j])=>r.links.push([i,j]))})});
const ptMat=new THREE.PointsMaterial({size:6,sizeAttenuation:false,map:dotTex,transparent:true,depthWrite:false,color:'#060D3F',opacity:.85});
const lnMat=new THREE.LineBasicMaterial({color:'#7584FA',transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false});

function syncPoints(){const pa=ptGeo.attributes.position.array,la=lnGeo.attributes.position.array;let i=0,j=0;
  R.forEach(r=>{const y=r.h+r.lift*3+.4,vis=ST.o&&r.o===ST.o&&(!ST.r||ST.r===r);r.pts.forEach(p=>{pa[i++]=vis?p[0]:1e6;pa[i++]=vis?y:1e6;pa[i++]=vis?p[1]:1e6});r.links.forEach(([a,b])=>{const A=r.pts[a],B=r.pts[b];la[j++]=A[0];la[j++]=vis?y:-999;la[j++]=A[1];la[j++]=B[0];la[j++]=vis?y:-999;la[j++]=B[1]})});
  for(;j<la.length;)la[j++]=0;ptGeo.attributes.position.needsUpdate=true;lnGeo.attributes.position.needsUpdate=true}
/* здания вузов */
let bld=null;
function buildings(r){if(bld){scene.remove(bld);bld.geometry.dispose();bld=null}if(!r)return;const n=Math.min(r.pts.length,24),g=new THREE.BoxGeometry(1,1,1);g.translate(0,.5,0);
  const mat=new THREE.MeshLambertMaterial({color:'#ffffff'});bld=new THREE.InstancedMesh(g,mat,n);bld.userData={t0:performance.now(),hs:[],r};
  const base=r.h*(1+r.lift);const span=Math.max(r.b[2]-r.b[0],r.b[3]-r.b[1]);const w=Math.max(.6,span/48);
  for(let i=0;i<n;i++)bld.userData.hs.push(w*(3+Math.random()*7));bld.userData.w=w;bld.userData.base=base;scene.add(bld)}
function tickBld(now){if(!bld)return;const {t0,hs,w,base,r}=bld.userData,k=Math.min(1,(now-t0)/900),e=1-Math.pow(1-k,3),m=new THREE.Matrix4();
  for(let i=0;i<hs.length;i++){const p=r.pts[i],h=hs[i]*Math.max(.001,Math.min(1,e*1.4-i*.02));m.compose(new THREE.Vector3(p[0],r.h+r.lift*3,p[1]),new THREE.Quaternion(),new THREE.Vector3(w,h,w));bld.setMatrixAt(i,m)}bld.instanceMatrix.needsUpdate=true}

/* ---------- потоки выпускников: дуги из региона ---------- */
const HUB={'Москва':5,'Санкт-Петербург':2.6,'Московская область':2.2,'Республика Татарстан':.9,'Татарстан':.9,'Свердловская область':.8,'Новосибирская область':.8,'Краснодарский край':1,'Тюменская область':.7,'Нижегородская область':.6};
function flowsOf(r){const stay=.45+hh(r.n+'st')*.35;const cand=R.filter(x=>x!==r&&x.o!=='НР').map(x=>{let w=(HUB[x.n]||.08)*(1+hh(r.n+x.n)*.6);if(x.o===r.o)w*=3;const d=Math.hypot(x.cx-r.cx,x.cy-r.cy);w*=1/(1+d/260);return {x,w}}).sort((a,b)=>b.w-a.w).slice(0,6);
  const W=cand.reduce((s,c)=>s+c.w,0),leave=1-stay;return {stay,top:cand.map(c=>({r:c.x,sh:leave*.8*c.w/W})),other:leave*.2,grd:r.v.grd}}
const arcG=new THREE.Group();scene.add(arcG);let FLW=null;const arcMat=new THREE.MeshBasicMaterial({color:'#2E5BE4',transparent:true,opacity:.9});
function clearArcs(){arcG.children.slice().forEach(m=>{m.geometry.dispose();arcG.remove(m)});FLW=null}
function buildArcs(r){clearArcs();FLW=flowsOf(r);FLW.t0=performance.now();const y0=3;
  FLW.top.forEach((f,i)=>{const a=new THREE.Vector3(X(r.cx),y0,Z(r.cy)),b=new THREE.Vector3(X(f.r.cx),y0,Z(f.r.cy)),d=a.distanceTo(b),mid=a.clone().add(b).multiplyScalar(.5);mid.y=y0+Math.max(8,d*.32);
    const curve=new THREE.QuadraticBezierCurve3(a,mid,b),g=new THREE.TubeGeometry(curve,64,.5+f.sh*9,8,false);g.setDrawRange(0,0);const m=new THREE.Mesh(g,arcMat);m.userData={n:g.index.count,delay:i*90};arcG.add(m);
    const cap=new THREE.Mesh(new THREE.CircleGeometry(1.2+f.sh*12,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:'#2E5BE4',transparent:true,opacity:0}));cap.position.set(b.x,y0+.2,b.z);cap.userData={cap:true,delay:i*90+700};arcG.add(cap)})}
function tickArcs(now){if(!FLW)return;arcG.children.forEach(m=>{const k=Math.max(0,Math.min(1,(now-FLW.t0-m.userData.delay)/900)),e=1-Math.pow(1-k,3);if(m.userData.cap)m.material.opacity=e*.35;else m.geometry.setDrawRange(0,Math.floor(m.userData.n*e/3)*3)})}
/* ---------- камера: вращение, приближение, перелёты ---------- */
const CAM={tx:0,ty:0,tz:10,dist:760,th:0,ph:.62},DES={...CAM};
function applyCam(){const sp=Math.sin(CAM.ph),x=CAM.tx+CAM.dist*sp*Math.sin(CAM.th),y=CAM.ty+CAM.dist*Math.cos(CAM.ph),z=CAM.tz+CAM.dist*sp*Math.cos(CAM.th);camera.position.set(x,y,z);camera.lookAt(CAM.tx,CAM.ty,CAM.tz)}
function flyTo(b,distK=1,ph){const cx=X((b[0]+b[2])/2),cz=Z((b[1]+b[3])/2),span=Math.max(b[2]-b[0],(b[3]-b[1])*1.6);DES.tx=cx;DES.tz=cz+span*.05;DES.dist=Math.max(22,span*1.25*distK*Math.max(1,(__far||1)*.8));if(ph!=null)DES.ph=ph}
let dragging=false,downX=0,downY=0,lastX=0,lastY=0,moved=0,idleT=performance.now();
canvas.addEventListener('pointerdown',e=>{dragging=true;moved=0;downX=lastX=e.clientX;downY=lastY=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.classList.add('drag');idleT=performance.now()});
canvas.addEventListener('pointerup',e=>{dragging=false;canvas.classList.remove('drag');if(moved<6)click(e)});
canvas.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.dirty=true;if(dragging){const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);DES.th=Math.max(-.45,Math.min(.45,DES.th-dx*.003));if(!MODE2D)DES.ph=Math.max(.25,Math.min(.95,DES.ph-dy*.003));idleT=performance.now()}});
canvas.addEventListener('pointerleave',()=>{mouse.in=false;setHover(null)});canvas.addEventListener('pointerenter',()=>{mouse.in=true});
canvas.addEventListener('wheel',e=>{e.preventDefault();DES.dist=Math.max(45,Math.min(1200,DES.dist*(1+Math.sign(e.deltaY)*.12)));idleT=performance.now()},{passive:false});
$('#rst').onclick=()=>goRF();
/* ---------- состояние ---------- */
const ST={o:null,r:null,hov:null,u:null,hu:null,fl:false};let MODE2D=false;
$('#md').onclick=()=>{MODE2D=!MODE2D;$('#md').textContent=MODE2D?'2.5D':'2D';DES.ph=MODE2D?.001:.62;if(MODE2D)DES.th=0};
function scaleOf(vals){const lo=Math.min(...vals),hi=Math.max(...vals);return {lo,hi,t:v=>(v-lo)/((hi-lo)||1)}}
let SC;
function restyle(origin){const m=met(),now=performance.now();
  if(!ST.o){const ov={};OK.forEach(o=>ov[o]=okv(o,m.k));SC=scaleOf(Object.values(ov));R.forEach(r=>{const t=SC.t(ov[r.o]);r.colT.copy(rampColor(.08+t*.88));r.hT=3;r.opT=1})}
  else{const rs=R.filter(r=>r.o===ST.o);SC=scaleOf(rs.map(r=>r.v[m.k]));R.forEach(r=>{const fd=ST.fl&&FLW&&FLW.top.find(f=>f.r===r);if(fd){r.colT.copy(rampColor(.18+Math.min(.27,fd.sh*2.5)));r.hT=1.2;r.opT=1;return}if(ST.fl&&r===ST.r){r.colT.set('#1B2D83');r.hT=4;r.opT=1;return}if(r.o!==ST.o){r.colT.set('#E6E9F2');r.hT=ST.r?Math.min(1.2,Math.max(ST.r.b[2]-ST.r.b[0],ST.r.b[3]-ST.r.b[1])*.06):1.2;r.opT=1;return}const t=SC.t(r.v[m.k]);r.colT.copy(rampColor(.08+t*.88));if(ST.r&&ST.r!==r)r.colT.lerp(new THREE.Color('#E6E9F2'),.72);const sp=ST.r?Math.max(ST.r.b[2]-ST.r.b[0],ST.r.b[3]-ST.r.b[1]):99,base=Math.min(3,sp*.12);r.hT=ST.r===r?base*2:base;r.opT=1})}
  if(origin)R.forEach(r=>{r.delay=now+Math.hypot(r.cx-origin[0],r.cy-origin[1])*1.6});else R.forEach(r=>r.delay=now);
  $('#lg').innerHTML=`<span>${m.n}${ST.o?', регионы округа':', округа'}</span><i></i><div class="r"><span>${m.fmt(SC.lo)}</span><span>${m.fmt(SC.hi)}</span></div>`;hud();below()}
function hud(){const m=met();const c=[];if(ST.o)c.push('<button data-l="0">Россия</button>',ic('chevron-right'),ST.r?`<button data-l="1">${ON(ST.o)}</button>`:`<span>${ON(ST.o)}</span>`);if(ST.r)c.push(ic('chevron-right'),ST.u?`<button data-l="2">${ST.r.n}</button>`:`<span>${ST.r.n}</span>`);if(ST.u)c.push(ic('chevron-right'),`<span>${ST.u.n}</span>`);
  $('#cr').innerHTML=c.join('')||'<span>Карта страны</span>';$$('#cr button').forEach(b=>b.onclick=()=>{const l=+b.dataset.l;l===0?goRF():l===1?goO(ST.o):goR(ST.r)});
  $('#fl').style.display=ST.r&&!ST.u?'':'none';$('.ov.bl').style.display=ST.fl?'none':'';$('#fl').classList.toggle('on',ST.fl);$('#mT').textContent=ST.u?ST.u.n:ST.r?ST.r.n:ST.o?ONF(ST.o):'Россия';
  const v=ST.u?ST.u.v[m.k]:ST.r?ST.r.v[m.k]:ST.o?okv(ST.o,m.k):(m.k==='grd'?R.reduce((s,r)=>s+r.v.grd,0):R.reduce((s,r)=>s+r.v[m.k]*r.v.grd,0)/R.reduce((s,r)=>s+r.v.grd,0));
  $('#mSub').innerHTML=`${m.n}: <b>${m.fmt(v)}</b>`;
  $('#hint').textContent=ST.fl?'Дуги — куда уезжают работать выпускники региона. Толщина — сколько':ST.u?'Подробности по вузу ниже на странице. Esc: назад к региону':ST.r?'Точки — вузы региона. Нажмите на точку, чтобы открыть паспорт':ST.o?'Нажмите на регион. Esc или клик мимо: назад':'Тяните, чтобы повернуть. Колесо — ближе. Нажмите на округ'}
function goO(o,origin){ST.fl=false;clearArcs();ST.o=o;ST.r=null;ST.u=null;colorU();restyle(origin||[O[o].cx,O[o].cy]);flyTo(O[o].b,1,MODE2D?.001:.6)}
function goR(r){ST.fl=false;clearArcs();ST.o=r.o;ST.r=r;ST.u=null;colorU();restyle([r.cx,r.cy]);flyTo(r.b,Math.max(r.b[2]-r.b[0],r.b[3]-r.b[1])>120?.95:1.6,MODE2D?.001:.62)}
function goU(u){ST.fl=false;clearArcs();if(ST.o!==u.r.o||ST.r!==u.r){ST.o=u.r.o;ST.r=u.r;restyle([u.r.cx,u.r.cy])}ST.u=u;colorU();const span=Math.max(u.r.b[2]-u.r.b[0],u.r.b[3]-u.r.b[1]);DES.tx=u.p[0];DES.tz=u.p[1]+span*.04;DES.dist=Math.max(22,span*1.0);if(!MODE2D)DES.ph=.5;hud();below()}
function setFlows(on){if(!ST.r)return;ST.fl=on;if(on){buildArcs(ST.r);const pts=[ST.r,...FLW.top.map(f=>f.r)];const b=[Math.min(...pts.map(p=>p.b[0])),Math.min(...pts.map(p=>p.b[1])),Math.max(...pts.map(p=>p.b[2])),Math.max(...pts.map(p=>p.b[3]))];flyTo(b,.9,MODE2D?.001:.7)}else{clearArcs();goR(ST.r);return}$('#fl').classList.toggle('on',on);restyle(null)}
$('#fl').onclick=()=>setFlows(!ST.fl);
function goRF(){ST.fl=false;clearArcs();ST.o=null;ST.r=null;ST.u=null;colorU();restyle([453,250]);Object.assign(DES,{tx:0,ty:0,tz:10,dist:760*(__far||1),th:0,ph:MODE2D?.001:.62})}
__on(window,'keydown',e=>{if(e.key==='Escape'&&document.activeElement!==$('#q3')){if(ST.u)goR(ST.r);else if(ST.r)goO(ST.o);else if(ST.o)goRF()}});
initSeg($('#mS'),i=>{MI=i;restyle(ST.r?[ST.r.cx,ST.r.cy]:ST.o?[O[ST.o].cx,O[ST.o].cy]:[0,250])});
/* ---------- наведение и выбор ---------- */
const ray=new THREE.Raycaster(),mouse={x:0,y:0,dirty:false,in:false},ndc=new THREE.Vector2();
const tip=$('#mtip');let TX=0,TY=0,CX=0,CY=0;
function pickAt(cx,cy){const rc=canvas.getBoundingClientRect();ndc.set((cx-rc.left)/rc.width*2-1,-(cy-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,camera);const hit=ray.intersectObjects(meshes,false)[0];return hit?hit.object.userData.r:null}
function setHover(r){if(ST.hov===r)return;ST.hov=r;R.forEach(x=>x.liftT=0);
  if(r){const grp=!ST.o||r.o!==ST.o?R.filter(x=>x.o===r.o):[r];grp.forEach(x=>x.liftT=!ST.o?.8:(r.o===ST.o?1:.8));tip.innerHTML=tipHTML(r);tip.classList.add('on');canvas.style.cursor='pointer'}else{tip.classList.remove('on');canvas.style.cursor=''}}
function tipU(u){const m=met();return `<div class="n">${u.n}</div><div class="v">${m.fmt(u.v[m.k])}</div><div class="h">${ST.u===u?'Подробности ниже на странице':'Вуз, '+u.r.n+'. Нажмите, чтобы открыть'}</div>`}
function tipHTML(r){const m=met();if(ST.fl&&FLW){if(r===ST.r)return `<div class="n">${r.n}</div><div class="v">${fmt(FLW.stay*100,0)}%</div><div class="h">остаются работать в регионе</div>`;const f=FLW.top.find(x=>x.r===r);if(f)return `<div class="n">${ST.r.n} → ${r.n}</div><div class="v">${fmt(Math.round(FLW.grd*f.sh/100)*100)} чел.</div><div class="h">${fmt(f.sh*100,1)}% выпускников региона</div>`}if(!ST.o||r.o!==ST.o)return `<div class="n">${ON(r.o)}</div><div class="v">${m.fmt(okv(r.o,m.k))}</div><div class="h">${ST.o?'Перейти в этот округ':'Нажмите, чтобы приблизить'}</div>`;
  return `<div class="n">${r.n}</div><div class="v">${m.fmt(r.v[m.k])}</div><div class="h">${ST.r===r?'Подробности ниже на странице':'Нажмите, чтобы открыть'}</div>`}
function pickU(cx,cy){if(!ST.r)return null;const rc=canvas.getBoundingClientRect();ndc.set((cx-rc.left)/rc.width*2-1,-(cy-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,camera);const h=ray.intersectObject(uRing,false)[0];if(!h)return null;const u=U[h.instanceId];return u&&u.s>.3?u:null}
function click(e){const uu=pickU(e.clientX,e.clientY);if(uu){goU(uu);return}const r=pickAt(e.clientX,e.clientY);if(!r){if(ST.r)goO(ST.o);else if(ST.o)goRF();return}if(!ST.o||r.o!==ST.o)goO(r.o,[r.cx,r.cy]);else goR(r);tip.innerHTML=tipHTML(r)}
/* ---------- содержимое ниже ---------- */
function below(){opts.onChange&&opts.onChange({okrug:ST.o?ONF(ST.o):null,region:ST.r?ST.r.n:null,vuz:ST.u?ST.u.n:null,flows:ST.fl})}
/* ---------- поиск внутри карты ---------- */
{const q=$('#q3'),res=$('#q3r');const items=[...R.map(r=>({t:'r',n:r.n,s:ON(r.o),r})),...U.map(u=>({t:'u',n:u.n,s:'вуз, '+u.r.n,u}))];
 const go=it=>{q.value='';res.classList.remove('on');q.blur();idleT=performance.now();if(it.t==='r'){if(ST.o!==it.r.o){goO(it.r.o);setTimeout(()=>goR(it.r),650)}else goR(it.r)}else{if(ST.o!==it.u.r.o){goO(it.u.r.o);setTimeout(()=>goU(it.u),650)}else goU(it.u)}};
 let sel=0,hits=[];const draw=()=>{res.innerHTML=hits.length?hits.map((it,i)=>`<button class="${i===sel?'on':''}" data-i="${i}"><b>${it.n}</b><span>${it.s}</span></button>`).join(''):'<div class="no">Ничего не найдено</div>';$$('button',res).forEach(b=>b.onmousedown=e=>{e.preventDefault();go(hits[+b.dataset.i])})};
 q.addEventListener('input',()=>{const s=q.value.trim().toLowerCase();if(!s){res.classList.remove('on');return}hits=items.filter(it=>it.n.toLowerCase().includes(s)).sort((a,b)=>a.n.toLowerCase().indexOf(s)-b.n.toLowerCase().indexOf(s)).slice(0,7);sel=0;draw();res.classList.add('on')});
 q.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){sel=Math.min(hits.length-1,sel+1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);draw();e.preventDefault()}else if(e.key==='Enter'&&hits[sel])go(hits[sel]);else if(e.key==='Escape'){q.value='';res.classList.remove('on');q.blur()}});
 q.addEventListener('blur',()=>setTimeout(()=>res.classList.remove('on'),150));}
/* ---------- рендер ---------- */
function resize(){const w=stage.clientWidth,h=stage.clientHeight;const far=Math.max(1,1.75/(w/h));__far=far;if(!ST.o){DES.dist=760*far;if(!__inited){CAM.dist=DES.dist;__inited=1}}renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
const __ro=new ResizeObserver(resize);__ro.observe(stage);resize();
let running=true,__dead=false;const __io=new IntersectionObserver(es=>{running=es[0].isIntersecting&&!__dead;if(running)requestAnimationFrame(loop)});__io.observe(stage);
const t0=performance.now();let lastPick=0,prevT=performance.now();const kf=(a,dt)=>1-Math.pow(1-a,dt/16.7);
function loop(now){if(!running)return;requestAnimationFrame(loop);const dt=Math.min(100,now-prevT);prevT=now;const k1=kf(.075,dt),k2=kf(.12,dt),k3=kf(.18,dt),k4=kf(.08,dt),k5=kf(.1,dt);
  const intro=Math.min(1,(now-t0)/1800);
  /* камера */
  if(!dragging&&!ST.o&&!MODE2D&&now-idleT>5000)DES.th=Math.sin((now-idleT-5000)/7000)*.08;
  for(const k of ['tx','ty','tz','dist','th','ph'])CAM[k]+=(DES[k]-CAM[k])*k1;applyCam();
  /* регионы */
  let ch=false;R.forEach(r=>{if(now<r.delay)return;const iw=Math.min(1,Math.max(0,(intro*1.6-(r.cx/906)*.6)));const hT=r.hT*iw;
    const dh=hT-r.h,dl2=r.liftT-r.lift;if(Math.abs(dh)>.005||Math.abs(dl2)>.002){r.h+=dh*k2;r.lift+=dl2*k3;ch=true}
    r.col.lerp(r.colT,k4);r.op+=(r.opT-r.op)*k5;
    const m=r.mesh;m.scale.y=Math.max(.01,r.h+r.lift*3);const hl=r.lift>0.01?Math.min(1,r.lift*1.6)*.4:0;m.material.color.copy(r.col).lerp(HOV,hl);m.material.opacity=r.op;m.material.transparent=r.op<.99});
  syncU(dt);tickArcs(now);
  ptMat.opacity=.75+.15*Math.sin(now/900);
  /* наведение */
  if(mouse.in&&!dragging&&now-lastPick>40){lastPick=now;const hu=pickU(mouse.x,mouse.y);if(hu!==ST.hu){ST.hu=hu;colorU()}if(hu){ST.hov=null;R.forEach(x=>x.liftT=0);if(ST.r)ST.r.liftT=0;tip.innerHTML=tipU(hu);tip.classList.add('on');canvas.style.cursor='pointer';ST.hovU=true}else{if(ST.hovU){ST.hovU=false;ST.hov=undefined}setHover(pickAt(mouse.x,mouse.y))}}
  
  if(ST.hov||ST.hu){TX=Math.min(innerWidth-tip.offsetWidth-12,mouse.x+18);TY=mouse.y+18;CX+=(TX-CX)*.3;CY+=(TY-CY)*.3;tip.style.transform=`translate(${Math.round(CX)}px,${Math.round(CY)}px)`}else{CX=mouse.x;CY=mouse.y}
  renderer.render(scene,camera)}
restyle(null);applyCam();requestAnimationFrame(loop);setTimeout(()=>$('#ld').style.opacity=0,300);
return {goO:o=>goO(o),goR:n=>{const r=R.find(x=>x.n===n);if(r)goR(r)},goU:n=>{const u=U.find(x=>x.n===n);if(u)goU(u)},goRF,setFlows,destroy(){__dead=true;running=false;__io.disconnect();__ro.disconnect();__off.forEach(f=>f());renderer.dispose()}};
}
