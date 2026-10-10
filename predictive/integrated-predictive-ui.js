(()=>{
'use strict';
if(window.__HS_INTEGRATED_PREDICTIVE_0560__) return;
window.__HS_INTEGRATED_PREDICTIVE_0560__=true;
// Preserve prior release markers so historical regression checks remain valid.
window.__HS_INTEGRATED_PREDICTIVE_0550__=true;
window.__HS_INTEGRATED_PREDICTIVE_0541__=true;
window.__HS_INTEGRATED_PREDICTIVE_0540__=true;
window.__HS_INTEGRATED_PREDICTIVE_0531__=true;

const BUNDLE=window.__HS_PREDICTIVE_BUNDLE__||null;
const ENSEMBLE=window.__HS_ENSEMBLE_CONFIG__||null;
const COMMON_OUTCOME=window.__HS_COMMON_OUTCOME_TRANSPORT__||null;
if(!BUNDLE?.registry||!BUNDLE?.models) return;

document.getElementById('hs-pe040')?.remove();
document.getElementById('hs-router041')?.remove();


// Release identity reconciliation: the standalone base originated from 0.38,
// but the live product is HealthSolver 0.42. Keep dataset provenance text intact
// while updating only visible application-release branding.
(function reconcileReleaseBranding(){
  const replacements=[
    [/^MASSIVE PUBLIC DATA\s*·\s*0\.38$/i,'PREDICTIVE ENGINE · 0.56.1'],
    [/^HealthSolver\s+0\.38\.0\s*·\s*Massive Public Data \+ Clinical Coach Research Edition\s*·\s*Riccardo Scaringi\s*·\s*Non uso clinico\.?$/i,
     'HealthSolver 0.56.1 · Complete In-App Guide + Common-Outcome Transport + Ensemble Intelligence + Predictive-First UI · Riccardo Scaringi · Non uso clinico.']
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
const brfssAgeCategory=age=>{
  if(age===null||age===undefined||!Number.isFinite(Number(age))||Number(age)<18) return null;
  const a=Number(age);
  if(a<25) return 1;
  if(a<30) return 2;
  if(a<35) return 3;
  if(a<40) return 4;
  if(a<45) return 5;
  if(a<50) return 6;
  if(a<55) return 7;
  if(a<60) return 8;
  if(a<65) return 9;
  if(a<70) return 10;
  if(a<75) return 11;
  if(a<80) return 12;
  return 13;
};

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
#hs55Ensemble{margin-top:24px;padding:18px;border:2px solid #314d7a;border-radius:16px;background:#f8fbff}
#hs55Ensemble .hs55-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
#hs55Ensemble .hs55-badge{font-size:.75rem;font-weight:800;letter-spacing:.07em;border-radius:999px;background:#314d7a;color:#fff;padding:7px 10px}
#hs55EnsembleSummary,#hs55DomainGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-top:14px}
#hs55Ensemble .hs55-card{border:1px solid #d4deec;border-radius:12px;background:#fff;padding:13px}
#hs55Ensemble .hs55-value{font-size:1.65rem;font-weight:800;color:#1b355d;line-height:1.05}
#hs55Ensemble .hs55-label{font-size:.82rem;color:#5c6d83;margin-top:6px}
#hs55Ensemble .hs55-domain h4{margin:0 0 8px;font-size:1rem}
#hs55Ensemble .hs55-domain p{margin:5px 0;font-size:.88rem;line-height:1.35}
#hs55Ensemble .hs55-state{font-weight:800}
#hs55Ensemble .hs55-map{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
#hs55Ensemble .hs55-chip{border:1px solid #ccd7e7;border-radius:999px;padding:5px 8px;background:#fff;font-size:.78rem}
#hs55Ensemble .hs55-chip.on{border-color:#7a4e00;background:#fff8df}
#hs55Ensemble .hs55-chip.off{border-color:#3f6b62;background:#f2fbf8}
#hs55Ensemble .hs55-warning{margin-top:12px;padding:11px 13px;border-radius:10px;background:#fff4e5;color:#694100;font-size:.88rem;line-height:1.4}
#hs56Transport{margin-top:22px;border:2px solid #d09a2d;border-radius:16px;padding:18px;background:linear-gradient(180deg,#fffaf0,#fff)}
#hs56Transport .hs56-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap}
#hs56Transport .hs56-badge{background:#7a4e00;color:#fff;border-radius:999px;padding:7px 10px;font-size:.72rem;font-weight:900;letter-spacing:.05em}
#hs56Transport .hs56-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:12px}
#hs56Transport .hs56-card{border:1px solid #ead5a8;border-radius:12px;padding:13px;background:#fff}
#hs56Transport .hs56-value{font-size:1.75rem;font-weight:900;color:#5b3a00}
#hs56Transport .hs56-warning{margin-top:12px;padding:12px 14px;border-radius:10px;background:#fff0cf;color:#5b3a00;line-height:1.45}
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
      <div class="hs43-kicker">MOTORE PREDITTIVO · HEALTHSOLVER 0.56.1</div>
      <h2 class="hs43-title">Predizioni cliniche di ricerca</h2>
      <p class="hs43-sub">HealthSolver usa lo stesso dossier che hai già compilato per verificare quali modelli sono applicabili e calcolare le stime disponibili. Le funzioni predittive sono qui, in primo piano. Ogni nuovo database entra nello stesso registry e nello stesso dossier.</p>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><div class="hs43-badge">14 MODELLI SUPERVISIONATI</div><div class="hs43-badge" style="background:#7a4e00">1 TRANSPORT LAYER SPERIMENTALE</div></div>
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
    <summary><b>Insufficienza cardiaca · DEATH_EVENT coorte UCI 519</b> · dati clinici di base</summary>
    <p class="hint">Dominio sorgente: 299 pazienti raccolti nel 2015 in due ospedali di Faisalabad (Pakistan); tutti con disfunzione sistolica ventricolare sinistra e precedenti episodi di scompenso NYHA III–IV. Età e sesso vengono riutilizzati dal dossier. Creatinina e sodio possono essere riutilizzati dai campi generali se presenti nelle stesse unità. La variabile <code>time</code> è esclusa dai predittori per evitare leakage temporale.</p>
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
    <div class="notice" style="margin-top:10px"><b>Semantica dell'output:</b> stima del label binario <code>DEATH_EVENT</code> nella coorte sorgente UCI 519. Il follow-up varia da 4 a 285 giorni (media circa 130): la percentuale <b>non</b> rappresenta mortalità a 30/90/365 giorni, non ha un orizzonte temporale fisso e non è una probabilità di sopravvivenza. Il modello non è una survival analysis né uno score prognostico clinicamente validato.</div>
  </details>
  <details id="hs50CdcDiabetesDetails">
    <summary><b>CDC/BRFSS · diabete/prediabete</b> · 253.680 record survey</summary>
    <p class="hint">Modello cross-sectional sul dataset CDC Diabetes Health Indicators. Età, sesso e BMI vengono riutilizzati dal dossier quando disponibili. Le altre risposte devono rispettare le definizioni BRFSS sorgente.</p>
    <div class="grid">
      <label>Pressione alta riferita<select id="hs50_high_bp"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Colesterolo alto riferito<select id="hs50_high_chol"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Controllo colesterolo negli ultimi 5 anni<select id="hs50_chol_check"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Almeno 100 sigarette nella vita<select id="hs50_smoker_100"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Ictus riferito<select id="hs50_stroke_history"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>CHD o infarto riferito<select id="hs50_heart_disease_or_attack"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Attività fisica negli ultimi 30 giorni<select id="hs50_physical_activity"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Frutta ≥1 volta/giorno<select id="hs50_fruits_daily"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Verdura ≥1 volta/giorno<select id="hs50_veggies_daily"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Consumo elevato di alcol<select id="hs50_heavy_alcohol"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Copertura sanitaria<select id="hs50_any_healthcare"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Impossibilità di vedere un medico per costo negli ultimi 12 mesi<select id="hs50_no_doctor_due_cost"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Salute generale riferita<select id="hs50_general_health"><option value="">—</option><option value="1">Ottima</option><option value="2">Molto buona</option><option value="3">Buona</option><option value="4">Discreta</option><option value="5">Scarsa</option></select></label>
      <label>Giorni di salute mentale non buona (ultimi 30)<input id="hs50_mental_health_days" type="number" min="0" max="30" step="1"></label>
      <label>Giorni di salute fisica non buona (ultimi 30)<input id="hs50_physical_health_days" type="number" min="0" max="30" step="1"></label>
      <label>Difficoltà seria a camminare/salire scale<select id="hs50_difficulty_walking"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Istruzione BRFSS<select id="hs50_education"><option value="">—</option><option value="1">Mai frequentato / solo kindergarten</option><option value="2">Classi 1–8</option><option value="3">Classi 9–11</option><option value="4">Diploma / GED</option><option value="5">College 1–3 anni / scuola tecnica</option><option value="6">College ≥4 anni</option></select></label>
      <label>Reddito BRFSS<select id="hs50_income"><option value="">—</option><option value="1">Categoria 1 · &lt;$10.000</option><option value="2">Categoria 2</option><option value="3">Categoria 3</option><option value="4">Categoria 4</option><option value="5">Categoria 5 · &lt;$35.000</option><option value="6">Categoria 6</option><option value="7">Categoria 7</option><option value="8">Categoria 8 · ≥$75.000</option></select></label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Semantica del target:</b> <code>Diabetes_binary=1</code> unisce <b>prediabete e diabete</b>. La percentuale è una classificazione del label sorgente BRFSS, non una diagnosi, non separa prediabete da diabete e non è la probabilità futura di sviluppare diabete.</div>
  </details>
  <details id="hs51SepsisDetails">
    <summary><b>Infezione / SIRS / sepsi · esito ospedaliero</b> · primary cohort UCI 827</summary>
    <p class="hint">Età e sesso vengono riutilizzati dal dossier. Inserisci soltanto il numero dell'episodio settico secondo la codifica sorgente (1=primo episodio, 2=secondo, ...). Il primary cohort norvegese 2011–2012 include infezioni, SIRS, sepsi microbiologica o shock settico secondo definizioni pre-Sepsis-3; non tutti i 110.204 ricoveri possono essere qualificati come Sepsis-3.</p>
    <div class="grid">
      <label>Numero episodio settico<input id="hs51_episode_number" type="number" min="1" max="5" step="1"></label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Semantica dell'output:</b> il modello stima il label di <b>decesso come esito ospedaliero</b> nella coorte sorgente. Il paper descrive l'orizzonte come “circa 9,351 giorni” perché 9,351 è la <b>durata media</b> del ricovero; la durata individuale varia da 0 a 499 giorni. HealthSolver quindi non interpreta 9,351 giorni come un orizzonte fisso per ogni paziente e non presenta la percentuale come survival/time-to-event.</div>
    <div class="notice" style="margin-top:10px"><b>Validazione esterna debole:</b> sulla coorte sudcoreana indipendente di 137 pazienti, AUROC 0,548. Il risultato va trattato come dimostrazione metodologica di ricerca e non generalizzato clinicamente.</div>
  </details>
  <details id="hs52MiFatalDetails">
    <summary><b>Infarto miocardico acuto · esito letale sorgente</b> · admission-time UCI 579</summary>
    <p class="hint">Il modello usa 21 variabili predefinite disponibili all'ammissione. Età e sesso vengono riutilizzati dal dossier. Pressione, sodio e potassio vengono riusati solo se presenti nelle stesse unità; in alternativa puoi inserirli qui. Sono escluse le 9 variabili dinamiche dei giorni successivi e tutte le variabili terapeutiche.</p>
    <div class="grid">
      <label>Infarti miocardici pregressi<select id="hs52_inf_anam"><option value="">—</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3 o più</option></select></label>
      <label>Angina da sforzo in anamnesi<select id="hs52_stenok_an"><option value="">—</option><option value="0">Mai</option><option value="1">Nell'ultimo anno</option><option value="2">1 anno fa</option><option value="3">2 anni fa</option><option value="4">3 anni fa</option><option value="5">4–5 anni fa</option><option value="6">&gt;5 anni fa</option></select></label>
      <label>Classe funzionale angina<select id="hs52_fk_stenok"><option value="">—</option><option value="0">Nessuna</option><option value="1">I</option><option value="2">II</option><option value="3">III</option><option value="4">IV</option></select></label>
      <label>CHD nelle settimane/giorni precedenti<select id="hs52_ibs_post"><option value="">—</option><option value="0">Nessuna</option><option value="1">Angina da sforzo</option><option value="2">Angina instabile</option></select></label>
      <label>Ipertensione essenziale<select id="hs52_gb"><option value="">—</option><option value="0">Nessuna</option><option value="1">Stadio 1</option><option value="2">Stadio 2</option><option value="3">Stadio 3</option></select></label>
      <label>Ipertensione sintomatica<select id="hs52_sim_gipert"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Scompenso cardiaco cronico pregresso<select id="hs52_zsn_a"><option value="">—</option><option value="0">Nessuno</option><option value="1">Stadio I</option><option value="2">Stadio II · disfunzione destra</option><option value="3">Stadio II · disfunzione sinistra</option><option value="4">Stadio IIB · destra + sinistra</option></select></label>
      <label>PA sistolica in ICU all'ingresso (mmHg)<input id="hs52_sbp" type="number" min="0" step="any"></label>
      <label>PA diastolica in ICU all'ingresso (mmHg)<input id="hs52_dbp" type="number" min="0" step="any"></label>
      <label>Edema polmonare all'ingresso in ICU<select id="hs52_pulm_edema"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Shock cardiogeno all'ingresso in ICU<select id="hs52_cardiogenic_shock"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>FA parossistica all'ingresso/pre-ospedaliero<select id="hs52_parox_af"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Fibrillazione ventricolare all'ingresso/pre-ospedaliero<select id="hs52_vf"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Infarto ventricolare destro<select id="hs52_rv_mi"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Potassio sierico (mmol/L)<input id="hs52_k" type="number" step="any"></label>
      <label>Sodio sierico (mmol/L)<input id="hs52_na" type="number" step="any"></label>
      <label>Leucociti (10^9/L)<input id="hs52_wbc" type="number" min="0" step="any"></label>
      <label>VES (mm/h)<input id="hs52_esr" type="number" min="0" step="any"></label>
      <label>Tempo da inizio attacco CHD a ospedale<select id="hs52_time_to_hospital"><option value="">—</option><option value="1">&lt;2 ore</option><option value="2">2–4 ore</option><option value="3">4–6 ore</option><option value="4">6–8 ore</option><option value="5">8–12 ore</option><option value="6">12–24 ore</option><option value="7">&gt;1 giorno</option><option value="8">&gt;2 giorni</option><option value="9">&gt;3 giorni</option></select></label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Semantica del target:</b> <code>LET_IS ≠ 0</code> indica che nel record sorgente è registrata una delle sette cause di esito letale. È un classificatore di ricerca nel dominio dei ricoveri per IMA del dataset, non uno score di mortalità clinicamente validato e non una raccomandazione di triage.</div>
    <div class="notice" style="margin-top:10px"><b>Nota di leakage/causalità:</b> shock cardiogeno, edema polmonare e aritmie presenti già all'ingresso sono mantenuti perché UCI li definisce admission/pre-hospital. Sono forti segnali di gravità e concettualmente vicini ad alcune cause letali finali: per questo la probabilità non va interpretata come rischio eziologico indipendente.</div>
    <div class="notice" style="margin-top:10px"><b>Limite della selezione feature:</b> il profiling esplorativo preliminare ha incluso correlazioni univariate con <code>LET_IS</code> sull'intero dataset prima di congelare le 21 feature. Non è stato fatto tuning iterativo sul test, ma il test finale non è completamente indipendente dalla conoscenza usata nello screening; le metriche possono quindi essere ottimistiche e restano esplorative fino a validazione esterna.</div>
  </details>
  <details id="hs53Support2Details">
    <summary><b>SUPPORT2 · decesso intraospedaliero</b> · stato clinico giorno 3</summary>
    <p class="hint">Coorte multicentrica di 9.105 pazienti critici in 5 centri USA. Il modello usa un set split-first di variabili baseline/giorno 3. Solo età e sesso vengono riutilizzati automaticamente dal dossier. I parametri fisiologici del giorno 3 contano come osservati solo se inseriti esplicitamente qui; se assenti restano missing e possono essere imputati soltanto entro la policy di astensione del modello.</p>
    <div class="grid">
      <label>Gruppo diagnostico SUPPORT<select id="hs53_dzgroup"><option value="">—</option><option>ARF/MOSF w/Sepsis</option><option>COPD</option><option>CHF</option><option>Cirrhosis</option><option>Coma</option><option>Colon Cancer</option><option>Lung Cancer</option><option>MOSF w/Malig</option></select></label>
      <label>Numero comorbidità<input id="hs53_numco" type="number" min="0" step="1"></label>
      <label>SUPPORT coma score giorno 3<input id="hs53_scoma" type="number" min="0" max="100" step="any"></label>
      <label>Giorno di ricovero all'ingresso nello studio<input id="hs53_hday" type="number" min="1" step="1"></label>
      <label>Diabete<select id="hs53_diabetes"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Demenza<select id="hs53_dementia"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Cancro<select id="hs53_ca"><option value="">—</option><option value="no">No</option><option value="yes">Sì, non metastatico</option><option value="metastatic">Metastatico</option></select></label>
      <label>Pressione arteriosa media giorno 3 (mmHg)<input id="hs53_meanbp" type="number" step="any"></label>
      <label>Leucociti giorno 3 (10³/µL)<input id="hs53_wblc" type="number" min="0" step="any"></label>
      <label>Frequenza respiratoria giorno 3 (atti/min)<input id="hs53_resp" type="number" min="0" step="any"></label>
      <label>Temperatura giorno 3 (°C)<input id="hs53_temp" type="number" step="any"></label>
      <label>Frequenza cardiaca giorno 3 (bpm)<input id="hs53_hrt" type="number" min="0" step="any"></label>
      <label>Creatinina giorno 3 (mg/dL)<input id="hs53_crea" type="number" min="0" step="any"></label>
      <label>Sodio giorno 3 (mEq/L)<input id="hs53_sod" type="number" min="0" step="any"></label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Target:</b> <code>hospdead=1</code> significa decesso durante il ricovero nella coorte SUPPORT2. Non è mortalità a 30/90 giorni, non è una survival probability e non è uno score clinicamente validato.</div>
    <div class="notice" style="margin-top:10px"><b>Leakage control:</b> esclusi outcome/follow-up, costi e utilizzo futuro, TISS giorni 3–25, punteggi SUPPORT/APACHE, probabilità di sopravvivenza già calcolate, prognosi del medico e variabili DNR. Il modello usa la fisiologia grezza del giorno 3 come index time.</div>
    <div class="notice" style="margin-top:10px"><b>Fairness/portabilità:</b> razza, reddito e istruzione non sono usati come predittori. La performance resta una validazione interna sullo stesso studio storico e richiede validazione esterna contemporanea.</div>
  </details>
  <details id="hs54EicuDetails">
    <summary><b>eICU Demo · decesso ospedaliero</b> · first APACHE day</summary>
    <p class="hint">Modello di ricerca sulla demo pubblica eICU. L'index time è la fine del primo APACHE day: i valori fisiologici devono quindi rappresentare esplicitamente le peggiori misure delle prime 24 ore. Solo età e sesso vengono riutilizzati dal dossier generale.</p>
    <div class="grid">
      <label>GCS totale peggiore nel primo APACHE day<input id="hs54_gcs_total" type="number" min="3" max="15" step="1"></label>
      <label>GCS non valutabile per farmaci<select id="hs54_gcs_meds"><option value="">—</option><option value="0">No</option><option value="1">Sì</option></select></label>
      <label>Temperatura peggiore prime 24h (°C)<input id="hs54_temperature" type="number" step="any"></label>
      <label>Frequenza respiratoria peggiore prime 24h (atti/min)<input id="hs54_respiratoryrate" type="number" min="0" step="any"></label>
      <label>Frequenza cardiaca peggiore prime 24h (bpm)<input id="hs54_heartrate" type="number" min="0" step="any"></label>
      <label>Pressione arteriosa media peggiore prime 24h (mmHg)<input id="hs54_meanbp" type="number" step="any"></label>
      <label>Glucosio peggiore prime 24h (mg/dL)<input id="hs54_glucose" type="number" min="0" step="any"></label>
      <label>Sodio peggiore prime 24h (mEq/L)<input id="hs54_sodium" type="number" step="any"></label>
      <label>Creatinina peggiore prime 24h (mg/dL)<input id="hs54_creatinine" type="number" min="0" step="any"></label>
    </div>
    <div class="notice" style="margin-top:10px"><b>Coerenza GCS:</b> nel source eICU, se il GCS è non valutabile per farmaci (<code>meds=1</code>), il GCS numerico non è disponibile. In quel caso HealthSolver ignora qualsiasi GCS numerico inserito e applica la stessa rappresentazione usata nello sviluppo.</div>
    <div class="notice" style="margin-top:10px"><b>Target:</b> <code>hospitalDischargeStatus = Expired</code> contro <code>Alive</code>. Non è mortalità a 24 ore, 30 o 90 giorni e non è una probabilità di sopravvivenza.</div>
    <div class="notice" style="margin-top:10px"><b>Leakage control:</b> nessun APACHE score o predicted mortality/LOS, nessun outcome/actual result, nessun campo di dimissione e nessun identificativo ospedale è usato come predittore. Lo stesso paziente non compare in più partizioni di sviluppo.</div>
    <div class="notice" style="margin-top:10px"><b>Validazione:</b> metriche interne patient-disjoint sulla demo eICU; non è validazione esterna, clinica o prospettica. Software di ricerca.</div>
  </details>
  <h3 style="margin:24px 0 10px;font-size:1.25rem">Risultati predittivi</h3>
  <div id="hs42Results" class="grid"></div>
  <section id="hs56Transport">
    <div class="hs56-head">
      <div>
        <div class="eyebrow">COMMON-OUTCOME TRANSPORT · 0.56</div>
        <h3 style="margin:4px 0 6px">Modello cross-dataset sul decesso intraospedaliero</h3>
        <p class="hint" style="margin:0">Modello separato dai 14 modelli base. Usa soltanto età e sesso, le uniche variabili pulitamente armonizzabili tra UCI Sepsis Survival, SUPPORT2 ed eICU Demo.</p>
      </div>
      <div class="hs56-badge">GENERALIZZAZIONE DEBOLE</div>
    </div>
    <div id="hs56TransportBody"><div class="hs56-warning">Compila età e sesso, quindi premi <b>CALCOLA PREDIZIONI</b>. Questa funzione è sperimentale e non è un punteggio clinico.</div></div>
  </section>
  <section id="hs55Ensemble">
    <div class="hs55-head">
      <div>
        <div class="eyebrow">ENSEMBLE INTELLIGENCE · 0.55</div>
        <h3 style="margin:4px 0 6px">Sintesi complessa multi-modello</h3>
        <p class="hint" style="margin:0">Combina in modo deterministico solo le uscite dei modelli applicabili, rispettando la soglia interna di ciascun modello. Produce pattern di attivazione, copertura e concordanza: <b>non produce una nuova probabilità clinica globale</b>.</p>
      </div>
      <div class="hs55-badge">NON È UNA PROBABILITÀ</div>
    </div>
    <div id="hs55EnsembleSummary"></div>
    <div id="hs55DomainGrid"></div>
    <div id="hs55Concordance" class="hs55-card" style="margin-top:10px"></div>
    <div id="hs55Coactivation" class="hs55-card" style="margin-top:10px"></div>
    <details id="hs55Methodology" style="margin-top:12px">
      <summary><b>Metodo e limiti dell'Ensemble Intelligence Layer</b></summary>
      <div id="hs55MethodologyText" class="hint" style="margin-top:8px"></div>
    </details>
  </section>
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

const SUPPORT2_ID='HS-SUPPORT2-HOSPDEATH-001';
const support2Pair=models.find(x=>x.model.model_id===SUPPORT2_ID)||null;
const EICU_ID='HS-EICU-DEMO-HOSPDEATH-001';
const eicuPair=models.find(x=>x.model.model_id===EICU_ID)||null;
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
function support2EncodedCase(model,age,sex){
  if(!model) return {};
  const rawValues={
    age,
    sex:sex===1?'male':sex===0?'female':null,
    dzgroup:raw('hs53_dzgroup')||null,
    'num.co':num('hs53_numco'),
    scoma:num('hs53_scoma'),
    hday:num('hs53_hday'),
    diabetes:num('hs53_diabetes'),
    dementia:num('hs53_dementia'),
    ca:raw('hs53_ca')||null,
    meanbp:num('hs53_meanbp'),
    wblc:num('hs53_wblc'),
    hrt:num('hs53_hrt'),
    resp:num('hs53_resp'),
    temp:num('hs53_temp'),
    crea:num('hs53_crea'),
    sod:num('hs53_sod')
  };
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
function eicuEncodedCase(model,age,sex){
  if(!model) return {};
  const gcsMeds=num('hs54_gcs_meds');
  const rawValues={
    age,
    sex:sex===1?'male':sex===0?'female':null,
    gcs_total:gcsMeds===1?null:num('hs54_gcs_total'),
    gcs_unscorable_meds:gcsMeds,
    temperature:num('hs54_temperature'),
    respiratoryrate:num('hs54_respiratoryrate'),
    heartrate:num('hs54_heartrate'),
    meanbp:num('hs54_meanbp'),
    glucose:num('hs54_glucose'),
    sodium:num('hs54_sodium'),
    creatinine:num('hs54_creatinine')
  };
  const out={};
  for(const feature of model.features){
    const enc=(model.encoding_map||{})[feature];
    if(!enc){out[feature]=null;continue;}
    const rv=rawValues[enc.raw_key];
    if(feature==='age_numeric'){
      const n=Number(rv);
      out[feature]=(rv===null||rv===undefined||rv===''||!Number.isFinite(n))?null:Math.min(n,90);
    }else if(feature==='age_over_89'){
      const n=Number(rv);
      out[feature]=(rv===null||rv===undefined||rv===''||!Number.isFinite(n))?null:(n>89?1:0);
    }else if(enc.kind==='category'){
      out[feature]=(rv===null||rv===undefined||rv==='')?null:(String(rv)===String(enc.category)?1:0);
    }else{
      const n=Number(rv);
      out[feature]=(rv===null||rv===undefined||rv===''||!Number.isFinite(n))?null:n;
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
  const cdcDiabetes={
    high_bp:num('hs50_high_bp'),
    high_chol:num('hs50_high_chol'),
    chol_check:num('hs50_chol_check'),
    bmi:first(num('ci_bmi'),num('hs45_bmi')),
    smoker_100:num('hs50_smoker_100'),
    stroke_history:num('hs50_stroke_history'),
    heart_disease_or_attack:num('hs50_heart_disease_or_attack'),
    physical_activity:num('hs50_physical_activity'),
    fruits_daily:num('hs50_fruits_daily'),
    veggies_daily:num('hs50_veggies_daily'),
    heavy_alcohol:num('hs50_heavy_alcohol'),
    any_healthcare:num('hs50_any_healthcare'),
    no_doctor_due_cost:num('hs50_no_doctor_due_cost'),
    general_health:num('hs50_general_health'),
    mental_health_days:num('hs50_mental_health_days'),
    physical_health_days:num('hs50_physical_health_days'),
    difficulty_walking:num('hs50_difficulty_walking'),
    sex:sexVal(),
    age_category:brfssAgeCategory(age),
    education:num('hs50_education'),
    income:num('hs50_income')
  };
  const sv=sexVal();
  const sepsis={
    age_years:age,
    sex_0male_1female:sv===1?0:sv===0?1:null,
    episode_number:num('hs51_episode_number')
  };
  const support2=support2EncodedCase(support2Pair?.model||null,age,sv);
  const eicu=eicuEncodedCase(eicuPair?.model||null,age,sv);
  const miFatal={
    AGE:age,
    SEX:sv,
    INF_ANAM:num('hs52_inf_anam'),
    STENOK_AN:num('hs52_stenok_an'),
    FK_STENOK:num('hs52_fk_stenok'),
    IBS_POST:num('hs52_ibs_post'),
    GB:num('hs52_gb'),
    SIM_GIPERT:num('hs52_sim_gipert'),
    ZSN_A:num('hs52_zsn_a'),
    S_AD_ORIT:first(num('ci_systolic'),num('hs52_sbp')),
    D_AD_ORIT:first(num('ci_diastolic'),num('hs52_dbp')),
    O_L_POST:num('hs52_pulm_edema'),
    K_SH_POST:num('hs52_cardiogenic_shock'),
    MP_TP_POST:num('hs52_parox_af'),
    FIB_G_POST:num('hs52_vf'),
    IM_PG_P:num('hs52_rv_mi'),
    K_BLOOD:first(num('ci_potassium'),num('hs52_k')),
    NA_BLOOD:first(num('ci_sodium'),num('hs52_na')),
    L_BLOOD:num('hs52_wbc'),
    ROE:num('hs52_esr'),
    TIME_B_S:num('hs52_time_to_hospital')
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
    'HS-UCI-HFDEATH-001':heartFailure,
    'HS-CDC-DIABIND-001':cdcDiabetes,
    'HS-UCI-SEPSISDEATH-001':sepsis,
    'HS-UCI-MIFATAL-001':miFatal,
    'HS-SUPPORT2-HOSPDEATH-001':support2,
    'HS-EICU-DEMO-HOSPDEATH-001':eicu
  };
}
function readiness(model,values){
  const missing=model.features.filter(f=>values[f]===null||values[f]===undefined||!Number.isFinite(Number(values[f])));
  const base={missing,provided:model.features.length-missing.length};
  if(Array.isArray(model.raw_features)&&model.encoding_map&&Number.isFinite(Number(model.abstention?.max_missing_raw_features))){
    const rawMissing=model.raw_features.filter(rawKey=>{
      const encoded=model.features.filter(f=>model.encoding_map?.[f]?.raw_key===rawKey);
      return encoded.length===0||encoded.every(f=>missing.includes(f));
    });
    const requiredRawMissing=(model.abstention?.required_raw_features||[]).filter(k=>rawMissing.includes(k));
    return {
      ...base,
      rawMissing,
      requiredRawMissing,
      ready:rawMissing.length<=Number(model.abstention.max_missing_raw_features)&&requiredRawMissing.length===0
    };
  }
  return {...base,ready:missing.length<=model.abstention.max_missing_features};
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
    const missCount=r.rawMissing?.length??r.missing.length;
    d.innerHTML=`<b>${r.provided}/${model.features.length}</b><span><strong>${titleFor(entry)}</strong><br><small>${r.ready?'✓ PRONTO ALLA PREDIZIONE':'mancano '+missCount+' dati'}</small></span>`;
    box.append(d);
  }
  $('hs42Status').textContent='Copertura aggiornata dai campi correnti dell’Expert Mode.';
}
function renderResult(entry,model,res){
  const d=document.createElement('div');d.className='card';
  d.style.margin='0';
  if(res.status==='abstain'){
    const missCount=res.rawMissing?.length??res.missing.length;
    const required=res.requiredRawMissing?.length?` Campi categoriali obbligatori mancanti: ${res.requiredRawMissing.join(', ')}.`:'';
    d.innerHTML=`<div class="eyebrow">${model.model_id}</div><h3>${titleFor(entry)}</h3><div class="notice"><b>Astensione.</b> Mancano ${missCount} dati clinici richiesti.${required} Compila il dossier o i dati specialistici pertinenti.</div>`;
    return d;
  }
  const pct=res.p*100;
  const contrib=res.contributions.slice(0,4).map(([f,c])=>`<li><b>${f}</b>: ${c>=0?'+':''}${c.toFixed(3)}</li>`).join('');
  const semanticNotice=model.model_id==='HS-UCI-HFDEATH-001'
    ? `<div class="notice"><b>DEATH_EVENT UCI 519, non rischio a tempo fisso.</b> Coorte Faisalabad 2015 con disfunzione sistolica ventricolare sinistra e NYHA III–IV; follow-up 4–285 giorni (media ~130). Questa percentuale non è mortalità a 30/90/365 giorni e non è una probabilità di sopravvivenza.</div>`
    : model.model_id==='HS-CDC-DIABIND-001'
      ? `<div class="notice"><b>Label BRFSS, non diagnosi né rischio futuro.</b> <code>Diabetes_binary=1</code> unisce prediabete e diabete. Questa percentuale non distingue le due condizioni e non stima la probabilità futura di sviluppare diabete.</div>`
      : model.model_id==='HS-UCI-SEPSISDEATH-001'
        ? `<div class="notice"><b>Esito ospedaliero con durata variabile.</b> Il paper usa “circa 9,351 giorni” perché è la durata media del ricovero, ma i ricoveri variano da 0 a 499 giorni: non è un endpoint fisso a 9 giorni né una probabilità di sopravvivenza. <b>Validazione esterna debole:</b> coorte sudcoreana n=137, AUROC 0.548; non generalizzare clinicamente.</div>`
        : model.model_id==='HS-UCI-MIFATAL-001'
          ? `<div class="notice"><b>LET_IS sorgente, non score clinico.</b> La classe positiva raggruppa sette cause di esito letale registrate nel dataset UCI 579. Il modello usa 21 feature di ingresso congelate prima del fitting e non include variabili dinamiche dei giorni successivi né farmaci. Il profiling preliminare aveva però visto associazioni univariate con l'outcome: le metriche interne sono esplorative e possono essere ottimistiche. La soglia interna privilegia sensibilità e non è un cut-off di triage.</div>`
          : model.model_id==='HS-SUPPORT2-HOSPDEATH-001'
            ? `<div class="notice"><b>SUPPORT2 hospdead, stato clinico giorno 3.</b> Stima del label di decesso intraospedaliero nella coorte SUPPORT2. I parametri fisiologici usati sono esplicitamente quelli del giorno 3; non vengono sostituiti con valori generici del dossier. Non è mortalità a 30/90 giorni e non è una survival probability. Il protocollo ha effettuato lo split prima di qualunque screening e ha escluso score/probabilità prognostiche preesistenti, prognosi del medico e DNR. Validazione interna storica, non validazione clinica contemporanea.</div>`
            : model.model_id==='HS-EICU-DEMO-HOSPDEATH-001'
              ? `<div class="notice"><b>eICU Demo hospitalDischargeStatus, first APACHE day.</b> La classe positiva è <code>Expired</code> alla dimissione ospedaliera dopo la prima ICU stay indicizzata. Le variabili fisiologiche sono peggiori valori delle prime 24 ore e devono essere inserite esplicitamente nel pannello eICU; i valori generici del dossier non vengono riutilizzati. APACHE score, predicted mortality/LOS, outcome actual, campi di dimissione e hospital ID sono esclusi. Split patient-disjoint; validazione interna sulla demo, non validazione clinica o prospettica.</div>`
              : '';
  d.innerHTML=`
    <div class="eyebrow">${model.model_id}</div>
    <h3>${titleFor(entry)}</h3>
    <div class="metric"><b>${pct.toFixed(1)}%</b><span>STIMA PREDITTIVA DEL MODELLO</span></div>
    ${semanticNotice}
    ${res.imputed.length?`<p class="hint">Imputati con mediana training: ${res.imputed.join(', ')}</p>`:''}
    ${res.ood.length?`<div class="notice">Fuori dal range osservato nel training: ${res.ood.join(', ')}</div>`:''}
    <p class="hint"><b>Contributi principali</b></p><ul>${contrib}</ul>
    <p class="hint">Test interno: AUROC ${Number(first(model.metrics_test.auroc,model.metrics_test.auroc_weighted)).toFixed(3)} · Brier ${Number(first(model.metrics_test.brier,model.metrics_test.brier_weighted)).toFixed(3)}. Le metriche interne non costituiscono validazione clinica/prospettica.</p>
    ${model.model_id==='HS-UCI-SEPSISDEATH-001'&&model.external_validation?`<p class="hint"><b>Validazione esterna indipendente del dataset:</b> n=${model.external_validation.n} · AUROC ${Number(model.external_validation.auroc).toFixed(3)} · AUPRC ${Number(model.external_validation.auprc).toFixed(3)} · Brier ${Number(model.external_validation.brier).toFixed(3)}. Discriminazione esterna debole; non equivale a validazione clinica/prospettica.</p>`:''}
  `;
  return d;
}


function hs56TransportInfer(){
  if(!COMMON_OUTCOME) return {status:'unavailable'};
  const age=first(num('ciAge'),num('coachAge'));
  const male=sexVal();
  if(age===null||male===null||!Number.isFinite(Number(age))) return {status:'abstain'};
  const vals={age:Number(age),male:Number(male)};
  let score=Number(COMMON_OUTCOME.logistic.intercept);
  const contributions=[];
  for(const f of COMMON_OUTCOME.features||[]){
    const z=(vals[f]-Number(COMMON_OUTCOME.standardization.mean[f]))/Number(COMMON_OUTCOME.standardization.scale[f]);
    const part=z*Number(COMMON_OUTCOME.logistic.coefficients[f]);
    score+=part;contributions.push([f,part]);
  }
  const p=sigmoid(Number(COMMON_OUTCOME.calibration.intercept)+Number(COMMON_OUTCOME.calibration.slope)*score);
  return {status:'predicted',p,threshold:Number(COMMON_OUTCOME.threshold),values:vals,contributions};
}
function renderTransport(){
  const box=$('hs56TransportBody');
  if(!box) return;
  if(!COMMON_OUTCOME){
    box.innerHTML='<div class="hs56-warning"><b>Layer 0.56 non disponibile.</b> Le 14 predizioni e l’Ensemble Intelligence restano operative.</div>';
    return;
  }
  const r=hs56TransportInfer();
  if(r.status==='abstain'){
    box.innerHTML='<div class="hs56-warning"><b>Astensione.</b> Il layer cross-dataset richiede età e sesso. Non vengono imputati perché sono le sole due variabili condivise dal modello.</div>';
    window.__HS_LAST_TRANSPORT__={status:'abstain',qualification:COMMON_OUTCOME.qualification_status};
    return;
  }
  if(r.status!=='predicted'){
    box.innerHTML='<div class="hs56-warning"><b>Layer non disponibile.</b></div>';return;
  }
  const m=COMMON_OUTCOME.metrics||{}, pooled=m.pooled_source_balanced_test||{}, loso=m.leave_one_source_out_transport||{};
  const minAuc=Number(m.minimum_loso_auroc);
  const pct=r.p*100, above=r.p>=r.threshold;
  const losoRows=Object.entries(loso).map(([k,v])=>'<li><b>'+k+'</b>: AUROC '+Number(v.auroc).toFixed(3)+' · n='+Number(v.n).toLocaleString('it-IT')+'</li>').join('');
  box.innerHTML=
    '<div class="hs56-grid">'+
      '<div class="hs56-card"><div class="hs56-value">'+pct.toFixed(1)+'%</div><b>output modellistico del label condiviso</b><p class="hint">Non è una probabilità clinica generale di mortalità.</p></div>'+
      '<div class="hs56-card"><div class="hs56-value">'+(above?'SOPRA':'SOTTO')+'</div><b>soglia interna '+(r.threshold*100).toFixed(1)+'%</b><p class="hint">Soglia di ricerca, non di triage.</p></div>'+
      '<div class="hs56-card"><div class="hs56-value">'+Number(pooled.auroc).toFixed(3)+'</div><b>AUROC test bilanciata per sorgente</b><p class="hint">Valutazione pooled, non validazione clinica.</p></div>'+
      '<div class="hs56-card"><div class="hs56-value">'+minAuc.toFixed(3)+'</div><b>peggior AUROC leave-one-source-out</b><p class="hint">Misura la fragilità del trasporto fra dataset.</p></div>'+
    '</div>'+
    '<div class="hs56-warning"><b>WEAK_TRANSPORT_GENERALIZATION.</b> Il modello usa solo età e sesso perché sono le sole feature comuni pulitamente armonizzabili fra i tre dataset. Il trasporto verso SUPPORT2 è quasi casuale: non usare questo numero per diagnosi, triage, trattamento, ricovero, dimissione o decisioni di fine vita.</div>'+
    '<details style="margin-top:12px"><summary><b>Validazione cross-dataset e limiti</b></summary><p class="hint">Leave-one-source-out: il modello viene riaddestrato su due sorgenti e valutato sulla terza mai vista. Le coorti hanno criteri di inclusione e index time differenti; il solo elemento comune è il label di esito ospedaliero, non un orizzonte temporale fisso.</p><ul>'+losoRows+'</ul><p class="hint">Questo layer <b>non</b> è uno stacker delle 14 probabilità HealthSolver: non esiste un dataset comune che contenga simultaneamente tutti gli input necessari a produrre quelle 14 uscite sullo stesso paziente.</p></details>';
  window.__HS_LAST_TRANSPORT__={status:'predicted',p:r.p,threshold:r.threshold,above_threshold:above,qualification:COMMON_OUTCOME.qualification_status,minimum_loso_auroc:minAuc};
}
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
function hs55Threshold(model){
  const t=Number(model?.threshold);
  return Number.isFinite(t)&&t>0&&t<1?t:null;
}
function hs55ThresholdPosition(p,t){
  if(!Number.isFinite(p)||!Number.isFinite(t)||t<=0||t>=1) return null;
  const x=Math.max(0,Math.min(1,p));
  return x<=t?0.5*(x/t):0.5+0.5*((x-t)/(1-t));
}
function hs55Signal(row){
  if(!row||row.res?.status!=='predicted') return null;
  const p=Number(row.res.p),t=hs55Threshold(row.model);
  const position=hs55ThresholdPosition(p,t);
  if(position===null) return null;
  return {
    id:row.model.model_id,
    title:titleFor(row.entry),
    p,t,
    active:p>=t,
    position,
    separation:Math.abs(position-0.5)*2
  };
}
function hs55State(index){
  const rules=ENSEMBLE?.display_rules||{};
  if(index===null||!Number.isFinite(index)) return 'non valutabile';
  if(index<=Number(rules.domain_below_max??40)) return rules.labels?.below||'prevalentemente sotto le soglie interne';
  if(index<=Number(rules.domain_mixed_max??60)) return rules.labels?.mixed||'pattern intermedio/misto';
  return rules.labels?.above||'prevalentemente sopra le soglie interne';
}
function renderEnsemble(rows){
  const summary=$('hs55EnsembleSummary'),domainsBox=$('hs55DomainGrid'),conc=$('hs55Concordance'),map=$('hs55Coactivation'),method=$('hs55MethodologyText');
  if(!summary||!domainsBox||!conc||!map||!method) return;
  if(!ENSEMBLE){
    summary.innerHTML='<div class="hs55-card"><b>Layer ensemble non disponibile.</b><p class="hint">Le 14 predizioni individuali restano operative e invariate.</p></div>';
    domainsBox.innerHTML='';conc.innerHTML='';map.innerHTML='';
    return;
  }
  const signals=rows.map(hs55Signal).filter(Boolean);
  const byId=Object.fromEntries(signals.map(s=>[s.id,s]));
  const domainResults=(ENSEMBLE.domains||[]).map(d=>{
    const available=(d.models||[]).map(id=>byId[id]).filter(Boolean);
    const index=available.length?mean(available.map(x=>x.position))*100:null;
    const separation=available.length?mean(available.map(x=>x.separation))*100:null;
    const active=available.filter(x=>x.active).length;
    return {...d,available,index,separation,active,coverage:available.length/(d.models?.length||1)};
  });
  const applicable=signals.length;
  const active=signals.filter(x=>x.active).length;
  const evaluableDomains=domainResults.filter(d=>d.available.length);
  const activeDomains=domainResults.filter(d=>d.active>0).length;
  const highest=evaluableDomains.slice().sort((a,b)=>(b.index??-1)-(a.index??-1))[0]||null;

  summary.innerHTML=[
    ['Modelli applicabili',applicable+'/'+rows.length,'I modelli in astensione non valgono zero e non entrano nella sintesi.'],
    ['Sopra soglia interna',String(active),'Conteggio descrittivo sui soli modelli applicabili.'],
    ['Domini con segnali',evaluableDomains.length+'/'+domainResults.length,'Copertura dei domini configurati.'],
    ['Ampiezza co-attivazione',String(activeDomains),'Domini con almeno un modello sopra la propria soglia interna.']
  ].map(([l,v,h])=>'<div class="hs55-card"><div class="hs55-value">'+v+'</div><div class="hs55-label"><b>'+l+'</b><br>'+h+'</div></div>').join('');

  domainsBox.innerHTML=domainResults.map(d=>{
    if(!d.available.length) return '<div class="hs55-card hs55-domain"><h4>'+d.label+'</h4><p class="hs55-state">Non valutabile</p><p>0/'+d.models.length+' modelli applicabili.</p><p class="hint">'+d.interpretation+'</p></div>';
    const rai=d.index.toFixed(0);
    const sep=d.separation.toFixed(0);
    return '<div class="hs55-card hs55-domain"><h4>'+d.label+'</h4>'+
      '<div class="hs55-value">'+rai+'/100 RAI</div>'+
      '<p class="hs55-state">'+hs55State(d.index)+'</p>'+
      '<p>'+d.available.length+'/'+d.models.length+' modelli applicabili · '+d.active+' sopra soglia.</p>'+
      '<p>Separazione media dalla soglia: '+sep+'/100.</p>'+
      '<p class="hint">'+d.interpretation+'</p></div>';
  }).join('');

  const group=(ENSEMBLE.concordance_groups||[])[0];
  if(group){
    const gs=(group.models||[]).map(id=>byId[id]).filter(Boolean);
    let state='Non valutabile: servono almeno '+(group.min_applicable||2)+' modelli applicabili.';
    if(gs.length>=(group.min_applicable||2)){
      const on=gs.filter(x=>x.active).length;
      state=on===0?'Concordanza sotto-soglia':on===gs.length?'Concordanza sopra-soglia':'Pattern misto / discordante';
      state+=' · '+on+'/'+gs.length+' sopra la propria soglia.';
    }
    conc.innerHTML='<h4 style="margin:0 0 6px">'+group.label+'</h4><p class="hs55-state">'+state+'</p><p class="hint">'+group.semantics+'</p>';
  }

  map.innerHTML='<h4 style="margin:0 0 6px">Mappa di co-attivazione dei modelli applicabili</h4>'+
    '<div class="hs55-map">'+signals.map(s=>'<span class="hs55-chip '+(s.active?'on':'off')+'">'+s.title+' · '+(s.active?'sopra':'sotto')+' soglia · p '+(s.p*100).toFixed(1)+'%</span>').join('')+'</div>'+
    (highest?'<p class="hint" style="margin-top:10px">Pattern di attivazione più marcato, in senso puramente descrittivo: <b>'+highest.label+'</b> (RAI '+highest.index.toFixed(0)+'/100). Non equivale al dominio clinicamente più rischioso.</p>':'');

  method.innerHTML=
    '<p><b>Research Activation Index (RAI):</b> indice senza unità. Per ogni modello applicabile, 0,5 corrisponde alla sua soglia decisionale interna; le posizioni vengono poi mediate a pesi uguali dentro il dominio. Non è una media delle probabilità.</p>'+
    '<p><b>Separazione:</b> distanza media dalla soglia interna; non è confidenza statistica.</p>'+
    '<p><b>Concordanza:</b> confronta solo lo stato sopra/sotto soglia e soltanto nel gruppo configurato. Coorti e index time restano differenti.</p>'+
    '<div class="hs55-warning"><b>Limite vincolante:</b> HealthSolver 0.55 non ha un outcome comune su cui addestrare un meta-modello. Perciò non genera mortalità globale, rischio complessivo, probabilità diagnostica combinata o soglie di triage.</div>';

  window.__HS_LAST_ENSEMBLE__={
    release:ENSEMBLE.release,
    applicable_models:applicable,
    active_models:active,
    active_domains:activeDomains,
    domains:domainResults.map(d=>({id:d.id,label:d.label,index:d.index,separation:d.separation,applicable:d.available.length,total:d.models.length,active:d.active,state:hs55State(d.index)})),
    strongest_descriptive_domain:highest?highest.id:null
  };
}

function runAll(){
  const values=dossierCase(),out=$('hs42Results');out.innerHTML='';
  let done=0;
  const ensembleRows=[];
  for(const {entry,model} of models){
    const res=infer(model,values[model.model_id]||{});
    ensembleRows.push({entry,model,res});
    if(res.status==='predicted') done++;
    out.append(renderResult(entry,model,res));
  }
  renderCoverage();
  renderTransport();
  renderEnsemble(ensembleRows);
  $('hs42Status').textContent=`Analisi completata: ${done}/${models.length} modelli applicabili con i dati correnti. Ensemble Intelligence aggiornato sui soli modelli effettivamente predetti.`;
}
$('hs42Run').addEventListener('click',runAll);
$('hs42Refresh').addEventListener('click',renderCoverage);
const syncEicuGcs=()=>{
  const meds=$('hs54_gcs_meds'),gcs=$('hs54_gcs_total');
  if(!meds||!gcs) return;
  const blocked=meds.value==='1';
  if(blocked) gcs.value='';
  gcs.disabled=blocked;
  gcs.title=blocked?'GCS numerico non disponibile quando il GCS è non valutabile per farmaci.':'';
};
$('hs54_gcs_meds')?.addEventListener('change',()=>{syncEicuGcs();renderCoverage();});
host.addEventListener('input',e=>{if(e.target!==$('hs42Run')) renderCoverage();});
syncEicuGcs();
renderCoverage();
renderTransport();
})();