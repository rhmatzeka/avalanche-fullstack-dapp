const connectBtn = document.getElementById("connectBtn");
const statusText = document.getElementById("statusText");
const statusBadge = document.getElementById("statusBadge");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const errorMsg = document.getElementById("errorMsg");

const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

// Helper: Memperpendek Address (0x1234...abcd)
function shortenAddress(address) {
  if (!address) return "-";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = "block";
  setTimeout(() => { errorMsg.style.display = "none"; }, 5000);
}

async function updateUI() {
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    
    if (accounts.length === 0) {
      resetUI();
      return;
    }

    const address = accounts[0];
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    addressEl.textContent = shortenAddress(address);

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Avalanche Fuji";
      statusText.textContent = "Connected";
      statusBadge.classList.add("connected");
      
      // Update Balance
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      const balance = parseInt(balanceWei, 16) / 1e18;
      balanceEl.textContent = balance.toFixed(4);

      // Disable button after successful Fuji connection
      connectBtn.disabled = true;
      connectBtn.textContent = "Wallet Connected";
    } else {
      networkEl.textContent = "Wrong Network";
      statusText.textContent = "Switch to Fuji";
      statusBadge.classList.remove("connected");
      balanceEl.textContent = "-";
      connectBtn.disabled = false;
      connectBtn.textContent = "Switch Network";
    }
  } catch (err) {
    console.error(err);
  }
}

function resetUI() {
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
  statusText.textContent = "Disconnected";
  statusBadge.classList.remove("connected");
  connectBtn.disabled = false;
  connectBtn.textContent = "Connect Core Wallet";
}

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    showError("Core Wallet not found. Please install it.");
    return;
  }

  try {
    // Request Accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Check Chain ID & Request switch if not on Fuji
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
    if (currentChainId !== AVALANCHE_FUJI_CHAIN_ID) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: AVALANCHE_FUJI_CHAIN_ID }],
            });
        } catch (switchError) {
            showError("Please add & switch to Avalanche Fuji Testnet in Core Wallet.");
        }
    }
    
    updateUI();
  } catch (error) {
    showError("User rejected connection.");
  }
}

// Event Listeners for Real-time Updates
if (window.ethereum) {
  // 1. Detect account changes (logout/switch account)
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) resetUI();
    else updateUI();
  });

  // 2. Detect network changes
  window.ethereum.on('chainChanged', () => {
    window.location.reload(); 
  });
}

connectBtn.addEventListener("click", connectWallet);

// Check if already connected on load
window.addEventListener('load', () => {
    if (window.ethereum) updateUI();
});