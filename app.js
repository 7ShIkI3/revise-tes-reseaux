'use strict';
const $ = (selector, root=document) => root.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = {
  home:'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
  book:'<path d="M12 5v15M3 4h5a4 4 0 0 1 4 3 4 4 0 0 1 4-3h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>',
  pen:'<path d="m4 16-1 5 5-1L20 8l-4-4Z"/><path d="m13 7 4 4M16 4l2-2 4 4-2 2"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7Z"/>',
  sliders:'<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="19" r="2" fill="currentColor"/>',
  formula:'<path d="M18 4H6l6 8-6 8h12"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  fibre:'<path d="M4 18c3-10 5-10 8 0s5-10 8-10M4 8c3 10 5 10 8 0s5 10 8 10"/>',
  network:'<rect x="8" y="3" width="8" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  antenna:'<path d="M12 13v8M7 21h10M9 8a4 4 0 0 0 6 0M6 5a8 8 0 0 0 12 0M3 2a12 12 0 0 0 18 0"/><circle cx="12" cy="10" r="1"/>',
  radio:'<path d="M5 18 12 6l7 12H5ZM9 12h6M12 6V3M5 4a8 8 0 0 0 0 8M19 4a8 8 0 0 1 0 8"/>',
  mobile:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4M11 18h2"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.book}</svg>`;
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const topicIcons = ['formula','fibre','network','antenna','radio','mobile'];
const KEY = 'revise-reseaux:v1';
const emptyState = () => ({read:[],done:[],notes:{},answers:{},quizBest:{},history:[],lastChapter:1,lastExercise:1,tdDone:[],tdNotes:{},tdAnswers:{}});
let state = emptyState(), data, quizSession=null, quizResult=null, exerciseFilter=0, exerciseSearch='', labTab='optique';
const labValues = {optique:{source:2,length:10,alpha:.35,split:16,other:1.4,low:-24,high:-5},ros:{incident:200,reflected:40},radio:{power:20,freq:2400,distance:2,txgain:12,rxgain:12,cables:4,threshold:-80}};
try {
  const saved=JSON.parse(localStorage.getItem(KEY) || 'null');
  if(saved && typeof saved==='object') {
    state.read=Array.isArray(saved.read)?saved.read.filter(n=>Number.isInteger(n)&&n>=1&&n<=6):[];
    state.done=Array.isArray(saved.done)?saved.done.filter(n=>Number.isInteger(n)&&n>=1&&n<=36):[];
    state.read=[...new Set(state.read)]; state.done=[...new Set(state.done)];
    const tdKey=key=>typeof key==='string'&&/^td[1-3]-(?:[23]\.[1-6]|Q(?:[1-9]|1[0-9]|2[0-3]))$/.test(key);
    state.tdDone=Array.isArray(saved.tdDone)?[...new Set(saved.tdDone.filter(tdKey))]:[];
    for(const [key,value] of Object.entries(saved.tdNotes||{})) if(tdKey(key)&&typeof value==='string')state.tdNotes[key]=value.slice(0,20000);
    for(const [key,value] of Object.entries(saved.tdAnswers||{})) if(tdKey(key)&&Array.isArray(value))state.tdAnswers[key]=value.slice(0,4).map(v=>typeof v==='string'?v.slice(0,50):'');
    for(let id=1;id<=36;id++) {
      if(typeof saved.notes?.[id]==='string') state.notes[id]=saved.notes[id].slice(0,20000);
      if(Array.isArray(saved.answers?.[id])) state.answers[id]=saved.answers[id].slice(0,4).map(v=>typeof v==='string'?v.slice(0,50):'');
    }
    for(let id=0;id<=6;id++) if(Number.isFinite(saved.quizBest?.[id]) && saved.quizBest[id]>=0 && saved.quizBest[id]<=100) state.quizBest[id]=saved.quizBest[id];
    state.history=Array.isArray(saved.history)?saved.history.filter(h=>Number.isInteger(h.chapter)&&h.chapter>=0&&h.chapter<=6&&Number.isInteger(h.score)&&h.score>=0&&Number.isInteger(h.total)&&h.total>0&&h.score<=h.total&&Number.isFinite(h.time)).slice(0,20):[];
    if(Number.isInteger(saved.lastChapter)&&saved.lastChapter>=1&&saved.lastChapter<=6) state.lastChapter=saved.lastChapter;
    if(Number.isInteger(saved.lastExercise)&&saved.lastExercise>=1&&saved.lastExercise<=36) state.lastExercise=saved.lastExercise;
  }
} catch { $('#storage-warning').hidden=false; }
function save() {
  try { localStorage.setItem(KEY,JSON.stringify(state)); } catch { $('#storage-warning').hidden=false; }
  updateProgress();
}
function updateProgress() {
  const totalTD=data?.tds?.reduce((sum,td)=>sum+td.questions.length,0)||56;
  const total=42+totalTD;
  const n=state.read.length+state.done.length+state.tdDone.length;
  $('#global-progress').max=total;
  $('#global-progress').value=n;
  $('#progress-percent').textContent=`${Math.round(n/total*100)} %`;
  $('#progress-caption').textContent=`${state.read.length}/6 chapitres lus · ${state.done.length}/36 exercices · ${state.tdDone.length}/${totalTD} questions de TD`;
}
let toastTimer;
function toast(message) {
  $('#toast').textContent=message; $('#toast').classList.add('visible');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);
}
const format = (value,digits=2) => new Intl.NumberFormat('fr-FR',{maximumFractionDigits:digits}).format(value);
function numberValue(raw) {
  const s=String(raw).trim().replace(/[−–]/g,'-').replace(/\s/g,'').replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
  const value=Number(s); return Number.isFinite(value)?value:null;
}
function pageHeading(eyebrow,title,description,extra='') {
  return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>${extra}</div>`;
}
function chapterCard(c) {
  return `<a class="chapter-card topic-${c.id}" href="#cours/${c.id}"><div class="card-top"><span class="chapter-symbol">${icon(topicIcons[c.id-1])}</span><span class="tag">${esc(c.tag)}</span></div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><div class="card-foot"><span>0${c.id} · ${c.minutes} min de lecture</span>${state.read.includes(c.id)?'<span class="chip done">✓ Lu</span>':'<span class="card-arrow" aria-hidden="true">↗</span>'}</div></a>`;
}
function networkArt() {
  return `<svg class="network-art" viewBox="0 0 400 280" role="img" aria-label="Un réseau relie fibre optique, antennes et téléphonie mobile"><circle cx="203" cy="138" r="87" class="art-line art-dash"/><circle cx="203" cy="138" r="111" class="art-line art-dash" opacity=".3"/><path d="M95 90 203 138 314 87M203 138l7 97" class="art-line"/><circle cx="203" cy="138" r="33" class="art-hub"/><path d="m186 138 12 12 23-24" stroke="#1d5260" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="68" y="57" width="56" height="56" rx="16" class="art-node"/><path d="M82 87c8-20 12 20 19 0s8 16 11 0" class="art-ray"/><text x="76" y="136" class="art-label">Fibre optique</text><rect x="284" y="58" width="56" height="56" rx="16" class="art-node"/><path d="m302 102 10-22 10 22m-10-22V73m-15 5a14 14 0 0 0 0 15m30-15a14 14 0 0 1 0 15" class="art-ray"/><text x="288" y="137" class="art-label">Liaisons radio</text><rect x="184" y="201" width="56" height="56" rx="16" class="art-node"/><rect x="204" y="212" width="17" height="31" rx="4" class="art-ray"/><path d="M210 237h5" class="art-ray"/><text x="252" y="235" class="art-label">Réseaux mobiles</text><circle cx="152" cy="59" r="4" fill="#b1efd5"/><circle cx="277" cy="192" r="3" fill="#b1efd5"/><circle cx="138" cy="204" r="3" fill="#6a9db0"/></svg>`;
}
function renderHome() {
  const next=data.chapters.find(c=>!state.read.includes(c.id)) || data.chapters[state.lastChapter-1];
  const attempts=state.history.length;
  const best=Object.values(state.quizBest).length?Math.max(...Object.values(state.quizBest)):null;
  return `${pageHeading('BIENVENUE DANS TON ESPACE','Un peu chaque jour. Beaucoup à comprendre.','Les notions essentielles de tes cours et TP, réunies dans un parcours que tu peux suivre à ton rythme.')}
  <section class="hero"><div class="hero-copy"><span class="eyebrow">TON PARCOURS · RÉSEAUX & TÉLÉCOMS</span><h1>Comprendre.<br>S’entraîner.<br><span>Progresser.</span></h1><p>De la fibre optique aux réseaux mobiles : des explications claires, des schémas et de la pratique.</p><a class="button mint" href="#cours/${next.id}">${state.read.length?'Continuer le parcours':'Commencer les bases'}${icon('arrow')}</a><div class="hero-note">${icon('check')}Tout le parcours se fait sans matériel.</div></div><div class="hero-visual">${networkArt()}</div></section>
  <div class="stats"><div class="stat"><div class="stat-icon">${icon('book')}</div><div><strong>${state.read.length}<small> / 6</small></strong><span>chapitres lus</span></div></div><div class="stat"><div class="stat-icon">${icon('pen')}</div><div><strong>${state.done.length}<small> / 36</small></strong><span>exercices terminés</span></div></div><div class="stat"><div class="stat-icon">${icon('bolt')}</div><div><strong>${best===null?'—':format(best,0)+' %'}</strong><span>${attempts?`${attempts} quiz terminés · meilleur score`:'ton prochain score de quiz'}</span></div></div></div>
  <section><div class="section-heading"><h2>Explore le cours</h2><a href="#cours">Les 6 chapitres →</a></div><div class="chapter-grid">${data.chapters.map(chapterCard).join('')}</div></section>
  <section class="td-home-section"><div class="section-heading"><h2>Tes TD de cours</h2><a href="#td">Les 3 sujets →</a></div><div class="chapter-grid td-grid">${data.tds.map(tdCard).join('')}</div></section>
  <section class="support-strip"><span class="support-icon">${icon('sliders')}</span><div><h3>Le banc de TP est indisponible ? Continue à pratiquer.</h3><p>Fais varier les valeurs et observe les résultats dans le labo virtuel.</p></div><a class="button secondary small" href="#labo">Ouvrir le labo ${icon('arrow')}</a></section>
  <div class="bottom-grid"><section class="panel"><span class="eyebrow">DE LA THÉORIE À LA PRATIQUE</span><h2>À toi de jouer.</h2><p>36 exercices progressifs, dont 5 mini-TP. Pose tes calculs, vérifie tes résultats et compare ta démarche au corrigé.</p><a class="button" href="#exercices/${state.lastExercise}">Reprendre les exercices ${icon('arrow')}</a></section><section class="panel"><span class="eyebrow">POUR RÉVISER HORS LIGNE</span><h2>Ton livret de départ.</h2><p>Le livret initial de 34 pages reste disponible en PDF et Word. Les cours en ligne ajoutent les bases détaillées, les méthodes de TD et les guides de TP.</p><div class="download-links"><a class="button secondary" href="assets/livret-reseaux.pdf" download>${icon('download')}PDF</a><a class="button secondary" href="assets/livret-reseaux.docx" download>${icon('download')}Word</a></div></section></div>
  <p class="hint-caption" style="margin-top:24px">Les valeurs d’entraînement et les courbes pédagogiques sont fictives. Elles ne remplacent pas les mesures expérimentales manquantes.</p>`;
}
function renderCourses(id) {
  const c=data.chapters.find(c=>c.id===id);
  if(!c) return `${pageHeading('LE COURS','Des bases aux questions de tes TD et TP.','Chaque chapitre explique le vocabulaire, les formules et leurs unités, puis déroule les calculs et les méthodes de lecture. Commence par les bases communes.')}<div class="note-box"><strong>Comment travailler :</strong> lis la définition, refais l’exemple sans regarder, puis utilise les liens vers ton TD. Les guides de TP expliquent ce que l’on mesure ou configure et comment conclure.</div><div class="chapter-grid course-list">${data.chapters.map(chapterCard).join('')}</div><a class="button secondary" href="#glossaire">Retrouver les guides des TP ${icon('arrow')}</a>`;
  state.lastChapter=c.id; save();
  return `<a class="back-link" href="#cours">← Tous les chapitres</a>${pageHeading(`CHAPITRE 0${c.id} · ${esc(c.tag)}`,esc(c.title),esc(c.description),`<span class="page-count">${c.minutes} min · Exercices ${6*c.id-5} à ${6*c.id}</span>`)}
  <details class="mobile-course-toc"><summary>Sommaire du chapitre · ${c.toc.length} rubriques</summary><nav aria-label="Sommaire compact du chapitre">${c.toc.map(t=>`<a href="#cours/${c.id}/${t.id}" data-section="${t.id}">${esc(t.title)}</a>`).join('')}</nav></details>
  <div class="two-column"><article class="panel reading"><div class="prose">${c.html}</div><div class="reading-footer"><div><button class="button ${state.read.includes(c.id)?'secondary':'mint'}" data-read="${c.id}">${state.read.includes(c.id)?'✓ Chapitre lu — annuler':'Marquer comme lu'}</button><p>La lecture et les exercices comptent dans ton parcours.</p></div><a class="button secondary" href="#exercices/${6*c.id-5}">Passer aux exercices ${icon('arrow')}</a></div><div class="exercise-pager">${c.id>1?`<a href="#cours/${c.id-1}">← Chapitre précédent</a>`:'<span></span>'}${c.id<6?`<a href="#cours/${c.id+1}">Chapitre suivant →</a>`:'<a href="#quiz">Tester mes connaissances →</a>'}</div></article><aside class="toc" aria-label="Sommaire du chapitre"><span class="eyebrow">DANS CE CHAPITRE</span>${c.toc.map(t=>`<a href="#cours/${c.id}/${t.id}" data-section="${t.id}">${esc(t.title)}</a>`).join('')}<a class="button secondary small" href="#quiz/${c.id}">${icon('bolt')}Le quiz du chapitre</a></aside></div>`;
}
function exerciseTitle(e) { return e.title.replace(/^(Bases|Application|Analyse)\s*/,'').replace(/^de\s+/,''); }
function renderExercises(id) {
  let e=data.exercises.find(e=>e.id===id) || data.exercises[state.lastExercise-1];
  if(exerciseFilter && e.chapter!==exerciseFilter) exerciseFilter=e.chapter;
  state.lastExercise=e.id; save();
  const list=data.exercises.filter(x=>(!exerciseFilter||x.chapter===exerciseFilter)&&`${x.id} ${x.title}`.toLocaleLowerCase('fr').includes(exerciseSearch.toLocaleLowerCase('fr')));
  return `${pageHeading('L’ENTRAÎNEMENT','Le meilleur moyen de comprendre : essayer.','Écris ta démarche avant de consulter le corrigé. Les calculs proposés se vérifient automatiquement ; les explications se comparent au corrigé.',`<span class="page-count">${state.done.length} / 36 terminés</span>`)}<div class="exercise-layout"><aside class="panel exercise-browser"><label class="field-label" for="exercise-filter">Le chapitre</label><select id="exercise-filter"><option value="0">Tous les chapitres</option>${data.chapters.map(c=>`<option value="${c.id}" ${exerciseFilter===c.id?'selected':''}>${c.id}. ${esc(c.title)}</option>`).join('')}</select><input class="search-field" id="exercise-search" type="search" placeholder="Chercher un exercice…" aria-label="Chercher un exercice" value="${esc(exerciseSearch)}"><div class="exercise-list" id="exercise-list">${exerciseLinks(list,e.id)}</div></aside>
  <article class="panel exercise-content"><div class="exercise-heading"><span class="chip">Exercice ${e.id.toString().padStart(2,'0')}</span><span class="chip">${esc(e.level)}</span>${e.mini?'<span class="chip mini-tag">Mini-TP sans matériel</span>':''}</div><h2>${esc(exerciseTitle(e))}</h2><div class="prose">${e.html}</div><div class="work-area"><label class="field-label" for="exercise-notes">Ton raisonnement et tes calculs</label><textarea id="exercise-notes" data-exercise="${e.id}" maxlength="20000" placeholder="Formule → unités → calcul → interprétation…">${esc(state.notes[e.id]||'')}</textarea><p class="hint-caption">Tes notes restent dans ce navigateur. Tu peux utiliser une virgule ou un point dans les champs de calcul.</p></div>
  ${e.checks.length?`<section class="check-section"><h3>Vérifie tes calculs</h3><p>Ces champs vérifient une partie des résultats. Les questions de raisonnement restent à comparer au corrigé. Tolérance : 1 % pour les calculs, valeur exacte pour les comptages.</p><div class="check-grid">${e.checks.map((c,i)=>`<div class="check-field"><label for="answer-${i}">${esc(c.label)}</label><div class="input-unit"><input type="text" inputmode="decimal" autocomplete="off" id="answer-${i}" data-answer="${i}" data-exercise="${e.id}" maxlength="50" value="${esc(state.answers[e.id]?.[i]||'')}" aria-describedby="feedback-${i}"><span>${esc(c.unit)}</span></div><div class="check-feedback" id="feedback-${i}" role="status"></div></div>`).join('')}</div><button class="button secondary" data-check="${e.id}">Vérifier mes résultats ${icon('check')}</button><p class="check-summary" id="check-summary" role="status"></p></section>`:'<div class="note-box">Cet exercice porte sur le raisonnement. Compare ton explication au corrigé et vérifie les distinctions importantes.</div>'}
  <details class="solution"><summary>Afficher le corrigé détaillé</summary><div class="prose">${e.solution}</div></details><div class="exercise-end"><button class="button ${state.done.includes(e.id)?'secondary':'mint'}" data-done="${e.id}">${state.done.includes(e.id)?'✓ Exercice terminé — annuler':'J’ai terminé cet exercice'}</button><p class="hint-caption">Coche après avoir vérifié les calculs et les explications. Voir le corrigé ne marque pas l’exercice comme terminé.</p></div><div class="exercise-pager">${e.id>1?`<a href="#exercices/${e.id-1}">← Exercice précédent</a>`:`<a href="#cours/${e.chapter}">← Revoir le cours</a>`}${e.id<36?`<a href="#exercices/${e.id+1}">Exercice suivant →</a>`:'<a href="#quiz">Passer aux quiz →</a>'}</div></article></div>`;
}
function exerciseLinks(list,selected) {
  return list.length?list.map(x=>`<a href="#exercices/${x.id}" class="exercise-link ${selected===x.id?'active':''} ${state.done.includes(x.id)?'completed':''}" ${selected===x.id?'aria-current="true"':''}><span class="exercise-num">${state.done.includes(x.id)?'✓':x.id}</span><span>${esc(exerciseTitle(x))}</span></a>`).join(''):'<p class="empty-note">Aucun exercice trouvé.</p>';
}
function checkExercise(id) {
  const e=data.exercises.find(x=>x.id===id); let correct=0;
  e.checks.forEach((c,i)=>{
    const field=$(`#answer-${i}`), feedback=$(`#feedback-${i}`), value=numberValue(field.value);
    const match=value!==null&&Math.abs(value-c.value)<=c.tolerance+1e-12;
    field.classList.toggle('correct',match); field.classList.toggle('incorrect',!match);
    field.setAttribute('aria-invalid',String(!match));
    feedback.className=`check-feedback ${match?'correct':value===null?'empty':'incorrect'}`;
    feedback.textContent=match?'✓ Résultat correct dans la tolérance.':value===null?'Entre un nombre, par exemple −7,55 ou 1,2e−3, sans l’unité.':'À revoir : vérifie la formule, les conversions et l’unité indiquée. Le corrigé détaille le calcul.';
    if(match) correct++;
  });
  $('#check-summary').textContent=`${correct} / ${e.checks.length} résultats corrects.${correct===e.checks.length?' Compare aussi ton raisonnement au corrigé.':''}`;
}
function shuffle(items) { const a=[...items]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
function makeQuiz(chapter) {
  // Le quiz mixte prend au moins une question de chaque chapitre.
  const questions=chapter?shuffle(data.quizzes.filter(q=>q.chapter===chapter)):(()=>{const first=data.chapters.map(c=>shuffle(data.quizzes.filter(q=>q.chapter===c.id))[0]);const ids=first.map(q=>q.id);return shuffle([...first,...shuffle(data.quizzes.filter(q=>!ids.includes(q.id))).slice(0,4)]);})();
  return {chapter,questions,index:0,answers:[],selection:null};
}
function startQuiz(chapter) {
  quizResult=null;
  quizSession=makeQuiz(chapter);
  if(location.hash!==`#quiz/${chapter}`) location.hash=`quiz/${chapter}`; else route(false);
}
function renderQuiz(chapter) {
  if(quizSession && quizSession.chapter===chapter) return renderQuizQuestion();
  if(quizResult && quizResult.chapter===chapter) return renderQuizResult();
  if(Number.isInteger(chapter) && chapter>=0 && chapter<=6) {
    quizResult=null;quizSession=makeQuiz(chapter);return renderQuizQuestion();
  }
  return `${pageHeading('LES QUIZ','Teste ce qui est resté.','Un choix par question, une explication immédiate et un bilan pour savoir quoi revoir. Les scores sont sauvegardés à la fin du quiz.')}
  <section class="mixed-quiz"><div><span class="eyebrow">UN PEU DE TOUT</span><h2>Le défi des 10 questions</h2><p>Un mélange des six chapitres, pour réviser en cinq minutes.</p></div><button class="button mint" data-start-quiz="0">Lancer le défi ${icon('arrow')}</button></section><div class="quiz-grid">${data.chapters.map(c=>`<section class="chapter-card quiz-theme topic-${c.id}"><div class="card-top"><span class="chapter-symbol">${icon(topicIcons[c.id-1])}</span><span class="tag">6 questions</span></div><h3>${esc(c.title)}</h3><p>${state.quizBest[c.id]!==undefined?`Meilleur score : ${format(state.quizBest[c.id],0)} %`:'Pour vérifier les notions essentielles.'}</p><button class="button secondary small" data-start-quiz="${c.id}">Commencer le quiz →</button></section>`).join('')}</div>${state.history.length?`<section class="panel reference"><h2>Tes derniers résultats</h2>${state.history.slice(0,6).map(h=>`<div class="recent-score"><span>${h.chapter?esc(data.chapters[h.chapter-1].title):'Défi mixte'} · ${new Date(h.time).toLocaleDateString('fr-FR')}</span><strong>${h.score} / ${h.total}</strong></div>`).join('')}</section>`:''}`;
}
function renderQuizQuestion() {
  const s=quizSession,q=s.questions[s.index],answered=s.selection!==null,correct=s.selection===q.answer;
  const title=s.chapter?data.chapters[s.chapter-1].title:'Défi mixte';
  return `<div class="quiz-stage"><a class="back-link" href="#quiz">← Tous les quiz</a><section class="panel"><div class="quiz-top"><span>${esc(title)}</span><span>Question ${s.index+1} / ${s.questions.length}</span></div><progress max="${s.questions.length}" value="${s.index+1}" aria-label="Avancement du quiz"></progress><p class="eyebrow" style="margin:23px 0 12px">${esc(data.chapters[q.chapter-1].title)}</p><h2>${esc(q.prompt)}</h2><div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option ${answered&&i===q.answer?'correct':''} ${answered&&i===s.selection&&!correct?'incorrect':''}" data-option="${i}" ${answered?'disabled':''}><span class="option-letter">${answered&&i===q.answer?'✓':['A','B','C'][i]}</span>${esc(o)}</button>`).join('')}</div>${answered?`<div class="quiz-explanation" role="status"><strong>${correct?'Bien joué.':'Une notion à revoir.'}</strong>${esc(q.explanation)}</div><div class="button-row quiz-next"><a class="text-button" href="#cours/${q.chapter}">Revoir le chapitre</a><button class="button" id="quiz-next">${s.index===s.questions.length-1?'Voir mon bilan':'Question suivante'} ${icon('arrow')}</button></div>`:'<p class="hint-caption" style="margin-top:19px">Choisis une réponse pour afficher l’explication.</p>'}</section></div>`;
}
function finishQuiz() {
  const s=quizSession;const score=s.answers.filter((a,i)=>a===s.questions[i].answer).length;
  quizResult={...s,score};quizSession=null;
  const percent=score/s.questions.length*100;
  state.quizBest[s.chapter]=Math.max(state.quizBest[s.chapter]||0,percent);
  state.history.unshift({chapter:s.chapter,score,total:s.questions.length,time:Date.now()});state.history=state.history.slice(0,20);save();
}
function renderQuizResult() {
  const r=quizResult;
  return `<div class="quiz-stage"><a class="back-link" href="#quiz">← Tous les quiz</a><section class="panel"><div class="result-heading"><span class="eyebrow">TON BILAN · ${r.chapter?esc(data.chapters[r.chapter-1].title):'DÉFI MIXTE'}</span><span class="score">${r.score}<small> / ${r.questions.length}</small></span><h2>${r.score===r.questions.length?'Les bases sont solides.':'Chaque erreur indique quoi revoir.'}</h2><p>Ton score est enregistré dans ce navigateur. Reprends les explications ci-dessous, puis retente le quiz.</p><div class="button-row" style="justify-content:center"><button class="button" data-start-quiz="${r.chapter}">Réessayer</button><a class="button secondary" href="#exercices">Passer aux exercices</a></div></div><div class="result-review">${r.questions.map((q,i)=>`<div class="review-item ${r.answers[i]!==q.answer?'wrong':''}"><div class="review-status">${r.answers[i]===q.answer?'✓ Réponse correcte':'↻ À revoir'}</div><h3>${esc(q.prompt)}</h3><p>Ta réponse : ${esc(q.options[r.answers[i]])}</p><p><strong>Bonne réponse : ${esc(q.options[q.answer])}</strong></p><p>${esc(q.explanation)}</p><a class="text-button" href="#cours/${q.chapter}">Revoir le cours</a></div>`).join('')}</div></section></div>`;
}
function labField(tab,key,label,unit) {
  return `<div><label class="field-label" for="lab-${key}">${label} ${unit?`(${unit})`:''}</label><input id="lab-${key}" data-lab="${key}" type="text" inputmode="decimal" value="${esc(String(labValues[tab][key]).replace('.',','))}" autocomplete="off"></div>`;
}
function renderLab() {
  const controls=labTab==='optique'?`${labField('optique','source','Puissance émise','dBm')}${labField('optique','length','Longueur de fibre','km')}${labField('optique','alpha','Atténuation linéique','dB/km')}<div><label class="field-label" for="lab-split">Splitter idéal</label><select id="lab-split" data-lab="split">${[1,2,4,8,16,32,64].map(n=>`<option value="${n}" ${labValues.optique.split===n?'selected':''}>${n===1?'Sans splitter':`1 × ${n}`}</option>`).join('')}</select></div>${labField('optique','other','Autres pertes','dB')}${labField('optique','low','Sensibilité','dBm')}${labField('optique','high','Seuil de surcharge','dBm')}`:labTab==='ros'?`${labField('ros','incident','Tension incidente efficace','mV')}${labField('ros','reflected','Tension réfléchie efficace','mV')}`:`${labField('radio','power','Puissance émise','dBm')}${labField('radio','freq','Fréquence','MHz')}${labField('radio','distance','Distance','km')}${labField('radio','txgain','Gain émission','dBi')}${labField('radio','rxgain','Gain réception','dBi')}${labField('radio','cables','Pertes totales de câbles','dB')}${labField('radio','threshold','Sensibilité','dBm')}`;
  return `${pageHeading('LE LABO VIRTUEL','Change une valeur. Comprends son effet.','Trois modèles simples pour t’entraîner sans banc de mesure. Les résultats sont théoriques et recalculés à chaque changement.')}<div class="lab-tabs" role="group" aria-label="Choisir un modèle"><button data-lab-tab="optique" class="${labTab==='optique'?'active':''}" aria-pressed="${labTab==='optique'}">Budget optique</button><button data-lab-tab="ros" class="${labTab==='ros'?'active':''}" aria-pressed="${labTab==='ros'}">Adaptation & ROS</button><button data-lab-tab="radio" class="${labTab==='radio'?'active':''}" aria-pressed="${labTab==='radio'}">Bilan radio</button></div><div class="lab-layout"><section class="panel lab-controls"><h2 style="font-size:18px;margin-bottom:8px">Les paramètres</h2>${controls}<p>${labTab==='ros'?'Deux voies identiquement calibrées, sur la même impédance. Il faut Uinc > 0 et 0 ≤ Uref ≤ Uinc.':'Les pertes sont positives. Utilise les unités affichées ; une virgule et un point sont acceptés.'}</p></section><section class="panel lab-result" id="lab-result" aria-live="polite"></section></div><div class="note-box"><strong>Pour garder la bonne méthode :</strong> observe le résultat, prédis ce qui changera si tu doubles un paramètre, puis teste ton idée. Ces modèles ne produisent pas de relevés expérimentaux.</div>`;
}
function updateLab() {
  const output=$('#lab-result');if(!output)return;
  const v=labValues[labTab];
  if(Object.values(v).some(x=>x===null||!Number.isFinite(x))) {output.innerHTML='<p class="lab-error">Renseigne chaque paramètre avec un nombre valide.</p>';return;}
  if(labTab==='optique') {
    if(v.length<0||v.alpha<0||v.other<0||v.low>=v.high||Math.abs(v.source)>1000||Math.abs(v.low)>1000||Math.abs(v.high)>1000) {output.innerHTML='<p class="lab-error">Utilise des pertes et une longueur positives, une sensibilité inférieure au seuil de surcharge et des puissances comprises entre −1000 et +1000 dBm.</p>';return;}
    const fibre=v.length*v.alpha,splitter=10*Math.log10(v.split),loss=fibre+splitter+v.other,rx=v.source-loss,margin=rx-v.low;
    if(!Number.isFinite(rx)){output.innerHTML='<p class="lab-error">Les valeurs sont trop grandes pour ce modèle.</p>';return;}
    const status=rx<v.low?'Sous la sensibilité':rx>v.high?'Risque de surcharge':'Dans la fenêtre de réception';
    output.innerHTML=`<span class="eyebrow">MODÈLE OPTIQUE</span><h2 style="margin-top:12px">Les pertes se cumulent.</h2><div class="lab-flow"><div class="lab-node">Source<strong>${format(v.source)} dBm</strong></div><span>→</span><div class="lab-node">Fibre<strong>−${format(fibre)} dB</strong></div><span>→</span><div class="lab-node">Splitter<strong>−${format(splitter)} dB</strong></div></div><span class="result-label">Puissance reçue, après toutes les pertes</span><div class="result-number">${format(rx)}<small>dBm</small></div><div class="result-details"><div>Perte totale<strong>${format(loss)} dB</strong></div><div>Marge au seuil faible<strong>${format(margin)} dB</strong></div></div><span class="status-pill ${rx<v.low||rx>v.high?'bad':''}">${status}</span><div class="note-box">Pr = Pe − (αL + 10 log₁₀ N + autres pertes).<br>Le splitter est idéal ; ajoute ses pertes supplémentaires dans « Autres pertes ». Un niveau dans la fenêtre ne valide pas toute la liaison.</div><a class="back-link" style="margin:18px 0 0" href="#exercices/9">Essayer l’exercice 9 →</a>`;
  } else if(labTab==='ros') {
    if(v.incident<=0||v.reflected<0||v.reflected>v.incident){output.innerHTML='<p class="lab-error">Il faut une tension incidente positive et une tension réfléchie comprise entre 0 et la tension incidente.</p>';return;}
    const rho=v.reflected/v.incident,ros=rho===1?Infinity:(1+rho)/(1-rho),ref=rho*rho*100;
    output.innerHTML=`<span class="eyebrow">MODÈLE D’ADAPTATION</span><h2 style="margin-top:12px">Le rapport d’amplitude se met au carré.</h2><span class="result-label">Rapport d’ondes stationnaires</span><div class="result-number">${ros===Infinity?'∞':format(ros)}</div><div class="result-details"><div>Coefficient ρ<strong>${format(rho,4)}</strong></div><div>Puissance réfléchie<strong>${format(ref)} %</strong></div></div><div class="ros-track"><div class="ros-accepted" style="width:${100-ref}%"></div><div class="ros-reflected" style="width:${ref}%"></div></div><div class="legend"><span>${format(100-ref)} % acceptée</span><span>${format(ref)} % réfléchie</span></div><div class="note-box">ρ = Uref / Uinc ; ROS = (1 + ρ) / (1 − ρ).<br>La puissance acceptée peut être dissipée. Elle n’est pas nécessairement toute rayonnée. Le module seul ne détermine pas une impédance complexe unique.</div><a class="back-link" style="margin:18px 0 0" href="#exercices/22">Essayer l’exercice 22 →</a>`;
  } else {
    if(v.freq<=0||v.distance<=0||v.cables<0||[v.power,v.txgain,v.rxgain,v.threshold].some(x=>Math.abs(x)>1000)){output.innerHTML='<p class="lab-error">La fréquence et la distance doivent être positives, les pertes de câbles non négatives et les niveaux et gains compris entre −1000 et +1000.</p>';return;}
    const loss=32.45+20*Math.log10(v.distance)+20*Math.log10(v.freq),rx=v.power+v.txgain+v.rxgain-v.cables-loss,margin=rx-v.threshold;
    output.innerHTML=`<span class="eyebrow">ESPACE LIBRE · CHAMP LOINTAIN</span><h2 style="margin-top:12px">Distance, fréquence, gains et pertes.</h2><div class="lab-flow"><div class="lab-node">Émission<strong>${format(v.power)} dBm</strong></div><span>→</span><div class="lab-node">Espace libre<strong>${format(loss)} dB</strong></div><span>→</span><div class="lab-node">Réception<strong>${format(rx)} dBm</strong></div></div><span class="result-label">Puissance reçue</span><div class="result-number">${format(rx)}<small>dBm</small></div><div class="result-details"><div>Perte en espace libre<strong>${format(loss)} dB</strong></div><div>Marge au seuil<strong>${format(margin)} dB</strong></div></div><span class="status-pill ${margin<0?'bad':''}">${margin>=0?'Au-dessus du seuil du modèle':'Sous le seuil du modèle'}</span><div class="note-box">L = 32,45 + 20 log₁₀ d[km] + 20 log₁₀ f[MHz].<br>Pr = Pt + Gt + Gr − pertes de câbles − L.<br>Modèle en espace libre et champ lointain : obstacles, Fresnel, fading, polarisation et pertes supplémentaires sont ignorés. À gains constants, doubler la distance ajoute environ 6,02 dB de perte.</div><a class="back-link" style="margin:18px 0 0" href="#exercices/25">Essayer l’exercice 25 →</a>`;
  }
}
function renderFormulas() {
  return `${pageHeading('L’ESSENTIEL SOUS LA MAIN','Les formules, avec les bonnes unités.','Identifie la grandeur recherchée, choisis le bon modèle et convertis les unités avant de remplacer les valeurs.')}<article class="panel reading formula-card"><div class="prose">${data.formulas}</div><div class="button-row"><a class="button secondary" href="#labo">Tester dans le labo</a><a class="button secondary" href="assets/livret-reseaux.pdf" download>${icon('download')}Télécharger le livret</a></div></article>`;
}
function renderGlossary() {
  const guides=(data.tpGuides||[]).map(tp=>`<section class="panel tp-guide"><h2>${esc(tp.title)}</h2><p>${esc(tp.goal)}</p><div class="lesson-links">${tp.links.map(link=>`<a href="${esc(link.href)}">${esc(link.title)} →</a>`).join('')}</div></section>`).join('');
  return `${pageHeading('GLOSSAIRE & SUPPORTS','Les mots et les TP se relient.','Choisis ton TP pour retrouver les méthodes détaillées, puis consulte les définitions et les supports.')}<div class="tp-guide-grid">${guides}</div><article class="panel reading"><div class="prose">${data.glossary}</div><details class="solution reference"><summary>Supports et références pour aller plus loin</summary><div class="prose">${data.references}</div></details></article>`;
}
function setMenu(open) {
  $('#sidebar').classList.toggle('open',open);$('#scrim').hidden=!open;
  $('#sidebar').inert=window.matchMedia('(max-width: 760px)').matches && !open;
  $('#menu-toggle').setAttribute('aria-expanded',String(open));
  $('#menu-toggle').setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
}
function route(scroll=true) {
  if(!data)return;
  const [raw='',argument,section]=location.hash.slice(1).split('/');
  const allowed=['accueil','cours','exercices','td','quiz','labo','formules','glossaire'];
  const view=allowed.includes(raw)?raw:'accueil',id=Number(argument);
  const labels={accueil:'Vue d’ensemble',cours:'Le cours',exercices:'Les exercices',td:'Tes TD',quiz:'Les quiz',labo:'Labo virtuel',formules:'Fiche de formules',glossaire:'Glossaire & TP'};
  $('#page-label').textContent=labels[view];document.title=`${labels[view]} · Révise tes réseaux`;
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===view;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  const html=view==='cours'?renderCourses(id):view==='exercices'?renderExercises(id):view==='td'?renderTD(id,location.hash.slice(1).split('/')[2]):view==='quiz'?renderQuiz(id):view==='labo'?renderLab():view==='formules'?renderFormulas():view==='glossaire'?renderGlossary():renderHome();
  const related=view==='cours'&&Number.isInteger(id)?data.tds.filter(td=>td.chapters.includes(id)):[];
  $('#main').innerHTML=html;updateProgress();setMenu(false);
  if(related.length&&$('.reading-footer'))$('.reading-footer').insertAdjacentHTML('beforebegin',`<div class="note-box"><strong>Retrouve ces notions dans tes TD :</strong> ${related.map(td=>`<a href="#td/${td.id}">TD${td.id} · ${esc(td.title)}</a>`).join(' · ')}</div>`);
  if(view==='labo')updateLab();
  if(scroll){window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});}
  if(view==='cours'&&section&&data.chapters.find(c=>c.id===id)?.toc.some(t=>t.id===section)){
    const target=document.getElementById(section);if(target){target.setAttribute('tabindex','-1');target.scrollIntoView({behavior:'instant'});target.focus({preventScroll:true});}
  }
}
$('#menu-toggle').addEventListener('click',()=>setMenu(!$('#sidebar').classList.contains('open')));
$('#scrim').addEventListener('click',()=>setMenu(false));
window.matchMedia('(max-width: 760px)').addEventListener('change',()=>setMenu(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false);});
document.addEventListener('click',event=>{
  const button=event.target.closest('button,a');if(!button)return;
  if(button.getAttribute('href')==='#main') {event.preventDefault();$('#main').focus();$('#main').scrollIntoView();return;}
  if(button.dataset.section) {event.preventDefault();button.closest('.mobile-course-toc')?.removeAttribute('open');document.getElementById(button.dataset.section)?.scrollIntoView({behavior:'smooth'});return;}
  if(button.dataset.zoom){$('#diagram-large').src=button.dataset.zoom;$('#diagram-large').alt=button.dataset.caption;$('#diagram-caption').textContent=button.dataset.caption;$('#diagram-dialog').showModal();return;}
  if(button.dataset.read){const id=Number(button.dataset.read);state.read=state.read.includes(id)?state.read.filter(x=>x!==id):[...state.read,id];save();button.textContent=state.read.includes(id)?'✓ Chapitre lu — annuler':'Marquer comme lu';button.classList.toggle('mint',!state.read.includes(id));button.classList.toggle('secondary',state.read.includes(id));toast(state.read.includes(id)?'Chapitre ajouté à ta progression.':'Chapitre retiré de la progression.');return;}
  if(button.dataset.done){const id=Number(button.dataset.done);state.done=state.done.includes(id)?state.done.filter(x=>x!==id):[...state.done,id];save();button.textContent=state.done.includes(id)?'✓ Exercice terminé — annuler':'J’ai terminé cet exercice';button.classList.toggle('mint',!state.done.includes(id));button.classList.toggle('secondary',state.done.includes(id));const link=$(`.exercise-link[href="#exercices/${id}"]`);if(link){link.classList.toggle('completed',state.done.includes(id));$('.exercise-num',link).textContent=state.done.includes(id)?'✓':String(id);}toast(state.done.includes(id)?'Exercice ajouté à ta progression.':'Exercice retiré de la progression.');return;}
  if(button.dataset.check){checkExercise(Number(button.dataset.check));return;}
  if(button.dataset.startQuiz!==undefined){startQuiz(Number(button.dataset.startQuiz));return;}
  if(button.dataset.option!==undefined && quizSession && quizSession.selection===null) {quizSession.selection=Number(button.dataset.option);quizSession.answers.push(quizSession.selection);route(false);$('#quiz-next')?.focus({preventScroll:true});return;}
  if(button.id==='quiz-next' && quizSession){if(quizSession.index===quizSession.questions.length-1)finishQuiz();else {quizSession.index++;quizSession.selection=null;}route(false);$('#main').focus({preventScroll:true});return;}
  if(button.dataset.labTab){labTab=button.dataset.labTab;route(false);return;}
});
document.addEventListener('input',event=>{
  const field=event.target;
  if(field.id==='exercise-notes'){state.notes[field.dataset.exercise]=field.value;save();}
  if(field.dataset.answer!==undefined){const id=field.dataset.exercise;state.answers[id] ||= [];state.answers[id][Number(field.dataset.answer)]=field.value;save();field.classList.remove('correct','incorrect');field.removeAttribute('aria-invalid');$(`#feedback-${field.dataset.answer}`).textContent='';$('#check-summary').textContent='';}
  if(field.id==='exercise-search'){exerciseSearch=field.value;const list=data.exercises.filter(x=>(!exerciseFilter||x.chapter===exerciseFilter)&&`${x.id} ${x.title}`.toLocaleLowerCase('fr').includes(exerciseSearch.toLocaleLowerCase('fr')));$('#exercise-list').innerHTML=exerciseLinks(list,state.lastExercise);}
  if(field.dataset.lab){labValues[labTab][field.dataset.lab]=numberValue(field.value);updateLab();}
});
document.addEventListener('change',event=>{
  if(event.target.id==='exercise-filter') {exerciseFilter=Number(event.target.value);exerciseSearch='';const id=exerciseFilter?6*exerciseFilter-5:state.lastExercise;const hash=`#exercices/${id}`;if(location.hash===hash)route(false);else location.hash=hash;}
  if(event.target.dataset.lab){labValues[labTab][event.target.dataset.lab]=numberValue(event.target.value);updateLab();}
});
$('#close-diagram').addEventListener('click',()=>$('#diagram-dialog').close());
$('#diagram-dialog').addEventListener('click',event=>{if(event.target===$('#diagram-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
$('#reset-button').addEventListener('click',()=>$('#reset-dialog').showModal());
$('#cancel-reset').addEventListener('click',()=>$('#reset-dialog').close());
$('#confirm-reset').addEventListener('click',()=>{state=emptyState();quizSession=null;quizResult=null;exerciseFilter=0;exerciseSearch='';save();$('#reset-dialog').close();route(false);toast('Ta progression a été réinitialisée.');});
window.addEventListener('hashchange',()=>route());
Promise.all(['data.json','tds.json'].map(file=>fetch(file).then(response=>{if(!response.ok)throw new Error('content unavailable');return response.json();}))).then(([content,tds])=>{data={...content,tds};const valid=new Set(tds.flatMap(td=>td.questions.map(q=>q.key)));state.tdDone=state.tdDone.filter(key=>valid.has(key));route(false);}).catch(()=>{$('#main').innerHTML='<section class="panel"><h1>Le cours n’a pas pu se charger.</h1><p>Vérifie ta connexion puis recharge cette page.</p><button class="button" onclick="location.reload()">Réessayer</button><p style="margin-top:20px"><a class="text-button" href="assets/livret-reseaux.pdf">Ouvrir le livret PDF</a></p></section>';});
