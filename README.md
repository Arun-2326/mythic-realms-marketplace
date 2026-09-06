# 🃏 Mythic Realms Marketplace

A decentralized marketplace for unique blockchain-based game cards.

Mythic Realms allows users to connect their wallet, mint unique game cards, store card metadata and images on IPFS, list cards for sale, buy cards from other users, and manage their collection directly on the Sepolia Ethereum testnet.

## 🚀 Features

- 🔐 Connect Ethereum wallet
- 🎴 Mint unique game cards
- 🖼️ Upload card images to IPFS
- 📝 Store card metadata on IPFS
- ⭐ Card rarity and element attributes
- ⚔️ Attack, Defense, Speed and Health attributes
- 💰 List cards for sale in ETH
- ❌ Cancel active listings
- 🛒 Buy cards from other users
- 👤 View cards owned by the connected wallet
- 🔄 Ownership updates automatically after purchases
- ⛓️ Ethereum Sepolia testnet integration

## 🛠️ Tech Stack

### Blockchain
- Solidity
- OpenZeppelin Contracts
- Hardhat
- Ethereum Sepolia Testnet
- ERC-721 NFTs

### Frontend
- React
- TypeScript
- Vite
- Wagmi
- Viem
- React Router
- Tailwind CSS

### Storage
- IPFS
- Pinata

## 🏗️ Project Structure

```text
mythic-realms-marketplace/
│
├── contracts/
│   ├── GameCard.sol
│   └── Marketplace.sol
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── config/
│       ├── hooks/
│       └── pages/
│
├── ignition/
├── scripts/
├── test/
├── hardhat.config.ts
├── package.json
└── README.md