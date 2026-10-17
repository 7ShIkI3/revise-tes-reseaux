'use strict';
// Outils locaux : aucune donnée personnelle n'est envoyée à un serveur.
const PLUS_KEY = 'revise-reseaux:plus:v1';
const plusEmpty = () => ({version:1,moduleDone:[],cards:{},goal:{minutes:20,date:'',chapter:0},sessions:[]});
function validatePlus(raw) {
  if(!raw || raw.version!==1 || !Array.isArray(raw.moduleDone) || !raw.cards || typeof raw.cards!=='object' || !raw.goal || !Array.isArray(raw.sessions)) throw Error('Format des révisions invalide.');
  const result=plusEmpty(), modules=new Set(window.REVISION_LEARNING.modules.map(m=>m.id)), cards=new Set(window.REVISION_LEARNING.cards.map(c=>c.id));
  result.moduleDone=[...new Set(raw.moduleDone.filter(id=>modules.has(id)))];
  for(const [id,c] of Object.entries(raw.cards)) if(cards.has(id) && c && Number.isFinite(c.due) && c.due>=0 && Number.isInteger(c.streak) && c.streak>=0 && c.streak<=100 && /^\d{4}-\d{2}-\d{2}$/.test(c.lastDay||'')) result.cards[id]={due:c.due,streak:c.streak,lastDay:c.lastDay};
  const g=raw.goal;
  result.goal={minutes:Number.isInteger(g.minutes)&&g.minutes>=5&&g.minutes<=180?g.minutes:20,date:typeof g.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(g.date)?g.date:'',chapter:Number.isInteger(g.chapter)&&g.chapter>=0&&g.chapter<=6?g.chapter:0};
  result.sessions=raw.sessions.filter(s=>s && Number.isFinite(s.at)&&s.at>0&&Number.isInteger(s.minutes)&&s.minutes>=1&&s.minutes<=180).slice(-365).map(s=>({at:s.at,minutes:s.minutes}));
  return result;
}
let plus=plusEmpty(), flashChapter=0, flashAll=false, flashIndex=0, flashCardId=null, flashRevealed=false, moduleChapter=0;
let searchQuery='', focusEnd=0, focusDuration=0, focusInterval=null;
try { const saved=localStorage.getItem(PLUS_KEY); if(saved)plus=validatePlus(JSON.parse(saved)); } catch { /* Le message de stockage apparaît à la première tentative de sauvegarde. */ }
const localDay=(time=Date.now())=>{const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const calendarDays=(target,from=localDay())=>{const stamp=text=>{const [year,month,day]=text.split('-').map(Number);return Date.UTC(year,month-1,day);};return (stamp(target)-stamp(from))/86400000;};
function savePlus() { try {localStorage.setItem(PLUS_KEY,JSON.stringify(plus));return true;} catch {$('#storage-warning').hidden=false;toast('Stockage indisponible : exporte tes données avant de fermer.');return false;} }
const chapterOptions=(value,all='Tous les chapitres')=>`<option value="0">${all}</option>${data.chapters.map(c=>`<option value="${c.id}" ${Number(value)===c.id?'selected':''}>${c.id}. ${esc(c.title)}</option>`).join('')}`;
function moduleCards(list) {return list.map(m=>`<a class="chapter-card topic-${m.chapter}" href="#modules/${m.id}"><div class="card-top"><span class="tag">${esc(m.level)} · ${m.minutes} min</span><span class="chip ${plus.moduleDone.includes(m.id)?'done':''}">${plus.moduleDone.includes(m.id)?'✓ Terminé':'Chapitre '+m.chapter}</span></div><h2>${esc(m.title)}</h2><p>${esc(m.intro)}</p><span class="card-foot">Comprendre pas à pas →</span></a>`).join('');}
function renderModules(id) {
  const m=window.REVISION_LEARNING.modules.find(x=>x.id===id);
  if(!m) return `${pageHeading('COMPRENDRE PAS À PAS','Les ateliers explicatifs.','Des schémas de raisonnement, des exemples résolus et les erreurs fréquentes pour relier le cours à la pratique.')}<div class="plus-toolbar"><label for="module-chapter">Filtrer par chapitre</label><select id="module-chapter">${chapterOptions(moduleChapter)}</select><span>${plus.moduleDone.length} / ${window.REVISION_LEARNING.modules.length} ateliers terminés</span></div><div class="chapter-grid plus-modules" id="module-grid">${moduleCards(window.REVISION_LEARNING.modules.filter(x=>!moduleChapter||x.chapter===moduleChapter))}</div>`;
  return `<a class="back-link" href="#modules">← Tous les ateliers</a>${pageHeading(`ATELIER · CHAPITRE ${m.chapter} · ${m.minutes} MIN`,esc(m.title),esc(m.intro))}<article class="panel plus-reading"><ol class="plus-flow" aria-label="Les étapes du raisonnement">${m.flow.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${m.sections.map(s=>`<section><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></section>`).join('')}<section class="plus-example"><span class="eyebrow">EXEMPLE PAS À PAS</span><h2>${esc(m.example.title)}</h2><ol>${m.example.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p><strong>${esc(m.example.result)}</strong></p></section><div class="note-box"><strong>Le piège à éviter :</strong> ${esc(m.pitfall)}</div><details class="solution"><summary>${esc(m.check.question)}</summary><div class="prose"><p>${esc(m.check.answer)}</p></div></details><div class="button-row plus-space"><button class="button ${plus.moduleDone.includes(m.id)?'secondary':'mint'}" data-module-done="${m.id}">${plus.moduleDone.includes(m.id)?'✓ Atelier terminé — annuler':'Marquer cet atelier comme terminé'}</button><a class="button secondary" href="${esc(m.link)}">Revoir le cours</a><a class="button secondary" href="#revision">M’entraîner avec les cartes</a></div>${m.sources?.length?`<details class="plus-sources"><summary>Sources du module</summary><ul>${m.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('')}</ul></details>`:''}</article>`;
}
function flashDeck() {return window.REVISION_LEARNING.cards.filter(c=>(!flashChapter||c.chapter===flashChapter)&&(flashAll||!plus.cards[c.id]||plus.cards[c.id].due<=Date.now()));}
function renderFlashcard() {
  const cards=flashDeck();flashIndex=Math.min(flashIndex,Math.max(0,cards.length-1));const card=cards.find(c=>c.id===flashCardId)||cards[flashIndex];flashCardId=card?.id||null;
  if(card)flashIndex=cards.findIndex(c=>c.id===card.id);
  if(!card)return `<section class="plus-flash-empty"><h3>Les cartes de ce filtre sont revues.</h3><p>Reviens demain, ou reprends toutes les cartes pour une nouvelle séance.</p><button class="button secondary" id="flash-restart">Reprendre toutes les cartes</button></section>`;
  return `<div class="plus-flash-meta"><span>Chapitre ${card.chapter} · ${esc(data.chapters[card.chapter-1].title)}</span><span>${cards.length} carte${cards.length>1?'s':''} ${flashAll?'dans ce filtre':'à revoir'}</span></div><section class="plus-flash"><span class="eyebrow">RAPPEL ACTIF</span><h3>${esc(card.question)}</h3>${flashRevealed?`<div class="plus-answer"><p><strong>${esc(card.answer)}</strong></p><p>${esc(card.explanation)}</p></div><p class="hint-caption">Évalue ton rappel sans regarder la réponse. Ce choix sert seulement à espacer tes révisions.</p><div class="button-row"><button class="button secondary" data-flash-rate="again">À revoir</button><button class="button mint" data-flash-rate="known">Je sais</button></div>`:'<p>Formule ta réponse avant de retourner la carte.</p><button class="button" id="flash-reveal">Voir la réponse</button>'}<button class="text-button plus-skip" id="flash-skip">Passer cette carte</button></section>`;
}
function renderRevision() {
  const today=localDay(), studied=plus.sessions.filter(s=>localDay(s.at)===today).reduce((sum,s)=>sum+s.minutes,0), reviewed=Object.values(plus.cards).filter(c=>c.lastDay===today).length;
  const chosen=plus.goal.chapter?data.chapters.find(c=>c.id===plus.goal.chapter):data.chapters.find(c=>!state.read.includes(c.id))||data.chapters[state.lastChapter-1];
  const examDays=plus.goal.date?calendarDays(plus.goal.date):null;
  return `${pageHeading('TON ATELIER DE RÉVISION','Un objectif. Une petite séance.','Rappelle les notions sans regarder, vérifie tes réponses et avance sur le chapitre de ton choix.')}<div class="stats"><div class="stat"><div><strong>${reviewed}<small> / 36</small></strong><span>cartes revues aujourd’hui</span></div></div><div class="stat"><div><strong>${studied}<small> / ${plus.goal.minutes} min</small></strong><span>travail enregistré aujourd’hui</span></div></div><div class="stat"><div><strong>${plus.moduleDone.length}<small> / 12</small></strong><span>ateliers terminés</span></div></div></div><section class="panel plus-plan"><div><span class="eyebrow">TA PROCHAINE ÉTAPE</span><h2>${esc(chosen.title)}</h2><p>${examDays===null?'Choisis ton rythme, puis commence par une notion.':examDays<0?'La date de ton objectif est passée : ajuste-la pour le prochain.':examDays===0?'Ton objectif est pour aujourd’hui.':`Il reste ${examDays} jour${examDays>1?'s':''} avant ton objectif.`}</p></div><div class="button-row"><a class="button" href="#cours/${chosen.id}">Ouvrir le cours</a><a class="button secondary" href="#modules">Ateliers expliqués</a></div></section><div class="plus-grid"><section class="panel"><h2>Les flashcards</h2><div class="plus-toolbar"><label for="flash-chapter">Chapitre</label><select id="flash-chapter">${chapterOptions(flashChapter)}</select><label for="flash-mode">Cartes</label><select id="flash-mode"><option value="due">À revoir aujourd’hui</option><option value="all" ${flashAll?'selected':''}>Toutes les cartes</option></select></div><div id="flash-area" aria-live="polite">${renderFlashcard()}</div></section><aside class="plus-stack"><section class="panel"><h2>Ton rythme</h2><form id="goal-form" class="plus-form"><label for="goal-minutes">Objectif quotidien, en minutes</label><input id="goal-minutes" type="number" min="5" max="180" required value="${plus.goal.minutes}"><label for="goal-date">Date de l’objectif (facultatif)</label><input id="goal-date" type="date" value="${esc(plus.goal.date)}"><label for="goal-chapter">Chapitre prioritaire</label><select id="goal-chapter">${chapterOptions(plus.goal.chapter,'Continuer mon parcours')}</select><button class="button secondary" type="submit">Enregistrer mon objectif</button></form></section><section class="panel"><h2>Une séance concentrée</h2><p>Le minuteur continue si tu changes de page. Le temps n’est compté que lorsque la séance se termine.</p><div id="focus-clock" class="plus-clock" role="timer">${focusEnd?focusText():'20:00'}</div><div class="button-row"><button class="button" id="focus-start" ${focusEnd?'disabled':''}>Commencer 20 minutes</button><button class="button secondary" id="focus-stop" ${focusEnd?'':'disabled'}>Arrêter</button></div><form id="session-form" class="plus-form plus-space"><label for="session-minutes">Ajouter une séance déjà effectuée (minutes)</label><input id="session-minutes" type="number" min="1" max="180" value="20" required><button class="button secondary" type="submit">Enregistrer cette séance</button></form></section></aside></div><section class="panel plus-space"><h2>Ta sauvegarde complète</h2><p>Exporte les notes, la progression, les cartes, les objectifs et tes cours personnels. Le fichier reste sur ton appareil. L’import remplace les données locales après confirmation.</p><div class="button-row"><button class="button secondary" id="backup-export">Exporter ma sauvegarde</button><label class="button secondary" for="backup-import">Importer une sauvegarde</label><input class="plus-file" id="backup-import" type="file" accept="application/json,.json"></div><p class="hint-caption" id="backup-status" role="status"></p></section>`;
}
function downloadJSON(value,name) {
  const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function validProgress(raw) {
  if(!raw || typeof raw!=='object' || !Array.isArray(raw.read)||!Array.isArray(raw.done))throw Error('Progression invalide.');
  const out=emptyState();out.read=[...new Set(raw.read.filter(n=>Number.isInteger(n)&&n>=1&&n<=6))];out.done=[...new Set(raw.done.filter(n=>Number.isInteger(n)&&n>=1&&n<=36))];
  const tdIds=new Set(data.tds.flatMap(t=>t.questions.map(q=>q.key)));
  out.tdDone=Array.isArray(raw.tdDone)?[...new Set(raw.tdDone.filter(n=>tdIds.has(n)))]:[];
  for(const [noteKey,answerKey,isValid] of [['notes','answers',id=>/^\d+$/.test(id)&&Number(id)>=1&&Number(id)<=36],['tdNotes','tdAnswers',id=>tdIds.has(id)]]) {
    for(const [id,text] of Object.entries(raw[noteKey]||{}))if(isValid(id)&&typeof text==='string')out[noteKey][id]=text.slice(0,20000);
    for(const [id,answers] of Object.entries(raw[answerKey]||{}))if(isValid(id)&&Array.isArray(answers))out[answerKey][id]=answers.slice(0,4).map(v=>typeof v==='string'?v.slice(0,50):'');
  }
  for(let n=0;n<=6;n++)if(Number.isFinite(raw.quizBest?.[n])&&raw.quizBest[n]>=0&&raw.quizBest[n]<=100)out.quizBest[n]=raw.quizBest[n];
  out.history=Array.isArray(raw.history)?raw.history.filter(h=>h&&Number.isInteger(h.chapter)&&h.chapter>=0&&h.chapter<=6&&Number.isInteger(h.score)&&h.score>=0&&Number.isInteger(h.total)&&h.total>0&&h.score<=h.total&&Number.isFinite(h.time)).slice(0,20):[];
  for(const [key,max] of [['lastChapter',6],['lastExercise',36]])if(Number.isInteger(raw[key])&&raw[key]>=1&&raw[key]<=max)out[key]=raw[key];
  return out;
}
async function importBackup(file) {
  if(file.size>16*1024*1024)throw Error('Fichier trop volumineux (16 Mo maximum).');
  const raw=JSON.parse(await file.text());
  if(raw.format!=='revise-reseaux-backup'||raw.version!==1)throw Error('Ce fichier n’est pas une sauvegarde complète du site.');
  const checked={progress:validProgress(raw.progress),plus:validatePlus(raw.plus),personal:window.PersonalCourses.validate(raw.personal),theme:['light','dark'].includes(raw.theme)?raw.theme:null};
  if(!window.confirm('Remplacer la progression, les notes, les cartes et les cours personnels de ce navigateur par cette sauvegarde ? Exporte d’abord tes données actuelles si tu souhaites les garder.'))return;
  const records=[[KEY,JSON.stringify(checked.progress)],[PLUS_KEY,JSON.stringify(checked.plus)],['revise-reseaux:personal:v1',JSON.stringify(checked.personal)],['revise-reseaux:theme',checked.theme]];
  const before=records.map(([key])=>[key,localStorage.getItem(key)]);
  try {
    for(const [key,value] of records){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}
    window.PersonalCourses.replaceData(checked.personal);
  } catch {
    // Libérer les nouvelles valeurs avant de restaurer évite un second dépassement du quota.
    for(const [key] of before){try{localStorage.removeItem(key);}catch{}}
    for(const [key,value] of before){try{if(value!==null)localStorage.setItem(key,value);}catch{}}
    let restored=false;
    try {restored=before.every(([key,value])=>localStorage.getItem(key)===value);}catch{}
    if(!restored)throw Error('Import interrompu : le stockage empêche une restauration complète. Tes données précédentes sont encore dans cette session ; exporte-les avant de fermer.');
    throw Error('Stockage insuffisant ou indisponible : import annulé, les données précédentes ont été restaurées.');
  }
  location.reload();
}
const cleanText=html=>String(html).replace(/<[^>]*>/g,' ').replace(/&(?:nbsp|amp|lt|gt|quot);/g,' ').replace(/\s+/g,' ').trim();
const normaliseSearch=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
function searchEntries() {
  const entries=[];
  for(const c of data.chapters)entries.push({title:c.title,type:'Cours',href:'#cours/'+c.id,text:cleanText(c.description+' '+c.html)});
  for(const m of window.REVISION_LEARNING.modules)entries.push({title:m.title,type:'Atelier',href:'#modules/'+m.id,text:m.intro+' '+m.sections.map(s=>s.title+' '+s.text).join(' ')});
  for(const e of data.exercises)entries.push({title:e.title,type:'Exercice '+e.id,href:'#exercices/'+e.id,text:cleanText(e.html+' '+e.solution)});
  for(const td of data.tds)for(const q of td.questions)entries.push({title:q.title,type:'TD '+td.id+' · '+q.id,href:'#td/'+td.id+'/'+q.id,text:cleanText(q.section+' '+q.html+' '+q.solution)});
  return entries;
}
function searchResults(query) {
  const terms=normaliseSearch(query.trim()).split(/\s+/).filter(Boolean).slice(0,8);
  if(!terms.length)return '<p class="muted">Essaie « budget optique », « G.711 », « VLAN » ou « dBm ».</p>';
  const matches=searchEntries().filter(e=>terms.every(t=>normaliseSearch(e.title+' '+e.text).includes(t)));
  return `<p role="status">${matches.length} résultat${matches.length>1?'s':''}${matches.length>60?' · 60 premiers affichés':''}</p><div class="plus-results">${matches.slice(0,60).map(e=>`<a class="plus-result" href="${esc(e.href)}"><span class="eyebrow">${esc(e.type)}</span><h2>${esc(e.title)}</h2><p>${esc(e.text.slice(0,220))}…</p><span>Ouvrir →</span></a>`).join('')||'<div class="note-box">Aucun résultat. Essaie un mot plus court ou un synonyme.</div>'}</div>`;
}
function renderSearch() {return `${pageHeading('RETROUVER UNE NOTION','Recherche dans tes révisions.','Explore les six cours, les ateliers, les exercices et les 56 questions de TD.')}<section class="panel"><label class="field-label" for="global-search">Mot ou notion à retrouver</label><input class="search-field" type="search" id="global-search" maxlength="160" placeholder="Ex. fibre, marge, RTP…" value="${esc(searchQuery)}"><div class="plus-space" id="global-results">${searchResults(searchQuery)}</div></section>`;}
function renderPlusHome() {return `<section class="panel plus-plan plus-home"><div><span class="eyebrow">NOUVEAU · TON ATELIER</span><h2>Une autre façon de travailler.</h2><p>12 ateliers expliqués, 36 flashcards et un espace pour tes cours personnels.</p></div><div class="button-row"><a class="button" href="#revision">Ma séance de révision</a><a class="button secondary" href="#modules">Les ateliers</a><a class="button secondary" href="#perso">Mes cours personnels</a></div></section>`;}
function focusText() {const remaining=Math.max(0,Math.ceil((focusEnd-Date.now())/1000));return `${Math.floor(remaining/60).toString().padStart(2,'0')}:${(remaining%60).toString().padStart(2,'0')}`;}
function finishFocus(complete) {clearInterval(focusInterval);focusInterval=null;focusEnd=0;if(complete){plus.sessions.push({at:Date.now(),minutes:focusDuration});plus.sessions=plus.sessions.slice(-365);savePlus();toast('Séance terminée. Tu peux faire une pause.');}if(location.hash.startsWith('#revision'))route(false);}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.moduleDone){const id=button.dataset.moduleDone;if(!window.REVISION_LEARNING.modules.some(m=>m.id===id))return;plus.moduleDone=plus.moduleDone.includes(id)?plus.moduleDone.filter(x=>x!==id):[...plus.moduleDone,id];savePlus();route(false);}
  if(button.id==='flash-reveal'){flashRevealed=true;$('#flash-area').innerHTML=renderFlashcard();}
  if(button.id==='flash-skip'){const deck=flashDeck();const visibleIndex=deck.findIndex(c=>c.id===flashCardId);flashIndex=deck.length?(visibleIndex+1)%deck.length:0;flashCardId=null;flashRevealed=false;$('#flash-area').innerHTML=renderFlashcard();}
  if(button.id==='flash-restart'){flashAll=true;flashIndex=0;flashCardId=null;flashRevealed=false;route(false);}
  if(button.dataset.flashRate&&flashRevealed){const card=window.REVISION_LEARNING.cards.find(c=>c.id===flashCardId);if(!card)return;const streak=button.dataset.flashRate==='known'?Math.min(100,(plus.cards[card.id]?.streak||0)+1):0;plus.cards[card.id]={due:Date.now()+(streak?Math.min(30,2**Math.min(streak-1,5))*86400000:600000),streak,lastDay:localDay()};savePlus();if(flashAll){flashIndex=(flashIndex+1)%flashDeck().length;}flashCardId=null;flashRevealed=false;route(false);}
  if(button.id==='focus-start'&&!focusEnd){focusDuration=20;focusEnd=Date.now()+focusDuration*60000;focusInterval=setInterval(()=>{if(Date.now()>=focusEnd)finishFocus(true);else if($('#focus-clock'))$('#focus-clock').textContent=focusText();},1000);route(false);}
  if(button.id==='focus-stop')finishFocus(false);
  if(button.id==='backup-export'){try{downloadJSON({format:'revise-reseaux-backup',version:1,exportedAt:new Date().toISOString(),progress:state,plus,personal:window.PersonalCourses.getData(),theme:localStorage.getItem('revise-reseaux:theme')},'mes-revisions-'+localDay()+'.json');$('#backup-status').textContent='Sauvegarde téléchargée. Garde ce fichier dans un endroit sûr.';}catch{$('#backup-status').textContent='Impossible de lire le stockage. Tes données de cette session restent accessibles.';}}
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.id==='module-chapter'){moduleChapter=Number(el.value);route(false);}
  if(el.id==='flash-chapter'||el.id==='flash-mode'){flashChapter=Number($('#flash-chapter').value);flashAll=$('#flash-mode').value==='all';flashIndex=0;flashCardId=null;flashRevealed=false;$('#flash-area').innerHTML=renderFlashcard();}
  if(el.id==='backup-import'&&el.files?.[0])importBackup(el.files[0]).catch(error=>{if($('#backup-status'))$('#backup-status').textContent=error.message||'Fichier invalide.';el.value='';});
});
document.addEventListener('input',event=>{if(event.target.id==='global-search'){searchQuery=event.target.value;$('#global-results').innerHTML=searchResults(searchQuery);}});
document.addEventListener('submit',event=>{
  if(event.target.id==='goal-form'){event.preventDefault();plus.goal={minutes:Number($('#goal-minutes').value),date:$('#goal-date').value,chapter:Number($('#goal-chapter').value)};if(savePlus())toast('Objectif enregistré.');route(false);}
  if(event.target.id==='session-form'){event.preventDefault();const minutes=Number($('#session-minutes').value);if(!Number.isInteger(minutes)||minutes<1||minutes>180)return;plus.sessions.push({at:Date.now(),minutes});plus.sessions=plus.sessions.slice(-365);if(savePlus())toast('Séance enregistrée.');route(false);}
});
