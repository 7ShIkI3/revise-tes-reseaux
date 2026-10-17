'use strict';
function tdCard(td) {
  const done=td.questions.filter(q=>state.tdDone.includes(q.key)).length;
  const topics={1:2,2:5,3:6};
  return `<a class="chapter-card topic-${topics[td.id]}" href="#td/${td.id}"><div class="card-top"><span class="chapter-symbol">${icon(topicIcons[topics[td.id]-1])}</span><span class="tag">TD ${td.id} · ${td.pages} pages</span></div><h3>${esc(td.title)}</h3><p>${esc(td.description)}</p><div class="card-foot"><span>${td.questions.length} questions avec corrigés</span><span class="chip ${done===td.questions.length?'done':''}">${done} / ${td.questions.length}</span></div></a>`;
}
function renderTD(id,questionId) {
  const td=data.tds.find(td=>td.id===id);
  if(!td) return `${pageHeading('TES SUJETS DE COURS','Tes TD, question par question.','Retrouve les trois documents, leurs questions et des corrigés expliqués. Les calculs théoriques se vérifient ; les réponses expérimentales indiquent les relevés nécessaires.',`<span class="page-count">${state.tdDone.length} / 56 questions terminées</span>`)}<div class="chapter-grid td-grid">${data.tds.map(tdCard).join('')}</div><div class="note-box"><strong>La méthode :</strong> ouvre un sujet, lis la feuille de méthode, écris ta réponse, puis consulte le corrigé. Les 36 exercices du parcours restent accessibles dans « Les exercices ».</div>`;
  const current=td.questions.find(q=>q.id===questionId);
  const done=td.questions.filter(q=>state.tdDone.includes(q.key)).length;
  const downloads=`<div class="button-row"><a class="button secondary small" href="assets/td/${td.slug}.pdf" download>${icon('download')}Sujet PDF</a><a class="button secondary small" href="assets/td/${td.slug}.doc" download>Word d’origine</a></div>`;
  const heading=`<a class="back-link" href="#td">← Tous les TD</a>${pageHeading(`TD ${td.id} · ${td.pages} PAGES`,esc(td.title),esc(td.subtitle),downloads)}`;
  const links=td.questions.map((q,i)=>`${i===0||q.section!==td.questions[i-1].section?`<p class="td-section-label">${esc(q.section)}</p>`:''}<a class="exercise-link ${current?.id===q.id?'active':''} ${state.tdDone.includes(q.key)?'completed':''}" href="#td/${td.id}/${q.id}" data-td-link="${q.key}" ${current?.id===q.id?'aria-current="true"':''}><span class="exercise-num">${state.tdDone.includes(q.key)?'✓':esc(q.id)}</span><span>${esc(q.title)}</span></a>`).join('');
  const browser=`<aside class="panel exercise-browser td-browser"><label class="field-label" for="td-select">Le sujet</label><select id="td-select">${data.tds.map(t=>`<option value="${t.id}" ${t.id===td.id?'selected':''}>TD ${t.id} · ${esc(t.title)}</option>`).join('')}</select><a class="td-method-link" href="#td/${td.id}">Feuille de méthode & sommaire →</a><p class="hint-caption">${done} / ${td.questions.length} questions terminées</p><div class="exercise-list">${links}</div></aside>`;
  let content;
  if(!current) content=`<article class="panel exercise-content"><span class="eyebrow">AVANT DE COMMENCER</span><h2 style="margin-top:12px">La feuille de méthode</h2><div class="prose">${td.intro}</div><div class="note-box">Document fourni : <strong>${esc(td.file)}</strong>. Les formulations des questions sont reprises et clarifiées pour l’entraînement. Le PDF et le Word conservent le sujet complet, ses données et ses figures.</div><div class="button-row"><a class="button" href="#td/${td.id}/${td.questions[0].id}">Commencer à la première question ${icon('arrow')}</a>${downloads}</div><section class="td-overview"><h3>Au programme</h3>${[...new Set(td.questions.map(q=>q.section))].map(s=>`<div class="td-group"><h4>${esc(s)}</h4>${td.questions.filter(q=>q.section===s).map(q=>`<a href="#td/${td.id}/${q.id}"><strong>${esc(q.id)}</strong> ${esc(q.title)} <span>→</span></a>`).join('')}</div>`).join('')}</section><div class="td-course-links"><strong>Revoir le cours :</strong>${td.chapters.map(c=>`<a href="#cours/${c}">${esc(data.chapters[c-1].title)}</a>`).join('')}</div></article>`;
  else {
    const q=current,index=td.questions.indexOf(q);
    const lessons=data.tdLessons?.[q.key]||[];
    const lessonLinks=lessons.length?`<section class="lesson-prerequisites" aria-label="Cours utiles pour cette question"><strong>Comprendre avant de répondre</strong><p>Revois la notion et un calcul guidé, puis reviens à cette question.</p><div class="lesson-links">${lessons.map(link=>`<a href="${esc(link.href)}">${esc(link.title)} →</a>`).join('')}</div></section>`:'';
    content=`<article class="panel exercise-content"><div class="exercise-heading"><span class="chip">TD ${td.id} · ${esc(q.id)}</span>${q.measurement?'<span class="chip td-measurement">Relevé manquant</span>':''}</div><p class="eyebrow">${esc(q.section)}</p><h2>${esc(q.title)}</h2><div class="prose">${q.html}</div>${lessonLinks}<div class="work-area"><label class="field-label" for="td-notes">Ta réponse et ta démarche</label><textarea id="td-notes" data-td-key="${q.key}" maxlength="20000" placeholder="Les données utiles, la formule, les unités et ton explication…">${esc(state.tdNotes[q.key]||'')}</textarea><p class="hint-caption">Tes notes sont sauvegardées dans ce navigateur, avec ta progression.</p></div>
    ${q.checks.length?`<section class="check-section"><h3>Vérifie tes calculs</h3><p>Utilise les unités affichées. Le point, la virgule et la notation scientifique (ex. 1,59e-7) sont acceptés. Le corrigé précise les hypothèses et les arrondis.</p><div class="check-grid">${q.checks.map((c,i)=>`<div class="check-field"><label for="td-answer-${i}">${esc(c.label)}</label><div class="input-unit"><input type="text" inputmode="decimal" autocomplete="off" id="td-answer-${i}" data-td-answer="${i}" data-td-key="${q.key}" value="${esc(state.tdAnswers[q.key]?.[i]||'')}" maxlength="50" aria-describedby="td-feedback-${i}"><span>${esc(c.unit)}</span></div><div class="check-feedback" id="td-feedback-${i}" role="status"></div></div>`).join('')}</div><button class="button secondary" data-td-check="${q.key}">Vérifier mes calculs ${icon('check')}</button><p id="td-check-summary" class="check-summary" role="status"></p></section>`:`<div class="note-box">${q.measurement?'Le sujet nécessite un relevé qui n’est pas disponible. Le corrigé fournit la méthode et distingue les mesures des exemples théoriques.':'Cette question demande une explication ou une lecture de figure. Compare ta démarche au corrigé, en conservant les hypothèses annoncées.'}</div>`}
    <details class="solution"><summary>Afficher le corrigé expliqué</summary><div class="prose">${q.solution}</div></details><div class="exercise-end"><button class="button ${state.tdDone.includes(q.key)?'secondary':'mint'}" data-td-done="${q.key}">${state.tdDone.includes(q.key)?'✓ Question terminée — annuler':'J’ai terminé cette question'}</button><p class="hint-caption">Marque la question après avoir comparé le raisonnement et les calculs. Pour un relevé manquant, cela indique que tu as travaillé la méthode.</p></div><div class="exercise-pager"><a href="#td/${td.id}/${index?td.questions[index-1].id:''}">← ${index?'Question précédente':'Feuille de méthode'}</a>${index<td.questions.length-1?`<a href="#td/${td.id}/${td.questions[index+1].id}">Question suivante →</a>`:'<a href="#td">Tous les TD →</a>'}</div></article>`;
  }
  return `${heading}<div class="exercise-layout">${browser}${content}</div>`;
}
function checkTD(key) {
  const q=data.tds.flatMap(td=>td.questions).find(q=>q.key===key);if(!q)return;
  let count=0;
  q.checks.forEach((c,i)=>{
    const input=$(`#td-answer-${i}`),feedback=$(`#td-feedback-${i}`),value=numberValue(input.value),correct=value!==null&&Math.abs(value-c.value)<=c.tolerance+1e-12;
    input.classList.toggle('correct',correct);input.classList.toggle('incorrect',!correct);input.setAttribute('aria-invalid',String(!correct));
    feedback.className=`check-feedback ${correct?'correct':'incorrect'}`;
    feedback.textContent=correct?'✓ Résultat correct dans la tolérance.':value===null?'Entre un nombre sans l’unité. La notation 1,59e-7 est acceptée.':'À revoir : vérifie les unités, le modèle retenu et les signes. Le corrigé détaille la démarche.';
    if(correct)count++;
  });
  $('#td-check-summary').textContent=`${count} / ${q.checks.length} résultats corrects.${count===q.checks.length?' Compare aussi ton explication au corrigé.':''}`;
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.tdCheck){checkTD(button.dataset.tdCheck);return;}
  if(button.dataset.tdDone){const key=button.dataset.tdDone;state.tdDone=state.tdDone.includes(key)?state.tdDone.filter(x=>x!==key):[...state.tdDone,key];save();const done=state.tdDone.includes(key);button.textContent=done?'✓ Question terminée — annuler':'J’ai terminé cette question';button.classList.toggle('mint',!done);button.classList.toggle('secondary',done);const link=$(`[data-td-link="${key}"]`);if(link){link.classList.toggle('completed',done);$('.exercise-num',link).textContent=done?'✓':key.split('-').slice(1).join('-');}toast(done?'Question ajoutée à ta progression.':'Question retirée de ta progression.');}
});
document.addEventListener('input',event=>{
  const field=event.target;
  if(field.id==='td-notes'){state.tdNotes[field.dataset.tdKey]=field.value;save();}
  if(field.dataset.tdAnswer!==undefined){const key=field.dataset.tdKey;state.tdAnswers[key]||=[];state.tdAnswers[key][Number(field.dataset.tdAnswer)]=field.value;save();field.classList.remove('correct','incorrect');field.removeAttribute('aria-invalid');$(`#td-feedback-${field.dataset.tdAnswer}`).textContent='';$('#td-check-summary').textContent='';}
});
document.addEventListener('change',event=>{if(event.target.id==='td-select')location.hash=`td/${event.target.value}`;});
