<div class="lesson-intro"><strong>Objectif TP1 et TD1.</strong> Savoir expliquer le guidage, calculer une perte, poser une référence au photomètre et lire une trace OTDR. Commence par les unités et les dB du chapitre 1 si les conversions sont encore difficiles.</div>

## Les mots du montage optique {#fibre-vocabulaire}

Une fibre n’est pas un tube vide : c’est un guide transparent, généralement en silice. Son **cœur** et sa **gaine optique** possèdent des indices légèrement différents. Une protection mécanique entoure cet ensemble. L’indice n décrit la vitesse de propagation : n = c/v.

| Terme | Rôle dans le TP |
|---|---|
| Jarretière | Petit cordon optique muni de connecteurs ; elle relie deux appareils ou raccords |
| Adaptateur | Pièce qui aligne deux connecteurs ; il ne produit pas de lumière |
| SC | Famille mécanique de connecteur ; ne décrit pas son polissage |
| PC / UPC | Polissage à contact physique ; à utiliser avec une interface compatible |
| APC | Polissage incliné qui réduit la réflexion vers l’émetteur ; généralement vert |
| Épissure | Raccord permanent entre deux fibres, souvent réalisé par fusion |
| Photomètre | Mesure la puissance optique qui arrive, en dBm ou en unité linéaire |
| Source | Produit la lumière à une longueur d’onde choisie |
| Atténuateur | Introduit volontairement une perte connue |
| Splitter | Partage la puissance entre plusieurs trajets |
| OTDR | Réflectomètre : mesure le retour d’une impulsion pour localiser des événements |

Les couleurs aident à reconnaître le polissage mais ne remplacent pas la documentation de l’interface. Deux connecteurs « SC » ne sont pas forcément compatibles s’ils ont des polissages différents. La source et le photomètre du sujet se reconnaissent sur le matériel ; une image peu lisible ne justifie pas d’inventer leur référence.

## Guidage, réflexion et dispersion expliqués {#fibre-guidage}

À l’interface cœur–gaine, le rayon change de direction : c’est la **réfraction**. Si la lumière se trouve dans le milieu d’indice le plus élevé et rencontre l’interface sous un angle assez grand, elle peut être totalement réfléchie. Les angles de la loi de Snell sont mesurés par rapport à la **normale**, une droite perpendiculaire à l’interface, pas par rapport à l’axe de la fibre.

$$n_1\sin i=n_2\sin r\qquad i_c=\arcsin(n_2/n_1)$$

La seconde formule suppose n1 > n2. Pour n1 = 1,48 et n2 = 1,46, calculer le rapport 1,46/1,48 puis l’arcsinus en degrés donne environ **80,6°**. Il ne s’agit pas directement de l’angle d’entrée admissible dans la fibre.

Un **mode** est une forme de propagation possible du champ. En multimode, plusieurs modes arrivent avec des retards différents : l’impulsion s’élargit. En monomode, cette dispersion entre modes disparaît, mais pas toutes les dispersions. La **dispersion chromatique** vient notamment du fait que différentes longueurs d’onde n’ont pas exactement le même temps de propagation.

**Atténuation** = moins de puissance ; **dispersion** = impulsion plus étalée. Une chaîne peut échouer par manque de puissance ou parce que les impulsions voisines se recouvrent. Les deux diagnostics ne sont pas équivalents.

## Calculer une perte et un budget sans se tromper de signe {#fibre-budget}

Le coefficient α représente une perte **par unité de longueur**. Si α = 0,35 dB/km, chaque kilomètre ajoute 0,35 dB. Le budget ajoute les pertes réparties dans la fibre et les pertes localisées des composants.

$$A_{\mathrm{total}}=\alpha L+N_c A_c+N_e A_e+A_{\mathrm{splitter}}\qquad P_r=P_e-A_{\mathrm{total}}$$

