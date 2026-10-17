<div class="lesson-intro"><strong>Objectif TP4 et TD2.</strong> Relier la taille d’une antenne à la fréquence, comprendre son gain, lire un diagramme et distinguer adaptation, puissance acceptée et puissance rayonnée. Les exemples numériques sont fictifs sauf les données explicitement reprises du sujet.</div>

## Ce qu’une antenne fait réellement {#antenne-vocabulaire}

Une antenne convertit une onde guidée dans une ligne en onde rayonnée dans l’espace, et réciproquement en réception. Une antenne passive ne fabrique pas d’énergie. Elle répartit le rayonnement différemment selon les directions, et une partie de l’énergie peut se dissiper.

| Terme | Signification |
|---|---|
| Isotrope | Antenne idéale rayonnant également dans toutes les directions de l’espace ; référence du dBi |
| Omnidirectionnel | À peu près uniforme dans un plan ; pas forcément dans l’espace entier |
| Directivité | Concentration du rayonnement dans une direction par rapport à sa moyenne spatiale |
| Gain | Directivité tenant compte du rendement de rayonnement selon la convention utilisée |
| Polarisation | Orientation et évolution du champ électrique ; une mauvaise correspondance réduit la réception |
| Azimut / élévation | Angle dans le plan horizontal / angle au-dessus de l’horizon |
| Lobe principal | Zone angulaire contenant le maximum étudié |
| Lobes secondaires | Autres directions de rayonnement |
| Bande de fonctionnement | Fréquences pour lesquelles les performances spécifiées sont satisfaites |
| Impédance | Rapport tension/courant complexe à une fréquence donnée ; peut inclure résistance et réactance |

Un diagramme en un seul plan ne donne pas toute la forme 3D du rayonnement. Un dipôle peut paraître omnidirectionnel dans un plan et très directif dans un autre. La position horizontale ou verticale demandée dans le TP choisit donc aussi le plan de mesure et la polarisation.

## Dipôle, Yagi, parabole et patch {#antenne-familles}

Le **dipôle demi-onde** possède deux bras alimentés ; sa longueur totale nominale est λ/2, et chaque bras vaut λ/4. La résonance signifie que la composante réactive de l’impédance s’annule ou devient faible dans la condition étudiée. La longueur réelle dépend de l’épaisseur, des matériaux et de l’environnement : λ/2 est un point de départ.

Une **Yagi** associe un élément alimenté, des directeurs et un réflecteur parasites. Les courants induits et les phases façonnent un lobe principal plus concentré. Les éléments non raccordés au câble jouent quand même un rôle électromagnétique.

Une **parabole** utilise un réflecteur qui concentre le champ vers une source placée au foyer. Une **antenne patch** est un élément conducteur au-dessus d’un plan de masse, séparé par un substrat ; plusieurs patches peuvent former un réseau. Toutes les antennes patch ne sont pas des réseaux à plusieurs éléments.

**Calcul TP4 à 5 GHz :** f = 5 × 10⁹ Hz ; λ = 3 × 10⁸ / (5 × 10⁹) = **0,060 m = 6 cm**. Longueur totale nominale du dipôle : **3 cm**. Chaque bras : **1,5 cm**. La longueur d’onde, la longueur totale et la longueur d’un bras sont trois réponses différentes.

À 130 MHz, λ ≈ **2,31 m** et λ/2 ≈ **1,15 m**. Une antenne dimensionnée à une autre fréquence peut être désadaptée ; mesurer le ROS en fonction de la fréquence aide à trouver la zone d’accord.

## Gain linéaire, dBi et surface effective {#antenne-gain}

Un gain de 2,1 dBi ne signifie pas « multiplier la puissance par 2,1 ». Il faut convertir le niveau logarithmique en rapport linéaire.

$$g=10^{G_{\mathrm{dBi}}/10}\qquad S_e=\frac{g\lambda^2}{4\pi}$$

