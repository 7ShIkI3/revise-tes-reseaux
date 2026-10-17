# Révise tes réseaux

Site de révision en français pour les cours, TD et TP de réseaux et télécommunications.

**Site en ligne : [7shiki3.github.io/revise-tes-reseaux](https://7shiki3.github.io/revise-tes-reseaux/)**

## Contenu

- 6 chapitres : bases, fibre optique, FTTH, antennes, radio et réseaux mobiles.
- 36 exercices corrigés, quiz, 3 TD et 4 guides de TP.
- Schémas, formules et modèles interactifs : budget optique, ROS et bilan radio.
- Livret et sujets de TD téléchargeables en PDF et Word.
- Mode clair/sombre, notes et progression conservés dans le navigateur.
- 12 ateliers complémentaires : 36 explications et 52 étapes d'exemples corrigés.
- 36 flashcards avec rappel actif et dates de révision espacées selon l'autoévaluation.
- Recherche dans les cours, ateliers, exercices et TD.
- Objectif quotidien, chapitre prioritaire, date d'échéance et minuteur de concentration.
- Cours personnels : édition, favoris, recherche, impression, corbeille et restauration.
- Export/import JSON des cours et sauvegarde complète des révisions.

Les téléchargements restent les documents initiaux ; les enrichissements des cours sont intégrés à la version web.

## Fonctionnement

Site entièrement statique, sans compilation ni API. `index.html`, les scripts, les feuilles de style et les données JSON sont à la racine. Les images, documents et fontes sont dans `assets/`. KaTeX est distribué localement avec sa licence. Les textes d'enrichissement sont conservés dans `content/enrichissements/`.

Pour une prévisualisation locale, servir ce dossier avec un serveur HTTP statique, puis ouvrir son adresse dans un navigateur.

## Hébergement et données

GitHub Pages publie la racine de la branche `gh-pages`. Le fichier `.nojekyll` permet de servir les fichiers statiques directement. Le site et les documents téléchargeables sont publics.

La progression, les notes et les scores restent dans le stockage local du navigateur sous `revise-reseaux:v1`, et le thème sous `revise-reseaux:theme`. Aucune synchronisation entre appareils n'est effectuée. En changeant d'adresse d'hébergement, la progression de l'ancien site ne se transfère pas automatiquement.

Les flashcards, objectifs et séances sont sous `revise-reseaux:plus:v1`, les cours personnels sous `revise-reseaux:personal:v1`. Ces données ne sont pas commitées dans ce dépôt et ne sont envoyées à aucun serveur. L'export complet se trouve dans **Ma révision → Ta sauvegarde complète**. Son import remplace les données locales après confirmation et valide le fichier avant modification. Un export de cours personnels s'importe séparément dans **Mes cours personnels**, par fusion.

## Références des ateliers

Les exemples sont fictifs et les relevés de TP restent à mesurer. Conventions et méthodes : [RTP, RFC 3550](https://www.rfc-editor.org/rfc/rfc3550), [G.711 dans RTP, RFC 3551](https://www.rfc-editor.org/rfc/rfc3551), [GPON, UIT-T G.984.3](https://www.itu.int/rec/T-REC-G.984.3/en), [espace libre, UIT-R P.525](https://www.itu.int/rec/R-REC-P.525/en), [diffraction, UIT-R P.526](https://www.itu.int/rec/R-REC-P.526/en), [mesures de réflexion, Keysight](https://helpfiles.keysight.com/csg/pxivna/Tutorials/Reflection_Measurements.htm), [OTDR, Fluke](https://www.flukenetworks.com/expertise/learn-about/otdr).
