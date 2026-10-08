(()=>{
'use strict';
if(window.__HS_INTEGRATED_PREDICTIVE_042__) return;
window.__HS_INTEGRATED_PREDICTIVE_042__=true;

const BUNDLE=window.__HS_PREDICTIVE_BUNDLE__||null;
if(!BUNDLE?.registry||!BUNDLE?.models) return;

document.getElementById('hs-pe040')?.remove();
document.getElementById('hs-router041')?.remove();


// Release identity reconciliation: the standalone base originated from 0.38,
// but the live product is HealthSolver 0.42. Keep dataset provenance text intact
// while updating only visible application-release branding.
(function reconcileReleaseBranding(){
  const replacements=[
    [/^MASSIVE PUBLIC DATA\s*·\s*0\.38$/i,'INTEGRATED PREDICTIVE UI · 0.42'],
    [/^HealthSolver\s+0\.38\.0\s*·\s*Massive Public Data \+ Clinical Coach Research Edition\s*·\s*Riccardo Scaringi\s*·\s*Non uso clinico\.?$/i,
     'HealthSolver 0.42.0 · Integrated Predictive UI + Multi-Outcome Predictive Engine + Clinical Coach Research Edition · Riccardo Scaringi · Non uso clinico.']
  ];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  for(const n of nodes){
    const t=(n.nodeValue||'').trim();
    for(const [rx,to] of replacements){
      if(rx.test(t)){ n.nodeValue=n.nodeValue.replace(rx,to); break; }
    }
  }
})();

const host=document.getElementById('page-intelligence');
if(!host) return;

const $=id=>document.getElementById(id);
const num=id=>{
  const e=$(id); if(!e||e.value==='') return null;
  const v=Number(e.value); return Number.isFinite(v)?v:null;
};
const raw=id=>$(id)?.value??'';
const yes=v=>['1','yes','si','sì','true','present','presente','m','male','maschio'].includes(String(v).trim().toLowerCase());
const sexVal=()=>{
  const v=(raw('ciSex')||raw('coachSex')).trim().toLowerCase();
  if(['m','male','maschio','1'].includes(v)) return 1;
  if(['f','female','femmina','0','2'].includes(v)) return 0;
  return null;
};
const oneHot=(prefix,vals)=>{
  for(const v of vals){ const x=raw(prefix+v); if(x!==''&&yes(x)) return Number(v); }
  return null;
};
const first=(...xs)=>xs.find(v=>v!==null&&v!==undefined&&v!=='')??null;

const FNA=[
 ['radius1','Raggio medio'],['texture1','Texture media'],['perimeter1','Perimetro medio'],['area1','Area media'],
 ['smoothness1','Smoothness media'],['compactness1','Compactness media'],['concavity1','Concavità media'],
 ['concave_points1','Punti concavi medi'],['symmetry1','Simmetria media'],['fractal_dimension1','Dimensione frattale media']
];

const wrap=document.createElement('div');
wrap.id='hs-predictive-integrated';
wrap.className='card';
wrap.style.marginTop='22px';
wrap.innerHTML=`
  <div class="eyebrow">PREDIZIONE SUPERVISIONATA · STESSO DOSSIER</div>
  <h2>Predizione dai dati già inseriti.</h2>
  <p class="lead">HealthSolver riusa automaticamente i dati dell'Expert Mode. Non devi ricompilare un secondo caso.</p>
  <div id="hs42Coverage" class="metrics"></div>
  <details id="hs42HeartDetails" style="margin-top:16px">
    <summary><b>Dati specialistici cardiologici mancanti</b> · apri solo se non sono già disponibili nel dossier</summary>
    <p class="hint">Questi quattro campi completano il modello cardiaco quando il relativo pannello specialistico dell’Expert Mode non è attivo.</p>
    <div class="grid">
      <label>Tipo di dolore toracico<select id="hs42_cp"><option value="">—</option><option value="1">Angina tipica</option><option value="2">Angina atipica</option><option value="3">Dolore non anginoso</option><option value="4">Asintomatico</option></select></label>
      <label>ECG a riposo<select id="hs42_restecg"><option value="">—</option><option value="0">Normale</option><option value="1">Alterazioni ST-T</option><option value="2">Ipertrofia ventricolare sinistra</option></select></label>
      <label>Pendenza segmento ST<select id="hs42_slope"><option value="">—</option><option value="1">Ascendente</option><option value="2">Piatta</option><option value="3">Discendente</option></select></label>
      <label>Thal<select id="hs42_thal"><option value="">—</option><option value="3">Normale</option><option value="6">Difetto fisso</option><option value="7">Difetto reversibile</option></select></label>
    </div>
  </details>
  <details id="hs42FnaDetails" style="margin-top:16px">
    <summary><b>Dati specialistici FNA mammella</b> · apri solo se vuoi usare anche il modello FNA</summary>
    <p class="hint">Queste 10 misure non fanno parte del dossier clinico generale e restano quindi un'integrazione specialistica.</p>
    <div id="hs42FnaGrid" class="grid"></div>
  </details>
  <div class="actions" style="margin-top:16px">
    <button id="hs42Run" class="primary">Calcola predizioni dai dati del dossier</button>
    <button id="hs42Refresh">Aggiorna copertura</button>
  </div>
  <div id="hs42Status" class="hint" style="margin-top:10px"></div>
  <div id="hs42Results" class="grid" style="margin-top:16px"></div>
  <div class="notice" style="margin-top:16px"><b>Come leggere il risultato.</b> Ogni percentuale appartiene al proprio modello e al proprio dataset. Non sono probabilità concorrenti di una singola diagnosi e non vanno sommate.</div>
`;
host.append(wrap);

const fnaGrid=$('hs42FnaGrid');
for(const [id,label] of FNA){
  const lab=document.createElement('label');lab.textContent=label;
  const inp=document.createElement('input');inp.type='number';inp.step='any';inp.id='hs42_'+id;
  lab.append(inp);fnaGrid.append(lab);
}

const registry=BUNDLE.registry;
const models=registry.models.map(e=>({entry:e,model:BUNDLE.models[e.file]})).filter(x=>x.model);

function dossierCase(){
  const age=first(num('ciAge'),num('coachAge'));
  const fasting=num('ci_fasting_glucose');
  const heart={
    age, sex:sexVal(),
    cp:first(oneHot('ci_cp_',[1,2,3,4]),num('hs42_cp')),
    trestbps:first(num('ci_systolic'),num('ci_bp')),
    chol:num('ci_total_chol'),
    fbs:fasting===null?null:(fasting>120?1:0),
    restecg:first(oneHot('ci_ecg_',[0,1,2]),num('hs42_restecg')),
    thalach:num('ci_max_heart_rate'),
    exang:(()=>{const v=raw('ci_exercise_angina');return v===''?null:(yes(v)?1:0)})(),
    oldpeak:num('ci_oldpeak'),
    slope:first(oneHot('ci_slope_',[1,2,3]),num('hs42_slope')),
    ca:num('ci_major_vessels'),
    thal:first(oneHot('ci_thal_',[3,6,7]),num('hs42_thal'))
  };
  const ckd={
    age,
    bp:first(num('ci_bp'),num('ci_systolic')),
    sg:num('ci_specific_gravity'),
    al:num('ci_urine_albumin'),
    su:num('ci_urine_sugar'),
    bgr:num('ci_random_glucose'),
    bu:first(num('ci_blood_urea'),num('ci_bun')),
    sc:num('ci_creatinine'),
    sod:num('ci_sodium'),
    pot:num('ci_potassium'),
    hemo:num('ci_hemoglobin'),
    pcv:num('ci_pcv'),
    wbcc:first(num('ci_wbc_count'),num('ci_wbc')),
    rbcc:num('ci_rbc_count')
  };
  const fna={};
  for(const [id] of FNA) fna[id]=num('hs42_'+id);
  return {
    'HS-UCI-HD-001':heart,
    'HS-UCI-CKD-001':ckd,
    'HS-UCI-BC-001':fna
  };
}
function readiness(model,values){
  const missing=model.features.filter(f=>values[f]===null||values[f]===undefined||!Number.isFinite(Number(values[f])));
  return {missing,provided:model.features.length-missing.length,ready:missing.length<=model.abstention.max_missing_features};
}
const sigmoid=z=>1/(1+Math.exp(-Math.max(-35,Math.min(35,z))));
function infer(model,values){
  const r=readiness(model,values);
  if(!r.ready) return {status:'abstain',...r};
  let score=model.logistic.intercept;const contributions=[],imputed=[],ood=[];
  for(const f of model.features){
    const meta=(model.field_meta||{})[f]||{};
    const rawv=values[f],v=(rawv===null||rawv===undefined||!Number.isFinite(Number(rawv)))?model.imputation.values[f]:Number(rawv);
    if(rawv===null||rawv===undefined||!Number.isFinite(Number(rawv))) imputed.push(f);
    if(rawv!==null&&rawv!==undefined&&Number.isFinite(meta.training_min)&&Number.isFinite(meta.training_max)&&(Number(rawv)<meta.training_min||Number(rawv)>meta.training_max)) ood.push(f);
    const z=(v-model.standardization.mean[f])/model.standardization.scale[f],c=z*model.logistic.coefficients[f];
    score+=c; contributions.push([f,c]);
  }
  contributions.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
  return {status:'predicted',p:sigmoid(model.calibration.intercept+model.calibration.slope*score),imputed,ood,contributions};
}
function titleFor(entry){return entry.title||entry.model_id}
function renderCoverage(){
  const values=dossierCase(),box=$('hs42Coverage');box.innerHTML='';
  for(const {entry,model} of models){
    const r=readiness(model,values[model.model_id]||{});
    const d=document.createElement('div');d.className='metric';
    d.innerHTML=`<b>${r.provided}/${model.features.length}</b><span>${titleFor(entry)}<br><small>${r.ready?'pronto':'mancano '+r.missing.length+' dati'}</small></span>`;
    box.append(d);
  }
  $('hs42Status').textContent='Copertura aggiornata dai campi correnti dell’Expert Mode.';
}
function renderResult(entry,model,res){
  const d=document.createElement('div');d.className='card';
  d.style.margin='0';
  if(res.status==='abstain'){
    d.innerHTML=`<div class="eyebrow">${model.model_id}</div><h3>${titleFor(entry)}</h3><div class="notice"><b>Astensione.</b> Mancano ${res.missing.length} dati richiesti. Compila il dossier o i dati specialistici pertinenti.</div>`;
    return d;
  }
  const pct=res.p*100;
  const contrib=res.contributions.slice(0,4).map(([f,c])=>`<li><b>${f}</b>: ${c>=0?'+':''}${c.toFixed(3)}</li>`).join('');
  d.innerHTML=`
    <div class="eyebrow">${model.model_id}</div>
    <h3>${titleFor(entry)}</h3>
    <div class="metric"><b>${pct.toFixed(1)}%</b><span>stima sperimentale calibrata</span></div>
    ${res.imputed.length?`<p class="hint">Imputati con mediana training: ${res.imputed.join(', ')}</p>`:''}
    ${res.ood.length?`<div class="notice">Fuori dal range osservato nel training: ${res.ood.join(', ')}</div>`:''}
    <p class="hint"><b>Contributi principali</b></p><ul>${contrib}</ul>
    <p class="hint">Test interno: AUROC ${model.metrics_test.auroc.toFixed(3)} · Brier ${model.metrics_test.brier.toFixed(3)}. Nessuna validazione clinica esterna/prospettica.</p>
  `;
  return d;
}
function runAll(){
  const values=dossierCase(),out=$('hs42Results');out.innerHTML='';
  let done=0;
  for(const {entry,model} of models){
    const res=infer(model,values[model.model_id]||{});
    if(res.status==='predicted') done++;
    out.append(renderResult(entry,model,res));
  }
  renderCoverage();
  $('hs42Status').textContent=`Analisi completata: ${done}/${models.length} modelli applicabili con i dati correnti.`;
}
$('hs42Run').addEventListener('click',runAll);
$('hs42Refresh').addEventListener('click',renderCoverage);
host.addEventListener('input',e=>{if(e.target!==$('hs42Run')) renderCoverage();});
renderCoverage();
})();