g est sans unité ; λ est en m ; Se est en m². La **surface effective** est le coefficient qui relie la densité de puissance reçue à la puissance disponible dans les conditions de polarisation et d’adaptation supposées. Elle ne correspond pas nécessairement à la surface physique visible de l’antenne.

**Exemple TP4, dipôle à 5 GHz :**

1. G = 2,1 dBi ; g = 10⁰·²¹ = **1,6218**.
2. λ = **0,06 m** ; λ² = **0,0036 m²**.
3. Se = 1,6218 × 0,0036 / (4π) = **0,0004646 m²**.
4. Convertir en cm² : 0,0004646 × 10 000 = **4,646 cm²**.

La bonne expression est **g × λ²**, et non **(g × λ)²**. Le gain n’est pas mis au carré. Dans une copie, écrire les étapes évite qu’une valeur finale correcte masque une formule incorrecte.

Pour une parabole de diamètre D et de rendement η :

$$g=\eta(\pi D/\lambda)^2\qquad G=10\log_{10}(g)$$

D et λ doivent être dans la même unité. η = 0,5 signifie 50 %, pas 50 dans la formule. À diamètre constant, doubler la fréquence divise λ par deux, multiplie g par quatre et augmente G d’environ **6,02 dB**.

## Lire un diagramme : niveau absolu ou relatif ? {#antenne-diagramme}

Le banc peut mesurer une tension, une puissance ou un niveau logarithmique. Si tous les autres réglages sont conservés, la variation avec l’angle décrit la réponse directionnelle. Une mesure en dBm sur le récepteur ne donne pas directement un gain absolu en dBi : la source, la distance, les câbles et les amplificateurs interviennent.

Pour **normaliser**, retirer à chaque niveau le niveau maximal. Exemple : maximum −18 dBm ; niveau à 45° −26 dBm ; niveau relatif à 45° = −26 − (−18) = **−8 dB**. Si le gain maximal est connu et vaut 14 dBi, le gain à 45° dans les mêmes conditions est 14 − 8 = **6 dBi**.

La largeur à **−3 dB** correspond aux deux directions où la puissance tombe à la moitié du maximum du lobe. On cherche donc le maximum **moins 3 dB**, jamais forcément −3 dBm.

**Exemple fictif :** maximum −18 dBm ; seuil −21 dBm ; intersections à −15° et +15° ; ouverture = 15 − (−15) = **30°**. Pour un diagramme dont le lobe traverse 0°, tenir compte du bouclage 360° : 350° et 10° sont séparés de 20°, pas de 340°.

Si le logiciel affiche une tension en unité linéaire, la demi-puissance correspond à Umax/√2 ≈ **0,707 Umax**, et non Umax/2. En puissance linéaire, on utilise Pmax/2. Le pas angulaire de 1,25° ou 2,5° limite la précision ; des réflexions dans la salle peuvent modifier la trace.

