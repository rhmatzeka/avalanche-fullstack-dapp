# SimpleStorage Contract (Day 2)

A Solidity contract on the **Avalanche Fuji testnet** (chain ID 43113) that shows ownership, access control, and events.

## What it does

- **Owner**: the wallet that deploys the contract becomes the `owner`.
- **Access control**: the `onlyOwner` modifier blocks everyone else from changing data.
- **Stored number**: anyone can read it with `getValue`; only the owner can change it with `setValue`.
- **To-do list**: the owner can add tasks with `addTodo`; anyone can read `todos(i)` and `getTodoCount`.
- **Events** for every important change:
  - `OwnerSet` when the contract is deployed
  - `ValueUpdated` when the number changes
  - `TodoAdded` when a task is added

If someone who is not the owner tries to write, the transaction fails with `Not owner`.

## Commands

```bash
yarn install
npx hardhat compile
npx hardhat run scripts/deployments.ts --network avalancheFuji
```

Put your deployer wallet's `PRIVATE_KEY` in a `.env` file before deploying.

## Where is the ABI?

After compiling, the ABI is in `artifacts/contracts/simple-storage.sol/SimpleStorage.json`. Copies used by the apps are in `../backend/src/blockchain/simple-storage.json` and `../frontend-day3/my-app/src/contracts/abi/simpleStorage.ts`.
