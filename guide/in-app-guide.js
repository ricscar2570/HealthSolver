(()=>{
'use strict';
if(window.__HS_IN_APP_GUIDE_V1__) return;
window.__HS_IN_APP_GUIDE_V1__=true;

const READY=async()=>{
  const main=document.querySelector('.main')||document.querySelector('main')||document.body;
  const aside=document.querySelector('aside');
  if(!aside||!main) return;

  const existingNavs=[...aside.querySelectorAll('.nav[data-page]')];
  if(!existingNavs.length) return;

  const page=document.createElement('div');
  page.id='page-guide';
  page.className=(document.getElementById('page-intelligence')?.className||'page');
  page.style.display='none';
  page.innerHTML='<div class="card"><h2>Caricamento guida…</h2><p class="hint">Sto caricando la documentazione integrata.</p></div>';
  main.append(page);

  const source=existingNavs.find(n=>n.dataset.page==='intelligence')||existingNavs[0];
  const guideNav=source.cloneNode(true);
  guideNav.dataset.page='guide';
  guideNav.removeAttribute('id');
  guideNav.classList.remove('active');
  guideNav.innerHTML='Guida completa <span class="hs-guide-new">AIUTO</span>';
  source.parentElement?.append(guideNav);

  const resetExistingPages=()=>{
    [...document.querySelectorAll('[id^="page-"]')].forEach(el=>{
      if(el!==page) el.style.display='';
    });
  };
  const openGuide=()=>{
    [...document.querySelectorAll('aside .nav[data-page]')].forEach(n=>n.classList.remove('active'));
    guideNav.classList.add('active');
    [...document.querySelectorAll('[id^="page-"]')].forEach(el=>{
      if(el!==page) el.style.display='none';
    });
    page.style.display='block';
    page.hidden=false;
    window.scrollTo({top:0,behavior:'smooth'});
    history.replaceState(null,'','#guide');
  };
  existingNavs.forEach(n=>n.addEventListener('click',()=>{
    page.style.display='none';
    page.hidden=true;
    guideNav.classList.remove('active');
    resetExistingPages();
  }));
  guideNav.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openGuide();});

  const float=document.createElement('button');
  float.id='hsGuideFloat';
  float.type='button';
  float.textContent='? Guida';
  float.title='Apri la guida completa di HealthSolver';
  document.body.append(float);
  float.addEventListener('click',openGuide);

  const goToPage=name=>{
    const nav=document.querySelector('aside .nav[data-page="'+name+'"]');
    if(nav){nav.click();setTimeout(()=>document.getElementById('page-'+name)?.scrollIntoView({block:'start'}),80);}
  };

  try{
    const res=await fetch('guide/in-app-guide.html?guide=1',{cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    page.innerHTML=await res.text();

    page.querySelectorAll('[data-hg-scroll]').forEach(btn=>btn.addEventListener('click',()=>{
      page.querySelector('#hg-'+btn.dataset.hgScroll)?.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    page.querySelectorAll('[data-hs-open-page]').forEach(btn=>btn.addEventListener('click',()=>goToPage(btn.dataset.hsOpenPage)));
    page.querySelectorAll('a[href^="#hg-"]').forEach(a=>a.addEventListener('click',e=>{
      e.preventDefault();page.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth',block:'start'});
    }));

    const search=page.querySelector('#hsGuideSearch');
    search?.addEventListener('input',()=>{
      const q=search.value.trim().toLowerCase();
      page.querySelectorAll('[data-guide-search]').forEach(sec=>{
        const match=!q||(sec.innerText||'').toLowerCase().includes(q);
        sec.classList.toggle('hg-hidden',!match);
      });
    });

    const missingImgs=[];
    page.querySelectorAll('img[src^="guide/assets/"]').forEach(img=>{
      img.addEventListener('error',()=>{
        missingImgs.push(img.getAttribute('src'));
        const holder=document.createElement('div');
        holder.className='hg-warning';
        holder.innerHTML='<b>Schermata non disponibile.</b> L’immagine esplicativa non è stata caricata; il testo della guida resta valido.';
        img.replaceWith(holder);
      },{once:true});
    });
    window.__HS_GUIDE_STATE__={loaded:true,version:'1.0.0',sections:page.querySelectorAll('section.hg-section').length,missing_images:missingImgs};

    const predictive=document.getElementById('hs-predictive-integrated');
    const guideBox=predictive?.querySelector('.hs43-guide');
    if(guideBox&&!guideBox.querySelector('.hs-guide-inline')){
      const btn=document.createElement('button');
      btn.type='button';btn.className='hs-guide-inline';btn.textContent='Apri guida completa';
      btn.style.cssText='margin-left:10px;border:0;border-radius:8px;padding:7px 10px;background:#17365f;color:#fff;font-weight:800;cursor:pointer';
      btn.addEventListener('click',openGuide);
      guideBox.append(btn);
    }

    if(location.hash==='#guide') openGuide();
  }catch(err){
    page.innerHTML='<div class="card"><h2>Guida non disponibile</h2><div class="notice">Impossibile caricare la documentazione integrata: '+String(err?.message||err)+'</div></div>';
    window.__HS_GUIDE_STATE__={loaded:false,error:String(err?.message||err)};
  }

  let seen=false;
  try{seen=localStorage.getItem('hs-guide-seen-v1')==='1'}catch{}
  if(!seen&&!location.search.includes('audit=')){
    const modal=document.createElement('div');
    modal.id='hsGuideWelcome';
    modal.innerHTML='<div class="hg-modal"><div class="hg-kicker">PRIMA VOLTA SU HEALTHSOLVER?</div><h2>Ti mostro come funziona</h2><p>È disponibile una guida completa con percorso iniziale, schermate reali, diagrammi di flusso, interpretazione dei 14 modelli, Ensemble, Transport, esempi, FAQ e risoluzione dei problemi.</p><div class="actions"><button class="primary" data-act="open">Apri la guida</button><button data-act="close">Continua senza guida</button></div></div>';
    document.body.append(modal);
    modal.querySelector('[data-act="open"]')?.addEventListener('click',()=>{try{localStorage.setItem('hs-guide-seen-v1','1')}catch{};modal.remove();openGuide();});
    modal.querySelector('[data-act="close"]')?.addEventListener('click',()=>{try{localStorage.setItem('hs-guide-seen-v1','1')}catch{};modal.remove();});
  }
};
let __hsGuideBooted=false;
const BOOT=()=>{
  if(__hsGuideBooted) return;
  __hsGuideBooted=true;
  setTimeout(READY,0);
};
if(document.querySelector('aside')&&(document.querySelector('.main')||document.querySelector('main'))) BOOT();
else if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',BOOT,{once:true});
else BOOT();
})();