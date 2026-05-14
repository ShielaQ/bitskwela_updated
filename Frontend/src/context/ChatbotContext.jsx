import { createContext, useContext, useState } from 'react'

const ChatbotContext = createContext(null)

// first message shown when chatbot opens
const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'bot',
    text: "Hey! I'm your Bitskwela learning assistant. Ask me anything about Bitcoin, wallets, DeFi, blockchain — or how to use the tools on this site.",
  },
]

// quick reply buttons
const QUICK_REPLIES_INITIAL = [
  'What is Bitcoin?',
  'How do wallets work?',
  'What is DeFi?',
  'How do I start with crypto?',
]

const QUICK_REPLIES_FALLBACK = [
  'Tell me about Bitcoin',
  'Explain blockchain',
  'What is the mempool?',
  'How do gas fees work?',
]

// keyword responses
const RESPONSE_BANK = [
  {
    keywords: ['hello', 'hi ', 'hey', 'kamusta', 'kumusta', 'musta', 'good morning', 'good afternoon', 'good evening', 'sup'],
    text: "Hey! Happy to help. You can ask me about Bitcoin, Ethereum, wallets, DeFi, blockchain basics, investing, or how to use the tools on this site. What do you want to learn first?",
  },
  {
    keywords: ['thank', 'thanks', 'salamat', 'appreciate', 'helpful', 'that helped'],
    text: "You're welcome! If anything else comes up — whether it's about crypto, the simulations, or the calculator — I'm right here. Keep learning!",
  },
  {
    keywords: ['bitcoin', 'btc', 'satoshi nakamoto', 'digital gold'],
    text: "Bitcoin (BTC) is the world's first cryptocurrency, launched in 2009 by someone under the alias Satoshi Nakamoto. No one controls it — it runs on a decentralized network of computers. Think of it as digital gold: there will only ever be 21 million BTC. It's used for storing value, sending money peer-to-peer, and as an inflation hedge. A single Bitcoin can be split into 100 million smaller units called satoshis.",
  },
  {
    keywords: ['ethereum', 'eth', 'ether', 'vitalik', 'smart contract platform'],
    text: "Ethereum (ETH) is the second-largest crypto, but it's fundamentally different from Bitcoin. While Bitcoin is mainly a store of value, Ethereum is a programmable blockchain — developers build apps (called dApps) on top of it. Most DeFi protocols, NFT marketplaces, and Web3 games run on Ethereum. It switched from mining to staking in 2022, which cut its energy use by over 99%.",
  },
  {
    keywords: ['wallet', 'metamask', 'trust wallet', 'phantom', 'what is a wallet', 'crypto wallet'],
    text: "A crypto wallet doesn't store your crypto — it stores the private keys that prove you own it. Think of it like a username and password, but mathematical. Hot wallets (MetaMask, Trust Wallet) are apps on your phone or browser — convenient but online. Cold wallets (Ledger, Trezor) are hardware devices — offline and much more secure for large amounts. Golden rule: whoever has your seed phrase controls the wallet. Never share it.",
  },
  {
    keywords: ['seed phrase', 'seed word', 'recovery phrase', '12 words', '24 words', 'mnemonic'],
    text: "Your seed phrase is 12 or 24 random words that act as the master key to your entire wallet. Anyone who has it can drain your funds — permanently and irreversibly. Write it on paper. Store it somewhere safe offline. Never take a photo, type it into any app, or share it with anyone — not even with 'support' agents. This is the single most important security rule in crypto.",
  },
  {
    keywords: ['defi', 'decentralized finance', 'uniswap', 'aave', 'compound', 'yield', 'liquidity pool', 'automated market maker', 'amm'],
    text: "DeFi (Decentralized Finance) is financial services — lending, borrowing, trading — that run on smart contracts with no bank involved. You can swap tokens on DEXes like Uniswap, earn yield by providing liquidity, borrow against your crypto, or farm rewards. The catch: no customer support, no reversals, and smart contract bugs have caused billions in losses. High rewards = high risk.",
  },
  {
    keywords: ['nft', 'non-fungible', 'opensea', 'digital art', 'nfts', 'collectible', 'mint'],
    text: "NFTs (Non-Fungible Tokens) are unique digital assets on the blockchain — each one is one-of-a-kind, unlike Bitcoin where every coin is identical. Artists use them to sell digital art. Games use them for in-game items. Brands create digital collectibles. The key word is 'ownership on-chain' — you can verify who owns it without trusting any central company. Whether they're a great investment depends heavily on what you're buying.",
  },
  {
    keywords: ['blockchain', 'ledger', 'immutable', 'distributed ledger', 'what is blockchain'],
    text: "A blockchain is a shared ledger — a record of transactions stored across thousands of computers simultaneously. Each 'block' holds a batch of transactions, and each block references the previous one through a unique cryptographic hash. That chain makes it nearly impossible to alter old records: change one block and every subsequent block becomes invalid, alerting the entire network instantly.",
  },
  {
    keywords: ['mining', 'proof of work', 'pow', 'hash rate', 'miner', 'asic', 'sha-256'],
    text: "Mining is how Bitcoin adds new transactions to its blockchain. Miners compete to solve a complex mathematical puzzle (SHA-256 hash) — the first to solve it adds the next block and earns freshly minted BTC as a reward. It requires specialized hardware (ASICs) and consumes a lot of energy. This is why some blockchains switched to Proof of Stake — Ethereum being the biggest example.",
  },
  {
    keywords: ['staking', 'proof of stake', 'pos', 'validator', 'stake eth', 'staking rewards'],
    text: "Staking is Ethereum's alternative to mining. Instead of using computing power, validators lock up (stake) 32 ETH as collateral. They're randomly chosen to propose and vote on new blocks, and they earn staking rewards in return. Misbehaving or going offline results in 'slashing' — losing a portion of staked ETH as penalty. It uses 99% less energy than Proof of Work.",
  },
  {
    keywords: ['scam', 'phishing', 'hack', 'fraud', 'rug pull', 'ponzi', 'suspicious', 'fake website', 'too good to be true', 'guaranteed returns'],
    text: "Crypto scams are everywhere — and they've gotten sophisticated. Common ones: fake websites that look identical to real exchanges, DMs from 'support' asking for your seed phrase, pump-and-dump schemes, and rug pulls (dev abandons project after raising funds). Red flags: guaranteed returns, pressure to invest fast, unsolicited investment advice. If something sounds too good to be true in crypto, it almost certainly is.",
  },
  {
    keywords: ['calculator', 'investment calculator', 'projection', 'how much will i earn', 'how much will i make', 'grow my money'],
    text: "The Investment Calculator on this platform lets you compare how different assets grow over time. Enter an amount in pesos, pick an investment type — Bitcoin, Pag-IBIG MP2, Treasury Bills, time deposits, REITs, and more — then choose a time horizon. It shows you a projected value with a growth chart. It's for education and comparison purposes, not financial advice.",
  },
  {
    keywords: ['simulation', 'drag', 'drag and drop', 'exercise', 'module', 'practice', 'lesson', 'how does the simulation work'],
    text: "The simulations are drag-and-drop exercises where you match crypto concepts to the right categories. For example: which wallet is safest for Bitcoin? What role does a Merkle Root play in a block? Drag the item, drop it on the correct zone. Green = correct with an explanation. Red shake = wrong answer, try again. Each module has 4 steps — financial and technical.",
  },
  {
    keywords: ['dca', 'dollar cost average', 'dollar-cost averaging', 'cost averaging', 'invest regularly'],
    text: "Dollar Cost Averaging (DCA) means buying a fixed amount of crypto at regular intervals — like ₱500 of Bitcoin every week — regardless of the price. When prices drop, you automatically buy more. When they're high, you buy less. Over time, this lowers your average purchase price and removes the pressure of trying to 'time the market.' It's one of the most beginner-friendly strategies in crypto.",
  },
  {
    keywords: ['gas fee', 'gas fees', 'gas', 'transaction fee', 'gwei', 'network fee', 'ethereum fee'],
    text: "Gas fees are what you pay to have your transaction processed on Ethereum (and similar networks). They're priced in Gwei (a small fraction of ETH) and fluctuate based on how busy the network is. During high demand — like a popular NFT drop — fees can spike to hundreds of dollars. Layer 2 networks like Polygon, Arbitrum, and Optimism offer the same Ethereum capabilities at a fraction of the cost.",
  },
  {
    keywords: ['buy crypto', 'sell crypto', 'trade', 'trading', 'market order', 'limit order', 'how to trade'],
    text: "There are two main order types: market orders (buy or sell immediately at the current price) and limit orders (buy or sell only when price hits your target). For risk management, take-profit and stop-loss orders are your best friends — they let you exit positions automatically without needing to stare at charts all day. Set your exit strategy before you enter any trade.",
  },
  {
    keywords: ['exchange', 'binance', 'coinbase', 'bybit', 'pdax', 'coins.ph', 'coinsph', 'where to buy', 'how to buy bitcoin in philippines'],
    text: "In the Philippines, PDAX and Coins.ph are the most popular licensed exchanges — both have peso on-ramps and are regulated by the BSP. For more trading pairs, international exchanges like Binance are widely used. Always use a BSP-registered VASP (Virtual Asset Service Provider). Pro tip: withdraw to your own wallet after buying — don't leave large amounts on exchanges.",
  },
  {
    keywords: ['philippines', 'peso', 'bsp', 'bangko sentral', 'sentral ng pilipinas', 'pilipinas', 'filipino', 'pinas', 'vasp', 'ph crypto'],
    text: "The BSP (Bangko Sentral ng Pilipinas) regulates crypto in the Philippines through its VASP framework. Platforms like PDAX and Coins.ph are licensed and legal. They require KYC (ID verification) to comply with anti-money laundering rules. Crypto-to-crypto trading isn't clearly taxed yet, but converting to pesos or receiving crypto as payment may have income tax implications under BIR rules.",
  },
  {
    keywords: ['beginner', 'start', 'new to crypto', 'newbie', 'where do i start', 'how to start', 'first step', 'just started', 'getting started'],
    text: "Here's an honest beginner roadmap: (1) Learn what Bitcoin and blockchain actually are — not just price action. (2) Create an account on a BSP-licensed exchange like PDAX or Coins.ph. (3) Start small — ₱500 to ₱1,000. Don't invest what you can't afford to lose. (4) Set up your own wallet (MetaMask or Trust Wallet) so you experience actual self-custody. The simulations on this platform are a great risk-free way to practice concepts first.",
  },
  {
    keywords: ['altcoin', 'altcoins', 'sol', 'solana', 'ada', 'cardano', 'bnb', 'xrp', 'ripple', 'dot', 'polkadot', 'avax', 'avalanche'],
    text: "Altcoins are any cryptocurrency other than Bitcoin. Some are legitimate projects solving real problems — Ethereum, Solana, and Cardano being the most well-known. Others are speculative or outright scams. Before buying any altcoin, ask: What specific problem does it solve? Who's actively building on it? Does it have real usage, or just hype? Most altcoins have failed or become worthless — choose carefully.",
  },
  {
    keywords: ['stablecoin', 'usdt', 'usdc', 'tether', 'dai', 'busd', 'pegged', 'stable coin'],
    text: "Stablecoins are crypto assets pegged to a stable currency — usually the US dollar. USDT (Tether) and USDC are the most common. They're useful for holding value between trades without converting to pesos, and for DeFi yield (earning APY on stablecoins). The risk? USDT has faced questions about its reserves, and algorithmic stablecoins like UST (Luna) have collapsed spectacularly. The backing model matters a lot.",
  },
  {
    keywords: ['web3', 'web 3', 'decentralized web', 'dapps', 'dapp', 'web3 apps'],
    text: "Web3 is the next evolution of the internet — one where users own their data and digital assets, not corporations. Web1 was read-only (basic websites). Web2 gave us social media and apps, but platforms own everything you do. Web3 uses blockchain so you control your identity, tokens, and digital property directly — no middlemen, no accounts that can be deactivated, no one company holding all the data.",
  },
  {
    keywords: ['tax', 'bir', 'crypto tax', 'taxable', 'capital gains', 'pay tax', 'income tax crypto'],
    text: "Crypto taxation in the Philippines is still evolving. Under current BIR interpretations: profits from trading crypto are likely subject to income tax. Using crypto as payment for goods or services may have VAT implications. Capital gains rules are still being clarified for crypto. My strong advice: consult a licensed CPA who understands crypto. This is general educational info, not tax advice for your specific situation.",
  },
  {
    keywords: ['cold wallet', 'hardware wallet', 'ledger', 'trezor', 'offline wallet'],
    text: "Cold wallets are hardware devices — like Ledger Nano S/X or Trezor — that store your private keys completely offline. They only connect when you plug them in to sign a transaction, and every transaction requires physical button confirmation on the device. Even if your computer is fully infected with malware, your funds stay safe. For any significant amount of crypto, a hardware wallet is worth the investment.",
  },
  {
    keywords: ['hot wallet', 'software wallet', 'browser wallet', 'mobile wallet', 'online wallet'],
    text: "Hot wallets are software apps — MetaMask (browser), Trust Wallet (mobile), Phantom (Solana) — that store your keys digitally. They're convenient for accessing DeFi, swapping tokens, or sending crypto day-to-day. The tradeoff: because they're always connected to the internet, they're more vulnerable to phishing and malware. Best practice: use hot wallets for small daily amounts; keep the bulk in cold storage.",
  },
  {
    keywords: ['mempool', 'mem pool', 'pending transaction', 'unconfirmed', 'stuck transaction', 'transaction not confirmed', 'waiting to confirm', 'transaction pending'],
    text: "The mempool (memory pool) is like a waiting room for transactions. When you send crypto, your transaction broadcasts to every node on the network and sits in the mempool until a miner or validator picks it up and includes it in a block. Validators sort the mempool by fee — the highest tips get included first. During network congestion (like a hot NFT launch), the mempool can hold hundreds of thousands of transactions. Low-fee transactions can wait hours or even get dropped. MetaMask lets you 'speed up' a stuck transaction by rebroadcasting it with a higher fee.",
  },
  {
    keywords: ['eip-1559', 'eip1559', 'base fee', 'base fee burn', 'priority fee', 'gas tip', 'fee burn', 'gas burn'],
    text: "EIP-1559 (August 2021) completely changed how Ethereum fees work. Instead of a simple 'highest bidder wins' auction, every block now has a base fee that adjusts automatically based on how full the previous block was. The base fee is burned — permanently removed from the ETH supply. You also pay an optional priority fee (tip) that goes to the validator. This means ETH becomes deflationary during busy periods because more ETH burns than is issued as block rewards. The simulation's Gas & Fees module covers this step by step.",
  },
  {
    keywords: ['gwei', 'gas unit', 'gas price', 'gas limit', 'gas cost', 'how much gas', 'gas explained'],
    text: "Gas is the unit measuring computational effort on Ethereum. Gas price (in Gwei) is what you pay per unit of computation. Gas limit is the max units you're willing to use — if a transaction exceeds it, it fails but you still pay for gas already used. 1 ETH = 1,000,000,000 Gwei. Simple ETH transfers use ~21,000 gas units. Complex smart contract interactions can use millions. Total fee = Gas Used × Gas Price. The advanced Gas & Fees simulation on this platform breaks this down interactively.",
  },
  {
    keywords: ['layer 2', 'l2', 'polygon', 'arbitrum', 'optimism', 'scaling', 'lightning network'],
    text: "Layer 2 solutions are built on top of existing blockchains (like Ethereum) to make transactions faster and cheaper. Polygon, Arbitrum, and Optimism are L2s for Ethereum — they batch transactions off-chain then settle on Ethereum. Bitcoin has the Lightning Network for instant micro-payments. L2s don't change the base security of the blockchain; they just move activity to a more efficient layer.",
  },
  {
    keywords: ['private key', 'public key', 'keypair', 'cryptography', 'asymmetric', 'encryption'],
    text: "In crypto, you have two keys: a public key (your wallet address — like an email address, safe to share) and a private key (like your email password — never share this). Your private key cryptographically proves you authorized a transaction without revealing itself. Lose your private key with no backup? Your crypto is gone. This is why self-custody — holding your own keys — is powerful but comes with full responsibility.",
  },
  {
    keywords: ['pagibig', 'pag-ibig', 'mp2', 'treasury bill', 'tbill', 'rtb', 'retail treasury bond', 'government bond'],
    text: "Pag-IBIG MP2 currently offers around 7% annual dividend (historically higher than banks), backed by the Philippine government. Treasury Bills and Retail Treasury Bonds offer 6–7% per year and are also government-guaranteed. Compared to a savings account paying 0.5%, these are significantly better for stable, low-risk returns. The Investment Calculator on this platform lets you compare all of these side by side.",
  },
  {
    keywords: ['reit', 'real estate', 'areit', 'ddmpr', 'stock market', 'philippine stock'],
    text: "REITs (Real Estate Investment Trusts) in the Philippines — like AREIT, DDMPR, and others — let you invest in commercial real estate for as little as a few hundred pesos. They pay regular dividends (typically 5–7% yield) and trade on the PSE. It's real estate income without needing to buy an actual property. The Investment Calculator includes REIT projections for comparison.",
  },
]

