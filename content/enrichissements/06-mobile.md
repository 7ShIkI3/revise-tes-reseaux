<div class="lesson-intro"><strong>Objectif TD3 et TP5.</strong> Comprendre la numérisation de la voix, les échanges d’accès, les identités, la veille, la mobilité et les captures. Les termes 2G, 3G, LTE et 5G sont distingués pour éviter d’appliquer une procédure à la mauvaise génération.</div>

## Le téléphone, la cellule et le cœur de réseau {#mobile-vocabulaire}

Une **cellule** est une zone desservie par un équipement radio avec des ressources et des identifiants. Le téléphone, appelé **UE**, User Equipment, échange avec le réseau d’accès radio. Celui-ci est relié au **cœur de réseau**, qui gère abonnement, mobilité et services.

| Génération | Accès radio | Éléments du cœur rencontrés dans les supports |
|---|---|---|
| 2G GSM | BTS, Base Transceiver Station ; BSC, contrôleur des BTS | MSC/VLR pour appels et localisation ; HLR/AuC pour abonnement et authentification ; SGSN/GGSN pour les données GPRS |
| 3G UMTS | NodeB et RNC, contrôleur radio | Domaine circuit et domaine paquet ; SGSN/GGSN pour le paquet |
| 4G LTE | eNodeB ; cœur EPC, Evolved Packet Core | MME pour contrôle et mobilité ; HSS pour abonnement ; S-GW et P-GW pour les données |
| 5G SA | gNodeB et cœur 5GC | AMF pour accès/mobilité ; SMF pour sessions ; UPF pour acheminer les données |

**Plan de contrôle** = messages qui organisent la communication. **Plan utilisateur** = contenu transporté, comme les paquets du navigateur. Le MME gère notamment des procédures ; il n’est pas le chemin normal de tous les paquets Internet du mobile LTE.

La 5G **NSA** s’appuie sur une architecture comprenant la LTE ; la 5G **SA** utilise un cœur 5G. Une icône sur un téléphone ne suffit pas à reconstituer tous les équipements et bearers de la capture. Commencer par la technologie indiquée dans l’outil.

## TD3 Q1 à Q4 : de la voix aux paquets {#mobile-voix}

La voix analogique est une tension continue dans le temps. La numérisation suit trois étapes : **échantillonnage**, mesurer à des instants réguliers ; **quantification**, choisir une valeur dans un ensemble fini ; **codage**, représenter cette valeur par des bits.

Un **codec** est une méthode de codage/décodage. G.711 utilise 8 bits par échantillon à 8000 échantillons/s, avec une loi de compression de dynamique A ou µ. Une quantification non uniforme accorde des pas plus fins aux petites amplitudes ; elle ne signifie pas que chaque échantillon possède une taille variable dans le flux G.711.

Pour reconstruire un signal limité en fréquence, le critère de Shannon–Nyquist exige un échantillonnage au moins égal à deux fois la fréquence maximale dans le modèle idéal, avec une marge pratique pour le filtre. Dans le TD, la voix est filtrée jusqu’à 3400 Hz : la limite théorique est **6800 Hz** ; le codec retient **8000 Hz**. On ne prend pas 2 × (3400 − 300).

$$D_{\mathrm{voix}}=f_e b\qquad N_{\mathrm{paquets/s}}=f_e/N_e\qquad T_{\mathrm{paquet}}=N_e/f_e$$

fe est le nombre d’échantillons par seconde ; b le nombre de bits par échantillon ; Ne le nombre d’échantillons par paquet.

**Calculs du TD :**

1. Voix : 8000 × 8 = **64 000 bit/s = 64 kbit/s**.
2. Charge utile d’un paquet : 160 échantillons × 8 bits = **1280 bits = 160 octets**.
3. Nombre de paquets : 8000/160 = **50 paquets/s**.
4. Durée couverte : 160/8000 = **0,020 s = 20 ms**.

