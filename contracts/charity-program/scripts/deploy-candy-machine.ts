import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from '@metaplex-foundation/js';
import {
  CandyMachine,
  mplCandyMachine,
  CandyMachineConfigLine,
} from '@metaplex-foundation/mpl-candy-machine';
import fs from 'fs';
import path from 'path';

async function deployCandyMachine() {
  // Connexion à Solana devnet
  const connection = new Connection('https://api.devnet.solana.com');
  
  // Charger la configuration
  const rawConfig = fs.readFileSync(
    path.join(__dirname, '../config/candy-machine-config.json')
  );
  const config = JSON.parse(rawConfig.toString());

  // Initialiser Metaplex
  const wallet = Keypair.generate(); // À remplacer par votre wallet
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());

  // Créer le Candy Machine avec support des groupes
  const { candyMachine } = await metaplex.candyMachines().create({
    itemsAvailable: config.number,
    sellerFeeBasisPoints: config.sellerFeeBasisPoints,
    symbol: config.symbol,
    maxEditionSupply: 0,
    isMutable: config.isMutable,
    creators: config.creators,
    groups: config.groups.map(group => ({
      label: group.label,
      size: group.size,
      price: group.price,
    })),
    collection: {
      address: new PublicKey('your_collection_address'),
      updateAuthority: wallet,
    },
  });

  console.log('Candy Machine créé avec succès:', candyMachine.address.toString());

  // Charger et préparer les NFTs par groupe
  for (const group of config.groups) {
    const groupItems: CandyMachineConfigLine[] = [];
    
    // Charger les métadonnées du groupe
    const groupMetadata = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `../assets/nft-collection/${group.label}.json`)
      ).toString()
    );

    // Créer les items pour ce groupe
    for (let i = 0; i < group.size; i++) {
      groupItems.push({
        name: `${groupMetadata.name} #${i + 1}`,
        uri: groupMetadata.uri || `https://arweave.net/${group.label}/${i}`,
        group: group.label,
      });
    }

    // Ajouter les items au Candy Machine pour ce groupe
    await metaplex.candyMachines().insertItems({
      candyMachine,
      items: groupItems,
    });

    console.log(`${group.size} items ajoutés pour le groupe ${group.label}`);
  }

  console.log('Configuration du Candy Machine terminée');

  // Sauvegarder l'adresse du Candy Machine pour une utilisation ultérieure
  fs.writeFileSync(
    path.join(__dirname, '../config/candy-machine-address.json'),
    JSON.stringify({ address: candyMachine.address.toString() })
  );
}

deployCandyMachine().catch(console.error);
