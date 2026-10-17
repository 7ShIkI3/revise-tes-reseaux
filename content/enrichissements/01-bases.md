<div class="lesson-intro"><strong>Pars de zéro.</strong> Ce chapitre explique les mots et les outils de calcul que les TD supposent connus. Commence ici avant la fibre, les antennes ou le mobile. Les exemples qui suivent sont des données d’entraînement.</div>

## Ce que transporte un réseau {#base-signal}

Un réseau fait voyager une information : une voix, une image ou un fichier. Il transforme cette information en **signal**, une grandeur physique qui varie avec le temps. Dans un câble électrique, ce sont des tensions et courants ; dans une fibre, de la lumière ; dans une liaison radio, un champ électromagnétique.

Un **bit** est une information binaire, 0 ou 1. Un **octet** contient 8 bits. Le signal physique doit permettre de distinguer les valeurs malgré les pertes et le bruit. Il ne faut donc pas confondre le message (les bits) avec la puissance du support qui le transporte.

<div class="course-flow" role="img" aria-label="Les informations sont codées, transportées par un signal puis décodées"><span>Information<br><small>voix, fichier</small></span><b>→</b><span>Codage<br><small>bits et symboles</small></span><b>→</b><span>Signal<br><small>fibre, câble, radio</small></span><b>→</b><span>Décodage<br><small>information reçue</small></span></div>

| Mot | Définition simple | Question à se poser |
|---|---|---|
| Émetteur | Équipement qui produit le signal | Avec quelle puissance et quelle fréquence ? |
| Récepteur | Équipement qui détecte le signal | Est-il assez fort et assez propre ? |
| Puissance P | Énergie transmise par seconde, en W | Quelle quantité arrive au récepteur ? |
| Fréquence f | Nombre d’oscillations par seconde, en Hz | À quelle vitesse l’onde oscille-t-elle ? |
| Débit D | Quantité de bits transportés par seconde, en bit/s | Combien d’information passe ? |
| Bande passante B | Intervalle de fréquences utilisable, en Hz | Quelle largeur de spectre peut-on occuper ? |
| Bruit | Perturbation qui s’ajoute au signal | Peut-on encore distinguer les symboles ? |
| Atténuation A | Réduction de puissance le long d’un trajet | Quelle fraction de la puissance reste ? |

Un débit de 100 Mbit/s n’est ni une fréquence de 100 MHz, ni une puissance de 100 mW. Ces grandeurs décrivent des aspects différents. Un signal faible peut fonctionner à faible débit ; un signal fort peut rester inutilisable si les interférences sont trop grandes.

## Préfixes, conversions et notation scientifique {#base-unites}

Un préfixe est un multiplicateur appliqué à une unité. La lettre majuscule compte : **M** signifie méga, **m** signifie milli. Sur une calculatrice, « 3e8 » signifie 3 × 10⁸ ; « e » n’est pas une unité.

| Préfixe | Symbole | Multiplicateur | Exemple |
|---|---|---|---|
| giga | G | 10⁹ | 2,4 GHz = 2,4 × 10⁹ Hz |
| méga | M | 10⁶ | 100 Mbit/s = 100 × 10⁶ bit/s |
| kilo | k | 10³ | 5 km = 5 × 10³ m |
| milli | m | 10⁻³ | 2 mW = 2 × 10⁻³ W |
| micro | µ | 10⁻⁶ | 125 µs = 125 × 10⁻⁶ s |
| nano | n | 10⁻⁹ | 10 ns = 10 × 10⁻⁹ s |

**Exemple guidé : convertir 800 nW en µW.** 1 µW = 1000 nW. On cherche combien de groupes de 1000 nW contient 800 nW : 800 / 1000 = **0,8 µW**. Vérification : 0,8 × 10⁻⁶ W = 800 × 10⁻⁹ W.

**Autre exemple : 160 octets toutes les 20 ms.** 160 octets = 1280 bits. 20 ms = 0,020 s. Le débit utile vaut 1280 / 0,020 = **64 000 bit/s = 64 kbit/s**. Les en-têtes des protocoles s’ajouteront plus tard.

