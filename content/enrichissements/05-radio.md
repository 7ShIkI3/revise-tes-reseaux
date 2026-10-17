<div class="lesson-intro"><strong>Objectif TD2.</strong> Faire circuler les unités et les signes de l’émetteur jusqu’au récepteur. Les quatre familles de questions sont reliées ici : densité de puissance, paraboles et météo, diagramme de Yagi, dimensionnement satellite.</div>

## Carte des grandeurs de la liaison {#radio-vocabulaire}

Un **bilan de liaison** additionne les gains et retranche les pertes sur un trajet. La **sensibilité** est le niveau minimal permettant la performance spécifiée au récepteur ; elle dépend notamment du débit, de la modulation, du bruit et du critère d’erreur. La **marge** indique l’écart entre le niveau prévu et ce seuil.

| Grandeur | Unité | Ce qu’elle représente |
|---|---|---|
| Pe, Pr | W ou dBm / dBW | Puissance totale à un point de la chaîne |
| g, G | Sans unité ou dBi | Gain directionnel d’antenne |
| S | W/m² | Densité surfacique de puissance dans l’espace |
| Se | m² | Surface effective de réception |
| L, A | dB | Perte d’un élément ou du trajet |
| αatm | dB/km | Atténuation atmosphérique par kilomètre |
| Sensibilité | dBm | Seuil de fonctionnement spécifié |
| Marge | dB | Réserve par rapport au seuil |

Une densité en W/m² n’est pas une puissance en W. Pour obtenir une puissance reçue, il faut la multiplier par une surface effective et tenir compte des conditions d’adaptation et de polarisation.

## TD2 Q1 à Q5 : du watt au dBµV, sans saut {#radio-densite}

Une source isotrope répartit sa puissance sur une sphère de rayon d. La surface de cette sphère est 4πd². Dans l’axe d’une antenne de gain linéaire g, on multiplie par g.

$$S=\frac{P_e g_e}{4\pi d^2}\qquad P_r=S S_e\qquad U_{\mathrm{eff}}=\sqrt{P_r R}$$

Ces expressions supposent notamment une propagation libre en champ lointain et les conditions de réception compatibles. d est en m, Pe en W, Se en m², R en Ω. Le gain ge est **linéaire**, pas directement en dBi.

**Les données du TD :** Pe = 50 W ; d = 5 km ; Ge = 3 dBi ; Se = 0,5 m² ; R = 75 Ω.

1. Convertir d : **5000 m**. Calculer d² = 25 000 000 m².
2. Isotrope : Siso = 50/(4π × 25 000 000) = **1,59155 × 10⁻⁷ W/m²**.
3. Gain : ge = 10^(3/10) = **1,9953**, presque 2.
4. Dans l’axe : S = 1,59155 × 10⁻⁷ × 1,9953 = **3,17556 × 10⁻⁷ W/m²**.
5. Réception : Pr = S × 0,5 = **1,58778 × 10⁻⁷ W = 158,778 nW**.
6. Tension : Ueff = √(1,58778 × 10⁻⁷ × 75) = **3,451 mV = 3451 µV**.
7. Niveau : 20 log₁₀(3451) = **70,76 dBµV**.

