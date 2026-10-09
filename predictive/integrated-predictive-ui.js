(()=>{
'use strict';
if(window.__HS_INTEGRATED_PREDICTIVE_049__) return;
window.__HS_INTEGRATED_PREDICTIVE_049__=true;

const BUNDLE=window.__HS_PREDICTIVE_BUNDLE__||null;
if(!BUNDLE?.registry||!BUNDLE?.models) return;

document.getElementById('hs-pe040')?.remove();
document.getElementById('hs-router041')?.remove();


// Release identity reconciliation: the standalone base originated from 0.38,
// but the live product is HealthSolver 0.42. Keep dataset provenance text intact
// while updating only visible application-release branding.
(function reconcileReleaseBranding(){
  const replacements=[
    [/^MASSIVE PUBLIC DATA\s*·\s*0\.38$/i,'PREDICTIVE ENGINE · 0.49'],
    [/^HealthSolver\s+0\.38\.0\s*·\s*Massive Public Data \+ Clinical Coach Research Edition\s*·\s*Riccardo Scaringi\s*·\s*Non uso clinico\.?$/i,
     'HealthSolver 0.49.0 · UCI Heart Failure Clinical Records Integration + Predictive-First UI + Clinical Coach Research Edition · Riccardo Scaringi · Non uso clinico.']
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

const HCV=[
 ['alb','Albumina','g/L'],['alp','Fosfatasi alcalina','U/L'],['alt','ALT','U/L'],['ast','AST','U/L'],
 ['bil','Bilirubina','µmol/L'],['che','Colinesterasi','kU/L'],['chol','Colesterolo','mmol/L'],
 ['crea','Creatinina','µmol/L'],['ggt','GGT','U/L'],['prot','Proteine totali','g/L']
];

const style=document.createElement('style');
style.textContent=`
#hs-predictive-integrated{margin:18px 0 28px!important;border:2px solid #0d8f80!important;box-shadow:0 12px 34px rgba(13,143,128,.12)!important;background:linear-gradient(180deg,#f7fffd 0,#fff 34%)!important}
#hs-predictive-integrated .hs43-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap}
#hs-predictive-integrated .hs43-kicker{font-size:.82rem;font-weight:800;letter-spacing:.12em;color:#08796d;text-transform:uppercase;margin-bottom:6px}
#hs-predictive-integrated .hs43-title{font-size:clamp(1.8rem,3vw,2.6rem);line-height:1.04;margin:0;color:#10263b}
#hs-predictive-integrated .hs43-sub{font-size:1.05rem;max-width:780px;color:#56677a;margin:10px 0 0;line-height:1.5}
#hs-predictive-integrated .hs43-badge{background:#0d8f80;color:#fff;border-radius:999px;padding:9px 13px;font-size:.78rem;font-weight:800;letter-spacing:.08em;white-space:nowrap}
#hs-predictive-integrated #hs42Coverage{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin:22px 0 16px}
#hs-predictive-integrated #hs42Coverage .metric{min-height:126px;padding:18px!important;border:1px solid #cfe3df;border-radius:14px;background:#fff;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
#hs-predictive-integrated #hs42Coverage .metric b{font-size:2rem!important;line-height:1;color:#10263b}
#hs-predictive-integrated #hs42Coverage .metric span{margin-top:9px;font-size:.98rem;line-height:1.3}
#hs-predictive-integrated #hs42Coverage .metric small{font-size:.82rem}
#hs42Run{font-size:1.08rem!important;font-weight:800!important;padding:15px 24px!important;min-height:54px!important;border-radius:12px!important;box-shadow:0 8px 20px rgba(13,143,128,.18)}
#hs42Refresh{min-height:54px!important;padding:15px 20px!important}
#hs42Status{font-size:.95rem!important;margin:12px 0 0!important}
#hs42Results{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px!important}
#hs42Results>.card{border:1px solid #d7e5e2!important;border-radius:14px!important;padding:18px!important;background:#fff!important;box-shadow:none!important}
#hs42Results>.card .metric b{font-size:2.55rem!important;line-height:1!important;color:#0b6f65}
#hs42Results>.card h3{font-size:1.15rem!important;margin:7px 0 12px!important}
#hs-predictive-integrated details{border-top:1px solid #dce8e5;padding-top:12px;margin-top:12px!important}
#hs-predictive-integrated summary{cursor:pointer;font-size:.98rem}
#hs-predictive-integrated .hs43-guide{margin-top:18px;padding:14px 16px;border-radius:12px;background:#eef9f7;color:#24423f}
aside .nav[data-page="intelligence"] .hs43-nav-badge{display:inline-block;margin-left:7px;padding:2px 6px;border-radius:999px;background:#0d8f80;color:#fff;font-size:.62rem;font-weight:800;letter-spacing:.06em;vertical-align:middle}
@media(max-width:760px){#hs-predictive-integrated #hs42Coverage{grid-template-columns:1fr}#hs-predictive-integrated .hs43-title{font-size:1.75rem}}
`;
document.head.append(style);

const nav=document.querySelector('aside .nav[data-page="intelligence"]');
if(nav&&!nav.querySelector('.hs43-nav-badge')){
  const b=document.createElement('span');b.className='hs43-nav-badge';b.textContent='PREDITTIVO';nav.append(b);
}

const wrap=document.createElement('div');
wrap.id='hs-predictive-integrated';
wrap.className='card';
wrap.innerHTML=`
  <div class="hs43-hero">
    <div>
      <div class="hs43-kicker">MOTORE PREDITTIVO · HEALTHSOLVER 0.49</div>
      <h2 class="hs43-title">Predizioni cliniche di ricerca</h2>
      <p class="hs43-sub">HealthSolver usa lo stesso dossier che hai già compilato per verificare quali modelli sono applicabili e calcolare le stime disponibili. Le funzioni predittive sono qui, in primo piano. Ogni nuovo database entra nello stesso registry e nello stesso dossier.</p>
    </div>
    <div class="hs43-badge">9 MODELLI SUPERVISIONATI</div>
  </div>
  <div id="hs42Coverage" class="metrics"></div>
  <div class="actions" style="margin-top:8px">
    <button id="hs42Run" class="primary">CALCOLA PREDIZIONI</button>
    <button id="hs42Refresh">Aggiorna dati disponibili</button>
  </div>
  <div id="hs42Status" class="hint"></div>
  <div class="hs43-guide"><b>Come funziona:</b> completa il dossier normalmente. Se un modello richiede dati specialistici che non sono già presenti, apri soltanto la relativa sezione qui sotto.</div>
  <details id="hs42HeartDetails">
    <summary><b>Dati specialistici cardiologici</b> · completa solo ciò che manca</summary>
    <p class="hint">Questi campi completano il modello cardiaco quando i dati equivalenti non sono già disponibili nell'Expert Mode.</p>
    <div class="grid">
      <label>Tipo di dolore toracico<select id="hs42_cp"><option value="">—</option><option value="1">Angina tipica</option><option value="2">Angina atipica</option><option value="3">Dolore non anginoso</option><option value="4">Asintomatico</option></select></label>
      <label>ECG a riposo<select id="hs42_restecg"><option value="">—</option><option value="0">Normale</option><option value="1">Alterazioni ST-T</option><option value="2">Ipertrofia ventricolare sinistra</option></select></label>
      <label>Pendenza segmento ST<select id="hs42_slope"><option value="">—</option><option value="1">Ascendente</option><option value="2">Piatta</option><option value="3">Discendente</option></select></label>
      <label>Thal<select id="hs42_thal"><option value="">—</option><option value="3">Normale</option><option value="6">Difetto fisso</option><option value="7">Difetto reversibile</option></select></label>
    </div>
  </details>
  <details id="hs42FnaDetails">
    <summary><b>Dati specialistici FNA mammella</b> · apri solo per il modello FNA</summary>
    <p class="hint">Le 10 misure FNA sono caratteristiche specialistiche e non fanno parte del dossier clinico generale.</p>
    <div id="hs42FnaGrid" class="grid"></div>
  </details>
  <details id="hs44HcvDetails">
    <summary><b>Dati specialistici epatici / HCV</b> · apri per il modello epatico</summary>
    <p class="hint">Età e sesso vengono riutilizzati dal dossier. Inserisci qui soltanto il pannello biochimico nelle unità UCI indicate, evitando conversioni implicite da altri campi con unità diverse.</p>
    <div id="hs44HcvGrid" class="grid"></div>
  </details>
  <details id="hs45NhanesDetails">
    <summary><b>Dati NHANES · diabete riferito diagnosticato</b> · completa solo ciò che manca</summary>
    <p class="hint">Età e sesso vengono riutilizzati dal dossier. BMI, circonferenza vita, pressione sistolica, colesterolo totale e HDL vengono riusati se disponibili nelle stesse unità; in alternativa puoi inserirli qui.</p>
    <div class="grid">
      <label>BMI (kg/m²)<input id="hs45_bmi" type="number" step="any"></label>
      <label>Circonferenza vita (cm)<input id="hs45_waist" type="number" step="any"></label>
      <label>Pressione sistolica media (mmHg)<input id="hs45_sbp" type="number" step="any"></label>
      <label>Colesterolo totale (mg/dL)<input id="hs45_tc" type="number" step="any"></label>
      <label>Colesterolo HDL (mg/dL)<input id="hs45_hdl" type="number" step="any"></label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Target del modello:</b> probabilità di appartenere al gruppo NHANES che riferisce una diagnosi medica di diabete. Non equivale a una diagnosi clinica di diabete.</div>
  </details>
  <details id="hs46NhisDetails">
    <summary><b>Dati NHIS · ipertensione riferita</b> · completa solo ciò che manca</summary>
    <p class="hint">Età e sesso vengono riutilizzati dal dossier. Il modello NHIS usa inoltre obesità, fumo attuale e stato di salute generale riferito.</p>
    <div class="grid">
      <label>Obesità (BMI ≥30)
        <select id="hs46_obese"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
      <label>Fumatore attuale
        <select id="hs46_current_smoker"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
      <label>Salute generale discreta/scarsa
        <select id="hs46_fair_poor_health"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Target del modello:</b> probabilità di appartenere al gruppo NHIS che riferisce di essere stato informato di avere ipertensione. Non è una misurazione della pressione né una diagnosi clinica.</div>
  </details>
  <details id="hs47ReadmDetails">
    <summary><b>Dati ricovero diabetologico · riammissione &lt;30 giorni</b> · apri per il modello di riammissione</summary>
    <p class="hint">Il modello usa caratteristiche dell'episodio ospedaliero UCI. L'età viene convertita nella fascia decennale corrispondente; gli altri valori vanno inseriti come conteggi o categorie dell'episodio.</p>
    <div class="grid">
      <label>Durata ricovero (giorni)<input id="hs47_time_in_hospital" type="number" step="1" min="1"></label>
      <label>Procedure di laboratorio<input id="hs47_num_lab_procedures" type="number" step="1" min="0"></label>
      <label>Procedure<input id="hs47_num_procedures" type="number" step="1" min="0"></label>
      <label>Numero farmaci<input id="hs47_num_medications" type="number" step="1" min="0"></label>
      <label>Visite outpatient pregresse<input id="hs47_number_outpatient" type="number" step="1" min="0"></label>
      <label>Accessi emergenza pregressi<input id="hs47_number_emergency" type="number" step="1" min="0"></label>
      <label>Ricoveri inpatient pregressi<input id="hs47_number_inpatient" type="number" step="1" min="0"></label>
      <label>Numero diagnosi<input id="hs47_number_diagnoses" type="number" step="1" min="0"></label>
      <label>HbA1c
        <select id="hs47_a1c_abnormal"><option value="">Non misurata / —</option><option value="0">Normale</option><option value="1">&gt;7 / &gt;8</option></select>
      </label>
      <label>Glicemia massima
        <select id="hs47_glucose_abnormal"><option value="">Non misurata / —</option><option value="0">Normale</option><option value="1">&gt;200 / &gt;300</option></select>
      </label>
      <label>Farmaci per diabete
        <select id="hs47_diabetes_med"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
      <label>Cambio terapia
        <select id="hs47_medication_change"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Target del modello:</b> probabilità sperimentale di riammissione ospedaliera entro 30 giorni nel dominio del dataset UCI Diabetes 130-US Hospitals. Non è una diagnosi di diabete.</div>
  </details>
  <details id="hs48ThyroidDetails">
    <summary><b>Carcinoma tiroideo differenziato · recidiva</b> · dati clinicopatologici specialistici</summary>
    <p class="hint">Età e sesso vengono riutilizzati dal dossier. Gli altri campi devono corrispondere alle categorie della coorte UCI 915. La variabile post-trattamento <code>Response</code> è stata esclusa dal modello per ridurre leakage temporale.</p>
    <div id="hs48ThyroidGrid" class="grid"></div>
    <div class="notice" style="margin-top:10px"><b>Target del modello:</b> appartenenza al gruppo con recidiva del carcinoma tiroideo differenziato nella coorte UCI. Non è una previsione clinica validata né una raccomandazione terapeutica.</div>
  </details>
  <details id="hs49HeartFailureDetails">
    <summary><b>Insufficienza cardiaca · mortalità nel follow-up</b> · dati clinici di base UCI 519</summary>
    <p class="hint">Età e sesso vengono riutilizzati dal dossier. Creatinina e sodio possono essere riutilizzati dai campi generali se presenti nelle stesse unità. La variabile <code>time</code> (durata del follow-up) è esclusa dal modello per evitare leakage temporale.</p>
    <div class="grid">
      <label>Anemia
        <select id="hs49_anaemia"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
      <label>Creatinfosfochinasi / CPK (mcg/L)<input id="hs49_cpk" type="number" step="any" min="0"></label>
      <label>Diabete
        <select id="hs49_diabetes"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
      <label>Frazione di eiezione (%)<input id="hs49_ejection_fraction" type="number" step="any" min="0" max="100"></label>
      <label>Ipertensione
        <select id="hs49_high_blood_pressure"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
      <label>Piastrine (kiloplatelets/mL)<input id="hs49_platelets" type="number" step="any" min="0"></label>
      <label>Creatinina sierica (mg/dL)<input id="hs49_serum_creatinine" type="number" step="any" min="0"></label>
      <label>Sodio sierico (mEq/L)<input id="hs49_serum_sodium" type="number" step="any" min="0"></label>
      <label>Fumo
        <select id="hs49_smoking"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select>
      </label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Target del modello:</b> decesso registrato durante il follow-up nella coorte UCI Heart Failure Clinical Records. È una stima di ricerca nel dominio della coorte sorgente, non un punteggio prognostico clinicamente validato.</div>
  </details>
  <h3 style="margin:24px 0 10px;font-size:1.25rem">Risultati predittivi</h3>
  <div id="hs42Results" class="grid"></div>
  <div class="notice" style="margin-top:16px"><b>Interpretazione.</b> Ogni percentuale appartiene al proprio modello e al proprio dataset. Non sono probabilità concorrenti di una singola diagnosi e non vanno sommate. Software di ricerca, non diagnosi clinica.</div>
`;

const topHeading=host.querySelector('h1,h2');
const topContainer=topHeading?.parentElement;
if(topContainer&&topContainer.parentElement===host) topContainer.after(wrap);
else host.prepend(wrap);

const fnaGrid=$('hs42FnaGrid');
for(const [id,label] of FNA){
  const lab=document.createElement('label');lab.textContent=label;
  const inp=document.createElement('input');inp.type='number';inp.step='any';inp.id='hs42_'+id;
  lab.append(inp);fnaGrid.append(lab);
}

const hcvGrid=$('hs44HcvGrid');
for(const [id,label,unit] of HCV){
  const lab=document.createElement('label');lab.textContent=label+(unit?' ('+unit+')':'');
  const inp=document.createElement('input');inp.type='number';inp.step='any';inp.id='hs44_'+id;
  lab.append(inp);hcvGrid.append(lab);
}

const registry=BUNDLE.registry;
const models=registry.models.map(e=>({entry:e,model:BUNDLE.models[e.file]})).filter(x=>x.model);

const THYROID_ID='HS-UCI-THYREC-001';
const thyroidPair=models.find(x=>x.model.model_id===THYROID_ID)||null;
const thyroidLabel={
  smoking:'Fumo',
  hx_smoking:'Pregresso fumo',
  hx_radiothreapy:'Pregressa radioterapia',
  thyroid_function:'Funzione tiroidea',
  physical_examination:'Esame obiettivo tiroideo',
  adenopathy:'Adenopatie',
  pathology:'Istologia',
  focality:'Focalità',
  risk:'Classe di rischio',
  t:'Categoria T',
  n:'Categoria N',
  m:'Categoria M',
  stage:'Stadio'
};
const displayCategory=v=>({'Yes':'Sì','No':'No','Normal':'Normale','Low':'Basso','Intermediate':'Intermedio','High':'Alto'}[v]||v);

if(thyroidPair){
  const grid=$('hs48ThyroidGrid');
  for(const spec of thyroidPair.model.raw_feature_schema||[]){
    if(['age','gender'].includes(spec.key)) continue;
    const lab=document.createElement('label');
    lab.textContent=thyroidLabel[spec.key]||spec.source_name||spec.key;
    const sel=document.createElement('select');
    sel.id='hs48_'+spec.key;
    sel.append(new Option('—',''));
    for(const cat of spec.categories||[]) sel.append(new Option(displayCategory(cat),cat));
    lab.append(sel); grid.append(lab);
  }
}
function thyroidEncodedCase(model,age,sex){
  if(!model) return {};
  const rawValues={age,gender:sex===1?'M':sex===0?'F':null};
  for(const spec of model.raw_feature_schema||[]){
    if(['age','gender'].includes(spec.key)) continue;
    const v=raw('hs48_'+spec.key);
    rawValues[spec.key]=v===''?null:v;
  }
  const out={};
  for(const feature of model.features){
    const enc=(model.encoding_map||{})[feature];
    if(!enc){out[feature]=null;continue;}
    const rv=rawValues[enc.raw_key];
    if(enc.kind==='numeric'){
      const n=Number(rv);out[feature]=(rv===null||rv===undefined||rv===''||!Number.isFinite(n))?null:n;
    }else{
      out[feature]=(rv===null||rv===undefined||rv==='')?null:(String(rv)===String(enc.category)?1:0);
    }
  }
  return out;
}

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
  const hcv={age,sex:sexVal()};
  for(const [id] of HCV) hcv[id]=num('hs44_'+id);
  const nhanes={
    age,
    sex:sexVal(),
    bmi:first(num('ci_bmi'),num('hs45_bmi')),
    waist:first(num('ci_waist'),num('hs45_waist')),
    sbp:first(num('ci_systolic'),num('ci_bp'),num('hs45_sbp')),
    tc:first(num('ci_total_chol'),num('hs45_tc')),
    hdl:first(num('ci_hdl'),num('hs45_hdl'))
  };
  const bmiForNhis=first(num('ci_bmi'),num('hs45_bmi'));
  const nhis={
    age,
    sex:sexVal(),
    obese:bmiForNhis===null?num('hs46_obese'):(bmiForNhis>=30?1:0),
    current_smoker:num('hs46_current_smoker'),
    fair_poor_general_health:num('hs46_fair_poor_health')
  };
  const ageMidForReadm=age===null?null:(Math.min(9,Math.max(0,Math.floor(age/10)))*10+5);
  const readm={
    age_mid:ageMidForReadm,
    time_in_hospital:num('hs47_time_in_hospital'),
    num_lab_procedures:num('hs47_num_lab_procedures'),
    num_procedures:num('hs47_num_procedures'),
    num_medications:num('hs47_num_medications'),
    number_outpatient:num('hs47_number_outpatient'),
    number_emergency:num('hs47_number_emergency'),
    number_inpatient:num('hs47_number_inpatient'),
    number_diagnoses:num('hs47_number_diagnoses'),
    a1c_abnormal:num('hs47_a1c_abnormal'),
    glucose_abnormal:num('hs47_glucose_abnormal'),
    diabetes_med:num('hs47_diabetes_med'),
    medication_change:num('hs47_medication_change')
  };
  const thyroid=thyroidEncodedCase(thyroidPair?.model||null,age,sexVal());
  const heartFailure={
    age,
    anaemia:num('hs49_anaemia'),
    creatinine_phosphokinase:num('hs49_cpk'),
    diabetes:num('hs49_diabetes'),
    ejection_fraction:num('hs49_ejection_fraction'),
    high_blood_pressure:num('hs49_high_blood_pressure'),
    platelets:first(num('ci_platelets'),num('hs49_platelets')),
    serum_creatinine:first(num('ci_creatinine'),num('hs49_serum_creatinine')),
    serum_sodium:first(num('ci_sodium'),num('hs49_serum_sodium')),
    sex:sexVal(),
    smoking:num('hs49_smoking')
  };
  return {
    'HS-UCI-HD-001':heart,
    'HS-UCI-CKD-001':ckd,
    'HS-UCI-BC-001':fna,
    'HS-UCI-HCV-001':hcv,
    'HS-NHANES-DM-001':nhanes,
    'HS-NHIS-HYP-001':nhis,
    'HS-UCI-DMREADM-001':readm,
    'HS-UCI-THYREC-001':thyroid,
    'HS-UCI-HFDEATH-001':heartFailure
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
    d.innerHTML=`<b>${r.provided}/${model.features.length}</b><span><strong>${titleFor(entry)}</strong><br><small>${r.ready?'✓ PRONTO ALLA PREDIZIONE':'mancano '+r.missing.length+' dati'}</small></span>`;
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
    <div class="metric"><b>${pct.toFixed(1)}%</b><span>STIMA PREDITTIVA DEL MODELLO</span></div>
    ${res.imputed.length?`<p class="hint">Imputati con mediana training: ${res.imputed.join(', ')}</p>`:''}
    ${res.ood.length?`<div class="notice">Fuori dal range osservato nel training: ${res.ood.join(', ')}</div>`:''}
    <p class="hint"><b>Contributi principali</b></p><ul>${contrib}</ul>
    <p class="hint">Test interno: AUROC ${Number(first(model.metrics_test.auroc,model.metrics_test.auroc_weighted)).toFixed(3)} · Brier ${Number(first(model.metrics_test.brier,model.metrics_test.brier_weighted)).toFixed(3)}. Nessuna validazione clinica esterna/prospettica.</p>
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