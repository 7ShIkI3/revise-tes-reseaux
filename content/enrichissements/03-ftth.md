<div class="lesson-intro"><strong>Objectif TP3.</strong> Comprendre ce que l’on configure dans un accès FTTH : la liaison optique, l’enregistrement de la box, les services GPON, puis l’accès IP et la téléphonie. Un voyant « connecté » ne valide pas tous ces étages.</div>

## Du vocabulaire à un trajet concret {#ftth-vocabulaire}

**FTTH**, Fiber To The Home, signifie fibre jusqu’au logement. **PON**, Passive Optical Network, désigne un réseau dont la distribution optique ne nécessite pas d’équipement actif alimenté entre l’OLT et les abonnés. « Passif » concerne cette distribution ; les deux extrémités sont actives.

| Abréviation | Nom et rôle |
|---|---|
| NRO | Nœud de raccordement optique : site opérateur qui accueille les équipements d’accès |
| OLT | Optical Line Terminal : équipement actif côté opérateur, pilote un ou plusieurs arbres PON |
| ODN | Optical Distribution Network : ensemble passif de fibres, raccords et splitters |
| PM | Point de mutualisation : permet l’accès des opérateurs à la partie mutualisée |
| PBO | Point de branchement optique : raccordement à proximité des abonnés |
| PTO | Prise terminale optique : terminaison passive du logement |
| ONU / ONT | Optical Network Unit / Terminal : terminaison active côté abonné ; la documentation de la box emploie les deux termes |
| Box | Peut réunir ONT, routeur IP, switch Ethernet, Wi-Fi et adaptateur téléphonique |

<div class="course-flow" role="img" aria-label="Trajet pédagogique du réseau opérateur vers le PC abonné"><span>Réseau opérateur</span><b>→</b><span>OLT</span><b>→</b><span>Distribution passive<br><small>fibres et splitter</small></span><b>→</b><span>ONT / box</span><b>→</b><span>PC du LAN</span></div>

Une PTO ne remplace pas un ONT : elle termine le câble, mais ne décode pas le flux GPON. Un port GEM ne remplace pas une prise Ethernet : il identifie un flux logique. Une adresse IP de gestion ne remplace pas le numéro de série d’une ONU.

## Pourquoi le débit et le temps sont partagés {#ftth-partage}

L’OLT dessert plusieurs abonnés par un même port PON. Les débits usuels de GPON sont **2,48832 Gbit/s descendants** et **1,24416 Gbit/s montants**, avant les surdébits. Une division égale sert d’exercice ; elle n’est pas une promesse commerciale ni une description exacte de l’allocation dynamique.

**Exemple : 32 abonnés actifs.** Descendant égalitaire brut : 2,48832 × 10⁹ / 32 = **77,76 Mbit/s par abonné**. Montant : 1,24416 × 10⁹ / 32 = **38,88 Mbit/s**. Le débit utile tient compte des en-têtes, du trafic simultané et des profils.

Le descendant est diffusé optiquement dans les branches. En montant, chaque ONU utilise les créneaux autorisés par l’OLT afin d’éviter les collisions à l’arrivée. Le **ranging** estime les délais dus aux distances ; il ajuste le calendrier des salves. La **DBA**, Dynamic Bandwidth Allocation, arbitre les ressources montantes selon les besoins et les profils.

Une trame dure **125 µs**. À 2,48832 Gbit/s, elle transporte un équivalent brut de 2,48832 × 10⁹ × 125 × 10⁻⁶ = **311 040 bits**, soit **38 880 octets**. On multiplie ici un débit par une durée : bit/s × s = bits. Ne pas traiter 125 µs comme 125 secondes.

## GEM, T-CONT, VLAN et QoS, séparément {#ftth-services}

Imagine un système de livraison : il faut identifier le contenu, regrouper ce qui attend de partir et attribuer le temps de départ. Ces rôles ne sont pas tous assurés par le même identifiant.

