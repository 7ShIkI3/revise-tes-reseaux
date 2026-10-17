/*
 * Compléments pédagogiques : exemples fictifs, distincts des relevés de TP.
 * Vérification des conventions : RFC 3550/3551 ; UIT-T G.984.3 ;
 * UIT-R P.525/P.526 ; ETSI TS 123 401 ; guides OTDR Fluke et réflexion Keysight.
 * Les liens vers le cours sont des ancres déjà présentes dans data.json.
 */
window.REVISION_LEARNING = {
  modules: [
    {
      id: 'db-chaine-puissance',
      chapter: 1,
      title: 'Suivre une puissance dans une chaîne en dB',
      minutes: 9,
      level: 'Bases',
      intro: 'Les dBm donnent le niveau à un point ; les dB décrivent ce qui change entre deux points. Construis ton bilan comme un trajet pour ne plus hésiter sur les signes.',
      flow: ['Source en dBm', 'Gains ajoutés', 'Pertes retranchées', 'Réception en dBm', 'Vérification en mW'],
      sections: [
        {
          title: 'Un niveau et une variation',
          text: 'Le dBm compare une puissance à 1 mW : P(dBm) = 10 log₁₀(P en mW). Ainsi 0 dBm vaut 1 mW et −10 dBm vaut 0,1 mW. Le dB compare deux puissances. Une perte positive de 10 dB divise la puissance par dix ; elle se retranche du niveau en dBm. Une valeur négative en dBm reste une puissance positive.'
        },
        {
          title: 'Pourquoi les additions fonctionnent',
          text: 'En unités linéaires, les rapports se multiplient : un gain de 10 puis une transmission de 0,1 s’annulent. Le logarithme transforme ce produit en somme : +10 dB − 10 dB = 0 dB de variation. Écris chaque composant dans l’ordre du trajet et indique si sa valeur est une perte ou un gain avant de calculer.'
        },
        {
          title: 'Réunir deux sources demande une autre opération',
          text: 'Pour additionner des puissances indépendantes, repasse en mW, additionne, puis reconvertis. Deux contributions de −10 dBm valent 0,1 + 0,1 = 0,2 mW, soit environ −6,99 dBm. Les additionner directement donnerait −20 dBm, ce qui réduirait absurdement le total. Pour des ondes cohérentes, les phases doivent aussi être considérées.'
        }
      ],
      example: {
        title: 'Exemple fictif : un amplificateur et deux pertes',
        steps: [
          'Source : −4 dBm, soit 10^(−4/10) ≈ 0,398 mW.',
          'Amplificateur de 12 dB : −4 + 12 = +8 dBm.',
          'Câble de 3 dB, puis atténuateur de 5 dB : +8 − 3 − 5 = 0 dBm.',
          'Contrôle : la variation totale vaut +4 dB ; 0,398 × 10^(4/10) = 1 mW.'
        ],
        result: 'La réception vaut 0 dBm = 1 mW. Le niveau final dépasse le niveau de départ de 4 dB.'
      },
      pitfall: 'Ne pas additionner deux niveaux dBm pour réunir deux sources. Ne pas confondre 0 dBm, qui vaut 1 mW, et 0 dB, qui signifie un rapport égal à 1.',
      check: {
        question: 'Une source à +3 dBm traverse 13 dB de pertes. Que reçoit-on ?',
        answer: '+3 − 13 = −10 dBm, soit 10^(−10/10) = 0,1 mW = 100 µW.'
      },
      link: '#cours/1/base-decibels'
    },
    {
      id: 'conversions-tension-debit',
      chapter: 1,
      title: 'Convertir sans perdre les unités',
      minutes: 10,
      level: 'Application',
      intro: 'Une formule peut être juste et le résultat faux à cause d’un préfixe. Apprends une méthode commune aux puissances, tensions, durées, surfaces et débits.',
      flow: ['Identifier la grandeur', 'Convertir les préfixes', 'Appliquer la formule', 'Contrôler l’unité', 'Interpréter'],
      sections: [
        {
          title: 'Revenir aux unités attendues',
          text: 'Écris le préfixe sous forme de puissance de dix : µ = 10⁻⁶, n = 10⁻⁹, M = 10⁶. Pour P = Ueff²/R, il faut des watts, des volts et des ohms. Pour un débit, transforme les octets en bits et la durée en secondes. Vérifie aussi les exposants : 1 m² = 10 000 cm², car le facteur 100 s’applique aux deux dimensions.'
        },
        {
          title: 'Choisir 10 log ou 20 log',
          text: 'Une conversion de puissance utilise 10 log. Une conversion de tension utilise 20 log lorsque l’on compare des tensions sur la même résistance, car la puissance dépend du carré de la tension. Le niveau en dBµV est 20 log₁₀(Ueff/1 µV). La valeur entrée dans le logarithme est donc le nombre de microvolts, pas le nombre de volts.'
        },
        {
          title: 'Faire un contrôle physique',
          text: 'À résistance fixée, multiplier la puissance par quatre doit multiplier la tension efficace par deux. Pour une sinusoïde, la valeur de crête vaut √2 fois la valeur efficace ; lire une tension crête-à-crête comme une tension efficace fausse la puissance. Conserve les chiffres intermédiaires, puis arrondis le résultat final avec son unité.'
        }
      ],
      example: {
        title: 'Exemple fictif : 2 µW dans une résistance de 50 Ω',
        steps: [
          'Convertir la puissance : 2 µW = 2 × 10⁻⁶ W.',
          'Calculer Ueff = √(P × R) = √(2 × 10⁻⁶ × 50) = 0,010 V.',
          'Convertir la tension : 0,010 V = 10 mV = 10 000 µV.',
          'Calculer le niveau : 20 log₁₀(10 000) = 80 dBµV.',
          'Contrôle inverse : 0,010²/50 = 2 × 10⁻⁶ W.'
        ],
        result: '2 µW sur 50 Ω correspondent à 10 mV efficaces, soit 80 dBµV. La résistance fait partie des hypothèses.'
      },
      pitfall: 'Écrire 20 log₁₀(0,010) donnerait −40 dBV : ce n’est pas une valeur en dBµV. La référence choisie change le nombre.',
      check: {
        question: 'Quel débit utile représente un bloc de 200 octets envoyé toutes les 10 ms ?',
        answer: '200 × 8 = 1600 bits ; 10 ms = 0,010 s ; 1600/0,010 = 160 000 bit/s = 160 kbit/s, avant les en-têtes.'
      },
      link: '#cours/1/base-tension'
    },
    {
      id: 'fibre-budget-fenetre',
      chapter: 2,
      title: 'Construire un budget optique et ses deux marges',
      minutes: 12,
      level: 'Application',
      intro: 'Une liaison optique doit recevoir assez de lumière, mais aussi éviter la surcharge. Assemble les pertes, puis compare le niveau aux deux limites du récepteur.',
      flow: ['Puissance TX', 'Fibre et raccords', 'Partage optique', 'Puissance RX', 'Sensibilité et surcharge'],
      sections: [
        {
          title: 'Compter ce qui se trouve sur le trajet',
          text: 'La perte de fibre vaut α × L, avec α en dB/km et L en km. Ajoute ensuite les connexions, les épissures, l’atténuateur éventuel et la perte de la branche du splitter. Ne compte que les composants effectivement traversés. Les valeurs dépendent notamment de la longueur d’onde et du matériel ; une fiche technique ou un relevé réel prime sur un exemple pédagogique.'
        },
        {
          title: 'Comprendre le splitter',
          text: 'Pour un splitter égalitaire idéal 1×N, une branche reçoit 1/N de la puissance ; la perte de partage vaut 10 log₁₀(N). Un 1×16 donne environ 12,04 dB. Un composant réel ajoute des pertes excédentaires et peut présenter une dispersion entre sorties. Une grande partie de la puissance qui manque à une branche a été dirigée vers les autres branches.'
        },
        {
          title: 'Contrôler toute la fenêtre',
          text: 'Calcule Pr = Pe − Atotale. Si la fenêtre fictive est [−28 ; −8] dBm, la marge au seuil faible vaut Pr − (−28), et la marge avant surcharge vaut −8 − Pr. Les deux doivent être positives. Une grande marge au seuil faible peut cacher une réception trop forte. Les seuils réels doivent être ceux du récepteur et du sens de transmission étudiés.'
        }
      ],
      example: {
        title: 'Exemple fictif : 12 km et un splitter 1×16 idéal',
        steps: [
          'Fibre : 12 km × 0,35 dB/km = 4,20 dB.',
          'Raccords : 4 connexions × 0,30 + 6 épissures × 0,10 = 1,80 dB.',
          'Splitter idéal : 10 log₁₀(16) ≈ 12,04 dB ; total ≈ 18,04 dB.',
          'Avec Pe = +3 dBm : Pr = 3 − 18,04 = −15,04 dBm.',
          'Pour [−28 ; −8] dBm : marge faible ≈ 12,96 dB ; marge avant surcharge ≈ 7,04 dB.'
        ],
        result: 'Le modèle place la réception dans la fenêtre. Il reste à intégrer les spécifications réelles, leurs tolérances et la réserve de conception demandée.'
      },
      pitfall: 'La puissance TX de l’ONT et sa puissance RX concernent deux sens et deux émetteurs. Leur différence ne donne pas directement la perte d’un seul trajet.',
      check: {
        question: 'Une réception à −5 dBm convient-elle à une fenêtre [−28 ; −8] dBm ?',
        answer: 'Non : elle dépasse le maximum de 3 dB. La marge avant surcharge vaut −8 − (−5) = −3 dB, malgré une forte marge au seuil faible.'
      },
      link: '#cours/2/fibre-budget'
    },
    {
      id: 'otdr-localiser-expliquer',
      chapter: 2,
      title: 'Lire une trace OTDR sans inventer la mesure',
      minutes: 11,
      level: 'Bases',
      intro: 'L’OTDR transforme le temps de retour de la lumière en distance. Sa trace aide à localiser les événements ; elle doit être lue avec les réglages et les limites de l’appareil.',
      flow: ['Impulsion envoyée', 'Diffusion et réflexions', 'Temps aller-retour', 'Distance estimée', 'Événements interprétés'],
      sections: [
        {
          title: 'Pourquoi diviser par deux',
          text: 'La lumière parcourt la fibre jusqu’à l’événement, puis revient vers l’OTDR. La distance aller vaut d = c × t/(2n), avec t en secondes et n l’indice de groupe réglé sur l’appareil. Oublier le facteur 2 double la distance. Une erreur d’indice déplace l’échelle de distance ; l’instrument ne mesure donc pas une longueur indépendante de ses paramètres.'
        },
        {
          title: 'Pente, marche et pic',
          text: 'Une pente décrit une atténuation répartie. Une marche descendante peut indiquer une perte localisée ; un pic signale une réflexion, selon l’événement. Pour estimer l’atténuation linéique, choisis un tronçon homogène et utilise la différence de niveau divisée par la différence de distance. La hauteur d’un pic de réflexion ne se lit pas comme la perte d’insertion d’un connecteur.'
        },
        {
          title: 'Résolution, zone morte et confirmation',
          text: 'Une impulsion plus longue apporte davantage d’énergie, mais peut masquer des événements proches. Une forte réflexion crée une zone morte où l’appareil ne sépare pas encore correctement certains événements. Une bobine de lancement aide à examiner le premier raccord ; une bobine de réception aide au dernier. L’OTDR localise et caractérise ; une mesure source-photomètre vérifie la perte de bout en bout avec son propre montage de référence.'
        }
      ],
      example: {
        title: 'Exemple fictif : un retour après 40 µs',
        steps: [
          'Hypothèses de calcul : c ≈ 3 × 10⁸ m/s, n = 1,50 et t = 40 × 10⁻⁶ s.',
          'Vitesse de groupe simplifiée : v = c/n = 2 × 10⁸ m/s.',
          'Distance aller : d = v × t/2 = 4000 m = 4 km.',
          'Sur un autre tronçon fictif, une baisse de 1,6 dB sur 4 km donne α = 1,6/4 = 0,40 dB/km.'
        ],
        result: 'L’événement de cet exemple serait situé à 4 km. Ce nombre est un calcul d’entraînement, pas la lecture d’une capture de TP.'
      },
      pitfall: 'Un événement caché dans une zone morte n’est pas une preuve de son absence. Un gain apparent sur une épissure ne prouve pas qu’elle crée de l’énergie ; l’analyse bidirectionnelle peut être nécessaire.',
      check: {
        question: 'À indice identique, si le temps aller-retour double, que devient la distance calculée ?',
        answer: 'Elle double : d est proportionnelle à t. Le facteur 2 du trajet aller-retour reste présent dans les deux calculs.'
      },
      link: '#cours/2/fibre-otdr'
    },
    {
      id: 'gpon-partage-dba',
      chapter: 3,
      title: 'Comprendre le partage GPON, GEM et DBA',
      minutes: 10,
      level: 'Bases',
      intro: 'Plusieurs abonnés utilisent un arbre optique commun. Distingue le partage de lumière, l’identification des flux et l’attribution du temps de transmission montant.',
      flow: ['OLT', 'Arbre PON partagé', 'ONT abonnés', 'Demandes montantes', 'Créneaux attribués par l’OLT'],
      sections: [
        {
          title: 'Descendant et montant n’utilisent pas le même mécanisme',
          text: 'Le signal descendant de l’OLT est distribué optiquement dans les branches. Dans le sens montant, les ONT doivent émettre selon les autorisations de l’OLT pour que leurs salves n’entrent pas en collision à la réception. Le ranging tient compte des différences de délai liées aux distances ; la DBA organise l’allocation dynamique selon les besoins et les profils.'
        },
        {
          title: 'Trois rôles à distinguer',
          text: 'GEM transporte et identifie des flux logiques GPON. Un T-CONT correspond à une unité de ressources montantes à laquelle sont associés des paramètres d’allocation. La DBA détermine les ressources disponibles pour l’émission montante. Un VLAN appartient au découpage Ethernet : sa correspondance avec un GEM relève de la configuration, pas d’une identité universelle entre leurs numéros.'
        },
        {
          title: 'Un débit physique n’est pas un débit promis à chaque abonné',
          text: 'Dans le profil étudié, les débits bruts sont de 2,48832 Gbit/s en descendant et 1,24416 Gbit/s en montant. Diviser par le nombre d’abonnés donne un exercice de partage égal, pas une mesure du débit individuel. Les en-têtes, les profils, les demandes simultanées et les autres limites du réseau changent le débit utile. Une fibre partagée n’implique pas une division fixe à tout instant.'
        }
      ],
      example: {
        title: 'Exemple de calcul brut : 32 abonnés et une trame de 125 µs',
        steps: [
          'Partage égal descendant hypothétique : 2488,32/32 = 77,76 Mbit/s par abonné.',
          'Partage égal montant hypothétique : 1244,16/32 = 38,88 Mbit/s par abonné.',
          'Convertir la durée : 125 µs = 125 × 10⁻⁶ s.',
          'Quantité brute descendante sur cette durée : 2,48832 × 10⁹ × 125 × 10⁻⁶ = 311 040 bits = 38 880 octets.'
        ],
        result: 'On obtient des capacités brutes de calcul. Elles ne prédisent pas le résultat d’un test de débit sur un PC.'
      },
      pitfall: 'La DBA n’attribue pas d’adresse IP : c’est une fonction d’allocation du support montant. DHCP intervient à une autre couche.',
      check: {
        question: 'Pourquoi l’OLT tient-il compte de la distance des ONT dans le sens montant ?',
        answer: 'Deux salves émises à des instants identiques depuis des distances différentes n’arrivent pas simultanément. Le ranging permet d’organiser leurs temps d’arrivée avec les créneaux autorisés.'
      },
      link: '#cours/3/ftth-services'
    },
    {
      id: 'ftth-diagnostic-services',
      chapter: 3,
      title: 'Diagnostiquer la box du signal optique au service',
      minutes: 12,
      level: 'Application',
      intro: 'Un ONT Online ne suffit pas à valider Internet ou la téléphonie. Construis une suite de tests où chaque résultat vérifie un étage précis.',
      flow: ['Optique et enregistrement', 'GEM et VLAN', 'Configuration WAN', 'LAN et routage', 'DNS et services'],
      sections: [
        {
          title: 'Commencer par le support et la correspondance des flux',
          text: 'Vérifie les niveaux optiques dans la fenêtre du matériel, puis l’enregistrement de l’ONT et la cohérence de configuration. Examine ensuite le chemin entre port abonné, service GEM, VLAN et interface amont. Une erreur de correspondance peut laisser l’ONT Online tout en bloquant le trafic Ethernet. Dans le TP fourni, conserve la correction de l’interface VLAN 1 ; ne l’étends pas à toutes les installations.'
        },
        {
          title: 'Séparer les fonctions IP',
          text: 'Le DHCP du LAN donne au PC une adresse et des paramètres. Le DHCP du WAN configure une autre interface de la box : ce sont deux échanges différents. La passerelle permet d’atteindre les réseaux distants. Le DNS résout les noms. Le NAT/PAT peut traduire les adresses et les ports à la sortie. Une adresse WAN privée peut être normale dans le réseau du laboratoire.'
        },
        {
          title: 'Choisir un test qui réduit les hypothèses',
          text: 'Contrôle d’abord adresse, masque et passerelle du PC, puis l’accès local à la box, le routage vers une destination IP autorisée et enfin la résolution DNS. Un échec de ping seul ne conclut pas tout : ICMP peut être filtré. Pour la voix, distingue l’enregistrement SIP et le passage des médias RTP. Si cela sonne sans audio, examine notamment les paramètres médias, les ports, les codecs et le NAT.'
        }
      ],
      example: {
        title: 'Scénario fictif : le PC rejoint une IP distante mais pas les noms',
        steps: [
          'Le PC possède 192.168.10.20/24 et une passerelle 192.168.10.1 : les paramètres sont cohérents pour ce LAN fictif.',
          'L’interface de la box est accessible ; un service IP distant autorisé répond : une partie du chemin LAN, routage et amont fonctionne.',
          'La résolution d’un nom échoue : relever le serveur DNS configuré et tester explicitement une requête DNS.',
          'Vérifier la réponse DNS et sa joignabilité avant de modifier la fibre, le budget optique ou l’enregistrement de l’ONT.'
        ],
        result: 'Les indices orientent vers la résolution DNS. Ils ne prouvent pas à eux seuls quelle règle ou quel serveur provoque l’échec.'
      },
      pitfall: 'Changer simultanément VLAN, DNS, NAT et puissance empêche de savoir quelle modification a résolu le problème. Modifie une cause à la fois et conserve le résultat de chaque test.',
      check: {
        question: 'Un compte SIP est enregistré et le téléphone sonne, mais l’audio manque. Quel étage reste à vérifier ?',
        answer: 'Le transport des médias RTP et sa négociation : adresses et ports annoncés, compatibilité codec, routage et traduction NAT. L’enregistrement SIP ne valide pas ce trajet.'
      },
      link: '#cours/3/ftth-ip'
    },
    {
      id: 'ros-puissance-acceptee',
      chapter: 4,
      title: 'Du ROS à la puissance réellement acceptée',
      minutes: 11,
      level: 'Bases',
      intro: 'Le ROS décrit l’adaptation d’une charge à une ligne. Il ne mesure ni son gain, ni la part de puissance qu’elle transforme réellement en rayonnement.',
      flow: ['Onde incidente', 'Désadaptation', 'Onde réfléchie', 'Puissance acceptée', 'Rayonnement et pertes'],
      sections: [
        {
          title: 'Amplitude et puissance ne sont pas le même rapport',
          text: 'Pour une ligne d’impédance Z0 et une charge ZL, Γ = (ZL − Z0)/(ZL + Z0). Son module ρ compare les amplitudes des ondes réfléchie et incidente. Le rapport de leurs puissances vaut ρ². Si ρ = 0,2, l’amplitude réfléchie vaut 20 % mais la puissance réfléchie vaut 4 %. Ces relations supposent les mêmes conventions et des mesures correctement étalonnées.'
        },
        {
          title: 'Relier ρ au ROS',
          text: 'Le ROS vaut (1 + ρ)/(1 − ρ). Il compare maxima et minima d’amplitude de l’onde stationnaire dans la ligne. Sa valeur minimale est 1, lorsque ρ = 0. Pour une charge idéale ouverte ou court-circuitée, ρ = 1 et le ROS tend vers l’infini. Leur phase de réflexion diffère, même si toute la puissance incidente est réfléchie dans ce modèle.'
        },
        {
          title: 'Adaptation et rendement sont deux vérifications',
          text: 'À l’entrée de la charge, la puissance acceptée vaut Pi − Pr, soit Pi × (1 − ρ²). Elle peut ensuite être rayonnée ou dissipée. Une résistance adaptée présente un ROS de 1 tout en dissipant la puissance en chaleur. Pour juger une antenne, il faut donc aussi ses performances de rayonnement, la fréquence, la polarisation et le diagramme.'
        }
      ],
      example: {
        title: 'Exemple fictif : une charge résistive de 75 Ω sur une ligne de 50 Ω',
        steps: [
          'Γ = (75 − 50)/(75 + 50) = 25/125 = 0,2 ; donc ρ = 0,2.',
          'ROS = (1 + 0,2)/(1 − 0,2) = 1,5.',
          'Pour Pi = 2 W : Pr = 2 × 0,2² = 0,08 W = 80 mW.',
          'Puissance acceptée : 2 − 0,08 = 1,92 W ; pour cette résistance idéale, elle est dissipée.'
        ],
        result: 'Le ROS vaut 1,5 et 4 % de la puissance est réfléchie. Aucune conclusion sur un gain d’antenne ne découle de ce calcul.'
      },
      pitfall: 'Le mot TOS est employé avec plusieurs conventions dans les supports. Indique si tu parles de 100ρ en pourcentage ou du rapport ROS.',
      check: {
        question: 'Si le ROS vaut 2, quelle fraction de puissance est réfléchie ?',
        answer: 'ρ = (ROS − 1)/(ROS + 1) = 1/3 ; la fraction vaut ρ² = 1/9 ≈ 11,1 %, et non 33,3 %.'
      },
      link: '#cours/4/antenne-ros'
    },
    {
      id: 'gain-surface-diagramme',
      chapter: 4,
      title: 'Relier gain, surface effective et diagramme',
      minutes: 12,
      level: 'Application',
      intro: 'Le gain décrit une direction et une fréquence. Passe du dBi au rapport linéaire, puis utilise les bonnes grandeurs pour la réception et la PIRE.',
      flow: ['Fréquence', 'Longueur d’onde', 'Gain linéaire', 'Surface effective', 'Puissance ou PIRE'],
      sections: [
        {
          title: 'La référence isotrope du dBi',
          text: 'Un gain de G dBi correspond au rapport g = 10^(G/10), par rapport à une antenne isotrope idéale. Une antenne passive concentre le rayonnement dans certaines directions ; elle ne crée pas d’énergie. Le gain dépend de la fréquence et de la direction. Une valeur maximale de fiche technique ne doit pas être appliquée à toutes les orientations.'
        },
        {
          title: 'La surface effective sert à la réception',
          text: 'Dans les conditions compatibles d’adaptation et de polarisation, Se = gλ²/(4π), en m². La puissance disponible vaut alors la densité de puissance incidente multipliée par Se. La surface effective n’est pas nécessairement la surface physique de l’antenne. Dans cette formule, seul λ est au carré : écrire (gλ)² introduirait un facteur de gain en trop.'
        },
        {
          title: 'Lire un diagramme autour du maximum',
          text: 'Normalise un relevé en retirant son maximum à chaque point. Si le maximum est −18 dBm, le niveau de demi-puissance est −21 dBm. La largeur à −3 dB est l’écart angulaire entre les deux intersections de ce seuil avec le lobe principal. Un niveau brut en dBm au récepteur ne constitue pas à lui seul une mesure de gain absolu en dBi.'
        }
      ],
      example: {
        title: 'Exemple fictif : antenne de 12 dBi à 2,4 GHz',
        steps: [
          'λ = 3 × 10⁸/(2,4 × 10⁹) = 0,125 m.',
          'Gain linéaire : g = 10^(12/10) ≈ 15,85.',
          'Surface effective : Se = 15,85 × 0,125²/(4π) ≈ 0,01971 m² = 197,1 cm².',
          'Avec Pe = 20 dBm et 2 dB de câble, la PIRE maximale vaut 20 − 2 + 12 = 30 dBm = 1 W.'
        ],
        result: 'Le même gain intervient sous forme linéaire dans Se et sous forme logarithmique dans le bilan de PIRE.'
      },
      pitfall: 'Une PIRE de 1 W ne signifie pas que l’antenne rayonne 1 W au total. Elle décrit une équivalence isotrope dans la direction considérée.',
      check: {
        question: 'Un lobe coupe le seuil à −3 dB à 350° et à 10°. Quelle est son ouverture autour de 0° ?',
        answer: '20° : 10° avant 360° puis 10° après 0°. L’écart direct de 340° correspond au tour opposé.'
      },
      link: '#cours/4/antenne-gain'
    },
    {
      id: 'radio-bilan-marge',
      chapter: 5,
      title: 'Calculer un bilan radio et décider avec la marge',
      minutes: 12,
      level: 'Application',
      intro: 'La puissance reçue se construit de l’émetteur jusqu’au récepteur. La marge permet ensuite de comparer le modèle au seuil du mode radio demandé.',
      flow: ['Puissance et câble TX', 'Gain TX', 'Pertes du trajet', 'Gain et câble RX', 'Sensibilité et marge'],
      sections: [
        {
          title: 'Fixer les unités de la perte libre',
          text: 'Llibre ≈ 32,45 + 20 log₁₀(d en km) + 20 log₁₀(f en MHz). La constante dépend de ces unités. À défaut, utilise 20 log₁₀(4πd/λ), avec d et λ dans la même unité. Ce modèle suppose un trajet en espace libre et des antennes en champ lointain ; les obstacles, la pluie et les désadaptations demandent des corrections adaptées.'
        },
        {
          title: 'Écrire une ligne de bilan',
          text: 'Pr = Pe − Le + Ge − Llibre − Lextra + Gr − Lr. Pe et Pr sont en dBm ; gains et pertes sont en dB ou dBi selon leur rôle. Si une PIRE est déjà donnée, elle contient la puissance injectée, le gain d’émission et les pertes amont prises en compte : ne les ajoute ou retranche pas une deuxième fois.'
        },
        {
          title: 'Une marge positive dépend des hypothèses',
          text: 'M = Pr − sensibilité. Une marge positive signifie que le niveau prévu dépasse ce seuil dans le modèle. Le seuil dépend du mode de transmission et du critère de performance. Le fading, le bruit, les interférences ou une obstruction peuvent encore dégrader le service. Pour une atténuation en dB/km, multiplie par la longueur effectivement concernée, par exemple la portion de trajet sous la pluie.'
        }
      ],
      example: {
        title: 'Exemple fictif : 5,8 GHz sur 5 km',
        steps: [
          'Données : Pe = 20 dBm, deux antennes de 18 dBi, deux câbles de 1 dB et aucune perte supplémentaire dans le premier modèle.',
          'Perte libre : 32,45 + 20 log₁₀(5) + 20 log₁₀(5800) ≈ 121,70 dB.',
          'Réception : 20 − 1 + 18 − 121,70 + 18 − 1 = −67,70 dBm.',
          'Pour une sensibilité fictive de −75 dBm : M = −67,70 − (−75) = 7,30 dB.',
          'Si le trajet ajoute 10 dB de pertes : Pr = −77,70 dBm et M = −2,70 dB.'
        ],
        result: 'Le premier modèle dépasse le seuil de 7,30 dB ; après les 10 dB supplémentaires, le seuil du mode demandé n’est plus assuré.'
      },
      pitfall: 'Une sensibilité de −75 dBm est plus exigeante qu’une sensibilité de −90 dBm : il faut une puissance plus forte pour atteindre le premier seuil.',
      check: {
        question: 'À gains et fréquence constants, que devient la perte libre si la distance double ?',
        answer: 'Elle augmente de 20 log₁₀(2) ≈ 6,02 dB. La puissance reçue diminue donc d’environ 6 dB dans ce modèle.'
      },
      link: '#cours/5/radio-bilan'
    },
    {
      id: 'fresnel-obstacles',
      chapter: 5,
      title: 'Voir plus large que la ligne droite : Fresnel',
      minutes: 10,
      level: 'Bases',
      intro: 'Voir l’autre antenne ne suffit pas toujours. Le voisinage du trajet intervient dans la propagation ; un obstacle proche de l’axe peut ajouter une perte par diffraction.',
      flow: ['Profil du trajet', 'Fréquence et distances', 'Premier ellipsoïde de Fresnel', 'Dégagement', 'Pertes et marge'],
      sections: [
        {
          title: 'Un volume autour du trajet',
          text: 'La première zone de Fresnel est un volume autour du trajet direct. Son rayon dans une section dépend de la longueur d’onde et des distances aux deux antennes. Il est nul aux extrémités dans le modèle géométrique et maximal au milieu d’un trajet symétrique. Un dégagement visuel de quelques centimètres peut donc être insuffisant pour une liaison de plusieurs kilomètres.'
        },
        {
          title: 'Calculer un rayon à l’endroit de l’obstacle',
          text: 'Le rayon vaut r1 = √(λ × d1 × d2/(d1 + d2)). Utilise des mètres pour λ, d1 et d2 : r1 sera en mètres. Le repère de 60 % du rayon sert à une première appréciation du dégagement dans les conditions étudiées en cours. Il ne remplace pas une étude du profil, de la réfraction, de la courbure terrestre et de la végétation.'
        },
        {
          title: 'Choisir la correction qui traite la cause',
          text: 'Si un obstacle empiète sur la zone, compare la hauteur du trajet à son sommet et au dégagement visé. Relever les antennes ou modifier le tracé peut réduire la diffraction. Ajouter de la puissance ne libère pas le trajet et ne supprime pas les trajets multiples. Le résultat géométrique doit ensuite être relié au bilan et à la marge de la liaison.'
        }
      ],
      example: {
        title: 'Exemple fictif : obstacle au milieu d’une liaison de 2 km à 2,4 GHz',
        steps: [
          'λ = 3 × 10⁸/(2,4 × 10⁹) = 0,125 m ; d1 = d2 = 1000 m.',
          'r1 = √(0,125 × 1000 × 1000/2000) ≈ 7,91 m.',
          'Repère de 60 % : 0,60 × 7,91 ≈ 4,74 m sous l’axe direct au droit de l’obstacle.',
          'Si le sommet n’est qu’à 3 m sous cet axe, il manque environ 1,74 m au dégagement de ce modèle simplifié.'
        ],
        result: 'Les antennes peuvent se voir alors que le dégagement étudié est insuffisant. Le profil réel détermine la modification de hauteur nécessaire.'
      },
      pitfall: 'Le rayon de Fresnel se mesure perpendiculairement autour du trajet ; ce n’est ni la hauteur de l’antenne au sol, ni le diamètre de la zone.',
      check: {
        question: 'À distances identiques, que devient r1 si la fréquence est multipliée par quatre ?',
        answer: 'La longueur d’onde est divisée par quatre ; comme r1 dépend de sa racine carrée, le rayon est divisé par deux.'
      },
      link: '#cours/5/radio-fresnel'
    },
    {
      id: 'voix-g711-rtp',
      chapter: 6,
      title: 'De G.711 au débit des paquets RTP',
      minutes: 12,
      level: 'Application',
      intro: 'Le débit du codec n’est pas le débit sur le réseau. Compte la voix, le nombre de paquets et les en-têtes dans un périmètre clairement annoncé.',
      flow: ['Échantillonnage', 'G.711 : 8 bits', 'Paquets de voix', 'RTP, UDP et IP', 'Débit total du périmètre'],
      sections: [
        {
          title: 'Construire le débit du codec',
          text: 'Dans le modèle G.711 mono étudié, 8000 échantillons/s × 8 bits donnent 64 kbit/s. La loi A ou µ utilise une quantification non uniforme, mais chaque échantillon transporté reste codé sur 8 bits. Sur une durée de paquet de 20 ms, on réunit 8000 × 0,020 = 160 échantillons, donc 160 octets de voix.'
        },
        {
          title: 'RTP apporte une chronologie, pas une retransmission',
          text: 'Le numéro de séquence permet de suivre les paquets ; l’horodatage situe les échantillons dans le temps média. L’en-tête fixe RTP fait 12 octets avant CSRC et extensions. Dans notre calcul IPv4 sans options : RTP 12 + UDP 8 + IPv4 20 = 40 octets. RTP seul ne garantit ni la livraison ni un délai ; le récepteur doit gérer les arrivées variables et les pertes.'
        },
        {
          title: 'Annoncer ce que l’on compte',
          text: 'Un calcul au niveau IP n’inclut pas Ethernet, VLAN, GEM ou la couche physique. Dans le TD du cours, les hypothèses imposées RTP 16 et GEM 4 donnent un autre total ; le chapitre explique leur écart avec les formats minimaux réels. SIP établit la session et ne se rajoute pas comme en-tête à chaque paquet audio. La taille de paquet choisie met en balance surdébit et délai de mise en paquet.'
        }
      ],
      example: {
        title: 'Exemple fictif continu : comparer 20 ms et 10 ms au niveau IPv4',
        steps: [
          'À 20 ms : 160 octets de voix et 1/0,020 = 50 paquets/s.',
          'Taille IPv4 avec RTP/UDP : 160 + 12 + 8 + 20 = 200 octets.',
          'Débit : 200 × 8 × 50 = 80 000 bit/s = 80 kbit/s, pour un sens.',
          'À 10 ms : 80 octets de voix, 100 paquets/s ; (80 + 40) × 8 × 100 = 96 kbit/s.',
          'Dans les deux cas le codec reste à 64 kbit/s ; le surdébit IP passe de 16 à 32 kbit/s.'
        ],
        result: 'Réduire la durée par paquet diminue l’attente de mise en paquet, mais augmente le débit d’en-têtes. Ces totaux excluent les couches inférieures et RTCP.'
      },
      pitfall: 'Le total de 80 kbit/s contient déjà les 64 kbit/s de voix. Les ajouter une deuxième fois produirait un double comptage.',
      check: {
        question: 'En G.711 à 8 kHz, de combien progresse normalement l’horodatage RTP entre deux paquets de 20 ms consécutifs ?',
        answer: 'De 160 unités d’horodatage : 8000 × 0,020 = 160. Le numéro de séquence progresse de 1, pas de 160, pour cette émission consécutive.'
      },
      link: '#cours/6/mobile-entetes'
    },
    {
      id: 'lte-controle-donnees',
      chapter: 6,
      title: 'Lire LTE : contrôle, données et mobilité',
      minutes: 11,
      level: 'Bases',
      intro: 'Place les équipements dans le bon plan avant d’interpréter une capture. Une connexion radio, un enregistrement et un accès aux données correspondent à des vérifications différentes.',
      flow: ['UE', 'eNodeB', 'S-GW', 'P-GW', 'Réseau de données'],
      sections: [
        {
          title: 'Dessiner les deux trajets',
          text: 'Dans l’architecture LTE/EPC de base étudiée, le trafic utilisateur passe par UE, eNodeB, S-GW et P-GW vers le réseau de données. Le MME intervient dans le contrôle, notamment l’accès et la mobilité ; le HSS apporte les informations d’abonnement. Voir des échanges de contrôle avec le MME ne signifie pas que les paquets du navigateur transitent normalement dans cet équipement.'
        },
        {
          title: 'Veille et déplacement',
          text: 'Un mobile enregistré peut être en veille sans liaison radio dédiée active. Le paging permet au réseau de le solliciter lorsque la reprise de communication est nécessaire. La resélection de cellule en veille se distingue d’un handover pendant une connexion active. Le changement d’un identifiant de cellule, isolé de l’état et des messages, ne suffit pas à déterminer toute la procédure.'
        },
        {
          title: 'Lire les mesures avec leur nom et leur technologie',
          text: 'Une puissance de référence et une mesure de qualité ne répondent pas à la même question. Un niveau radio élevé peut coexister avec des interférences ou une cellule chargée et un faible débit. Pour un relevé, conserve le nom du champ, l’unité, la technologie et l’instant. Un PCI est réutilisable dans d’autres cellules ; il n’identifie pas seul une cellule mondiale. Sans capture, décris une méthode, pas une séquence prétendument observée.'
        }
      ],
      example: {
        title: 'Scénario pédagogique : le mobile change de cellule',
        steps: [
          'Relever d’abord la technologie et l’état du mobile avant le changement ; aucune trace réelle n’est supposée ici.',
          'Si le scénario indique un mobile en veille, examiner la sélection ou resélection et les éventuelles mises à jour de zone.',
          'Si une connexion est active, rechercher les messages de préparation et d’exécution du transfert pour étayer un handover.',
          'Pour les données, suivre séparément le trajet utilisateur et les tunnels concernés ; un message de contrôle seul ne prouve pas le passage du trafic.'
        ],
        result: 'La bonne conclusion dépend de l’état et des échanges disponibles, pas seulement de deux valeurs de cellule différentes.'
      },
      pitfall: 'Ne pas mélanger la chaîne GSM BTS/BSC, la chaîne LTE eNodeB/EPC et la chaîne 5G SA gNodeB/5GC. Une icône 5G ne reconstitue pas à elle seule l’architecture observée.',
      check: {
        question: 'Dans le trajet utilisateur LTE/EPC de base, le MME est-il le routeur normal des paquets Internet du téléphone ?',
        answer: 'Non. Le MME gère le contrôle ; le trajet utilisateur simplifié étudié passe par eNodeB, S-GW et P-GW. Il faut lire la technologie et le scénario avant de généraliser.'
      },
      link: '#cours/6/mobile-vocabulaire'
    }
  ],
  cards: [
    {
      id: 'bases-db-dbm', chapter: 1,
      question: 'Quelle différence entre dB et dBm ?',
      answer: 'Le dB exprime un rapport ; le dBm exprime une puissance référencée à 1 mW.',
      explanation: 'On peut partir de −7 dBm et retrancher une perte de 3 dB pour obtenir −10 dBm. Les deux écritures ont des rôles différents.'
    },
    {
      id: 'bases-moins-trente', chapter: 1,
      question: 'À quelle puissance correspond −30 dBm ?',
      answer: '0,001 mW = 1 µW.',
      explanation: 'P en mW = 10^(−30/10) = 10⁻³. Une valeur négative en dBm ne signifie pas une puissance physique négative.'
    },
    {
      id: 'bases-perte-dix', chapter: 1,
      question: 'Une perte de 10 dB laisse quelle fraction de puissance ?',
      answer: 'Un dixième, soit 10 %.',
      explanation: 'La fraction transmise vaut 10^(−A/10). Pour 10 dB, elle vaut 0,1. Une seconde perte de 10 dB laisse 1 % de la puissance initiale.'
    },
    {
      id: 'bases-dbw-dbm', chapter: 1,
      question: 'Comment passer de dBW à dBm ?',
      answer: 'Ajouter 30 : P(dBm) = P(dBW) + 30.',
      explanation: '1 W = 1000 mW et 10 log₁₀(1000) = 30. Ainsi 0 dBW = 30 dBm = 1 W.'
    },
    {
      id: 'bases-tension-puissance', chapter: 1,
      question: 'Sur une même résistance, si Ueff double, que devient la puissance ?',
      answer: 'Elle est multipliée par quatre.',
      explanation: 'P = Ueff²/R. Le carré explique pourquoi les rapports de tension utilisent 20 log lorsque la résistance reste la même.'
    },
    {
      id: 'bases-octets-debit', chapter: 1,
      question: 'Quel débit utile donnent 160 octets toutes les 20 ms ?',
      answer: '64 kbit/s, avant les en-têtes.',
      explanation: '160 × 8 = 1280 bits et 20 ms = 0,020 s ; 1280/0,020 = 64 000 bit/s.'
    },
    {
      id: 'fibre-attenuation-dispersion', chapter: 2,
      question: 'Quelle différence entre atténuation et dispersion ?',
      answer: 'L’atténuation réduit la puissance ; la dispersion étale les impulsions dans le temps.',
      explanation: 'Une puissance suffisante ne garantit pas que les impulsions restent distinctes. Les deux mécanismes demandent des diagnostics différents.'
    },
    {
      id: 'fibre-perte-lineique', chapter: 2,
      question: 'Quelle perte pour 6 km à 0,35 dB/km ?',
      answer: '2,10 dB, pour la fibre seule.',
      explanation: 'A = αL = 0,35 × 6. Il reste à ajouter les raccords, épissures et autres composants du trajet.'
    },
    {
      id: 'fibre-reference', chapter: 2,
      question: 'Référence à 0 dB au photomètre : reçoit-on forcément 0 dBm ?',
      answer: 'Non. 0 dB signifie que la puissance est égale à la référence choisie.',
      explanation: 'La référence peut être à −7,55 dBm, par exemple. Le mode relatif affiche alors 0 dB pour cette puissance.'
    },
    {
      id: 'fibre-splitter-huit', chapter: 2,
      question: 'Quelle perte idéale par branche pour un splitter égalitaire 1×8 ?',
      answer: '10 log₁₀(8) ≈ 9,03 dB ; chaque branche reçoit 12,5 %.',
      explanation: 'Une sortie reçoit 1/8 de la puissance. Les pertes réelles peuvent être supérieures à la seule perte de partage.'
    },
    {
      id: 'fibre-otdr-deux', chapter: 2,
      question: 'Pourquoi d = ct/(2n) pour localiser un événement OTDR ?',
      answer: 'Le temps mesuré correspond à l’aller-retour de la lumière.',
      explanation: 'La vitesse vaut c/n. Le produit vitesse × temps donne le trajet total, qu’il faut diviser par deux pour obtenir la distance aller.'
    },
    {
      id: 'fibre-zone-morte', chapter: 2,
      question: 'Que signifie une zone morte OTDR ?',
      answer: 'Une région où l’appareil ne distingue pas encore correctement certains événements.',
      explanation: 'Une forte réflexion ou une impulsion longue peut masquer des événements voisins. Ne pas les voir ne prouve pas leur absence.'
    },
    {
      id: 'ftth-olt-ont', chapter: 3,
      question: 'Où sont l’OLT et l’ONT dans un accès FTTH ?',
      answer: 'L’OLT est côté opérateur ; l’ONT est la terminaison active côté abonné.',
      explanation: 'Entre eux, l’ODN regroupe fibres, raccords et splitters passifs. La PTO est une terminaison passive, pas un ONT.'
    },
    {
      id: 'ftth-montant', chapter: 3,
      question: 'Pourquoi les ONT n’émettent-ils pas librement en même temps sur le montant ?',
      answer: 'Leurs salves arriveraient en collision sur le récepteur de l’OLT.',
      explanation: 'L’OLT attribue des créneaux ; le ranging tient compte des délais et la DBA organise l’allocation dynamique selon les profils et besoins.'
    },
    {
      id: 'ftth-dba-dhcp', chapter: 3,
      question: 'DBA et DHCP ont-ils le même rôle ?',
      answer: 'Non. La DBA alloue des ressources montantes ; DHCP fournit une configuration IP.',
      explanation: 'Une bonne allocation GPON ne garantit pas qu’un client ait reçu une adresse, une passerelle ou des serveurs DNS.'
    },
    {
      id: 'ftth-gem-vlan', chapter: 3,
      question: 'Le numéro d’un GEM doit-il être égal au numéro du VLAN ?',
      answer: 'Non : leur correspondance dépend de la configuration du service.',
      explanation: 'Un GEM identifie un flux logique GPON, tandis qu’un VLAN sépare des réseaux Ethernet. Ils ne désignent pas une prise physique.'
    },
    {
      id: 'ftth-online', chapter: 3,
      question: 'Un ONT Online valide-t-il automatiquement Internet ?',
      answer: 'Non : il reste à vérifier les services, VLAN, paramètres IP, routes et DNS.',
      explanation: 'L’enregistrement optique et le fonctionnement d’un service IP sont des étapes distinctes. Un test doit préciser l’étage qu’il valide.'
    },
    {
      id: 'ftth-sip-rtp', chapter: 3,
      question: 'Le téléphone sonne sans audio : quel protocole média vérifier ?',
      answer: 'RTP, ainsi que les adresses, ports et codecs négociés.',
      explanation: 'SIP organise la session. La signalisation peut fonctionner alors que le trajet des médias échoue, notamment avec le NAT ou un filtrage.'
    },
    {
      id: 'antenne-passive', chapter: 4,
      question: 'Une antenne passive de 14 dBi crée-t-elle de l’énergie ?',
      answer: 'Non : elle concentre le rayonnement dans certaines directions.',
      explanation: 'Le gain est référencé à l’isotrope. Il dépend de la direction, de la fréquence et du rendement selon la convention utilisée.'
    },
    {
      id: 'antenne-gain-lineaire', chapter: 4,
      question: 'Quel rapport linéaire correspond à 10 dBi ?',
      answer: 'g = 10^(10/10) = 10.',
      explanation: 'Dans Se = gλ²/(4π), il faut utiliser 10, et non une valeur traitée directement comme un niveau logarithmique.'
    },
    {
      id: 'antenne-demi-puissance', chapter: 4,
      question: 'Si le maximum du diagramme est −18 dBm, où est le seuil à −3 dB ?',
      answer: 'À −21 dBm.',
      explanation: 'Le seuil est relatif au maximum. Il ne vaut pas forcément −3 dBm et correspond approximativement à la moitié de la puissance maximale.'
    },
    {
      id: 'antenne-reflexion', chapter: 4,
      question: 'Si ρ = 0,2, quelle fraction de puissance est réfléchie ?',
      answer: 'ρ² = 0,04, soit 4 %.',
      explanation: 'ρ compare des amplitudes. Le carré est nécessaire pour obtenir le rapport des puissances.'
    },
    {
      id: 'antenne-ros-un', chapter: 4,
      question: 'Un ROS de 1 prouve-t-il un excellent rayonnement ?',
      answer: 'Non : il indique une adaptation parfaite dans le modèle étudié.',
      explanation: 'Une résistance adaptée peut avoir un ROS de 1 et dissiper la puissance en chaleur. L’adaptation et le rayonnement sont deux propriétés distinctes.'
    },
    {
      id: 'antenne-pire', chapter: 4,
      question: 'Pe = 20 dBm, câble = 2 dB et antenne = 12 dBi : quelle PIRE ?',
      answer: '20 − 2 + 12 = 30 dBm = 1 W.',
      explanation: 'La PIRE est une équivalence isotrope dans la direction étudiée. Elle ne donne pas directement la puissance totale rayonnée.'
    },
    {
      id: 'radio-unites-fspl', chapter: 5,
      question: 'Quelles unités utiliser avec la constante 32,45 de la perte libre ?',
      answer: 'Distance en kilomètres et fréquence en mégahertz.',
      explanation: 'L = 32,45 + 20 log₁₀(dkm) + 20 log₁₀(fMHz). Mélanger mètres et gigahertz avec cette constante fausse le calcul.'
    },
    {
      id: 'radio-distance-double', chapter: 5,
      question: 'En espace libre, doubler la distance ajoute quelle perte à fréquence constante ?',
      answer: 'Environ 6,02 dB.',
      explanation: '20 log₁₀(2) = 6,02. À gains fixes et dans ce modèle, la puissance reçue est divisée par quatre.'
    },
    {
      id: 'radio-marge', chapter: 5,
      question: 'Pr = −72 dBm et sensibilité = −80 dBm : quelle marge ?',
      answer: '−72 − (−80) = 8 dB.',
      explanation: 'La réception prévue dépasse le seuil de 8 dB. Ce résultat dépend du mode de réception et des pertes incluses dans le modèle.'
    },
    {
      id: 'radio-fresnel-visible', chapter: 5,
      question: 'Voir l’autre antenne garantit-il le dégagement de Fresnel ?',
      answer: 'Non : un obstacle peut gêner la zone autour du trajet direct.',
      explanation: 'Le rayon dépend de la longueur d’onde et de la position sur le trajet. Il faut examiner un volume, pas seulement une ligne visuelle.'
    },
    {
      id: 'radio-pluie', chapter: 5,
      question: 'Une pluie modélisée à 1 dB/km occupe 5 km d’un trajet de 30 km. Quelle perte ajoute-t-on ?',
      answer: '5 dB dans ce modèle.',
      explanation: 'On multiplie l’atténuation linéique par la portion affectée : 1 × 5. Utiliser 30 km supposerait une pluie identique sur toute la liaison.'
    },
    {
      id: 'radio-delai', chapter: 5,
      question: 'Quel délai de propagation pour un trajet de 72 000 km à 300 000 km/s ?',
      answer: '0,24 s pour ce trajet dans un sens.',
      explanation: 't = d/v = 72 000/300 000. L’aller-retour vaut 0,48 s, avant les autres délais et si les deux sens ont cette même longueur.'
    },
    {
      id: 'mobile-g711', chapter: 6,
      question: 'Comment retrouve-t-on les 64 kbit/s de G.711 mono ?',
      answer: '8000 échantillons/s × 8 bits/échantillon = 64 000 bit/s.',
      explanation: 'Les en-têtes RTP, UDP, IP et les couches inférieures s’ajoutent au débit de voix.'
    },
    {
      id: 'mobile-rtp-taille', chapter: 6,
      question: 'Quelle est la taille de l’en-tête fixe RTP, avant CSRC et extensions ?',
      answer: '12 octets.',
      explanation: 'Le TD du cours impose 16 octets dans son calcul. Il faut annoncer cette hypothèse et la distinguer du minimum RTP défini dans la RFC 3550.'
    },
    {
      id: 'mobile-paquets', chapter: 6,
      question: 'Des paquets couvrant chacun 20 ms donnent combien de paquets par seconde ?',
      answer: '50 paquets/s en émission continue.',
      explanation: '1/0,020 = 50. La suppression de silence ou d’autres comportements peuvent modifier le trafic réel ; ils sont exclus de ce calcul.'
    },
    {
      id: 'mobile-mme', chapter: 6,
      question: 'Dans LTE/EPC de base, à quoi sert principalement le MME ?',
      answer: 'Au plan de contrôle, notamment pour l’accès et la mobilité.',
      explanation: 'Le trajet utilisateur simplifié passe par eNodeB, S-GW et P-GW. Le MME n’est pas le chemin normal des paquets du navigateur dans ce modèle.'
    },
    {
      id: 'mobile-identites', chapter: 6,
      question: 'IMEI, IMSI et MSISDN identifient-ils la même chose ?',
      answer: 'Non : équipement, abonnement et numéro téléphonique, respectivement.',
      explanation: 'Garde le nom du champ et la technologie du relevé. Ces identifiants ne sont pas des coordonnées de localisation et doivent être masqués dans un document partagé si inutiles.'
    },
    {
      id: 'mobile-reselection-handover', chapter: 6,
      question: 'Quelle différence entre resélection et handover ?',
      answer: 'La resélection concerne le choix de cellule en veille ; le handover transfère une connexion active.',
      explanation: 'Un changement d’identifiant de cellule ne suffit pas à conclure. Il faut l’état du mobile et les messages de la technologie concernée.'
    }
  ]
};