| Symbole | Sens | Unité |
|---|---|---|
| α | Atténuation linéique à la longueur d’onde utilisée | dB/km |
| L | Longueur du trajet | km |
| Nc, Ne | Nombre de connexions et d’épissures comptées dans le trajet | Sans unité |
| Ac, Ae | Perte par connexion / épissure | dB |
| Pe, Pr | Puissances d’émission et de réception | dBm |

**Exemple complet fictif.** Pe = +2 dBm ; 8 km de fibre à 0,35 dB/km ; 4 connexions à 0,25 dB ; 2 épissures à 0,10 dB ; splitter 1×8 idéal.

1. Fibre : 8 × 0,35 = **2,8 dB**.
2. Connexions : 4 × 0,25 = **1 dB**.
3. Épissures : 2 × 0,10 = **0,2 dB**.
4. Splitter : 10 log₁₀(8) = **9,03 dB**.
5. Total : 2,8 + 1 + 0,2 + 9,03 = **13,03 dB**.
6. Réception : +2 − 13,03 = **−11,03 dBm**.

Si la sensibilité vaut −28 dBm, la marge au seuil faible est −11,03 − (−28) = **16,97 dB**. Il faut également vérifier le seuil maximal du récepteur : une réception trop forte peut être hors de sa fenêtre. Les seuils sont ceux du module réellement employé.

## Splitters et atténuateurs : refaire les questions 2.3 à 2.6 {#fibre-splitters}

Une perte de 1 dB ne divise pas par 1 ni par 10. Le rapport entrée/sortie vaut 10^(1/10) = **1,259** ; la fraction transmise vaut son inverse, **0,794**, soit 79,4 %. Les deux rapports sont corrects mais ne répondent pas à la même question.

Pour un splitter égalitaire idéal 1×N, chaque sortie reçoit 1/N de la puissance. La perte de partage est 10 log₁₀(N). Un 1×8 laisse 12,5 % sur une branche et introduit 9,03 dB. Un 1×32 laisse 3,125 % et introduit 15,05 dB.

**Exemple avec Pe = −7 dBm.** La sortie idéale du 1×8 vaut −7 − 9,03 = **−16,03 dBm**. En linéaire : 0,1995 mW / 8 = **0,02494 mW**. Les deux calculs donnent le même résultat. Une perte réelle plus grande peut inclure des connexions et les pertes excédentaires du composant.

Le partage ne signifie pas que chaque sortie perd 87,5 % dans une destruction d’énergie : une grande partie va aux autres branches. Pour un composant passif réciproque, la transmission entre une branche précise et le port commun est la même dans les deux sens. Inverser source et photomètre ne supprime donc pas cette perte de branche.