Plus de voix par paquet réduit la fréquence des en-têtes, mais augmente l’attente avant l’émission et la quantité de voix affectée par la perte d’un paquet. C’est un compromis entre débit supplémentaire, délai et robustesse.

## Encapsulation : compter les en-têtes du TD {#mobile-entetes}

Une **charge utile** est le contenu que l’on transporte. Un **en-tête** contient les informations permettant de traiter ce contenu. L’**encapsulation** ajoute les informations de chaque couche autour de celles de la couche précédente.

<div class="course-flow" role="img" aria-label="La voix est encapsulée successivement dans RTP, UDP, IPv4, Ethernet puis GEM"><span>Voix<br><small>160 octets</small></span><b>→</b><span>RTP</span><b>→</b><span>UDP</span><b>→</b><span>IPv4</span><b>→</b><span>Ethernet</span><b>→</b><span>GEM</span></div>

**RTP** fournit notamment numéro de séquence et horodatage pour les médias. **UDP** transporte un datagramme sans connexion et sans retransmission intégrée. **IP** assure l’adressage et le routage. **Ethernet** assure le transport local de trames. **GEM** transporte le flux dans GPON. SIP établit la session ; il n’est pas un en-tête présent dans chaque paquet de voix.

| Élément, sans VLAN | Hypothèse du TD | Format minimal correspondant |
|---|---|---|
| Voix | 160 octets | 160 octets |
| RTP | 16 octets | 12 octets, hors extensions et CSRC |
| UDP | 8 octets | 8 octets |
| IPv4 sans options | 20 octets | 20 octets |
| Ethernet sans préambule ni FCS | 14 octets | 14 octets dans ce même périmètre simplifié |
| GEM | 4 octets | 5 octets |
| Somme | **222 octets** | **219 octets** |

$$D=N_{\mathrm{paquets/s}}\times L_{\mathrm{paquet,octets}}\times8$$

Avec les nombres imposés par le TD : 50 × 222 × 8 = **88 800 bit/s = 88,8 kbit/s**. Le 222 compte déjà la voix ; ne pas ajouter encore 64 kbit/s à ce total.

**Attention au périmètre réel :** la seconde colonne « format minimal » garde l’exclusion du FCS pour comparer les tailles d’en-tête. Pour le transport d’une trame Ethernet dans GEM tel que décrit dans le corrigé, compter aussi le **FCS de 4 octets** : 219 + 4 = **223 octets**, soit **89,2 kbit/s**. Le préambule Ethernet et l’intervalle entre trames ne sont pas simplement transportés comme charge GEM. Ce total reste un modèle simplifié à un paquet par trame ; il n’inclut pas tous les surdébits physiques GPON, ni fragmentation, RTCP ou autres trafics.

