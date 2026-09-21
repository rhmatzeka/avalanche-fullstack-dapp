# Avalanche dApp Portal (Day 1)

A simple web page that connects to **Core Wallet** and shows your wallet details on the **Avalanche Fuji testnet**.

## What it does

- **Connect Wallet** button that asks the wallet for permission (`eth_requestAccounts`)
- Checks the network: shows **Connected** on Fuji (chain ID `0xa869`) and **Wrong Network** on anything else
- Shows your **address** (shortened, like `0x1234...abcd`), **AVAX balance**, **network name**, and a status badge
- Updates by itself when you **switch accounts** or **change networks**
- The button locks after you connect, and errors show up in the page instead of a pop-up alert

The design is a dark "glass" look with moving background shapes, and it works on phones too.

## How to use

1. Open `index.html` in a browser with the **Core Wallet** extension.
2. Switch the wallet to **Avalanche Fuji Testnet**.
3. Click **Connect Core Wallet** and approve the pop-up.