**À refaire :** [TD1 2.3](#td/1/2.3), [2.4](#td/1/2.4), [2.5](#td/1/2.5) et [2.6](#td/1/2.6). Dans un relevé, préciser « théorique » ou « mesuré » et les raccords inclus.

## Mesure par insertion : à quoi sert la référence ? {#fibre-reference}

On compare deux montages pour isoler la perte de l’élément ajouté. Le montage sans cet élément fournit **P0**, une puissance de référence. Le montage avec l’élément fournit **P1**.

<div class="course-flow" role="img" aria-label="Comparer une mesure de référence et une mesure avec composant"><span>Source 1310 nm</span><b>→</b><span>Jarretières<br><small>référence P0</small></span><b>→</b><span>Photomètre</span></div>
<div class="course-flow" role="img" aria-label="Ajouter le composant entre les jarretières et lire P1"><span>Même source</span><b>→</b><span>Composant ajouté<br><small>nouvelle mesure P1</small></span><b>→</b><span>Même photomètre</span></div>

$$A_{\mathrm{ajoutee}}=P_{0,\mathrm{dBm}}-P_{1,\mathrm{dBm}}$$

**Exemple :** P0 = −7,55 dBm et P1 = −8,60 dBm. A = −7,55 − (−8,60) = **1,05 dB**. Un appareil affichant une variation P1 − P0 montrera −1,05 dB ; la perte positive est 1,05 dB. Référence à 0 dB ne signifie pas 0 dBm : cela signifie « même puissance que la référence ».

Une comparaison fiable garde la même longueur d’onde, le même mode de source et les raccords appropriés. Sinon, on modifie plusieurs causes à la fois.

**Ton cas réel :** les valeurs −7 dBm annoncés, −7,55 dBm attendus et −55 dBm lus donnent respectivement une perte attendue de **0,55 dB** et une perte apparente de **48 dB**. L’écart à l’attendu est **47,45 dB**. Conserve la lecture observée, mais ne l’utilise pas comme preuve de la perte normale d’une jarretière ou d’un splitter. Elle ne suffit pas à déterminer la cause du dysfonctionnement. [Revoir la question 2.2](#td/1/2.2).

## OTDR : du temps à la distance {#fibre-otdr}

La lumière émise est partiellement renvoyée vers l’appareil par la rétrodiffusion et les réflexions. L’OTDR mesure un **temps aller-retour**. Il faut donc diviser la distance parcourue par deux.

$$v=c/n\qquad d=ct/(2n)\qquad \ell_{\mathrm{impulsion}}=v\tau$$

t est le délai de retour ; τ est la durée de l’impulsion émise. Ces deux temps n’ont pas le même rôle. Avec n = 1,4776 et c = 3 × 10⁸ m/s, v = **2,0303 × 10⁸ m/s**. Pour τ = 10 ns = 10⁻⁸ s, la longueur de l’impulsion est **2,0303 m**. L’échelle idéale de distance associée au retour vaut vτ/2 = **1,0152 m**. Ce n’est pas une garantie de résolution pratique ; les zones mortes et les réglages interviennent aussi.

**Exemple de localisation fictif.** Un retour arrive 32 µs après l’émission : d = 3 × 10⁸ × 32 × 10⁻⁶ / (2 × 1,4776) = **3248,5 m depuis l’OTDR**. Si l’amorce et le câblage amont totalisent 518 m, la distance depuis l’entrée de la liaison testée est 3248,5 − 518 = **2730,5 m**.

## Lire B, C et D : une procédure reproductible {#fibre-trace}

La trace place les événements sur un axe horizontal de distance ; l’axe vertical représente un niveau lié au retour optique. Une pente régulière correspond à une perte répartie. Une marche révèle une perte localisée. Un pic indique une réflexion. La forme seule ne prouve pas systématiquement une épissure, une courbure ou une rupture.

La **fibre amorce** éloigne le premier raccord de la zone morte causée par une forte réflexion près de l’appareil. Un OTDR convient surtout à des liaisons assez longues ; une jarretière de quelques mètres peut se confondre avec les événements d’entrée.

Pour les questions 3.3 à 3.6 :

1. Noter le réglage de longueur d’onde, l’indice, la durée d’impulsion et les unités des axes.
2. Repérer la fin de l’amorce, l’entrée de B ou C et sa fin.
3. Calculer la longueur testée : position de fin − position de début.
4. Repérer le défaut : position du défaut − position du connecteur de départ.
5. Mesurer la pente sur un segment sans événements : perte du segment / longueur du segment en km.
6. Mesurer la perte de l’événement par la méthode de l’appareil et comparer avec SmartLink. Un simple écart vertical lu à des points éloignés inclut aussi la pente de la fibre.

**Exemple fictif de pente :** une diminution corrigée de 0,70 dB sur 2 km donne α = 0,70/2 = **0,35 dB/km**. Une marche de 1 dB à un raccord est une perte localisée, pas un coefficient de 1 dB/km.

**Compte rendu sans matériel exploitable :** séparer les calculs théoriques, les lectures réellement obtenues et les relevés impossibles. Pour B, C et D, garder une grille avec longueur, position du défaut, perte, interprétation et incertitude, à compléter lorsque la trace existe. Aucune valeur fictive de ce cours ne remplace ces mesures. [Méthode B](#td/1/3.3), [SmartLink](#td/1/3.4), [C](#td/1/3.5), [D](#td/1/3.6).