Les **12 octets RTP** sont décrits dans la [RFC 3550](https://www.rfc-editor.org/rfc/rfc3550), et les **5 octets GEM** dans [UIT-T G.984.3](https://www.itu.int/rec/T-REC-G.984.3-201401-I). Dans une copie, annoncer les hypothèses du TD avant de calculer, puis expliquer l’écart avec les formats. Le codec cité « G709 » dans le sujet est clarifié en G.711 pour ce calcul. [Refaire Q4](#td/3/Q4).

## Identités : équipement, abonnement, opérateur et zone {#mobile-identites}

| Identifiant | Ce qu’il identifie | Piège courant |
|---|---|---|
| IMEI | L’équipement mobile | Ce n’est pas le numéro de téléphone |
| IMSI | L’abonnement sur les générations concernées | Ce n’est pas une position GPS |
| MSISDN | Numéro téléphonique de l’abonné | Il n’est pas identique à l’IMSI |
| TMSI / P-TMSI | Identité temporaire utilisée dans les domaines concernés | Sa valeur peut changer ; ne pas la traiter comme une identité permanente |
| GUTI / S-TMSI | Identités temporaires LTE, complète / courte | Ne pas les assimiler à un simple IMEI |
| MCC / MNC | Codes du pays et du réseau ; ensemble, ils identifient un PLMN | Le MNC doit être interprété avec son MCC |
| LAC / TAC | Code de zone de localisation / de suivi | Une zone contient souvent plusieurs cellules |
| PCI | Identité physique locale LTE/NR | Réutilisée ailleurs ; pas unique au monde |

Le **LAI** comprend MCC, MNC et LAC ; le **TAI** comprend l’identité du PLMN et le TAC. Une simple valeur de LAC ou TAC isolée n’identifie pas une zone mondiale. En itinérance, distinguer le réseau d’origine de la SIM et le réseau visité qui fournit l’accès radio.

Pour le TP5, recopier le type de champ et la technologie avec chaque valeur. L’IMSI, l’IMEI et des identifiants de capture sont des données personnelles : pour un compte rendu partagé, masquer les chiffres inutiles à l’explication. Ce cours n’invente pas tes identifiants ni les numéros présents dans une capture absente.

## Accès initial et sécurité : dérouler le TD3 Q5 à Q10 {#mobile-acces}

Dans la séquence **GSM** du sujet, le mobile ne commence pas par envoyer toute sa conversation. Il demande une ressource de signalisation sur le **RACH**, Random Access Channel, un canal d’accès partagé. À ce stade, cette demande seule ne prouve pas que l’abonné est déjà authentifié pour le service.

1. **CHANNEL REQUEST sur RACH** : petite demande avec une référence aléatoire et une cause d’accès. Deux mobiles peuvent entrer en collision.
2. **IMMEDIATE ASSIGNMENT sur AGCH**, Access Grant Channel : le réseau indique la ressource dédiée et une référence permettant au mobile de reconnaître la réponse à sa demande.
3. **Signalisation sur le canal alloué**, souvent un SDCCH : le mobile peut fournir l’identité attendue et demander le service.
4. **Authentification** : le réseau vérifie une réponse calculée à un défi.
5. **Activation du chiffrement**, puis établissement du service dans les conditions de la séquence étudiée.

Le réseau annonce notamment porteuse, créneau temporel, avance temporelle et, le cas échéant, paramètres de saut de fréquence. La demande initiale est courte parce que la ressource partagée et les collisions limitent ce qu’on peut y envoyer efficacement. La référence aléatoire aide à associer la réponse à la demande ; elle ne remplace pas une identité d’abonnement fiable.

La clé permanente **Ki** de la SIM n’est pas envoyée en clair comme réponse. Dans le modèle GSM, un défi RAND et la clé servent à produire une réponse SRES et une clé de chiffrement Kc. L’authentification vérifie le droit d’accès ; le chiffrement protège la confidentialité ; l’intégrité protège contre certaines modifications. Les mécanismes et garanties varient selon la génération : ne pas attribuer à la 2G toutes les propriétés de l’AKA 3G/LTE.

Une protection sur le lien radio n’est pas automatiquement une protection de bout en bout de l’application. [Canal initial Q5](#td/3/Q5), [allocation Q7](#td/3/Q7), [clé SIM Q10](#td/3/Q10).

## Attach, Detach, veille et paging {#mobile-veille}

**Attach / enregistrement** : le réseau conserve un contexte pour l’abonné et le service. **Detach** : demande de libération ou de retrait de cet enregistrement selon le domaine et la génération. Une extinction brutale peut ne pas envoyer le message ; le réseau peut conserver un contexte jusqu’à expiration ou détection. « Le mobile est éteint » ne garantit pas que tous les équipements ont déjà effacé toute information.

En LTE, **RRC Idle** signifie absence de connexion radio dédiée active. Le mobile peut rester enregistré et disposer d’un contexte de session. Il lit les informations système et surveille ses occasions de **paging**, qui lui demandent de reprendre contact. En **RRC Connected**, il dispose d’une connexion radio gérée par le réseau.

Le paging est diffusé dans les cellules de la zone de recherche appropriée ; un identifiant temporaire vise un abonné particulier. Il faut distinguer **qui peut recevoir la diffusion radio** et **qui est le destinataire logique**. Ce n’est pas une diffusion utile à tous les abonnés du pays. Le mobile qui se reconnaît lance la reprise de service et l’accès radio nécessaires ; la voix entière n’est pas transportée par le message de paging.

En GSM, le canal logique est le **PCH**, Paging Channel ; en LTE, le canal logique de contrôle de paging est le **PCCH**, transporté via les mécanismes radio correspondants. Le paging ordinaire n’est pas chiffré individuellement par une connexion dédiée déjà active ; les identités temporaires limitent l’exposition de l’identité permanente sans rendre tout suivi impossible.

En veille, changer de cellule est généralement une **resélection** ; en connexion active, le réseau peut organiser un **handover**. Changer de zone de suivi peut nécessiter une mise à jour, par exemple **TAU**, Tracking Area Update, en LTE. [Q11](#td/3/Q11), [Q16–Q17](#td/3/Q16), [Q19 à Q23](#td/3/Q19).

## Les tunnels GTP du TD : dessiner les deux plans {#mobile-gtp}

**GTP**, GPRS Tunnelling Protocol, encapsule des paquets pour les acheminer à travers le réseau mobile. **GTP-U** concerne le trafic utilisateur ; les procédures de gestion utilisent notamment GTP-C. Le tunnel n’est pas en lui-même un VPN chiffré : encapsulation et confidentialité sont des propriétés différentes.

<div class="course-flow" role="img" aria-label="Chemin utilisateur LTE connecté : mobile, eNodeB, S-GW, P-GW, Internet"><span>UE</span><b>→</b><span>eNodeB</span><b>→<small>S1-U</small></b><span>S-GW</span><b>→<small>S5 / S8</small></b><span>P-GW</span><b>→</b><span>Internet</span></div>

Dans le cas LTE/EPC ordinaire décrit ici, la libération de la connexion S1 retire le chemin S1-U vers l’eNodeB, tandis que le contexte de bearer et le segment entre S-GW et P-GW peuvent rester établis. Cela permet de retrouver le service après paging sans assimiler la veille à un désabonnement. Les cas particuliers d’architecture ne doivent pas être déduits d’un schéma simplifié.

En itinérance, un scénario **home routed** peut avoir le S-GW dans le réseau visité et le P-GW dans le réseau d’origine ; le segment inter-opérateurs est alors S8. En **local breakout**, l’ancrage et la sortie des données peuvent être dans le réseau visité. « SIM française à New York » ne suffit pas à choisir l’architecture : il faut des informations sur le réseau, le service et les extrémités effectives. Voir [RFC 6459](https://www.rfc-editor.org/rfc/rfc6459) et [3GPP TS 23.401 publiée par ETSI](https://www.etsi.org/deliver/etsi_ts/123400_123499/123401/18.08.00_60/ts_123401v180800p.pdf).

Le MME connaît un contexte de suivi ; le P-GW fournit l’ancrage IP de la session. Cela ne signifie pas que le P-GW connaît la position GPS exacte du téléphone. [Q18](#td/3/Q18), [Q22](#td/3/Q22), [Q23](#td/3/Q23).

## Timing Advance : calculer et interpréter {#mobile-ta}

Un mobile plus éloigné met davantage de temps à faire arriver son signal. L’**avance temporelle** le fait émettre plus tôt pour respecter les ressources temporelles à la réception. Une mesure de délai fournit une distance approximative, pas une direction : une distance seule décrit un cercle dans un modèle de carte plane.

Dans la convention LTE simplifiée du TP, TA est un **indice absolu** :

$$d\simeq TA\times78\,\mathrm{m}$$

**Exemple fictif :** TA = 23 ; d = 23 × 78 = **1794 m**. Temps de propagation dans un sens : t = d/c = 1794/(3 × 10⁸) = **5,98 µs**. Le facteur d’avance compense une convention liée au trajet temporel ; une commande relative d’ajustement n’est pas à multiplier aveuglément comme un indice absolu.

L’arrondi de 78 m masque une granularité et des erreurs de mesure. Cette formule n’est pas automatiquement valable pour une valeur GSM ou une autre numérologie 5G. Le secteur de l’antenne, d’autres mesures radio ou des observations supplémentaires peuvent améliorer la localisation, sans transformer le TA seul en coordonnées exactes. [TD3 Q13 à Q15](#td/3/Q13).

## TP5 : lire les fréquences, les mesures et une capture {#mobile-tp5}

Un **ARFCN / UARFCN / EARFCN / NR-ARFCN** est un numéro de canal selon la génération. Ce nombre ne se lit pas directement en MHz. La conversion dépend de la bande et de la règle de numérotation ; en LTE FDD, les fréquences montante et descendante sont distinctes. Le chapitre de référence ci-dessous développe les exemples de conversion.

En 3G WCDMA, plusieurs cellules peuvent partager une porteuse et utiliser des codes de brouillage distincts. Le code aide à les différencier ; il ne garantit pas une absence d’interférences. En LTE et NR, le PCI remplit un rôle d’identification physique avec d’autres mécanismes radio ; il ne s’appelle pas le code de brouillage 3G.

| Mesure | Sens | Interprétation |
|---|---|---|
| RSRP | Puissance des signaux de référence, en dBm | Plus proche de 0 : généralement plus forte ; pas une qualité complète |
| RSRQ | Rapport de qualité fondé sur les ressources et la puissance reçue, en dB | Sensible à la charge et aux interférences dans les conditions de mesure |
| SINR | Rapport signal / interférences et bruit, en dB | Plus élevé permet généralement une modulation/codage plus efficaces |
| RSSI | Puissance reçue globale sur un périmètre de mesure | Ne pas l’assimiler directement au RSRP |
| Débit | Bits par seconde dans le périmètre affiché | Préciser couche, sens et intervalle de mesure |

Une modulation **M-QAM** offre log₂(M) bits bruts par symbole : QPSK 2, 16-QAM 4, 64-QAM 6, 256-QAM 8. À 10 millions de symboles/s, 64-QAM donne 60 Mbit/s bruts par flux dans le modèle ; un taux de codage 3/4 donne 45 Mbit/s avant les autres surdébits. Le débit dépend aussi des ressources, du nombre de couches et des retransmissions : le nom de modulation seul ne suffit pas.

Pour répondre aux questions de capture du TP5 :

1. Identifier technologie, horodatage et sens de chaque message : mobile → réseau ou réseau → mobile.
2. Repérer l’état et les cellules avant/après un changement. Différencier handover actif, resélection et mise à jour de zone.
3. Pour un appel circuit 2G/3G : repérer **SETUP**, **ALERTING**, **CONNECT**, puis **DISCONNECT/RELEASE**. SETUP émis par le mobile indique un appel sortant ; reçu, un appel entrant dans cette séquence. Un appel VoLTE requiert une lecture SIP/IMS différente.
4. Calculer la conversation entre établissement et début de libération, sans inclure la sonnerie. Exemple fictif : CONNECT à 11:06:40 et DISCONNECT à 11:07:16 → **36 s**.
5. Regarder le sens du premier message qui initie la libération avant d’attribuer le raccrochage.
6. Pour les données 3G : relier Attach et activation du contexte PDP, APN, adresse et paramètres de service. En LTE, employer les termes EPS bearer ; en 5G SA, session PDU et DNN selon la procédure.
7. Lire les maxima de débit sur le graphique avec leur heure ; relever les modulations dans le même intervalle, en séparant upload et download.

Quand la capture n’est pas disponible, aucune heure, identité, fréquence de cellule ou valeur de débit réelle ne peut être déduite du seul énoncé. Le compte rendu explique alors quels champs consulter et comment calculer. Les exercices du site fournissent des captures fictives clairement identifiées pour pratiquer cette méthode.