| Notion | Ce qu’elle fait | Ce qu’elle ne signifie pas |
|---|---|---|
| GEM, GPON Encapsulation Method | Transporte et identifie des flux GPON ; un GEM Port-ID est logique | Une prise physique numérotée sur la box |
| T-CONT, Transmission Container | Regroupe des ressources de transmission montante identifiées pour l’allocation ; on lui associe un profil de bande passante | Une longueur d’onde ou un port RJ45 |
| DBA | Décide des ressources montantes attribuées | Un protocole qui donne une adresse IP |
| VLAN | Sépare des réseaux logiques Ethernet ; une étiquette peut identifier la classe de trafic | Une fibre supplémentaire |
| QoS, Quality of Service | Applique des règles de priorité, de débit ou de délai | Une garantie infinie sans ressources disponibles |

Un service Internet, un service voix et un service TV peuvent être associés à des flux distincts. Un VLAN peut être associé à un GEM ; cela demande une **correspondance configurée**, pas une égalité numérique universelle. Le GEM 52 n’est pas nécessairement le VLAN 52.

Le nombre de T-CONT et de GEM proposés par une box dépend de son modèle et de son logiciel. Le TP contient des relevés d’un matériel précis ; ils ne deviennent pas les capacités de toutes les ONT. Pour répondre, noter le modèle, le champ consulté et la valeur réellement affichée.

## Budget optique et atténuateur du banc {#ftth-budget}

Un montage court peut recevoir trop de puissance. L’atténuateur volontaire protège la fenêtre de fonctionnement du récepteur ; il ne rend pas la liaison « plus rapide ». La plage admissible dépend de la classe optique et du module. Le sujet utilise une plage de −8 à −28 dBm : l’utiliser comme hypothèse du TP, puis vérifier la fiche du matériel pour une installation réelle.

**Exemple fictif :** source à +2 dBm et atténuateur de 10 dB ; sans autres pertes, Pr = 2 − 10 = **−8 dBm**. Avec 1 dB de pertes supplémentaires, Pr = **−9 dBm**. La marge au seuil faible de −28 dBm vaut 19 dB ; la marge avant surcharge à −8 dBm vaut seulement 1 dB.

$$M_{\mathrm{faible}}=P_r-S_{\mathrm{min}}\qquad M_{\mathrm{surcharge}}=S_{\mathrm{max}}-P_r$$

Les puissances sont en dBm et les marges en dB. Il faut satisfaire **les deux** seuils. La puissance TX lue sur l’ONU correspond au sens montant ; sa puissance RX au descendant. Soustraire TX et RX du même écran ne donne pas forcément la perte d’un trajet, car elles concernent deux émetteurs et deux sens différents.

## TP3 : comprendre chaque étape de configuration {#ftth-tp3}

Le parcours du TP va du support vers le service. À chaque étape, un test répond à une question précise.

| Étape | Action décrite dans le sujet | Ce qu’elle vérifie |
|---|---|---|
| 1. Gestion | PC dans le sous-réseau de l’interface OLT | Le PC peut joindre l’administration |
| 2. Découverte | Autofind détecte l’ONU sur le port PON | Le lien permet la découverte optique |
| 3. Enregistrement | Autoriser le numéro de série selon le mode retenu | L’OLT accepte cette ONU |
| 4. État | Lire Online, Config Status, Match Status et puissance | L’ONU est enregistrée et sa configuration cohérente |
| 5. Liaison opérateur | Activer et associer les interfaces ou VLAN attendus | Le trafic possède un chemin côté réseau |
| 6. WAN de la box | Client DHCP, route par défaut et DNS | La box possède une configuration IP amont |
| 7. LAN de la box | DHCP local et ports Ethernet actifs | Le PC reçoit une configuration utilisable |
| 8. Services | NAT, Wi-Fi, SIP ; appliquer et pousser la configuration | Les paramètres sont réellement transmis à la box |

