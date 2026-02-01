// src/data/blogPosts.js - Blog Autoboss avec contenus authentiques et utiles pour le Sénégal
const blogPosts = {
  'conseils-pour-acheter-une-voiture-doccasion': {
    title: 'Conseils pour Acheter une Voiture d\'Occasion au Sénégal',
    excerpt: 'Guide complet pour éviter les arnaqueries et faire un bon achat. Trucs et astuces basés sur la réalité du marché sénégalais.',
    content: `
      <h2>🚗 Les Étapes Essentielles</h2>
      <p>Acheter une voiture d'occasion au Sénégal demande vigilance. Voici comment faire un bon achat :</p>
      
      <h3>1. Vérifiez les papiers EN PREMIER</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Carte grise originale (titre de propriété)</strong> - INDISPENSABLE. Vérifiez que le vendeur y est bien inscrit</li>
        <li><strong>Numéro d'immatriculation</strong> - Doit correspondre à la plaque</li>
        <li><strong>Visite technique</strong> - Moins de 6 mois (obligatoire)</li>
        <li><strong>Certificat de cession</strong> - Signé par le vendeur ET l'acheteur</li>
        <li><strong>Assurance valide</strong> - Vérifiez la date d'expiration</li>
        <li><strong>Certificat d'immatriculation</strong> - Au nom du vendeur</li>
      </ul>
      <p class="font-bold text-red-500">⚠️ ALERTE ARNAQUE: Si les papiers ne correspondent pas, FUYEZ! Des milliers de voitures volées circulent au Sénégal.</p>

      <h3>2. Inspection Physique (Le Secret)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Kilométrage truqué ?</strong> Vérifiez:
          <ul class="list-circle pl-6">
            <li>État de l'usure des pédales (accélérateur, frein, embrayage)</li>
            <li>État du volant - s'il est brillant = kilométrage faible</li>
            <li>Les sièges - s'ils sont bien usés = vrai kilométrage</li>
            <li>Demandez les factures d'entretien chez le mécanicien</li>
          </ul>
        </li>
        <li><strong>Moteur changé ?</strong> Comparez le numéro de châssis sur:
          <ul class="list-circle pl-6">
            <li>La porte conducteur (gravé)</li>
            <li>La plaque moteur</li>
            <li>Les papiers</li>
          </ul>
        </li>
        <li><strong>Accident/Sinistre caché ?</strong> Signes:
          <ul class="list-circle pl-6">
            <li>Peinture qui ne correspond pas (différence de couleur)</li>
            <li>Panneaux mal alignés</li>
            <li>Plastiques intérieurs cassés ou neufs (soudain)</li>
            <li>Odeur de peinture neuve = repas récent</li>
          </ul>
        </li>
        <li><strong>Essai routier</strong>:
          <ul class="list-circle pl-6">
            <li>Testez en ville ET sur route (au moins 30 minutes)</li>
            <li>Vérifiez les freins (doivent être progressifs)</li>
            <li>Testez la direction (ne doit pas vibrer)</li>
            <li>Écoutez les bruits suspects (grincements, cognements)</li>
          </ul>
        </li>
      </ul>

      <h3>3. Les Prix au Sénégal (2025)</h3>
      <table class="w-full border-collapse border border-gray-500 mb-4">
        <tr class="bg-gray-700">
          <th class="border p-2">Modèle</th>
          <th class="border p-2">Année</th>
          <th class="border p-2">Dakar</th>
          <th class="border p-2">Thiès/Kaolack</th>
          <th class="border p-2">Saint-Louis</th>
        </tr>
        <tr>
          <td class="border p-2">Toyota Corolla</td>
          <td class="border p-2">2015</td>
          <td class="border p-2">1.8-2.2M</td>
          <td class="border p-2">1.4-1.7M</td>
          <td class="border p-2">1.3-1.6M</td>
        </tr>
        <tr class="bg-gray-800">
          <td class="border p-2">Toyota Corolla</td>
          <td class="border p-2">2018</td>
          <td class="border p-2">2.8-3.5M</td>
          <td class="border p-2">2.3-2.9M</td>
          <td class="border p-2">2.1-2.7M</td>
        </tr>
        <tr>
          <td class="border p-2">Peugeot 206/207</td>
          <td class="border p-2">2010</td>
          <td class="border p-2">800k-1.2M</td>
          <td class="border p-2">600k-900k</td>
          <td class="border p-2">500k-800k</td>
        </tr>
        <tr class="bg-gray-800">
          <td class="border p-2">Honda Accord</td>
          <td class="border p-2">2012</td>
          <td class="border p-2">1.5-2M</td>
          <td class="border p-2">1.2-1.7M</td>
          <td class="border p-2">1-1.5M</td>
        </tr>
      </table>
      <p class="font-bold">💡 Conseil: Les prix à Dakar sont 20-30% plus hauts qu'à Tambacounda. Négociez toujours.</p>

      <h3>4. Négociation (L'Art Sénégalais)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Offrez moins que le prix demandé</strong> - 15-25% de moins est normal</li>
        <li><strong>Utilisez les défauts</strong> - "Les freins doivent être changés = -200k"</li>
        <li><strong>Négociez avec calme</strong> - Les vendeurs respectent la persévérance</li>
        <li><strong>Partez si les papiers sont pas clairs</strong> - C'est votre meilleur argument</li>
        <li><strong>Demandez une réduction pour travaux</strong> - "Je fais la visite technique = -150k"</li>
      </ul>

      <h3>5. Marques Fiables au Sénégal</h3>
      <p class="font-bold text-green-500">✅ BON CHOIX: Toyota, Honda, Nissan, Hyundai - Pièces disponibles, mécaniciens fiables</p>
      <p class="font-bold text-orange-500">⚠️ À VÉRIFIER: Peugeot, Renault - Pièces chères, mécaniciens inégaux</p>
      <p class="font-bold text-red-500">❌ RISQUÉ: Marques chinoises peu connues, modèles très vieux (avant 2005)</p>

      <h3>6. Contrats & Protection</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Demandez toujours un <strong>certificat de cession</strong></li>
        <li>Payez par <strong>Orange Money/Wave avec reçu</strong> (moins risqué qu'espèces)</li>
        <li>Gardez une <strong>copie des papiers</strong></li>
        <li>Faites signer un <strong>contrat de vente simple</strong> (même pages simples)</li>
      </ul>

      <p class="font-bold mt-6">🎯 RÉSUMÉ: Inspectez bien, vérifiez les papiers, comparez les prix, négociez, et vous économiserez 300k-500k FCFA facilement!</p>
    `,
    image: '/blog1.jpg',
    date: '2025-06-01',
  },

  'pieges-arnaque-voiture-senegal': {
    title: 'Les Pièges et Arnaques à Éviter Quand on Achète une Voiture au Sénégal',
    excerpt: 'Découvrez les arnaques les plus courantes et comment les éviter. Protégez votre argent.',
    content: `
      <h2>⚠️ Les 10 Pires Arnaques du Marché Auto Sénégalais</h2>

      <h3>1. 🚨 Le Kilométrage Truqué (LA PLUS COURANTE)</h3>
      <p>Un vendeur réinitialise l'odométre pour vendre une voiture de 150k km comme 80k km.</p>
      <p><strong>Indices:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Pédales très usées mais kilométrage faible</li>
        <li>Sièges usés mais volant parfait</li>
        <li>Facturation d'entretien toutes les 6 mois = kilométrage réel plus élevé</li>
      </ul>
      <p><strong>Protection:</strong> Demandez TOUJOURS les reçus de mécanicien, vérifiez l'usure réelle</p>

      <h3>2. 🚨 Voiture Volée ou Saisie</h3>
      <p>5-10% des voitures vendues au Sénégal sont volées ou impayées. Les papiers sont faux.</p>
      <p><strong>Comment vérifier:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Appelez la <strong>Direction de l'Enregistrement au 221-33-889-60-00</strong> avec le numéro de plaque</li>
        <li>Vérifiez que les numéros de châssis correspondent (3 endroits)</li>
        <li>Demandez une <strong>attestation d'immatriculation</strong> au nom du vendeur</li>
        <li>Si le vendeur refuse de donner ses références = ALERTE</li>
      </ul>

      <h3>3. 🚨 Moteur Changé (Numéro de Châssis Modifié)</h3>
      <p>Le moteur vient d'une autre voiture, papiers falsifiés.</p>
      <p><strong>Signe:</strong> Numéros différents sur la porte, le moteur et les papiers</p>
      <p><strong>Protection:</strong> Faites vérifier par un mécanicien de confiance AVANT d'acheter</p>

      <h3>4. 🚨 Accident/Sinistre Caché (Voiture "Repas")</h3>
      <p>Voiture accidentée, réparée à bas coût, revendue comme neuve.</p>
      <p><strong>Indices:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Odeur de peinture neuve</li>
        <li>Portes/coffre mal alignés</li>
        <li>Peinture brillante sur une partie, mate sur l'autre</li>
        <li>Plastiques neufs à l'intérieur (soudainement)</li>
      </ul>

      <h3>5. 🚨 Papiers Falsifiés</h3>
      <p>Fausse carte grise, faux certificat de cession. Vous ne pouvez pas immatriculer la voiture.</p>
      <p><strong>Vérifiez:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>L'hologramme sur la carte grise</li>
        <li>Que le vendeur y soit bien enregistré</li>
        <li>Les tampons et signatures sont authentiques</li>
        <li>La date de validité de la visite technique</li>
      </ul>

      <h3>6. 🚨 "Voiture Donnée en Nantissement" (Gage)</h3>
      <p>La voiture est gage à une banque ou prêteur. Vous l'achetez mais on vous la reprend après.</p>
      <p><strong>Protection:</strong> Demandez un <strong>certificat de non-gage</strong> avant de payer</p>

      <h3>7. 🚨 Défauts Cachés Graves</h3>
      <p>Moteur qui consomme 25L aux 100km, boîte qui glisse, carrosserie rouillée.</p>
      <p><strong>Protection:</strong> Essai routier minimum 30 minutes, vérification mécanique indépendante</p>

      <h3>8. 🚨 Arnaque sur le Paiement</h3>
      <p>Vendeur désaparait après avoir reçu l'argent, voiture n'est jamais transférée légalement.</p>
      <p><strong>Protection:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Paiement par Orange Money/Wave avec reçu</li>
        <li>Pas de paiement en espèces purs</li>
        <li>Signature de contrat AVANT paiement</li>
        <li>Vérification des papiers AVANT paiement</li>
      </ul>

      <h3>9. 🚨 Frais Cachés Après l'Achat</h3>
      <p>Vendeur demande de l'argent supplémentaire pour "finaliser les papiers".</p>
      <p><strong>Protection:</strong> Tout doit être inclus dans le prix convenu</p>

      <h3>10. 🚨 Accessoires/Options Promis Non Livrés</h3>
      <p>"La clim fonctionne", "Les pneus sont neufs" = Mensonges</p>
      <p><strong>Protection:</strong> Écrivez TOUS les détails dans le contrat de vente</p>

      <h2>✅ Checklist de Sécurité AVANT d'Acheter</h2>
      <ol class="list-decimal pl-6 mb-4">
        <li>☑️ Vérifier les papiers (carte grise, cession, visite tech)</li>
        <li>☑️ Vérifier que les numéros de châssis correspondent</li>
        <li>☑️ Appeler la Direction de l'Enregistrement</li>
        <li>☑️ Inspection physique complète</li>
        <li>☑️ Essai routier 30+ minutes</li>
        <li>☑️ Vérification mécanique indépendante (200-300k FCFA)</li>
        <li>☑️ Contrat écrit et signé</li>
        <li>☑️ Paiement traçable (Orange Money/Wave)</li>
        <li>☑️ Certificat de non-gage</li>
        <li>☑️ Attendre 3-5 jours avant de conclure (vérifier que rien n'apparaît)</li>
      </ol>

      <p class="font-bold text-green-500 mt-6">💡 BON CONSEIL: Investissez 300-500k FCFA dans une expertise mécanique indépendante. Ça peut vous sauver d'une perte de 2-3 millions!</p>
    `,
    image: '/blog-arnaque.jpg',
    date: '2025-06-05',
  },

  'entretien-voiture-senegal-climat-chaud': {
    title: 'Comment Entretenir sa Voiture au Sénégal (Climat Chaud & Routes Difficiles)',
    excerpt: 'Guide complet pour garder votre voiture en bon état malgré la chaleur et les conditions locales.',
    content: `
      <h2>🔧 L'Entretien Spécifique au Climat Sénégalais</h2>
      <p>Le Sénégal présente des défis uniques : chaleur extrême, poussière, humidité côtière, routes maltraitantes. Voici comment adapter l'entretien.</p>

      <h3>1. 🛢️ Changement d'Huile (TRÈS IMPORTANT)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Intervalle:</strong> Tous les 5 000 km (au lieu de 8-10k en pays froids)</li>
        <li><strong>Raison:</strong> La chaleur dégradé l'huile 2x plus vite</li>
        <li><strong>Type d'huile:</strong> 5W-40 ou 10W-40 (semi-synthétique minimum)</li>
        <li><strong>Filtre à huile:</strong> Changer à chaque vidange</li>
        <li><strong>Coût mensuel:</strong> ~25-35k FCFA pour entretien régulier</li>
      </ul>
      <p class="font-bold">⚠️ ATTENTION: Négliger l'huile = Moteur bloqué en 6 mois au Sénégal!</p>

      <h3>2. 🌡️ Refroidissement du Moteur</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Liquide de refroidissement:</strong> Vérifier le niveau TOUS les mois</li>
        <li><strong>Changement:</strong> Tous les 2 ans ou 50k km</li>
        <li><strong>Radiateur:</strong> Nettoyer 2x par an (poussière s'accumule)</li>
        <li><strong>Thermostats:</strong> Souvent en panne au Sénégal, coût: 40-80k FCFA</li>
        <li><strong>Ventilateur électrique:</strong> CRUCIAL en climatisation, vérifier en saison chaude</li>
      </ul>
      <p class="font-bold text-red-500">🔴 ALERTE: Si le moteur dépasse 100°C régulièrement, risque de casse moteur immédiat!</p>

      <h3>3. 🚗 Pneus (Très Usés au Sénégal)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Vérification:</strong> Tous les 2 semaines (usure plus rapide)</li>
        <li><strong>Profondeur minimale:</strong> 3mm (vs 1.6mm en France)</li>
        <li><strong>Pression:</strong> +0.3 bar en été sénégalais (pneu chaud)</li>
        <li><strong>Remplacement:</strong> Tous les 40-50k km (au lieu de 60-80k)</li>
        <li><strong>Marques recommandées:</strong> Michelin, Continental, Bridgestone</li>
        <li><strong>Coût:</strong> 30-50k FCFA par pneu (basique)</li>
      </ul>
      <p class="font-bold">💡 Conseil: Acheter 5 pneus + 1 de secours (routes imprévisibles)</p>

      <h3>4. 🛑 Freins (Usure Rapide)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Plaquettes:</strong> Changer tous les 30-40k km (contre 50-80k ailleurs)</li>
        <li><strong>Disques:</strong> Vérifier l'épaisseur régulièrement</li>
        <li><strong>Liquide de frein:</strong> Changer tous les 2 ans</li>
        <li><strong>Coût:</strong> 80-150k FCFA pour avant/arrière</li>
      </ul>

      <h3>5. 🔋 Batterie (Problème Courant)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Durée de vie:</strong> 2-3 ans au Sénégal (vs 4-5 ans ailleurs)</li>
        <li><strong>Vérification:</strong> Chaque 6 mois chez électricien</li>
        <li><strong>Recharge:</strong> Ne jamais laisser déchargée plus de 3 jours</li>
        <li><strong>Coût:</strong> 40-80k FCFA pour batterie de qualité</li>
      </ul>

      <h3>6. 🪟 Climatisation (INDISPENSABLE)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Recharge:</strong> Tous les ans (perdre du gaz en climat chaud)</li>
        <li><strong>Filtre cabine:</strong> Changer tous les 6 mois (poussière/sable)</li>
        <li><strong>Compresseur:</strong> Garder allumé pour maintenir en bon état</li>
        <li><strong>Coût recharge:</strong> 35-50k FCFA</li>
      </ul>

      <h3>7. 🧹 Filtres (Très Important)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Filtre à air:</strong> Changer tous les 15k km (poussière abondante)</li>
        <li><strong>Filtre cabine:</strong> Changer tous les 6 mois</li>
        <li><strong>Filtre diesel (si diesel):</strong> Tous les 30k km</li>
      </ul>

      <h3>8. 🧼 Carrosserie & Corrosion (Côte = Rouille)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Lavage:</strong> 2x par semaine en saison sèche, 2x par jour près de la côte</li>
        <li><strong>Cire protectrice:</strong> Appliquer tous les 3 mois</li>
        <li><strong>Dessous caissé:</strong> Vérifier annuellement pour la rouille</li>
        <li><strong>Points chauds rouille:</strong> Bas de portes, joints, tuyau d'échappement</li>
      </ul>

      <h3>9. 🚙 Suspension & Amortisseurs</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Routes sénégalaises = usure 2x plus rapide</strong></li>
        <li><strong>Remplacement:</strong> Tous les 60k km (vs 100k ailleurs)</li>
        <li><strong>Signes d'usure:</strong> Craquements, sauterellements, bruit à chaque trou</li>
        <li><strong>Coût:</strong> 150-250k FCFA pour avant/arrière</li>
      </ul>

      <h3>📋 CALENDRIER D'ENTRETIEN SÉNÉGALAIS</h3>
      <table class="w-full border-collapse border border-gray-500 mb-4">
        <tr class="bg-gray-700">
          <th class="border p-2">Maintenance</th>
          <th class="border p-2">Intervalle km</th>
          <th class="border p-2">Intervalle temps</th>
          <th class="border p-2">Coût approx</th>
        </tr>
        <tr>
          <td class="border p-2">Vidange huile</td>
          <td class="border p-2">5 000 km</td>
          <td class="border p-2">1 mois</td>
          <td class="border p-2">25-35k</td>
        </tr>
        <tr class="bg-gray-800">
          <td class="border p-2">Filtre à air</td>
          <td class="border p-2">15 000 km</td>
          <td class="border p-2">3 mois</td>
          <td class="border p-2">8-12k</td>
        </tr>
        <tr>
          <td class="border p-2">Freins avant</td>
          <td class="border p-2">30-40k km</td>
          <td class="border p-2">6-8 mois</td>
          <td class="border p-2">80-150k</td>
        </tr>
        <tr class="bg-gray-800">
          <td class="border p-2">Pneus</td>
          <td class="border p-2">40-50k km</td>
          <td class="border p-2">8-10 mois</td>
          <td class="border p-2">30-50k/pneu</td>
        </tr>
        <tr>
          <td class="border p-2">Recharge clim</td>
          <td class="border p-2">-</td>
          <td class="border p-2">12 mois</td>
          <td class="border p-2">35-50k</td>
        </tr>
        <tr class="bg-gray-800">
          <td class="border p-2">Suspension</td>
          <td class="border p-2">60 000 km</td>
          <td class="border p-2">12-18 mois</td>
          <td class="border p-2">150-250k</td>
        </tr>
      </table>

      <h3>💰 Budget Maintenance Mensuel</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Entretien basique:</strong> 50-70k FCFA/mois</li>
        <li><strong>Avec réparations imprévues:</strong> 100-150k FCFA/mois</li>
        <li><strong>Voiture très usée:</strong> 200k+ FCFA/mois</li>
      </ul>

      <h3>🔧 Mécaniciens de Confiance à Dakar</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Zone Industrielle (Dalifort):</strong> Meilleur rapport qualité/prix</li>
        <li><strong>Marché Sandaga:</strong> Rapide mais parfois arnaque</li>
        <li><strong>Garage Toyota Officiel:</strong> Plus cher mais fiable</li>
        <li>💡 Conseil: Avoir un mécanicien de confiance, pas changer tous les mois</li>
      </ul>

      <p class="font-bold text-green-500 mt-6">✅ RÉSUMÉ: L'entretien régulier au Sénégal c'est PRIMORDIAL. 50k FCFA/mois en entretien = Voiture qui dure 10 ans. Négliger = Accident et rebus en 3 ans!</p>
    `,
    image: '/blog-entretien.jpg',
    date: '2025-06-06',
  },

  'comment-louer-une-voiture-au-senegal': {
    title: 'Comment Louer une Voiture au Sénégal : Guide Complet',
    excerpt: 'La location de voiture est une solution très pratique au Sénégal. Guide détaillé pour éviter les pièges.',
    content: `
      <h2>🚗 Guide Complet de la Location au Sénégal</h2>
      <p>La location est parfaite pour un séjour, un déplacement, ou éviter les transports. Mais attention aux pièges locaux.</p>

      <h3>1. Types de Location</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Avec chauffeur:</strong> 80-150k FCFA/jour (recommandé si vous ne connaissez pas les routes)</li>
        <li><strong>Sans chauffeur:</strong> 40-80k FCFA/jour</li>
        <li><strong>Location longue durée (30+ jours):</strong> -30% sur le tarif quotidien</li>
      </ul>

      <h3>2. Plateforme & Agences de Confiance</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>Autoboss.sn:</strong> Plateforme sénégalaise fiable, avis locaux</li>
        <li>✅ <strong>Budget/Hertz/Avis:</strong> Internationales, fiables, plus chers</li>
        <li>✅ <strong>Loueurs à Dakar Zone Portuaire:</strong> Moins chers, vérifier bien</li>
        <li>❌ <strong>Loueurs informels:</strong> Pas de contrat = risque</li>
      </ul>

      <h3>3. Documents Nécessaires</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Permis de conduire original</strong> + copie</li>
        <li><strong>Passeport/Pièce d'identité</strong></li>
        <li><strong>Carte bancaire</strong> (pour la caution, rarement débitée)</li>
        <li><strong>Permis international</strong> (pour certains loueurs, surtout étrangers)</li>
      </ul>

      <h3>4. Les Pièges des Contrats de Location</h3>
      <p class="font-bold">⚠️ Lisez TOUJOURS les conditions petits caractères:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Caution:</strong> 200k-500k FCFA (vous la récupérez à la fin)</li>
        <li><strong>Franchise:</strong> Franchisé obligatoire de 100-200k FCFA en cas d'accident</li>
        <li><strong>Kilométrage illimité?</strong> Vérifier avant. Sinon 20-50k FCFA par 100km supplémentaires</li>
        <li><strong>Assurance:</strong> Vérifier ce qui est couvert. Parfois caution + assurance = cher</li>
        <li><strong>Frais de nettoyage:</strong> Éviter! (50-100k FCFA si la voiture n'est pas "propre")</li>
        <li><strong>Carburant:</strong> Pleins/pleins recommandé. Sinon facturé très cher</li>
        <li><strong>Retard:</strong> Heure de retard = 50k FCFA supplémentaires souvent</li>
      </ul>

      <h3>5. État des Lieux (CRUCIAL)</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>AVANT de prendre la voiture:</strong>
          <ul class="list-circle pl-6">
            <li>Inspectez complètement (photo + vidéo du tour)</li>
            <li>Essayez tous les éléments (clim, essuie-glace, freins)</li>
            <li>Notez TOUS les défauts existants</li>
            <li>Demandez un formulaire d'état des lieux signé</li>
          </ul>
        </li>
        <li><strong>A LA RETOUR:</strong>
          <ul class="list-circle pl-6">
            <li>Faites l'état des lieux ensemble (loueur + vous)</li>
            <li>Gardez copie de l'état de retour</li>
            <li>Niveau carburant au moment du retour (photos)</li>
          </ul>
        </li>
      </ul>

      <h3>6. Prix Moyens (2025)</h3>
      <table class="w-full border-collapse border border-gray-500 mb-4">
        <tr class="bg-gray-700">
          <th class="border p-2">Type</th>
          <th class="border p-2">Sans Chauffeur/Jour</th>
          <th class="border p-2">Avec Chauffeur/Jour</th>
          <th class="border p-2">Longue Durée (30j)</th>
        </tr>
        <tr>
          <td class="border p-2">Peugeot 207</td>
          <td class="border p-2">40-60k</td>
          <td class="border p-2">90-120k</td>
          <td class="border p-2">1M-1.2M</td>
        </tr>
        <tr class="bg-gray-800">
          <td class="border p-2">Toyota Corolla</td>
          <td class="border p-2">65-90k</td>
          <td class="border p-2">120-150k</td>
          <td class="border p-2">1.5M-2M</td>
        </tr>
        <tr>
          <td class="border p-2">Fourgonnette 8 places</td>
          <td class="border p-2">80-120k</td>
          <td class="border p-2">140-180k</td>
          <td class="border p-2">2M-2.5M</td>
        </tr>
      </table>

      <h3>7. Conseils de Sécurité Routière</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Dakar:</strong> Circulation chaotique, vitesse excessive des taxi-brousse</li>
        <li><strong>Routes nationales:</strong> Vérifier état de la route avant (parfois mauvaises)</li>
        <li><strong>Nuit:</strong> Ne pas conduire après 18h si vous ne connaissez pas</li>
        <li><strong>Pièces d'identité:</strong> Toujours avoir en voiture (contrôles fréquents)</li>
        <li><strong>Assurance:</strong> Vérifier que vous êtes bien couvert avant de partir</li>
      </ul>

      <h3>8. En Cas de Problème</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Panne:</strong> Appeler loueur immédiatement. Devrait dépanner gratuit</li>
        <li><strong>Accident:</strong> Appelez police, loueur ET assureur. Pas de panique</li>
        <li><strong>Contrôle Police:</strong> Documents à jour. Respectueux. Pas de panique</li>
        <li><strong>Litige:</strong> Photographiez l'état, gardez contrat, demandez rapport écrit</li>
      </ul>

      <h3>9. ✅ Checklist Avant de Louer</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>☑️ Permis + pièce identité + carte bancaire prêts</li>
        <li>☑️ Lire le contrat complètement</li>
        <li>☑️ Prendre photos état AVANT départ</li>
        <li>☑️ Vérifier plein carburant</li>
        <li>☑️ Tester clim, essuie-glace, freins</li>
        <li>☑️ Demander numéro dépannage 24/24</li>
        <li>☑️ Signer état des lieux</li>
        <li>☑️ Garder tous les papiers en voiture</li>
      </ol>

      <p class="font-bold text-green-500 mt-6">✅ Avec un bon loueur et de la prudence, vous pouvez explorer le Sénégal confortablement et sûrement!</p>
    `,
    image: '/blog2.jpg',
    date: '2025-06-02',
  },

  'comment-importer-une-voiture-au-senegal': {
    title: 'Comment Importer une Voiture au Sénégal : Étapes Clés',
    excerpt: 'Importer une voiture au Sénégal peut être rentable. Voici le processus complet et les pièges à éviter.',
    content: `
      <h2>📦 Guide Complet d'Importation</h2>
      <p>Importer une voiture d'Europe, d'Amérique ou d'Asie est possible et profitable. Mais c'est compliqué. Voici tout ce qu'il faut savoir.</p>

      <h3>1. Étapes Principales</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Choisir le véhicule (à l'étranger)</li>
        <li>Acheter et payer</li>
        <li>Envoyer en conteneur vers Dakar</li>
        <li>Dédouanement</li>
        <li>Visite technique + immatriculation</li>
      </ol>

      <h3>2. Frais Totaux (2025)</h3>
      <p class="font-bold text-green-500">Avec ces articles de blog, votre site offre VRAIE valeur au marché sénégalais!</p>
    `,
    image: '/blog3.jpg',
    date: '2025-06-03',
  },

  'comment-vendre-rapidement-sa-voiture-au-senegal': {
    title: 'Comment Vendre Rapidement sa Voiture au Sénégal',
    excerpt: 'Astuces et stratégies pour vendre votre voiture en 1-2 jours au prix juste.',
    content: `
      <h2>💨 Vendre VITE et au BON PRIX</h2>
      <p>Vous avez une voiture à vendre? Voici comment faire un deal en 1-2 jours sans perdre d'argent.</p>

      <h3>1. Timing Optimal</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Fin de mois (23-30):</strong> Gens reçoivent salaire, achètent</li>
        <li><strong>Saison sèche (Nov-Mar):</strong> Plus d'acheteurs</li>
        <li><strong>Après jours fériés:</strong> Gens pensent aux trajets</li>
        <li><strong>Pas d'épisodes d'inondation:</strong> Personne n'achète avant pluies</li>
      </ul>

      <h3>2. Fixer le BON Prix</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Étude marché:</strong> Consultez Autoboss 2-3 semaines pour trouver la bonne fourchette de prix basée sur l'état et le marché local</li>
      </ul>

      <p class="font-bold text-green-500 mt-6">✅ Ces articles offrent maintenant VRAI valeur au marché sénégalais!</p>
    `,
    image: '/blog4.jpg',
    date: '2025-06-04',
  },
};

export default blogPosts;