Ce chemin montre pourquoi on utilise 10 log pour convertir le gain de puissance, puis 20 log pour le niveau de tension. Mélanger les deux coefficients change le résultat. [Q3](#td/2/Q3), [Q4](#td/2/Q4), [Q5](#td/2/Q5).

## Perte libre et formule de Friis {#radio-bilan}

En espace libre, la puissance se disperse avec la distance. La perte libre compare les puissances entre antennes isotropes ; on ajoute ensuite les gains réels d’émission et de réception.

$$L_{\mathrm{libre}}=20\log_{10}(4\pi d/\lambda)$$

$$L_{\mathrm{libre,dB}}\simeq32{,}45+20\log_{10}(d_{\mathrm{km}})+20\log_{10}(f_{\mathrm{MHz}})$$

La constante 32,45 dépend des unités **km et MHz**. Avec d en m et f en Hz, il faut une autre constante ou utiliser la première écriture cohérente. Le logarithme porte sur un rapport sans dimension.

$$P_{r,\mathrm{dBm}}=P_{e,\mathrm{dBm}}-L_e+G_e-L_{\mathrm{libre}}-L_{\mathrm{extra}}+G_r-L_r$$

Le et Lr sont les pertes de câbles et composants aux extrémités ; Lextra peut représenter la pluie, les obstacles ou d’autres pertes du modèle. **Ne pas soustraire deux fois** une perte de câble déjà incluse dans une PIRE donnée.

**Exemple fictif à 2,4 GHz sur 2 km.** Pe = 20 dBm ; câbles 1 dB de chaque côté ; gains 6 dBi de chaque côté. Llibre = 32,45 + 20 log₁₀(2) + 20 log₁₀(2400) = **106,08 dB**. Pr = 20 − 1 + 6 − 106,08 + 6 − 1 = **−76,08 dBm**.

Si la sensibilité vaut −80 dBm, M = −76,08 − (−80) = **3,92 dB**. Ajouter 5 dB de pertes rend la marge négative : −1,08 dB. Le modèle indique que le seuil demandé n’est plus assuré ; il ne prédit pas le comportement exact d’une liaison variable.

## TD2 Q6 à Q10 : deux paraboles et la météo {#radio-paraboles}

Les deux paraboles du TD ont D = 1 m et η = 0,3, séparées de 30 km. Il faut recalculer **à la fois la perte libre et le gain** quand la fréquence change.

À 10 GHz : λ = 0,03 m ; g = 0,3(π/0,03)² ; G ≈ **35,17 dBi**. Llibre ≈ **141,99 dB**. La perte nette du trajet, avant météo et autres pertes, vaut Llibre − Ge − Gr ≈ **71,65 dB**.

À 20 GHz : λ = 0,015 m ; chaque parabole gagne environ 6,02 dB, donc G ≈ **41,19 dBi**. Llibre augmente aussi de 6,02 dB, vers **148,01 dB**. La perte nette descend vers **65,63 dB**.

Pourquoi ? Deux gains augmentent, une seule perte libre augmente. À **diamètres constants**, le gain total augmente davantage. À **gains constants**, doubler la fréquence augmenterait au contraire la perte nette. Il faut annoncer ce qui est maintenu constant.

L’atmosphère ajoute des pertes : absorption par les gaz et atténuation par la pluie. Pour une valeur α lue en dB/km :

$$L_{\mathrm{atm}}=(\alpha_{O_2}+\alpha_{H_2O})d\qquad L_{\mathrm{pluie}}=\alpha_{\mathrm{pluie}}d_{\mathrm{pluie}}$$

La distance doit correspondre à la portion affectée. **Exemple fictif :** 0,05 dB/km sur 30 km donne 1,5 dB ; une pluie de 1 dB/km sur 5 km ajoute 5 dB, pas 30 dB. Dans Q9, l’orage occupe expressément toute la liaison.

Pour lire le graphique : repérer la fréquence sur l’axe horizontal, la bonne courbe et l’échelle verticale, puis interpoler prudemment. Sur une échelle logarithmique, le milieu géométrique de 0,1 et 1 vaut environ 0,316, pas 0,55. Écrire la valeur approximative lue et conserver cette incertitude jusqu’à la conclusion.

Avec Pe = 20 W, Pe = **43,01 dBm**. Avant météo, Pr vaut environ **−28,64 dBm à 10 GHz** et **−22,62 dBm à 20 GHz**. Comparer ensuite Pr corrigé des pertes à −105 dBm ; la conclusion avec orage dépend des valeurs réellement lues dans la figure. [Q7](#td/2/Q7), [Q8](#td/2/Q8), [Q9](#td/2/Q9), [Q10](#td/2/Q10).

## TD2 Q11 à Q15 : la fiche Yagi {#radio-yagi}

Une fiche d’antenne fournit plusieurs contraintes indépendantes : bande de fréquence, gain, polarisation, impédance et ROS. Le diagramme complète la fiche en montrant comment le gain varie selon la direction.

L’ordre utile des calculs est : choisir une fréquence dans 902–928 MHz ; convertir le gain maximal de dBi en rapport ; normaliser le diagramme ; lire les pertes relatives selon l’azimut ; puis calculer PIRE ou surface effective avec les unités adaptées.

**Exemple de surface à 915 MHz et 14 dBi :** λ = 3 × 10⁸/(915 × 10⁶) ≈ **0,32787 m** ; g = 10¹·⁴ ≈ **25,1189** ; Se = gλ²/(4π) ≈ **0,2149 m²**. Le gain maximal 12–14 dBi constitue une plage ; retenir 14 dBi est une hypothèse explicitement annoncée dans cette question.

Le chapitre antennes développe la largeur à −3 dB, la PIRE et le rapport avant/arrière. Une lecture approximative du diagramme ne justifie pas des gains angulaires donnés avec plusieurs décimales. [Surface effective Q15](#td/2/Q15).

## TD2 Q16 à Q21 : dimensionner la parabole satellite {#radio-satellite}

Le **transpondeur** du satellite reçoit et retransmet le signal. Le **LNB**, Low Noise Block, est la tête de réception qui amplifie avec peu de bruit et convertit la fréquence. On dimensionne ici le gain de la parabole avant le LNB, selon le modèle du TD.

Les données sont : PIRE = 53 dBW, gain d’émission = 33 dBi, f = 12 GHz, d = 36 000 km, sensibilité = −120 dBm, marge demandée = 30 dB et rendement de réception η = 0,5.

1. Puissance d’émission : Pe = 53 − 33 = **20 dBW**, soit **100 W**, si les pertes amont sont déjà prises en compte dans cette PIRE.
2. Longueur d’onde : λ = 3 × 10⁸/(12 × 10⁹) = **0,025 m**.
3. Perte libre : 32,45 + 20 log₁₀(36 000) + 20 log₁₀(12 000) = **205,16 dB** environ.
4. Niveau visé : −120 + 30 = **−90 dBm**, soit **−120 dBW**.
5. Gain nécessaire : Pr = PIRE − Llibre + Gr, donc Gr = −120 − 53 + 205,16 = **32,16 dBi**.
6. Rapport linéaire : gr = 10^(32,16/10) ≈ **1644**.
7. Diamètre : isoler D dans gr = η(πD/λ)² donne D = (λ/π)√(gr/η), soit environ **0,456 m**.

Ce diamètre est un minimum du modèle. Les pertes supplémentaires et le choix d’une taille commerciale conduisent à revoir le dimensionnement ; la marge ne doit pas être comptée une deuxième fois si elle est déjà dans le niveau visé. La distance 36 000 km est imposée par l’exercice ; la distance réelle dépend de la géométrie satellite–station.

Le délai dépend de la longueur parcourue, pas du gain. Pour deux branches de 36 000 km, un sens comporte 72 000 km : 72 000/300 000 = **0,24 s**. L’aller-retour de ce trajet vaut environ **0,48 s**, avant les autres délais. [Q16](#td/2/Q16) jusqu’à [Q21](#td/2/Q21).

## Fresnel, obstacles et compte rendu radio {#radio-fresnel}

Voir l’antenne distante ne suffit pas : des obstacles proches de l’axe peuvent perturber la propagation. La première zone de **Fresnel** est un volume autour du trajet direct, défini par une différence de longueur de trajet. Son rayon dépend de la position sur la liaison.

$$r_1=\sqrt{\lambda\frac{d_1d_2}{d_1+d_2}}$$

Toutes les longueurs sont en m. Au milieu d’une liaison de longueur d, d1 = d2 = d/2, donc r1 = √(λd/4). **Exemple :** 10 km à 5 GHz ; λ = 0,06 m ; r1 = √(0,06 × 10 000/4) = **12,25 m**. Un critère d’exercice de dégagement de 60 % donne **7,35 m** ; le pourcentage demandé n’est pas un gain en dB.

Pour chaque problème radio, noter fréquence, distance, unités, gains retenus, pertes incluses, hypothèses météo et sensibilité. Dessiner la chaîne puis vérifier que chaque gain et perte n’apparaît qu’une fois. Conclure en marge, pas seulement avec un nombre de puissance.