**Sous-réseau de gestion :** 192.168.1.20/24 et 192.168.1.1/24 appartiennent au même réseau 192.168.1.0/24. /24 signifie 24 bits de préfixe, soit un masque 255.255.255.0. Le PC peut joindre l’OLT directement sur cette liaison ; elle ne nécessite pas une seconde passerelle par défaut si une autre interface assure Internet.

Le document annoté corrige son instruction initiale « routed port » en **interface VLAN 1 configurée en DHCP, port GE associé au VLAN 1**. Le cours conserve cette correction du TP. Les menus exacts et les bornes de distance restent ceux du matériel utilisé. Une portée paramétrable de 60 km ne prouve pas qu’un budget optique donné fonctionne à 60 km.

## LAN, WAN, DHCP, DNS et NAT sur un exemple {#ftth-ip}

Le **LAN** est le réseau local derrière la box ; le **WAN** est son côté réseau amont. Le **DHCP** fournit notamment adresse, masque, passerelle et DNS. Le **DNS** traduit un nom en adresse. Le **NAT** traduit des adresses ; le partage de plusieurs clients avec suivi de ports est généralement du NAPT/PAT.

**Exemple fictif.** Le PC reçoit 192.168.10.20/24, passerelle 192.168.10.1. La box utilise cette adresse côté LAN et une autre côté WAN. Pour joindre une destination extérieure au /24, le PC remet ses paquets à la box ; la box suit sa route par défaut vers l’amont et peut traduire l’adresse source. La réponse revient grâce à l’état de traduction.

Une adresse WAN attribuée par le réseau de la salle peut être privée : elle n’est pas automatiquement une adresse publique Internet. Dans ce TP, le réseau universitaire joue le rôle d’amont ; il peut réaliser d’autres traductions ou filtrages.

**Diagnostic progressif :** vérifier d’abord l’adresse du PC, puis l’accès à la box, puis à une destination IP autorisée, enfin la résolution d’un nom. Si l’adresse IP extérieure fonctionne mais pas un nom, chercher du côté du DNS. Si le PC reçoit une adresse automatique 169.254.x.x, il n’a généralement pas reçu de réponse DHCP utilisable. Un ping filtré ne prouve pas à lui seul que tout le réseau est en panne.

## Téléphonie, Wi-Fi et médias du TP3 {#ftth-toip}

**ToIP** est la téléphonie sur IP. Un téléphone analogique branché à la box est converti par un adaptateur interne. **SIP** gère la signalisation : enregistrement du compte et établissement de session. **RTP** transporte les médias ; le codec, par exemple G.711, transforme la voix en données. **SDP** décrit notamment les paramètres médias dans la négociation.

<div class="course-flow" role="img" aria-label="SIP établit la session tandis que RTP transporte la voix"><span>SIP<br><small>établir et terminer</small></span><b>≠</b><span>RTP<br><small>paquets audio</small></span><b>←</b><span>Codec<br><small>voix → échantillons</small></span></div>

Un compte SIP enregistré ne garantit pas que l’audio traverse le NAT. « Ça sonne, mais on n’entend rien » invite à vérifier RTP, les adresses et ports annoncés, les codecs et les règles de traduction. Un codec compatible doit être accepté aux extrémités ; un numéro disponible dans un PBX est une donnée de l’exercice, pas un identifiant à inventer.

Pour le Wi-Fi, le **SSID** est le nom du réseau. Le **band steering** encourage l’usage d’une bande selon les possibilités du client et la politique de la box. Un speedtest Wi-Fi mesure toute une chaîne : radio locale, box, accès, réseau et serveur. Un mauvais résultat ne permet pas d’accuser la fibre seule.

**Travail sans banc :** dessiner le trajet PC → LAN → box → GEM/VLAN → OLT → amont ; annoter où se trouvent DHCP, DNS, NAT, SIP et RTP. Puis simuler une panne à chaque étage et expliquer le test qui permet de la distinguer. Pour calculer le débit vocal avec les en-têtes : [TD3 Q1 à Q4](#td/3/Q1) et le chapitre mobile détaillé.