Pour les diagrammes du TD, lire les graduations et annoncer une estimation. Les réponses de lecture ne doivent pas avoir une précision supérieure à celle de la figure. [TD2 Q11](#td/2/Q11), [gain selon l’azimut](#td/2/Q13), [rapport avant/arrière](#td/2/Q14).

## PIRE et rapport avant/arrière {#antenne-pire}

La **PIRE**, puissance isotrope rayonnée équivalente, est la puissance qu’une source isotrope devrait produire pour créer la même densité dans la direction étudiée. Elle peut dépasser la puissance électrique injectée dans une antenne directive, sans création d’énergie.

$$\mathrm{PIRE}_{\mathrm{dBm}}=P_{e,\mathrm{dBm}}-L_{\mathrm{cable,dB}}+G_{e,\mathrm{dBi}}$$

**Exemple TD2 :** Pe = 2 W = 2000 mW ; Pe = 10 log₁₀(2000) = **33,01 dBm**. Sans perte de câble et avec 14 dBi, PIRE = **47,01 dBm**. Retour en W : 10^((47,01 − 30)/10) ≈ **50,24 W**. Calcul linéaire équivalent : 2 × 10¹·⁴ ≈ 50,24 W.

Le rapport avant/arrière compare deux directions : ΔG = Gavant − Garrière, puis Pavant/Parrière = 10^(ΔG/10). Un écart de 20 dB donne **100**, et non 20 ou 200. [TD2 Q12](#td/2/Q12) et [Q14](#td/2/Q14).

## Onde incidente, réflexion, ROS et TOS {#antenne-ros}

L’**onde incidente** arrive vers la charge ; l’**onde réfléchie** repart dans la ligne lorsqu’elle est désadaptée. Leur superposition crée des maxima et minima le long de la ligne : les ondes stationnaires. La ligne possède une impédance caractéristique Z0 ; la charge une impédance ZL.

$$\Gamma=\frac{Z_L-Z_0}{Z_L+Z_0}\qquad \rho=|\Gamma|\qquad \mathrm{ROS}=\frac{1+\rho}{1-\rho}$$

Γ peut être complexe ; ρ est son module. Le **ROS**, ou VSWR, est le rapport des amplitudes maximale et minimale : sa valeur minimale est 1. Certains supports emploient « TOS » pour 100ρ en pourcentage, d’autres pour le ROS : toujours préciser la définition retenue.

$$\rho=U_r/U_i\qquad P_r/P_i=\rho^2\qquad P_i=U_i^2/Z_0$$

Les tensions sont mesurées avec la même convention et aux ports de mesure étalonnés pour les ondes incidentes et réfléchies. Un banc avec coupleurs demande de tenir compte de leurs facteurs de couplage et gains ; une tension brute sur deux voies différentes ne suffit pas toujours.

**Exemple fictif :** Ui = 1 V efficace et Ur = 0,2 V, sur 50 Ω.

1. ρ = 0,2/1 = **0,2**.
2. ROS = 1,2/0,8 = **1,5**.
3. Pi = 1²/50 = **20 mW** ; Pr = 0,2²/50 = **0,8 mW**.
4. Fraction réfléchie = 0,2² = **4 %** ; puissance acceptée = **19,2 mW**.

Le rapport d’amplitudes de 20 % n’est pas la fraction de puissance réfléchie. Un ROS = 1 signifie absence de réflexion dans le modèle, mais ne prouve pas que la charge rayonne bien.

## TP4 : comparer les charges et conclure correctement {#antenne-tp4}

| Charge sur une ligne de 50 Ω | Réflexion et puissance dans le modèle idéal |
|---|---|
| Résistance 50 Ω | Γ = 0, ROS = 1 ; la puissance acceptée est dissipée en chaleur |
| Circuit ouvert | Γ = +1 ; réflexion totale, ROS tend vers l’infini |
| Court-circuit | Γ = −1 ; réflexion totale aussi, mais phase différente |
| Résistance 93 Ω | ρ = 43/143 ≈ 0,3007 ; ROS = 93/50 = 1,86 |

Pour la charge de 93 Ω, la fraction réfléchie est (43/143)² ≈ **9,04 %**. La fraction acceptée est **90,96 %** ; pour une résistance idéale, elle est dissipée, pas rayonnée. La phase distingue l’ouvert et le court-circuit même si leur puissance réfléchie est identique.

Pour le compte rendu du TP4 : préciser fréquence, antenne, polarisation, plan de rotation, grandeur mesurée et pas angulaire ; repérer maximum, intersections à −3 dB et largeur ; comparer les lobes et les niveaux relatifs ; puis, pour l’accord, noter Ui, Ur, conventions et facteurs du banc avant de calculer ρ, ROS et puissances.

Une courbe ROS(f) possède souvent un minimum près d’une zone d’accord. Pour définir une bande, annoncer le critère, par exemple ROS ≤ 2 si le sujet le demande, puis lire les deux fréquences limites. Sans courbe mesurée, donner la méthode et un exemple explicitement fictif, pas une bande attribuée au matériel.

**À toi :** si ρ = 1/3, ROS = 2 et la puissance réfléchie vaut 1/9 ≈ 11,1 %. Vérifie ces résultats avant de poursuivre vers le bilan radio.