Une surface demande de convertir **deux dimensions** : 1 m = 100 cm, donc 1 m² = 100² cm² = **10 000 cm²**. C’est essentiel dans le TP antennes. De même, un volume se convertit avec le cube du facteur.

## Le logarithme sans mystère {#base-logarithme}

Le logarithme décimal répond à la question : « Quelle puissance de 10 donne ce nombre ? » Ainsi log₁₀(100) = 2 parce que 10² = 100 ; log₁₀(0,01) = −2 parce que 10⁻² = 0,01. La fonction inverse est **10 puissance x**, souvent indiquée 10ˣ sur la calculatrice.

Les dB servent à convertir les **multiplications** de rapports en **additions**. Si deux éléments transmettent chacun un dixième de la puissance, ils transmettent ensemble 1/10 × 1/10 = 1/100. Cela correspond à 10 dB + 10 dB = 20 dB de perte.

Pour une perte positive, on place la puissance d’entrée au numérateur. Si Pe > Ps, le rapport est supérieur à 1 et son logarithme est positif.

$$A_{\mathrm{dB}}=10\log_{10}(P_e/P_s)\qquad P_s/P_e=10^{-A/10}$$

Pe et Ps doivent être dans **la même unité**. Le rapport est alors sans unité. Les deux écritures répondent à deux questions différentes : la première calcule la perte à partir des puissances ; la seconde calcule la fraction restante à partir de la perte.

| Perte | Fraction restante | Lecture intuitive |
|---|---|---|
| 0 dB | 1 | Pas de perte |
| 3,01 dB | 0,5 | La moitié reste |
| 6,02 dB | 0,25 | Un quart reste |
| 10 dB | 0,1 | Un dixième reste |
| 20 dB | 0,01 | Un centième reste |

**À ne pas faire :** 3 dB + 3 dB ne laisse pas 0 % ; cela laisse environ 25 %. Une perte n’est pas un pourcentage à additionner.

## dB, dBm, dBW et dBi : quatre rôles différents {#base-decibels}

| Écriture | Ce qu’elle désigne | Référence |
|---|---|---|
| dB | Rapport, gain ou perte | Deux valeurs comparées |
| dBm | Puissance absolue | 1 mW |
| dBW | Puissance absolue | 1 W |
| dBi | Gain d’antenne dans une direction | Antenne isotrope idéale |

$$P_{\mathrm{dBm}}=10\log_{10}(P_{\mathrm{mW}})\qquad P_{\mathrm{mW}}=10^{P_{\mathrm{dBm}}/10}$$

**Exemple TP1 : −7 dBm en mW.** On cherche une puissance, donc on utilise la seconde formule. On calcule −7/10 = −0,7, puis 10⁻⁰·⁷ = **0,1995 mW**, soit 199,5 µW. Le signe moins signifie « inférieur à 1 mW », pas « puissance négative ».

**Exemple TD satellite : convertir 53 dBW.** 1 W vaut 1000 mW, soit un décalage de 10 log₁₀(1000) = 30 dB. Donc **dBm = dBW + 30**, et 53 dBW = 83 dBm. Pour passer de dBm à dBW, on retire 30.

Un bilan s’écrit Pe en dBm **moins** les pertes en dB **plus** les gains en dB. On ne multiplie jamais un niveau dBm par un gain dBi. Le gain d’une antenne passive vient de la concentration du rayonnement dans certaines directions, pas d’une création d’énergie.

Deux sources indépendantes à −10 dBm fournissent chacune 0,1 mW. Ensemble : 0,2 mW ; 10 log₁₀(0,2) = **−6,99 dBm**. Additionner directement −10 et −10 serait faux. Cette addition de puissances concerne des signaux dont les puissances s’additionnent ; des ondes cohérentes nécessitent aussi de considérer leur phase.

## Tension efficace et dBµV : le pont vers le TD radio {#base-tension}

La **résistance R**, en ohms Ω, relie tension et courant. Une tension alternative change de signe : sa moyenne peut être nulle alors qu’elle chauffe une résistance. On utilise donc la **valeur efficace** Ueff, qui produirait le même chauffage qu’une tension continue.

$$P=U_{\mathrm{eff}}^2/R\qquad U_{\mathrm{eff}}=\sqrt{PR}$$

