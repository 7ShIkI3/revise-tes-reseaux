'use strict';
(() => {
  const STORAGE_KEY = 'revise-reseaux:personal:v1';
  const MAX_COURSES = 100;
  const MAX_CONTENT = 20000;
  const ROOT = '#personal-courses';
  let store = {version:1,courses:[]};
  let storageWarning = '';
  let selectedId = null;
  let editingId = null;
  let editing = false;
  let query = '';
  let favoritesOnly = false;
  let showTrash = false;
  let message = '';

  const clone = value => JSON.parse(JSON.stringify(value));
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype,null].includes(Object.getPrototypeOf(value));
  function exactKeys(value, keys, label) {
    if (!record(value) || Object.keys(value).length !== keys.length || Object.keys(value).some(key => !keys.includes(key))) throw new Error(`${label} : structure JSON incorrecte.`);
  }
  const timestamp = value => Number.isSafeInteger(value) && value >= 0 && value <= 8640000000000000;
  function validate(input) {
    exactKeys(input,['version','courses'],'Fichier de cours');
    if (input.version !== 1 || !Array.isArray(input.courses) || input.courses.length > MAX_COURSES) throw new Error('Format attendu : version 1 et 100 cours maximum, corbeille comprise.');
    const ids = new Set();
    const courses = input.courses.map(course => {
      exactKeys(course,['id','title','subject','content','favorite','createdAt','updatedAt','deletedAt'],'Cours');
      if (typeof course.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(course.id) || ids.has(course.id)) throw new Error('Identifiant de cours invalide ou présent plusieurs fois.');
      ids.add(course.id);
      if (typeof course.title !== 'string' || !course.title.trim() || course.title.length > 160) throw new Error('Chaque cours doit avoir un titre de 1 à 160 caractères.');
      if (typeof course.subject !== 'string' || course.subject.length > 80) throw new Error('La matière ou le tag doit contenir 80 caractères maximum.');
      if (typeof course.content !== 'string' || !course.content.trim() || course.content.length > MAX_CONTENT) throw new Error('Chaque contenu doit avoir de 1 à 20 000 caractères.');
      if (typeof course.favorite !== 'boolean') throw new Error('Le statut favori doit être un booléen.');
      if (!timestamp(course.createdAt) || !timestamp(course.updatedAt) || course.updatedAt < course.createdAt || (course.deletedAt !== null && (!timestamp(course.deletedAt) || course.deletedAt < course.createdAt || course.deletedAt > course.updatedAt))) throw new Error('Les dates du cours sont invalides ou incohérentes.');
      return {id:course.id,title:course.title,subject:course.subject,content:course.content,favorite:course.favorite,createdAt:course.createdAt,updatedAt:course.updatedAt,deletedAt:course.deletedAt};
    });
    return {version:1,courses};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) store = validate(JSON.parse(raw));
  } catch {
    storageWarning = 'Les cours enregistrés n’ont pas pu être chargés. Les changements restent disponibles pendant cette session si le stockage est indisponible.';
  }
  function persist(next) {
    const checked = validate(next);
    store = checked;
    try {
      localStorage.setItem(STORAGE_KEY,JSON.stringify(checked));
      storageWarning = '';
      return true;
    } catch {
      storageWarning = 'Stockage indisponible : tes changements restent seulement dans cette session. Exporte tes cours avant de fermer la page.';
      return false;
    }
  }
  function replaceData(input) {
    const checked = validate(input);
    try {
      localStorage.setItem(STORAGE_KEY,JSON.stringify(checked));
    } catch {
      storageWarning = 'Stockage indisponible : les cours importés n’ont pas été enregistrés.';
      throw new Error(storageWarning);
    }
    store = checked;
    storageWarning = '';
    selectedId = null;
    editing = false;
    editingId = null;
  }
  function makeId() {
    let id;
    do {
      id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `cours_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,14)}`;
    } while (store.courses.some(course => course.id === id));
    return id;
  }
  const date = value => new Date(value).toLocaleDateString('fr-FR',{year:'numeric',month:'short',day:'numeric'});
  const normalized = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
  function filteredCourses() {
    const term = normalized(query.trim());
    return store.courses.filter(course => Boolean(course.deletedAt !== null) === showTrash && (!favoritesOnly || course.favorite) && (!term || normalized(`${course.title} ${course.subject} ${course.content}`).includes(term))).sort((a,b) => b.updatedAt-a.updatedAt || a.title.localeCompare(b.title,'fr'));
  }
  function listHTML(courses) {
    if (!courses.length) return `<p class="personal-empty">${query || favoritesOnly ? 'Aucun cours ne correspond à ces filtres.' : showTrash ? 'La corbeille est vide.' : 'Crée ton premier cours ou importe une sauvegarde JSON.'}</p>`;
    return courses.map(course => `<button type="button" class="personal-course-link${selectedId === course.id?' is-selected':''}" data-personal-action="open" data-id="${esc(course.id)}"${selectedId === course.id?' aria-current="true"':''}><span class="personal-course-title">${course.favorite?'<span aria-label="Favori">★ </span>':''}${esc(course.title)}</span><span class="personal-course-subject">${esc(course.subject || 'Sans matière')} · ${date(course.updatedAt)}</span><span class="personal-course-preview">${esc(course.content.slice(0,100).replace(/\s+/g,' '))}</span></button>`).join('');
  }
  function editorHTML() {
    const course = store.courses.find(item => item.id === editingId);
    return `<section class="panel personal-editor" aria-labelledby="personal-editor-title"><h2 id="personal-editor-title">${course?'Modifier ton cours':'Nouveau cours personnel'}</h2><form id="personal-form"><div class="personal-form-field"><label class="field-label" for="personal-title">Titre du cours</label><input id="personal-title" name="title" required maxlength="160" autocomplete="off" value="${esc(course?.title || '')}" placeholder="Ex. Comprendre les VLAN"></div><div class="personal-form-field"><label class="field-label" for="personal-subject">Matière ou tag (facultatif)</label><input id="personal-subject" name="subject" maxlength="80" value="${esc(course?.subject || '')}" placeholder="Ex. Réseaux · RES501"></div><div class="personal-form-field"><label class="field-label" for="personal-content">Ton cours, tes exemples et tes schémas en texte</label><textarea id="personal-content" name="content" required maxlength="20000" rows="15" aria-describedby="personal-content-hint personal-character-count" placeholder="Définition, méthode, exemple corrigé, erreurs à éviter…">${esc(course?.content || '')}</textarea><p class="hint-caption" id="personal-content-hint">Texte simple : les retours à la ligne sont conservés. Le code HTML reste du texte.</p><p class="personal-character-count" id="personal-character-count">${(course?.content || '').length.toLocaleString('fr-FR')} / 20 000 caractères</p></div><label class="personal-checkbox"><input type="checkbox" name="favorite"${course?.favorite?' checked':''}> Ajouter aux favoris</label><div class="personal-actions"><button type="submit" class="button mint">Enregistrer le cours ${icon('check')}</button><button type="button" class="button secondary" data-personal-action="cancel">Annuler</button></div><p class="hint-caption">Pense à enregistrer avant de changer de page. Tes cours restent dans ce navigateur ; exporte-les pour les garder ailleurs.</p></form></section>`;
  }
  function readerHTML() {
    const course = store.courses.find(item => item.id === selectedId && (item.deletedAt !== null) === showTrash);
    if (!course) return `<section class="panel personal-reader personal-reader-empty"><span class="personal-empty-icon">${icon('book')}</span><h2>${showTrash?'Des cours récupérables.':'Ton espace, tes explications.'}</h2><p>${showTrash?'Sélectionne un cours supprimé pour le lire et le restaurer. La corbeille reste incluse dans tes exports.':'Sélectionne un cours pour le lire, ou crée une fiche avec tes propres mots.'}</p>${showTrash?'':'<button class="button mint" type="button" data-personal-action="new">Créer un cours</button>'}</section>`;
    return `<article class="panel personal-reader" aria-labelledby="personal-reader-title"><div class="personal-reader-meta"><span class="chip">${esc(course.subject || 'Cours personnel')}</span><span>${course.deletedAt !== null?'Mis à la corbeille le':'Modifié le'} ${date(course.deletedAt ?? course.updatedAt)}</span></div><h2 id="personal-reader-title">${esc(course.title)}</h2><div class="personal-actions personal-no-print">${course.deletedAt !== null?`<button class="button mint" type="button" data-personal-action="restore" data-id="${esc(course.id)}">Restaurer ce cours</button><button class="button secondary personal-trash-button" type="button" data-personal-action="purge" data-id="${esc(course.id)}">Supprimer définitivement</button>`:`<button class="button secondary" type="button" data-personal-action="edit" data-id="${esc(course.id)}">${icon('pen')}Modifier</button><button class="button secondary" type="button" data-personal-action="favorite" data-id="${esc(course.id)}" aria-pressed="${course.favorite}">${course.favorite?'★ Retirer des favoris':'☆ Ajouter aux favoris'}</button><button class="button secondary" type="button" data-personal-action="print">Imprimer</button><button class="button secondary personal-trash-button" type="button" data-personal-action="delete" data-id="${esc(course.id)}">Mettre à la corbeille</button>`}</div><div class="personal-content">${esc(course.content)}</div>${course.deletedAt !== null?'<p class="personal-trash-note personal-no-print">Ce cours est conservé dans la corbeille. Le restaurer le remet dans ta bibliothèque. Exporte une sauvegarde avant toute suppression définitive.</p>':''}</article>`;
  }
  function render() {
    const activeCount = store.courses.filter(course => course.deletedAt === null).length;
    const trashCount = store.courses.length-activeCount;
    const courses = filteredCourses();
    if (!editing && !courses.some(course => course.id === selectedId)) selectedId = courses[0]?.id || null;
    return `<div id="personal-courses">${pageHeading('TES COURS PERSONNELS','Comprendre avec tes propres mots.','Rassemble tes fiches de cours, exemples et méthodes. Cet espace est privé à ce navigateur : rien n’est envoyé sur GitHub.',`<span class="page-count">${activeCount} cours · ${store.courses.length} / ${MAX_COURSES} places</span>`)}<div class="personal-toolbar personal-no-print"><button class="button mint" type="button" data-personal-action="new">${icon('pen')}Nouveau cours</button><button class="button secondary" type="button" data-personal-action="export">${icon('download')}Exporter mes cours</button><button class="button secondary" type="button" data-personal-action="import" aria-controls="personal-import">Importer un JSON</button><input type="file" id="personal-import" accept="application/json,.json" aria-label="Importer une sauvegarde de cours JSON" hidden></div><p class="personal-storage-note personal-no-print">Sauvegarde locale uniquement. L’export JSON inclut les cours et la corbeille ; l’import fusionne avec ta bibliothèque. Limites : 100 cours, 20 000 caractères par cours.</p>${storageWarning?`<p class="personal-warning personal-no-print" role="alert">${esc(storageWarning)}</p>`:''}<p id="personal-message" class="personal-message personal-no-print" role="status"${message?'':' hidden'}>${esc(message)}</p><div class="personal-shell"><aside class="panel personal-library personal-no-print" aria-label="Bibliothèque de cours personnels"><div class="personal-tabs"><button type="button" data-personal-action="library" aria-pressed="${!showTrash}">Mes cours (${activeCount})</button><button type="button" data-personal-action="trash" aria-pressed="${showTrash}">Corbeille (${trashCount})</button></div><label class="field-label" for="personal-search">Chercher dans mes cours</label><input type="search" id="personal-search" maxlength="160" value="${esc(query)}" placeholder="Titre, matière ou contenu…"><label class="personal-checkbox"><input type="checkbox" id="personal-favorites"${favoritesOnly?' checked':''}> Favoris uniquement</label><p id="personal-results-count" class="hint-caption" role="status">${courses.length} cours affiché${courses.length>1?'s':''}</p><div id="personal-list" class="personal-list">${listHTML(courses)}</div></aside><div id="personal-detail">${editing?editorHTML():readerHTML()}</div></div></div>`;
  }
  function redraw(focusId) {
    const root = document.querySelector(ROOT);
    if (!root) return;
    root.outerHTML = render();
    mount();
    if (focusId) document.getElementById(focusId)?.focus();
  }
  function announce(text) {
    message = text;
    const target = document.getElementById('personal-message');
    if (target) { target.textContent = text; target.hidden = !text; }
    toast(text);
  }
  function draftDirty() {
    const form = document.getElementById('personal-form');
    if (!editing || !form) return false;
    const course = store.courses.find(item => item.id === editingId);
    return form.elements.title.value !== (course?.title || '') || form.elements.subject.value !== (course?.subject || '') || form.elements.content.value !== (course?.content || '') || form.elements.favorite.checked !== Boolean(course?.favorite);
  }
  function leaveEditor() {
    return !draftDirty() || window.confirm('Les modifications de ce cours ne sont pas enregistrées. Les abandonner ?');
  }
  function saveCourse(form) {
    const original = store.courses.find(course => course.id === editingId);
    if (!original && store.courses.length >= MAX_COURSES) throw new Error('La bibliothèque contient déjà 100 cours, corbeille comprise. Exporte une sauvegarde, puis supprime définitivement un cours de la corbeille pour libérer une place.');
    const now = Math.max(Date.now(),original?.updatedAt || 0);
    const course = {id:original?.id || makeId(),title:form.elements.title.value.trim(),subject:form.elements.subject.value.trim(),content:form.elements.content.value,favorite:form.elements.favorite.checked,createdAt:original?.createdAt ?? now,updatedAt:now,deletedAt:null};
    const next = {version:1,courses:original?store.courses.map(item => item.id === course.id?course:item):[...store.courses,course]};
    const saved = persist(next);
    selectedId = course.id;
    editing = false;
    editingId = null;
    showTrash = false;
    query = '';
    favoritesOnly = false;
    message = saved?'Cours enregistré dans ce navigateur.':'Cours conservé pour cette session seulement. Exporte-le avant de fermer la page.';
    redraw('personal-reader-title');
    toast(message);
  }
  function exportCourses() {
    const blob = new Blob([JSON.stringify(getData(),null,2)],{type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `mes-cours-reseaux-${new Date().toISOString().slice(0,10)}.json`;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    announce('Export JSON préparé. Vérifie le téléchargement pour conserver ta sauvegarde.');
  }
  async function importCourses(file) {
    if (!file) return;
    if (file.size > 12*1024*1024) throw new Error('Le fichier dépasse 12 Mo. Importe un export JSON de 100 cours maximum.');
    const imported = validate(JSON.parse(await file.text()));
    const merged = new Map(store.courses.map(course => [course.id,course]));
    let additions = 0;
    let replacements = 0;
    for (const course of imported.courses) {
      const old = merged.get(course.id);
      if (!old) additions++;
      else if (JSON.stringify(old) !== JSON.stringify(course)) replacements++;
      merged.set(course.id,course);
    }
    if (merged.size > MAX_COURSES) throw new Error(`La fusion donnerait ${merged.size} cours. La limite est de 100, corbeille comprise. Aucun cours n’a été importé.`);
    if (replacements && !window.confirm(`Importer ${additions} nouveau(x) cours et remplacer ${replacements} version(s) déjà présentes par celles du fichier, y compris leur état dans la corbeille ? Les autres cours seront conservés.`)) return;
    if (!additions && !replacements) { announce('Ces cours sont déjà présents. Aucun changement.'); return; }
    const saved = persist({version:1,courses:[...merged.values()]});
    editing = false;
    editingId = null;
    showTrash = false;
    favoritesOnly = false;
    query = '';
    selectedId = imported.courses.find(course => course.deletedAt === null)?.id || null;
    message = `${additions} cours ajouté(s), ${replacements} mis à jour.${saved?' Sauvegarde locale effectuée.':' Changements en mémoire seulement : exporte une sauvegarde.'}`;
    redraw();
    toast(message);
  }
  function changeCourse(id, transform, success) {
    const next = {version:1,courses:store.courses.map(course => course.id === id?transform(course):course)};
    const saved = persist(next);
    message = saved?success:`${success} Changements en mémoire seulement : exporte tes cours.`;
    redraw();
    toast(message);
  }
  function action(name, id) {
    if (name === 'export') { exportCourses(); return; }
    if (name === 'print') { window.print(); return; }
    if (name === 'import') { if (leaveEditor()) document.getElementById('personal-import')?.click(); return; }
    if (!leaveEditor()) return;
    message = '';
    if (name === 'new') {
      if (store.courses.length >= MAX_COURSES) { announce('La bibliothèque contient déjà 100 cours, corbeille comprise. Exporte une sauvegarde, puis supprime définitivement un cours de la corbeille pour libérer une place.'); return; }
      editing = true; editingId = null; showTrash = false; redraw('personal-title');
    } else if (name === 'edit') {
      if (!store.courses.some(course => course.id === id && course.deletedAt === null)) return;
      editing = true; editingId = id; redraw('personal-title');
    } else if (name === 'cancel') {
      editing = false; editingId = null; redraw();
    } else if (name === 'open') {
      selectedId = id; editing = false; editingId = null; redraw();
    } else if (name === 'library' || name === 'trash') {
      showTrash = name === 'trash'; editing = false; editingId = null; selectedId = null; redraw();
    } else if (name === 'favorite') {
      changeCourse(id,course => ({...course,favorite:!course.favorite,updatedAt:Math.max(Date.now(),course.updatedAt)}),'Favoris mis à jour.');
    } else if (name === 'delete') {
      changeCourse(id,course => { const now = Math.max(Date.now(),course.updatedAt); return {...course,deletedAt:now,updatedAt:now}; },'Cours déplacé dans la corbeille. Tu peux le restaurer.');
    } else if (name === 'restore') {
      changeCourse(id,course => ({...course,deletedAt:null,updatedAt:Math.max(Date.now(),course.updatedAt)}),'Cours restauré dans « Mes cours ».');
    } else if (name === 'purge') {
      const course = store.courses.find(item => item.id === id && item.deletedAt !== null);
      if (!course || !window.confirm(`Supprimer définitivement « ${course.title} » ? Cette action ne pourra pas être annulée. Conserve un export JSON si tu veux pouvoir le récupérer.`)) return;
      const saved = persist({version:1,courses:store.courses.filter(item => item.id !== id)});
      message = saved?'Cours supprimé définitivement.': 'Cours retiré de cette session seulement. Le stockage n’a pas pu être mis à jour.';
      redraw();
      toast(message);
    }
  }
  function mount() {
    const root = document.querySelector(ROOT);
    if (!root || root.dataset.mounted) return;
    root.dataset.mounted = 'true';
    root.addEventListener('click',event => {
      const button = event.target.closest('[data-personal-action]');
      if (!button || !root.contains(button)) return;
      try { action(button.dataset.personalAction,button.dataset.id); }
      catch (error) { announce(error.message || 'Cette action n’a pas pu être effectuée.'); }
    });
    root.addEventListener('submit',event => {
      if (event.target.id !== 'personal-form') return;
      event.preventDefault();
      try { saveCourse(event.target); }
      catch (error) { announce(error.message || 'Le cours n’a pas pu être enregistré.'); }
    });
    root.addEventListener('input',event => {
      if (event.target.id === 'personal-content') document.getElementById('personal-character-count').textContent = `${event.target.value.length.toLocaleString('fr-FR')} / 20 000 caractères`;
      if (event.target.id === 'personal-search') {
        query = event.target.value;
        const courses = filteredCourses();
        document.getElementById('personal-list').innerHTML = listHTML(courses);
        document.getElementById('personal-results-count').textContent = `${courses.length} cours affiché${courses.length>1?'s':''}`;
      }
    });
    root.addEventListener('change',async event => {
      if (event.target.id === 'personal-favorites') {
        favoritesOnly = event.target.checked;
        const courses = filteredCourses();
        document.getElementById('personal-list').innerHTML = listHTML(courses);
        document.getElementById('personal-results-count').textContent = `${courses.length} cours affiché${courses.length>1?'s':''}`;
      }
      if (event.target.id === 'personal-import') {
        const file = event.target.files[0];
        event.target.value = '';
        try { await importCourses(file); }
        catch (error) { announce(error instanceof SyntaxError?'Ce fichier n’est pas un JSON valide. Aucun cours n’a été importé.':error.message || 'L’import a échoué.'); }
      }
    });
    const heading = root.querySelector('#personal-reader-title');
    if (heading) heading.tabIndex = -1;
  }
  function getData() { return clone(store); }
  window.addEventListener('beforeunload',event => {
    if (draftDirty()) { event.preventDefault(); event.returnValue = ''; }
  });
  window.PersonalCourses = {render,mount,getData,validate,replaceData};
})();
