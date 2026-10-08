(()=>{
'use strict';
if(window.__HS_UNIFIED_ROUTER_041__) return;
window.__HS_UNIFIED_ROUTER_041__=true;

const BASE=new URL('./predictive/',window.location.href).href;
const REGISTRY=BASE+'model-registry-v2.json';
const heartLabels={
 age:['Età','anni','Generale'],sex:['Sesso','','Cardiovascolare'],cp:['Tipo di dolore toracico','','Cardiovascolare'],
 trestbps:['Pressione sistolica a riposo','mmHg','Cardiovascolare'],chol:['Colesterolo sierico','mg/dL','Cardiovascolare'],
 fbs:['Glicemia a digiuno >120 mg/dL','','Cardiovascolare'],restecg:['ECG a riposo','','Cardiovascolare'],
 thalach:['Frequenza cardiaca massima raggiunta','bpm','Cardiovascolare'],exang:['Angina indotta da esercizio','','Cardiovascolare'],
 oldpeak:['Depressione ST da esercizio','','Cardiovascolare'],slope:['Pendenza segmento ST al picco','','Cardiovascolare'],
 ca:['Vasi principali colorati alla fluoroscopia','','Cardiovascolare'],thal:['Thal','','Cardiovascolare']
};
const heartCategorical={
 sex:[['','—'],['0','Femmina'],['1','Maschio']],
 cp:[['','—'],['1','Angina tipica'],['2','Angina atipica'],['3','Dolore non anginoso'],['4','Asintomatico']],
 fbs:[['','—'],['0','No'],['1','Sì']],
 restecg:[['','—'],['0','Normale'],['1','Alterazioni ST-T'],['2','Ipertrofia ventricolare sinistra']],
 exang:[['','—'],['0','No'],['1','Sì']],
 slope:[['','—'],['1','Ascendente'],['2','Piatta'],['3','Discendente']],
 ca:[['','—'],['0','0'],['1','1'],['2','2'],['3','3']],
 thal:[['','—'],['3','Normale'],['6','Difetto fisso'],['7','Difetto reversibile']]
};
const groups=['Generale','Cardiovascolare','Rene / laboratorio','FNA mammella'];
const style=`
#hs-router041{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:1180px;margin:18px auto;padding:0 14px;color:#162033}
#hs-router041 *{box-sizing:border-box}
#hs-router041 .card{background:#fff;border:1px solid #d7deea;border-radius:16px;padding:18px;box-shadow:0 8px 24px #12203312}
#hs-router041 h2{margin:0 0 6px;font-size:1.5rem}#hs-router041 h3{font-size:1.05rem;margin:18px 0 8px}
#hs-router041 .muted{color:#5d6b82;font-size:.92rem;line-height:1.45}
#hs-router041 .group{border-top:1px solid #e5eaf1;margin-top:15px;padding-top:10px}
#hs-router041 .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}
#hs-router041 label{display:flex;flex-direction:column;gap:4px;font-size:.86rem;font-weight:650;min-width:0}
#hs-router041 input,#hs-router041 select{min-height:42px;border:1px solid #b8c4d6;border-radius:9px;padding:8px 10px;background:#fff;color:#162033;font-size:16px;min-width:0}
#hs-router041 .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
#hs-router041 button{min-height:42px;border:0;border-radius:10px;padding:9px 14px;font-weight:700;cursor:pointer}
#hs-router041 button:disabled{opacity:.55;cursor:not-allowed}
#hs-router041 .primary{background:#2457d6;color:#fff}#hs-router041 .secondary{background:#e8eef9;color:#183466}
#hs-router041 .coverage{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-top:14px}
#hs-router041 .mini{border:1px solid #dce3ee;border-radius:12px;padding:12px;background:#f8fafc}
#hs-router041 .ready{border-color:#a9d3b7;background:#f1faf4}.blocked{border-color:#e2c6a0;background:#fff9ee}
#hs-router041 .results{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:14px}
#hs-router041 .result{border:1px solid #d6dfed;border-radius:12px;padding:14px;background:#f4f7fb}
#hs-router041 .prob{font-size:1.8rem;font-weight:800;letter-spacing:-.03em}
#hs-router041 .bar{height:10px;background:#dfe6f1;border-radius:999px;overflow:hidden;margin:7px 0 10px}
#hs-router041 .bar span{display:block;height:100%;background:#2457d6}
#hs-router041 .warn{margin-top:8px;color:#674c13;font-size:.86rem}.good{color:#25613a;font-size:.86rem}
#hs-router041 table{width:100%;border-collapse:collapse;font-size:.84rem;margin-top:8px}
#hs-router041 th,#hs-router041 td{text-align:left;padding:5px;border-bottom:1px solid #e1e6ee}
@media(max-width:600px){#hs-router041{padding:0 8px}#hs-router041 .card{padding:14px}}
`;
function el(tag,attrs={},children=[]){
 const n=document.createElement(tag);
 Object.entries(attrs).forEach(([k,v])=>{if(k==='class')n.className=v;else if(k==='text')n.textContent=v;else n.setAttribute(k,v);});
 (Array.isArray(children)?children:[children]).forEach(c=>{if(c!==null&&c!==undefined)n.append(c);});
 return n;
}
const root=el('section',{id:'hs-router041'}),card=el('div',{class:'card'});
card.append(el('style',{text:style}),el('h2',{text:'Unified Predictive Case Router 0.41'}));
card.append(el('div',{class:'muted',text:'Compila un solo caso. HealthSolver misura automaticamente la copertura richiesta da ogni modello, esegue quelli compatibili e motiva le astensioni. Le probabilità appartengono a outcome diversi e non devono essere sommate o ordinate come diagnosi alternative.'}));
const formHost=el('div'),coverage=el('div',{class:'coverage'}),actions=el('div',{class:'actions'});
const runBtn=el('button',{type:'button',class:'primary',text:'Analizza con tutti i modelli applicabili',disabled:'disabled'});
const resetBtn=el('button',{type:'button',class:'secondary',text:'Azzera caso',disabled:'disabled'});
actions.append(runBtn,resetBtn);
const status=el('div',{class:'muted',text:'Caricamento registry e modelli…'}),results=el('div',{class:'results','aria-live':'polite'});
card.append(formHost,coverage,actions,status,results);root.append(card);
const mainHost=document.querySelector('main');
if(mainHost) mainHost.prepend(root);
else {
 const anchor=document.querySelector('#app,#root,body>div');
 if(anchor) anchor.prepend(root); else document.body.prepend(root);
}

let registry=null,models=[],controls={},featureInfo={};
const sigmoid=z=>1/(1+Math.exp(-Math.max(-35,Math.min(35,z))));
function groupFor(model,f){
 if(f==='age')return 'Generale';
 if(model.model_id==='HS-UCI-HD-001')return 'Cardiovascolare';
 if(model.model_id==='HS-UCI-CKD-001')return 'Rene / laboratorio';
 return 'FNA mammella';
}
function infoFor(model,f){
 if(heartLabels[f]){
  const [label,unit,group]=heartLabels[f];return {label,unit,group};
 }
 const meta=(model.field_meta||{})[f]||{};
 return {label:meta.label||f,unit:meta.unit||'',group:groupFor(model,f),min:meta.training_min,max:meta.training_max};
}
function makeInput(f,info){
 if(heartCategorical[f]){
  const s=el('select',{'data-unified-feature':f});heartCategorical[f].forEach(([v,t])=>s.append(el('option',{value:v,text:t})));return s;
 }
 const a={type:'number',step:'any','data-unified-feature':f};
 if(Number.isFinite(info.min))a.min=String(info.min);
 if(Number.isFinite(info.max))a.max=String(info.max);
 return el('input',a);
}
function buildForm(){
 const features=[];
 models.forEach(m=>m.features.forEach(f=>{
   if(!features.includes(f)){
     features.push(f);featureInfo[f]=infoFor(m,f);
   } else {
     const now=featureInfo[f],fresh=infoFor(m,f);
     if(!now.unit&&fresh.unit)now.unit=fresh.unit;
   }
 }));
 groups.forEach(g=>{
  const fs=features.filter(f=>featureInfo[f].group===g);if(!fs.length)return;
  const sec=el('div',{class:'group'});sec.append(el('h3',{text:g}));
  const grid=el('div',{class:'grid'});
  fs.forEach(f=>{
   const i=featureInfo[f],label=el('label',{text:i.label+(i.unit?' ('+i.unit+')':'')});
   const input=makeInput(f,i);controls[f]=input;label.append(input);grid.append(label);
  });
  sec.append(grid);formHost.append(sec);
 });
 Object.values(controls).forEach(x=>x.addEventListener('input',updateCoverage));
 runBtn.disabled=false;resetBtn.disabled=false;updateCoverage();
}
function read(f){
 const x=controls[f];if(!x||x.value==='')return null;const v=Number(x.value);return Number.isFinite(v)?v:null;
}
function readiness(m){
 const missing=m.features.filter(f=>read(f)===null);
 return {missing,ready:missing.length<=m.abstention.max_missing_features,provided:m.features.length-missing.length};
}
function updateCoverage(){
 coverage.innerHTML='';
 models.forEach(m=>{
  const r=readiness(m),box=el('div',{class:'mini '+(r.ready?'ready':'blocked')});
  box.append(el('strong',{text:(registry.models.find(x=>x.model_id===m.model_id)||{}).title||m.model_id}));
  box.append(el('div',{class:'muted',text:`${r.provided}/${m.features.length} feature presenti · massimo mancanti consentiti: ${m.abstention.max_missing_features}`}));
  box.append(el('div',{class:r.ready?'good':'warn',text:r.ready?'Applicabile al caso corrente':`Astensione: mancano ${r.missing.length} feature`}));
  coverage.append(box);
 });
}
function infer(m){
 const rr=readiness(m);if(!rr.ready)return {status:'abstain',missing:rr.missing};
 let score=m.logistic.intercept,contrib=[],imputed=[],ood=[];
 for(const f of m.features){
  const meta=(m.field_meta||{})[f]||{},raw=read(f),v=raw===null?m.imputation.values[f]:raw;
  if(raw===null)imputed.push(f);
  if(raw!==null&&Number.isFinite(meta.training_min)&&Number.isFinite(meta.training_max)&&(raw<meta.training_min||raw>meta.training_max))ood.push(f);
  const z=(v-m.standardization.mean[f])/m.standardization.scale[f],c=z*m.logistic.coefficients[f];
  score+=c;contrib.push([f,c,v,raw===null]);
 }
 const p=sigmoid(m.calibration.intercept+m.calibration.slope*score);
 contrib.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
 return {status:'predicted',p,contrib,imputed,ood};
}
function renderResult(m,res){
 const entry=registry.models.find(x=>x.model_id===m.model_id)||{},box=el('article',{class:'result'});
 box.append(el('strong',{text:entry.title||m.model_id}),el('div',{class:'muted',text:m.model_id}));
 if(res.status==='abstain'){
  box.append(el('div',{class:'warn',text:`Previsione non eseguita. Mancano ${res.missing.length} feature richieste: ${res.missing.slice(0,8).join(', ')}${res.missing.length>8?'…':''}`}));
  return box;
 }
 const pct=res.p*100;box.append(el('div',{class:'prob',text:pct.toFixed(1)+'%'}));
 const bar=el('div',{class:'bar'});bar.append(el('span',{style:`width:${Math.max(0,Math.min(100,pct)).toFixed(1)}%`}));box.append(bar);
 box.append(el('div',{class:'muted',text:m.task}));
 if(res.imputed.length)box.append(el('div',{class:'warn',text:`Imputati con mediana training: ${res.imputed.join(', ')}`}));
 if(res.ood.length)box.append(el('div',{class:'warn',text:`Fuori range training: ${res.ood.join(', ')}`}));
 const tbl=el('table');tbl.innerHTML='<thead><tr><th>Feature</th><th>Contributo</th></tr></thead>';const tb=el('tbody');
 res.contrib.slice(0,4).forEach(([f,c])=>{const tr=el('tr');tr.append(el('td',{text:(featureInfo[f]?.label||f)}),el('td',{text:(c>=0?'+':'')+c.toFixed(3)}));tb.append(tr);});tbl.append(tb);box.append(tbl);
 box.append(el('div',{class:'muted',text:`Test interno: AUROC ${m.metrics_test.auroc.toFixed(3)} · Brier ${m.metrics_test.brier.toFixed(3)} · nessuna validazione clinica esterna/prospettica.`}));
 return box;
}
runBtn.addEventListener('click',()=>{
 results.innerHTML='';const executed=[];
 models.forEach(m=>{const r=infer(m);executed.push([m,r]);results.append(renderResult(m,r));});
 const n=executed.filter(([,r])=>r.status==='predicted').length;
 status.textContent=`Router completato: ${n}/${models.length} modelli applicati; ${models.length-n} astensione/i. Le stime non sono una diagnosi differenziale e non sono reciprocamente esclusive.`;
});
resetBtn.addEventListener('click',()=>{Object.values(controls).forEach(x=>x.value='');results.innerHTML='';status.textContent='Caso azzerato.';updateCoverage();});

fetch(REGISTRY,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('registry HTTP '+r.status);return r.json();}).then(async reg=>{
 registry=reg;
 const loaded=await Promise.all(reg.models.map(async e=>{const r=await fetch(BASE+e.file,{cache:'no-store'});if(!r.ok)throw new Error(e.file+' HTTP '+r.status);return r.json();}));
 models=loaded;buildForm();status.textContent=`Router pronto · ${models.length} modelli caricati · ${Object.keys(controls).length} feature unificate disponibili.`;
}).catch(e=>{status.textContent='Unified router non disponibile: '+e.message;});
})();