(()=>{
'use strict';
if(window.__HS_PREDICTIVE_ENGINE_040__) return;
window.__HS_PREDICTIVE_ENGINE_040__=true;

const BASE='./predictive/';
const REGISTRY=BASE+'model-registry-v2.json';
const categorical={
  'HS-UCI-HD-001':{
    sex:[['','—'],['0','Femmina'],['1','Maschio']],
    cp:[['','—'],['1','Angina tipica'],['2','Angina atipica'],['3','Dolore non anginoso'],['4','Asintomatico']],
    fbs:[['','—'],['0','No'],['1','Sì']],
    restecg:[['','—'],['0','Normale'],['1','Alterazioni ST-T'],['2','Ipertrofia ventricolare sinistra']],
    exang:[['','—'],['0','No'],['1','Sì']],
    slope:[['','—'],['1','Ascendente'],['2','Piatta'],['3','Discendente']],
    ca:[['','—'],['0','0'],['1','1'],['2','2'],['3','3']],
    thal:[['','—'],['3','Normale'],['6','Difetto fisso'],['7','Difetto reversibile']]
  }
};
const heartLabels={
 age:'Età (anni)',sex:'Sesso',cp:'Tipo di dolore toracico',trestbps:'Pressione sistolica a riposo (mmHg)',
 chol:'Colesterolo sierico (mg/dL)',fbs:'Glicemia a digiuno >120 mg/dL',restecg:'ECG a riposo',
 thalach:'Frequenza cardiaca massima raggiunta',exang:'Angina indotta da esercizio',oldpeak:'Depressione ST da esercizio',
 slope:'Pendenza segmento ST al picco',ca:'Vasi principali colorati alla fluoroscopia',thal:'Thal'
};
const css=`
#hs-pe040{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:18px auto;max-width:1180px;padding:0 14px;color:#162033}
#hs-pe040 *{box-sizing:border-box}
#hs-pe040 .pe-card{background:#fff;border:1px solid #d7deea;border-radius:16px;padding:18px;box-shadow:0 8px 24px #12203312}
#hs-pe040 h2{margin:0 0 6px;font-size:1.45rem}#hs-pe040 h3{margin:18px 0 8px;font-size:1.05rem}
#hs-pe040 .muted{color:#5d6b82;font-size:.92rem;line-height:1.45}
#hs-pe040 .selector{display:grid;grid-template-columns:minmax(220px,1fr) minmax(0,2fr);gap:12px;align-items:end;margin-top:14px}
#hs-pe040 .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:14px}
#hs-pe040 label{display:flex;flex-direction:column;gap:5px;font-size:.88rem;font-weight:650}
#hs-pe040 input,#hs-pe040 select{min-height:42px;border:1px solid #b8c4d6;border-radius:9px;padding:8px 10px;background:#fff;color:#162033;font-size:16px;min-width:0}
#hs-pe040 .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
#hs-pe040 button{min-height:42px;border:0;border-radius:10px;padding:9px 14px;font-weight:700;cursor:pointer}
#hs-pe040 button:disabled{opacity:.55;cursor:not-allowed}
#hs-pe040 .primary{background:#2457d6;color:white}#hs-pe040 .secondary{background:#e8eef9;color:#183466}
#hs-pe040 .result{margin-top:16px;padding:16px;border-radius:12px;background:#f4f7fb;border:1px solid #d6dfed}
#hs-pe040 .prob{font-size:2rem;font-weight:800;letter-spacing:-.03em}
#hs-pe040 .bar{height:12px;background:#dfe6f1;border-radius:999px;overflow:hidden;margin:8px 0 12px}
#hs-pe040 .bar>span{display:block;height:100%;background:#2457d6}
#hs-pe040 .warn{padding:10px 12px;border-radius:10px;background:#fff3cd;border:1px solid #ead58a;color:#594800;margin-top:10px}
#hs-pe040 .ok{padding:10px 12px;border-radius:10px;background:#edf8f1;border:1px solid #b9ddc7;color:#1d5934;margin-top:10px}
#hs-pe040 .bad{padding:10px 12px;border-radius:10px;background:#fdeeee;border:1px solid #e7baba;color:#772525;margin-top:10px}
#hs-pe040 table{width:100%;border-collapse:collapse;margin-top:8px;font-size:.9rem}
#hs-pe040 th,#hs-pe040 td{text-align:left;padding:7px;border-bottom:1px solid #e2e7ef;vertical-align:top}
#hs-pe040 details{margin-top:12px}
@media(max-width:650px){#hs-pe040{padding:0 8px}#hs-pe040 .pe-card{padding:14px}#hs-pe040 .selector{grid-template-columns:1fr}}
`;

function el(tag,attrs={},children=[]){
 const n=document.createElement(tag);
 Object.entries(attrs).forEach(([k,v])=>{if(k==='class')n.className=v;else if(k==='text')n.textContent=v;else n.setAttribute(k,v);});
 (Array.isArray(children)?children:[children]).forEach(c=>{if(c!==null&&c!==undefined)n.append(c);});
 return n;
}
const root=el('section',{id:'hs-pe040'}),card=el('div',{class:'pe-card'});
const title=el('h2',{text:'Predictive Engine 0.40 — Multi-Outcome'});
const intro=el('div',{class:'muted',text:'Tre modelli supervisionati versionati, selezionabili e inferiti localmente nel browser. Ogni probabilità vale solo nel dominio del dataset e non costituisce diagnosi clinica.'});
const selector=el('div',{class:'selector'});
const selLabel=el('label',{text:'Modello predittivo'});
const modelSelect=el('select',{id:'hs-pe-model'});
selLabel.append(modelSelect);
const modelDesc=el('div',{class:'muted',text:'Caricamento registry…'});
selector.append(selLabel,modelDesc);
const grid=el('div',{class:'grid'});
const actions=el('div',{class:'actions'});
const predict=el('button',{type:'button',class:'primary',text:'Calcola previsione',disabled:'disabled'});
const reset=el('button',{type:'button',class:'secondary',text:'Azzera',disabled:'disabled'});
actions.append(predict,reset);
const state=el('div',{class:'muted',text:'Caricamento modelli…'});
const out=el('div',{class:'result','aria-live':'polite'});out.hidden=true;
card.append(title,intro,selector,grid,actions,state,out);root.append(el('style',{text:css}),card);
const anchor=document.querySelector('main,#app,#root,body>div');
if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(root,anchor);else document.body.prepend(root);

let registry=null,model=null,controls={};
const sigmoid=z=>1/(1+Math.exp(-Math.max(-35,Math.min(35,z))));
const labelFor=(m,f)=>{
 if(m.field_meta&&m.field_meta[f]&&m.field_meta[f].label)return m.field_meta[f].label+(m.field_meta[f].unit?' ('+m.field_meta[f].unit+')':'');
 return heartLabels[f]||f;
};
function inputFor(m,f){
 const opts=(categorical[m.model_id]||{})[f];
 if(opts){
  const s=el('select',{'data-feature':f});
  opts.forEach(([v,t])=>s.append(el('option',{value:v,text:t})));
  return s;
 }
 const meta=(m.field_meta||{})[f]||{};
 const a={type:'number','data-feature':f,step:'any'};
 if(Number.isFinite(meta.training_min))a.min=String(meta.training_min);
 if(Number.isFinite(meta.training_max))a.max=String(meta.training_max);
 return el('input',a);
}
async function loadSelected(){
 out.hidden=true;out.innerHTML='';grid.innerHTML='';controls={};predict.disabled=true;reset.disabled=true;
 const entry=registry.models.find(x=>x.model_id===modelSelect.value);
 if(!entry)return;
 modelDesc.textContent=entry.task;
 state.textContent='Caricamento '+entry.model_id+'…';
 try{
  const r=await fetch(BASE+entry.file,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);
  model=await r.json();
  for(const f of model.features){
   const lab=el('label',{text:labelFor(model,f)}),inp=inputFor(model,f);controls[f]=inp;lab.append(inp);grid.append(lab);
  }
  const q=model.metrics_test;
  state.textContent=`${model.model_id} v${model.version} · n=${q.n_total} · test n=${q.n_test} · AUROC ${q.auroc.toFixed(3)} · Brier ${q.brier.toFixed(3)}`;
  predict.disabled=false;reset.disabled=false;
 }catch(e){state.textContent='Modello non disponibile: '+e.message;}
}
function run(){
 if(!model)return;
 const values={},missing=[],ood=[];
 for(const f of model.features){
  const raw=controls[f].value,v=raw===''?null:Number(raw),meta=(model.field_meta||{})[f]||{};
  if(v===null||!Number.isFinite(v)){missing.push(f);values[f]=model.imputation.values[f];}
  else{
   values[f]=v;
   if(Number.isFinite(meta.training_min)&&Number.isFinite(meta.training_max)&&(v<meta.training_min||v>meta.training_max))ood.push(f);
  }
 }
 if(missing.length>model.abstention.max_missing_features){
  out.hidden=false;out.innerHTML='';
  out.append(el('div',{class:'bad',text:`Previsione sospesa: mancano ${missing.length} feature su ${model.features.length}; il limite per ${model.model_id} è ${model.abstention.max_missing_features}.`}));
  return;
 }
 let score=model.logistic.intercept;const contrib=[];
 for(const f of model.features){
  const z=(values[f]-model.standardization.mean[f])/model.standardization.scale[f];
  const c=z*model.logistic.coefficients[f];score+=c;contrib.push([f,c,values[f],missing.includes(f)]);
 }
 const p=sigmoid(model.calibration.intercept+model.calibration.slope*score),pct=Math.max(0,Math.min(100,p*100));
 contrib.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
 out.hidden=false;out.innerHTML='';
 out.append(el('div',{class:'muted',text:model.task}),el('div',{class:'prob',text:pct.toFixed(1)+'%'}));
 const bar=el('div',{class:'bar'});bar.append(el('span',{style:`width:${pct.toFixed(1)}%`}));out.append(bar);
 if(missing.length)out.append(el('div',{class:'warn',text:`${missing.length} valore/i mancanti imputati con la mediana del training: ${missing.join(', ')}.`}));
 else out.append(el('div',{class:'ok',text:'Nessuna feature mancante.'}));
 if(ood.length)out.append(el('div',{class:'warn',text:`Input fuori dal range osservato nel training per: ${ood.join(', ')}. La stima può essere meno affidabile.`}));
 const tbl=el('table');tbl.innerHTML='<thead><tr><th>Feature</th><th>Valore</th><th>Contributo log-odds</th></tr></thead>';
 const tb=el('tbody');
 contrib.slice(0,8).forEach(([f,c,v,imp])=>{const tr=el('tr');[labelFor(model,f),String(v)+(imp?' (imputato)':''),(c>=0?'+':'')+c.toFixed(3)].forEach(x=>tr.append(el('td',{text:x})));tb.append(tr);});
 tbl.append(tb);out.append(el('h3',{text:'Contributi principali'}),tbl);
 const q=model.metrics_test,d=el('details');d.append(el('summary',{text:'Metriche, dataset e limiti'}));
 d.append(el('div',{class:'muted',text:`Dataset: ${model.dataset.name} · DOI ${model.dataset.doi} · ${model.dataset.license}. Test hold-out n=${q.n_test}; AUROC=${q.auroc.toFixed(3)}; AUPRC=${q.auprc.toFixed(3)}; accuracy=${q.accuracy.toFixed(3)}; sensitivity=${q.sensitivity.toFixed(3)}; specificity=${q.specificity.toFixed(3)}; Brier=${q.brier.toFixed(3)}. Calibrazione: ${model.calibration.method}. Ricerca soltanto; nessuna validazione clinica esterna/prospettica.`}));
 out.append(d);
}
predict.addEventListener('click',run);
reset.addEventListener('click',()=>{Object.values(controls).forEach(x=>x.value='');out.hidden=true;out.innerHTML='';});
modelSelect.addEventListener('change',loadSelected);

fetch(REGISTRY,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(x=>{
 registry=x;modelSelect.innerHTML='';
 x.models.forEach(m=>modelSelect.append(el('option',{value:m.model_id,text:m.title+' — '+m.model_id})));
 loadSelected();
}).catch(e=>{state.textContent='Registry predittivo non disponibile: '+e.message;});
})();