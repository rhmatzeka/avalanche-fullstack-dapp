# Avalanche Full-Stack dApp

A small but complete blockchain app on the **Avalanche Fuji testnet**, built step by step during an Avalanche bootcamp. It has a smart contract, a backend API that reads from the chain, and two frontends.

**Live demo:** https://avalanche-fullstack-dapp-tau.vercel.app

## What's inside

| Folder | Day | What it does |
| --- | --- | --- |
| `dapps/frontend-day1` | Day 1 | Plain HTML/JS page that connects to Core Wallet and shows your address, AVAX balance, and network |
| `dapps/contracts` | Day 2 | `SimpleStorage` smart contract: an owner-only number and to-do list, with events |
| `dapps/frontend-day3` | Day 3 | Next.js app that reads and updates the contract with wagmi |
| `dapps/backend` | Day 4 | NestJS API that reads the current value and past `ValueUpdated` events from the chain |

## The smart contract

`SimpleStorage` (in `dapps/contracts/contracts/simple-storage.sol`):

- Stores one number. Anyone can read it with `getValue`; only the **owner** can change it with `setValue`.
- Keeps a small **to-do list**. Only the owner can add items with `addTodo`.
- Emits events (`OwnerSet`, `ValueUpdated`, `TodoAdded`) so apps can follow what changed.

Deployed on Fuji at `0x3fa731B5499253942737c2AD452Edc08bfa1c35f`.

## Getting started

You need Node.js 18+ and a wallet (Core or MetaMask) with some test AVAX from the [Fuji faucet](https://core.app/tools/testnet-faucet/).

**Contracts** (Hardhat):

```bash
cd dapps/contracts
yarn install
npx hardhat compile
```

To deploy, put your wallet's `PRIVATE_KEY` in a `.env` file first.

**Frontend (Day 3)**:

```bash
cd dapps/frontend-day3/my-app
npm install
npm run dev
```

**Backend API**:

```bash
cd dapps/backend
pnpm install
pnpm start:dev
```

The API runs on http://localhost:3000 and has interactive docs at `/documentations`. Endpoints: `GET /blockchain/value` and `GET /blockchain/events`.

**Day 1 page**: just open `dapps/frontend-day1/index.html` in a browser that has Core Wallet.

## Tech stack

Solidity, Hardhat, Next.js, wagmi, viem, NestJS, Swagger, Avalanche Fuji
