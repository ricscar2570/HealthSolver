(()=>{
  'use strict';
  if(window.__HS_PREDICTIVE_ENGINE_039__) return;
  window.__HS_PREDICTIVE_ENGINE_039__=true;

  const MODEL_URL='./predictive/model-heart-disease-v1.json';
  const css=`
  #hs-pe039{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:18px auto;max-width:1180px;padding:0 14px;color:#162033}
  #hs-pe039 *{box-sizing:border-box}
  #hs-pe039 .pe-card{background:#fff;border:1px solid #d7deea;border-radius:16px;padding:18px;box-shadow:0 8px 24px #12203312}
  #hs-pe039 h2{margin:0 0 6px;font-size:1.45rem}
  #hs-pe039 h3{margin:18px 0 8px;font-size:1.05rem}
  #hs-pe039 .muted{color:#5d6b82;font-size:.92rem;line-height:1.45}
  #hs-pe039 .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:14px}
  #hs-pe039 label{display:flex;flex-direction:column;gap:5px;font-size:.88rem;font-weight:650}
  #hs-pe039 input,#hs-pe039 select{min-height:42px;border:1px solid #b8c4d6;border-radius:9px;padding:8px 10px;background:#fff;color:#162033;font-size:16px}
  #hs-pe039 .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
  #hs-pe039 button{min-height:42px;border:0;border-radius:10px;padding:9px 14px;font-weight:700;cursor:pointer}
  #hs-pe039 .primary{background:#2457d6;color:white}
  #hs-pe039 .secondary{background:#e8eef9;color:#183466}
  #hs-pe039 .result{margin-top:16px;padding:16px;border-radius:12px;background:#f4f7fb;border:1px solid #d6dfed}
  #hs-pe039 .prob{font-size:2rem;font-weight:800;letter-spacing:-.03em}
  #hs-pe039 .bar{height:12px;background:#dfe6f1;border-radius:999px;overflow:hidden;margin:8px 0 12px}
  #hs-pe039 .bar>span{display:block;height:100%;background:#2457d6}
  #hs-pe039 .warn{padding:10px 12px;border-radius:10px;background:#fff3cd;border:1px solid #ead58a;color:#594800;margin-top:10px}
  #hs-pe039 .ok{padding:10px 12px;border-radius:10px;background:#edf8f1;border:1px solid #b9ddc7;color:#1d5934;margin-top:10px}
  #hs-pe039 table{width:100%;border-collapse:collapse;margin-top:8px;font-size:.9rem}
  #hs-pe039 th,#hs-pe039 td{text-align:left;padding:7px;border-bottom:1px solid #e2e7ef}
  #hs-pe039 details{margin-top:12px}
  @media(max-width:560px){#hs-pe039{padding:0 8px}#hs-pe039 .pe-card{padding:14px}}
  `;

  const fields=[
    ['age','Età (anni)','number',{min:18,max:100,step:1}],
    ['sex','Sesso','select',[['','—'],['0','Femmina'],['1','Maschio']]],
    ['cp','Tipo di dolore toracico','select',[['','—'],['1','Angina tipica'],['2','Angina atipica'],['3','Dolore non anginoso'],['4','Asintomatico']]],
    ['trestbps','Pressione sistolica a riposo (mmHg)','number',{min:60,max:260,step:1}],
    ['chol','Colesterolo sierico (mg/dL)','number',{min:50,max:700,step:1}],
    ['fbs','Glicemia a digiuno >120 mg/dL','select',[['','—'],['0','No'],['1','Sì']]],
    ['restecg','ECG a riposo','select',[['','—'],['0','Normale'],['1','Alterazioni ST-T'],['2','Ipertrofia ventricolare sinistra']]],
    ['thalach','Frequenza cardiaca massima raggiunta','number',{min:40,max:260,step:1}],
    ['exang','Angina indotta da esercizio','select',[['','—'],['0','No'],['1','Sì']]],
    ['oldpeak','Depressione ST da esercizio (oldpeak)','number',{min:-5,max:10,step:.1}],
    ['slope','Pendenza segmento ST al picco','select',[['','—'],['1','Ascendente'],['2','Piatta'],['3','Discendente']]],
    ['ca','Vasi principali colorati alla fluoroscopia','select',[['','—'],['0','0'],['1','1'],['2','2'],['3','3']]],
    ['thal','Thal','select',[['','—'],['3','Normale'],['6','Difetto fisso'],['7','Difetto reversibile']]]
  ];

  function el(tag,attrs={},children=[]){
    const n=document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') n.className=v; else if(k==='text') n.textContent=v; else n.setAttribute(k,v); });
    (Array.isArray(children)?children:[children]).forEach(c=>{ if(c) n.append(c); });
    return n;
  }

  const root=el('section',{id:'hs-pe039'});
  const card=el('div',{class:'pe-card'});
  const title=el('h2',{text:'Predictive Engine 0.39 — modello cardiopatia UCI'});
  const intro=el('div',{class:'muted',text:'Prima funzione predittiva supervisionata di HealthSolver. Stima sperimentale basata sul dataset UCI Heart Disease; non è una diagnosi clinica né un dispositivo medico.'});
  const grid=el('div',{class:'grid'});
  const controls={};
  fields.forEach(([name,label,type,opt])=>{
    const lab=el('label',{text:label});
    let input;
    if(type==='select'){
      input=el('select',{'data-feature':name});
      opt.forEach(([v,t])=>input.append(el('option',{value:v,text:t})));
    }else{
      input=el('input',{type:'number','data-feature':name,...opt});
    }
    controls[name]=input; lab.append(input); grid.append(lab);
  });
  const actions=el('div',{class:'actions'});
  const predict=el('button',{type:'button',class:'primary',text:'Calcola previsione'});
  const reset=el('button',{type:'button',class:'secondary',text:'Azzera'});
  actions.append(predict,reset);
  const state=el('div',{class:'muted',text:'Caricamento modello…'});
  const out=el('div',{class:'result','aria-live':'polite'});
  out.hidden=true;
  card.append(title,intro,grid,actions,state,out);
  root.append(el('style',{text:css}),card);

  const anchor=document.querySelector('main, #app, #root, body > div');
  if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(root,anchor);
  else document.body.prepend(root);

  let model=null;
  fetch(MODEL_URL,{cache:'no-store'}).then(r=>{if(!r.ok) throw new Error('HTTP '+r.status); return r.json();}).then(m=>{
    model=m;
    state.textContent=`Modello ${m.model_id} v${m.version} caricato · AUROC test ${m.metrics_test.auroc.toFixed(3)} · Brier ${m.metrics_test.brier.toFixed(3)}`;
  }).catch(e=>{
    state.textContent='Modello predittivo non disponibile: '+e.message;
    predict.disabled=true;
  });

  const sigmoid=z=>1/(1+Math.exp(-Math.max(-35,Math.min(35,z))));
  function valueOf(name){
    const raw=controls[name].value;
    return raw===''?null:Number(raw);
  }
  function run(){
    if(!model) return;
    const values={}, missing=[];
    for(const f of model.features){
      const v=valueOf(f);
      if(v===null || !Number.isFinite(v)){missing.push(f); values[f]=model.imputation.values[f];}
      else values[f]=v;
    }
    if(missing.length>model.abstention.max_missing_features){
      out.hidden=false;
      out.innerHTML='';
      out.append(el('div',{class:'warn',text:`Previsione sospesa: mancano ${missing.length} feature su ${model.features.length}. Il modello consente al massimo ${model.abstention.max_missing_features} valori imputati. Completa almeno: ${missing.slice(0,6).join(', ')}.`}));
      return;
    }
    let score=model.logistic.intercept;
    const contrib=[];
    for(const f of model.features){
      const z=(values[f]-model.standardization.mean[f])/model.standardization.scale[f];
      const c=z*model.logistic.coefficients[f];
      score+=c; contrib.push([f,c,values[f],missing.includes(f)]);
    }
    const calibrated=sigmoid(model.calibration.intercept + model.calibration.slope*score);
    const pct=Math.max(0,Math.min(100,calibrated*100));
    contrib.sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));
    out.hidden=false; out.innerHTML='';
    out.append(
      el('div',{class:'muted',text:'Stima sperimentale della presenza di cardiopatia angiografica nel dominio del dataset UCI'}),
      el('div',{class:'prob',text:pct.toFixed(1)+'%'}),
    );
    const bar=el('div',{class:'bar'}); bar.append(el('span',{style:`width:${pct.toFixed(1)}%`})); out.append(bar);
    out.append(el('div',{class:missing.length?'warn':'ok',text:missing.length?`${missing.length} valore/i mancanti imputati con la mediana del training: ${missing.join(', ')}.`:'Nessuna feature mancante: inferenza eseguita sui valori forniti.'}));
    const h=el('h3',{text:'Contributi principali al log-odds del modello'});
    const tbl=el('table'); tbl.innerHTML='<thead><tr><th>Feature</th><th>Valore</th><th>Contributo</th></tr></thead>';
    const tb=el('tbody');
    contrib.slice(0,6).forEach(([f,c,v,imp])=>{
      const tr=el('tr');
      [f,String(v)+(imp?' (imputato)':''),(c>=0?'+':'')+c.toFixed(3)].forEach(x=>tr.append(el('td',{text:x})));
      tb.append(tr);
    });
    tbl.append(tb); out.append(h,tbl);
    const d=el('details');
    d.append(el('summary',{text:'Metriche e limiti del modello'}));
    d.append(el('div',{class:'muted',text:`Test hold-out: n=${model.metrics_test.n_test}; AUROC=${model.metrics_test.auroc.toFixed(3)}; AUPRC=${model.metrics_test.auprc.toFixed(3)}; accuracy=${model.metrics_test.accuracy.toFixed(3)}; sensitivity=${model.metrics_test.sensitivity.toFixed(3)}; specificity=${model.metrics_test.specificity.toFixed(3)}; Brier=${model.metrics_test.brier.toFixed(3)}. Calibrazione: ${model.calibration.method}. Non validato prospetticamente o esternamente per uso clinico.`}));
    out.append(d);
  }
  predict.addEventListener('click',run);
  reset.addEventListener('click',()=>{Object.values(controls).forEach(x=>x.value=''); out.hidden=true; out.innerHTML='';});
})();