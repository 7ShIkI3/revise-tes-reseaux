# Révise tes réseaux

Site de révision en français pour les cours, TD et TP de réseaux et télécommunications.

**Site en ligne : [7shiki3.github.io/revise-tes-reseaux](https://7shiki3.github.io/revise-tes-reseaux/)**

## Contenu

- 6 chapitres : bases, fibre optique, FTTH, antennes, radio et réseaux mobiles.
- 36 exercices corrigés, quiz, 3 TD et 4 guides de TP.
- Schémas, formules et modèles interactifs : budget optique, ROS et bilan radio.
- Livret et sujets de TD téléchargeables en PDF et Word.
- Mode clair/sombre, notes et progression conservés dans le navigateur.

Les téléchargements restent les documents initiaux ; les enrichissements des cours sont intégrés à la version web.

## Fonctionnement

Site entièrement statique, sans compilation ni API. `index.html`, les scripts, les feuilles de style et les données JSON sont à la racine. Les images, documents et fontes sont dans `assets/`. KaTeX est distribué localement avec sa licence. Les textes d'enrichissement sont conservés dans `content/enrichissements/`.

Pour une prévisualisation locale, servir ce dossier avec un serveur HTTP statique, puis ouvrir son adresse dans un navigateur.

## Hébergement et données

GitHub Pages publie la racine de la branche `gh-pages`. Le fichier `.nojekyll` permet de servir les fichiers statiques directement. Le site et les documents téléchargeables sont publics.

La progression, les notes et les scores restent dans le stockage local du navigateur sous `revise-reseaux:v1`, et le thème sous `revise-reseaux:theme`. Aucune synchronisation entre appareils n'est effectuée. En changeant d'adresse d'hébergement, la progression de l'ancien site ne se transfère pas automatiquement.
