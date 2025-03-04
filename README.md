# CharityOnSolana

## Description
CharityOnSolana est une plateforme de charité basée sur la blockchain Solana. Les utilisateurs peuvent acheter des NFTs pour soutenir des causes sociales, et en retour, ils reçoivent des tokens SPL en guise de récompense.

## Technologies utilisées

### Blockchain & Backend
- Solana Devnet
- Metaplex Candy Machine v2
- Anchor Framework
- Solana Web3.js
- Token Program & Associated Token Account

### Frontend
- React + Vite
- Tailwind CSS
- Solana Wallet Adapter

## Fonctionnalités principales
### 🎗️ Token SPL de Charité
- Création d'un token SPL pour récompenser les donateurs.
- Distribution automatique des tokens en fonction des contributions.

### 🎨 Collection NFT
- Déploiement d'une collection de NFTs dédiés aux causes sociales.
- Utilisation de Metaplex Token Metadata pour associer image, description et nom aux NFTs.
- Prix variant entre 1 et 5 SOL.

### 💳 Achat de NFT
- Achat de NFTs pour soutenir une cause caritative.
- Envoi automatique des SOLs au portefeuille de charité.
- Attribution de NFTs et tokens SPL aux donateurs.

### 🖥️ Interface Client
- Affichage des NFTs avec leur prix, image et détails.
- Achat simplifié de NFTs via un wallet Solana.
- Consultation du portefeuille utilisateur :
  - NFTs possédés
  - Solde des tokens SPL

## Installation et Déploiement
### Prérequis
- Node.js >= 16
- Un wallet Solana (Phantom, Solflare, etc.)
- Solana CLI installé

### Installation
```sh
git clone https://github.com/LouisVannobel/CharityOnSolana.git
cd CharityOnSolana
npm install
```

### Lancement du projet
```sh
npm run dev
```

## Déploiement
### Smart Contracts
```sh
anchor build
anchor deploy
```

### Frontend
```sh
npm run build
npm run preview
```