// fallback if nothing in the response bank matches
const DEFAULT_RESPONSE = {
  text: "Hmm, I'm not sure about that specific question. I can help with topics like Bitcoin, wallets, DeFi, blockchain, the calculator, the simulations, or getting started with crypto in the Philippines. Try asking one of those!",
  showLearnLink: true,
}

// look for matching keywords in the user's message
function findResponse(input) {
  const lower = input.toLowerCase()
  for (const item of RESPONSE_BANK) {
    if (item.keywords.some(k => lower.includes(k))) {
      return { text: item.text, showLearnLink: false }
    }
  }
  return DEFAULT_RESPONSE
}

// context provider
export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [quickReplies, setQuickReplies] = useState(QUICK_REPLIES_INITIAL)
  const [inputText, setInputText] = useState('')

  const sendMessage = (text) => {
    const userMsg = { id: Date.now(), type: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setShowQuickReplies(false)
    setInputText('')

    const response = findResponse(text)

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        showLearnLink: response.showLearnLink,
      }
      setMessages(prev => [...prev, botMsg])

      // Show fallback quick replies after default response
      if (response.showLearnLink) {
        setQuickReplies(QUICK_REPLIES_FALLBACK)
        setShowQuickReplies(true)
      }
    }, 500)
  }

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES)
    setQuickReplies(QUICK_REPLIES_INITIAL)
    setShowQuickReplies(true)
    setInputText('')
  }

  return (
    <ChatbotContext.Provider value={{
      isOpen,
      setIsOpen,
      messages,
      showQuickReplies,
      quickReplies,
      inputText,
      setInputText,
      sendMessage,
      resetChat,
    }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => useContext(ChatbotContext)