P est en W, Ueff en V et R en Ω. Pour une sinusoïde : Ucrête = √2 Ueff et Ucrête-à-crête = 2√2 Ueff. Il faut identifier ce qu’affiche l’oscilloscope avant de calculer une puissance.

Le **dBµV** est un niveau de tension référencé à 1 µV. Il utilise 20 log, car la puissance est proportionnelle au carré de la tension lorsque la résistance ne change pas.

$$L_{\mathrm{dB\mu V}}=20\log_{10}\left(U_{\mathrm{eff}}/(1\,\mu\mathrm{V})\right)$$

**Exemple TD2 : P = 158,78 nW sur 75 Ω.**

1. Convertir : P = 158,78 × 10⁻⁹ W.
2. Calculer Ueff = √(158,78 × 10⁻⁹ × 75) = **0,003451 V**.
3. Passer en µV : 0,003451 × 10⁶ = **3451 µV**.
4. Appliquer 20 log₁₀(3451) = **70,76 dBµV**.

Ne pas placer 0,003451 directement dans un logarithme qui attend une valeur en µV. La conversion rapide, pour une résistance connue, est :

$$L_{\mathrm{dB\mu V}}=P_{\mathrm{dBm}}+90+10\log_{10}(R/1\,\Omega)$$

Elle donne un décalage de 108,75 dB sur 75 Ω, et de 106,99 dB sur 50 Ω. Ces deux références ne sont pas interchangeables.

## Fréquence, période, onde et vitesse {#base-ondes}

Une oscillation est un motif qui se répète. Sa **période T** est la durée d’un motif ; sa **fréquence f** est le nombre de motifs par seconde. Une fréquence de 100 MHz signifie 100 millions d’oscillations chaque seconde.

$$T=1/f\qquad \lambda=v/f\qquad v=c/n$$

T est en s, λ en m, v en m/s et n est un indice sans unité. Dans l’air, on prend v ≈ c = 3 × 10⁸ m/s. Dans le verre, n > 1 donc la vitesse est plus faible. La fréquence ne change pas en traversant une interface ; la longueur d’onde s’adapte à la nouvelle vitesse.

**Exemple TD2 Q1 : 100 MHz.** Convertir f = 100 × 10⁶ = 10⁸ Hz ; λ = 3 × 10⁸ / 10⁸ = **3 m**. Les puissances de 10 se simplifient. À 1 GHz, la longueur d’onde vaut 0,30 m ; à 10 GHz, elle vaut 0,030 m.

**Propagation ou transmission ?** Une fibre de 2 km parcourue à 2 × 10⁸ m/s introduit un délai de 10 µs. Envoyer 1000 bits à 1 Mbit/s prend 1 ms. Le premier délai dépend de la longueur et de la vitesse ; le second de la taille du message et du débit.

## Choisir et isoler une formule {#base-methode}

Pour calculer sans apprendre tous les corrigés par cœur, écris toujours : **données → inconnue → formule → unités → remplacement → résultat → interprétation**.

Si λ = c/f et que l’on cherche f, multiplier les deux côtés par f donne λf = c, puis diviser par λ donne f = c/λ. Si P = U²/R et que l’on cherche U, multiplier par R donne PR = U², puis prendre la racine donne U = √(PR).

La cohérence des unités sert de contrôle : (m/s)/Hz = (m/s)/(1/s) = m. Si tu trouves des mètres carrés pour une longueur d’onde, reviens à la formule avant de poursuivre. Arrondis le résultat final, pas chaque étape intermédiaire.

**Entraînement flash.** Une source de −2 dBm traverse une perte de 8 dB. Trouve la réception en dBm puis en mW. Réponse expliquée : Pr = −2 − 8 = **−10 dBm** ; 10⁻¹ = **0,1 mW**. Vérifie que la puissance finale est plus petite que la puissance initiale.

**Application directe :** [TD1, puissances et référence](#td/1/2.2), [TD2, tension en dBµV](#td/2/Q5), [TD3, bits et débit](#td/3/Q2). Les sections suivantes reprennent les notions physiques du cours avec leurs schémas et formules de référence.
