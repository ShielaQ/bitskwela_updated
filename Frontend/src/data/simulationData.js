// simulation data for all modules
// each step needs exactly one item per zone or the drop logic breaks

export const MODULES = {
  financial: {
    title: 'Web3 Financial Simulations',
    color: '#F7931A',
    steps: [
      {
        id: 'wallet-types',
        title: 'Wallet Types',
        instruction: 'Every asset belongs in a specific type of wallet. Drag each one into the wallet type that fits it best.',
        items: [
          { id: 'btc',  label: 'Bitcoin (BTC)',    desc: 'Best held long-term offline',         abbr: 'BTC', color: '#B06800', bg: '#FEF5E7', correctZone: 'cold'     },
          { id: 'usdt', label: 'USDT Stablecoin',  desc: 'Used for quick trades and payments',  abbr: '$',   color: '#15803D', bg: '#F0FDF4', correctZone: 'hot'      },
          { id: 'eth',  label: 'Ethereum (ETH)',    desc: 'Powers dApps and DeFi protocols',     abbr: 'ETH', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'defi'     },
          { id: 'seed', label: 'Seed Phrase',       desc: 'Your master wallet recovery backup',  abbr: 'KEY', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'recovery' },
        ],
        zones: [
          { id: 'hot',      label: 'Hot Wallet',         desc: 'Online, app-based, quick access',             icon: 'wallet'       },
          { id: 'cold',     label: 'Cold Wallet',        desc: 'Offline hardware device, maximum security',   icon: 'lock'         },
          { id: 'defi',     label: 'Web3 / DeFi Wallet', desc: 'Browser wallet for dApps and token swaps',   icon: 'trending-up'  },
          { id: 'recovery', label: 'Offline Backup',     desc: 'Physical storage for critical recovery keys', icon: 'file'         },
        ],
        explanations: {
          hot:      'USDT is commonly kept in hot wallets for quick access during trading. Since stablecoins hold a stable value, the risk from keeping small amounts online is manageable. Just do not store large sums.',
          cold:     'Bitcoin is best held in a cold wallet like a Ledger or Trezor. Since BTC is typically bought and held long-term, offline storage protects it from online threats permanently.',
          defi:     'Ethereum powers most of the DeFi world. To use it with dApps, DEXes, and lending protocols, you connect it through a Web3 browser wallet like MetaMask.',
          recovery: 'Your seed phrase is the master key to your entire wallet. Write it on paper and store it somewhere offline and secure. Never take a photo, type it into any app, or share it with anyone.',
        },
      },
      {
        id: 'buy-sell',
        title: 'Buy and Sell Strategies',
        instruction: 'Good traders have a plan for every situation. Match each strategy to what it is actually used for.',
        items: [
          { id: 'dip',    label: 'Buy the Dip',        desc: 'Buy more when the price drops hard',    abbr: 'DIP', color: '#15803D', bg: '#F0FDF4', correctZone: 'entry'      },
          { id: 'dca',    label: 'Dollar Cost Average', desc: 'Buy a fixed amount on a regular schedule', abbr: 'DCA', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'accumulate' },
          { id: 'profit', label: 'Take Profit',         desc: 'Sell a portion when the price is up',  abbr: 'TP',  color: '#B06800', bg: '#FEF5E7', correctZone: 'exit'       },
          { id: 'sloss',  label: 'Stop Loss',           desc: 'Auto-exit if the price falls too far', abbr: 'SL',  color: '#B91C1C', bg: '#FEF2F2', correctZone: 'protect'    },
        ],
        zones: [
          { id: 'entry',      label: 'Buy Opportunity',         desc: 'Entering the market at a favorable price', icon: 'trending-up'   },
          { id: 'accumulate', label: 'Long-term Accumulation',  desc: 'Building a position consistently over time', icon: 'star'          },
          { id: 'exit',       label: 'Profit Exit',             desc: 'Selling to lock in gains',                  icon: 'trending-down' },
          { id: 'protect',    label: 'Risk Management',         desc: 'Limiting losses with an automatic safety net', icon: 'shield'      },
        ],
        explanations: {
          entry:      'Buying the dip means purchasing more when prices drop significantly. The idea is that you get the same asset at a lower price. It requires patience and belief that the asset has long-term value.',
          accumulate: 'Dollar Cost Averaging removes the stress of timing the market. You invest the same fixed amount every week or month regardless of price. Over time you naturally buy more when prices are low.',
          exit:       'Taking profit means selling part of your holdings when the price hits your target. Setting this order before you enter a trade removes emotion from the decision entirely.',
          protect:    'A stop-loss is an automatic sell order that triggers if the price falls below a set level. It caps your downside without needing to watch the charts constantly.',
        },
      },
      {
        id: 'defi-basics',
        title: 'DeFi Protocol Types',
        instruction: 'DeFi covers a lot of ground. Match each activity to the protocol category it belongs to.',
        items: [
          { id: 'dex',   label: 'DEX Trading',    desc: 'Swap tokens directly from your wallet',  abbr: 'DEX', color: '#2563EB', bg: '#EFF6FF', correctZone: 'exchange' },
          { id: 'yield', label: 'Yield Farming',  desc: 'Earn APY by depositing tokens',          abbr: 'YLD', color: '#15803D', bg: '#F0FDF4', correctZone: 'earn'     },
          { id: 'flash', label: 'Flash Loan',     desc: 'Borrow and repay in a single transaction', abbr: 'FL', color: '#B91C1C', bg: '#FEF2F2', correctZone: 'borrow'   },
          { id: 'lp',    label: 'Liquidity Pool', desc: 'Supply token pairs to enable trading',   abbr: 'LP',  color: '#7C3AED', bg: '#F5F3FF', correctZone: 'provide'  },
        ],
        zones: [
          { id: 'exchange', label: 'DEX Swapping',         desc: 'Permissionless token exchange',           icon: 'trending-up'  },
          { id: 'earn',     label: 'Yield Earning',        desc: 'Earning passive returns on tokens',       icon: 'star'         },
          { id: 'borrow',   label: 'Lending and Borrowing',desc: 'DeFi credit without a bank',              icon: 'dollar-sign'  },
          { id: 'provide',  label: 'Liquidity Providing',  desc: 'Supplying token pairs to power a pool',   icon: 'layers'       },
        ],
        explanations: {
          exchange: 'DEXes like Uniswap use Automated Market Makers to let anyone swap tokens from their own wallet. There is no sign-up, no KYC, and prices are set automatically based on token ratios in the pool.',
          earn:     'Yield farming means depositing tokens into a protocol and earning rewards over time. Very high APYs are often a warning sign. They usually mean the project is printing incentive tokens that will eventually lose value.',
          borrow:   'Flash loans are uncollateralized loans that must be borrowed and repaid in the same transaction block. If repayment does not happen, the entire transaction is reversed automatically. Used for arbitrage and DeFi strategies.',
          provide:  'Liquidity providers supply equal value of two tokens to a pool and earn a share of trading fees. The main risk is impermanent loss, where the value of your supplied tokens becomes less than just holding them.',
        },
      },
      {
        id: 'crypto-security',
        title: 'Crypto Security Practices',
        instruction: 'Keeping your crypto safe is just as important as earning it. Classify each practice correctly.',
        items: [
          { id: 'hw',    label: 'Hardware Wallet',   desc: 'Offline device for storing private keys',      abbr: 'HW',  color: '#15803D', bg: '#F0FDF4', correctZone: 'safe'   },
          { id: 'phish', label: 'Phishing Link',     desc: '"Verify your wallet" from an unknown sender',  abbr: 'PH',  color: '#B91C1C', bg: '#FEF2F2', correctZone: 'threat' },
          { id: 'twofa', label: '2FA Authenticator', desc: 'Google Authenticator or Authy OTP code',       abbr: '2FA', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'best'   },
          { id: 'cloud', label: 'Cloud Seed Backup', desc: 'Seed phrase screenshot saved in Google Drive', abbr: 'CLO', color: '#B06800', bg: '#FEF5E7', correctZone: 'never'  },
        ],
        zones: [
          { id: 'safe',   label: 'Safe Storage',  desc: 'Best practice for securing large holdings',   icon: 'shield'   },
          { id: 'threat', label: 'Known Scam',    desc: 'A common attack vector used to steal keys',   icon: 'x-circle' },
          { id: 'best',   label: 'Best Practice', desc: 'Adds a critical layer to exchange accounts',  icon: 'lock'     },
          { id: 'never',  label: 'Never Do This', desc: 'One of the top ways people lose all their crypto', icon: 'trash-2' },
        ],
        explanations: {
          safe:   'Hardware wallets like Ledger and Trezor store your private keys completely offline. Every transaction requires physical button confirmation on the device, so malware on your computer cannot touch your crypto.',
          threat: 'Phishing links look identical to real exchange or wallet sites. They are designed to steal your seed phrase or login details. Always type URLs manually. No real platform ever asks for your private key.',
          best:   '2FA via an authenticator app adds a second layer of protection to your exchange account. Use an app like Google Authenticator or Authy instead of SMS, since SMS can be intercepted through SIM swapping.',
          never:  'Your seed phrase in any digital form is a security disaster waiting to happen. Screenshots, cloud drives, notes apps, emails. Anyone who finds it can drain your wallet in seconds with no way to recover.',
        },
      },
    ],
  },
  technical: {
    title: 'Web3 Technical Concepts',
    color: '#2563EB',
    steps: [
      {
        id: 'transactions',
        title: 'Transaction Creation',
        instruction: 'A blockchain transaction has four distinct parts. Drag each element into the role it plays in a transaction.',
        items: [
          { id: 'sender', label: 'Sender Address',    desc: 'The wallet starting the transfer',    abbr: 'FROM', color: '#B06800', bg: '#FEF5E7', correctZone: 'inputs'   },
          { id: 'recv',   label: 'Receiver Address',  desc: 'The wallet getting the funds',        abbr: 'TO',   color: '#15803D', bg: '#F0FDF4', correctZone: 'outputs'  },
          { id: 'fee',    label: 'Network Fee (Gas)', desc: 'Paid to miners or validators',        abbr: 'GAS',  color: '#B91C1C', bg: '#FEF2F2', correctZone: 'fee'      },
          { id: 'sig',    label: 'Digital Signature', desc: 'Cryptographic proof of ownership',   abbr: 'SIG',  color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'security' },
        ],
        zones: [
          { id: 'inputs',   label: 'Transaction Inputs',  desc: 'Where the funds are coming from',        icon: 'arrow-down'  },
          { id: 'outputs',  label: 'Transaction Outputs', desc: 'Where the funds are going',              icon: 'arrow-up'    },
          { id: 'fee',      label: 'Transaction Fee',     desc: 'The cost to process on the network',     icon: 'dollar-sign' },
          { id: 'security', label: 'Security Layer',      desc: 'Cryptographic proof of authorization',   icon: 'shield'      },
        ],
        explanations: {
          inputs:   'Inputs reference unspent outputs from previous transactions. This is the source of the funds being moved. On Bitcoin, these are called UTXOs, Unspent Transaction Outputs.',
          outputs:  'Outputs define the destination wallet address and the exact amount being sent. Any leftover amount goes back to the sender as change, similar to cash transactions.',
          fee:      'Gas fees pay miners or validators for processing your transaction. Higher fees generally get your transaction confirmed faster since miners prioritize higher-paying transactions first.',
          security: 'The digital signature proves you authorized the transaction using your private key, without ever revealing the key itself. This math-based proof is what prevents forgery on the blockchain.',
        },
      },
      {
        id: 'block-building',
        title: 'Block Building',
        instruction: 'A block has four distinct parts, each with a specific job. Place each component where it actually lives in the block structure.',
        items: [
          { id: 'prev',   label: 'Previous Block Hash', desc: 'Cryptographic link to the prior block',      abbr: 'PREV', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'link'   },
          { id: 'merkle', label: 'Merkle Root',          desc: 'A single hash of all transactions in the block', abbr: 'MKL', color: '#15803D', bg: '#F0FDF4', correctZone: 'header' },
          { id: 'txns',   label: 'Transactions List',    desc: 'All the confirmed transactions',             abbr: 'TXN', color: '#B06800', bg: '#FEF5E7', correctZone: 'body'   },
          { id: 'nonce',  label: 'Nonce',                desc: 'The number miners adjust to solve the puzzle', abbr: 'NON', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'mining' },
        ],
        zones: [
          { id: 'link',   label: 'Chain Link',    desc: 'What connects this block to the previous one', icon: 'arrow-up' },
          { id: 'header', label: 'Block Header',  desc: 'The compact summary and fingerprint of the block', icon: 'layers' },
          { id: 'body',   label: 'Block Body',    desc: 'Where the actual transaction data is stored',  icon: 'list'     },
          { id: 'mining', label: 'Proof of Work', desc: 'The puzzle-solving component miners adjust',   icon: 'shield'   },
        ],
        explanations: {
          link:   'The Previous Block Hash is what chains each block to the one before it. If data in block 100 is changed, its hash changes, which breaks the link to block 101 and invalidates every block after it.',
          header: 'The Merkle Root is a single hash that summarizes every transaction in the block. Miners include it in the header so the entire set of transactions can be verified with one compact fingerprint.',
          body:   'The block body holds all confirmed transactions. A typical Bitcoin block fits around 2,000 to 3,000 transactions. Everything else in the block is metadata about this transaction data.',
          mining: 'The nonce is a number miners change billions of times per second, trying to find a hash output that meets the network difficulty target. Finding one is the Proof of Work that earns the block reward.',
        },
      },
      {
        id: 'blockchain-linking',
        title: 'Blockchain Linking',
        instruction: 'Each concept plays a specific role in how the blockchain stays honest and connected. Match each one to what it represents.',
        items: [
          { id: 'phash',    label: 'Previous Block Hash', desc: 'Cryptographic reference to the prior block', abbr: 'PH',   color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'link'     },
          { id: 'tamper',   label: 'Altered Transaction', desc: 'A modified record inside an old block',       abbr: 'TMR',  color: '#B91C1C', bg: '#FEF2F2', correctZone: 'break'    },
          { id: 'fullnode', label: 'Full Node',            desc: 'Downloads and verifies the entire chain',    abbr: 'FN',   color: '#15803D', bg: '#F0FDF4', correctZone: 'validate' },
          { id: 'fork',     label: 'Hard Fork',            desc: 'Protocol upgrade that splits the chain',     abbr: 'FK',   color: '#7C3AED', bg: '#F5F3FF', correctZone: 'split'    },
        ],
        zones: [
          { id: 'link',     label: 'Chain Link',       desc: 'The mechanism that connects blocks together',       icon: 'arrow-up'  },
          { id: 'break',    label: 'Chain Invalidator', desc: 'What causes the chain to be rejected by nodes',    icon: 'x-circle'  },
          { id: 'validate', label: 'Chain Validator',   desc: 'Who independently checks the entire chain',        icon: 'shield'    },
          { id: 'split',    label: 'Chain Split',       desc: 'When the network diverges into two separate chains', icon: 'layers'   },
        ],
        explanations: {
          link:     'Each block header contains the hash of the block before it. This is the glue of the blockchain. Change anything in block 100 and its hash changes, which breaks the reference in block 101 and alerts every node on the network.',
          break:    'If someone modifies a transaction in an old block, its hash changes completely. This breaks the chain from that point forward. Every full node on the network would detect and reject this invalid chain immediately.',
          validate: 'Full nodes download and independently verify the entire blockchain history. They reject any block that breaks the rules. The more full nodes there are, the harder it is to cheat the network.',
          split:    'A hard fork happens when developers make a change to the protocol rules that older nodes do not accept. Nodes that disagree keep following the old rules, creating two separate chains. Bitcoin Cash was created this way in 2017.',
        },
      },
      {
        id: 'gas-fees',
        title: 'Gas & Transaction Fees',
        instruction: 'Every Ethereum transaction has a fee made up of distinct components. Drag each fee concept into the role it actually plays.',
        items: [
          { id: 'gaslimit', label: 'Gas Limit',       desc: 'Max units of gas the sender is willing to use',     abbr: 'LIM', color: '#B06800', bg: '#FEF5E7', correctZone: 'ceiling'  },
          { id: 'basefee',  label: 'Base Fee',         desc: 'Minimum fee set by the protocol per block',         abbr: 'BASE',color: '#B91C1C', bg: '#FEF2F2', correctZone: 'burn'     },
          { id: 'tip',      label: 'Priority Fee',     desc: 'Optional tip added on top to incentivise validators', abbr: 'TIP', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'validator'},
          { id: 'gwei',     label: 'Gwei',             desc: 'The unit used to denominate gas prices',            abbr: 'GWI', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'unit'     },
        ],
        zones: [
          { id: 'ceiling',   label: 'Spending Cap',       desc: 'Controls the maximum cost of a transaction',       icon: 'shield'      },
          { id: 'burn',      label: 'Protocol Burn',      desc: 'Destroyed by the network — removed from supply',   icon: 'trending-down' },
          { id: 'validator', label: 'Validator Reward',   desc: 'Paid directly to the block proposer as incentive', icon: 'star'        },
          { id: 'unit',      label: 'Fee Denomination',   desc: 'The unit all gas prices are expressed in',         icon: 'dollar-sign' },
        ],
        explanations: {
          ceiling:   'The gas limit is the maximum number of gas units you are willing to spend. If a transaction uses less, you are refunded the difference. If it would use more, the transaction fails and you still pay for the gas consumed up to that point.',
          burn:      'After EIP-1559 (August 2021), the base fee is burned — permanently removed from the ETH supply — rather than paid to miners. This makes ETH deflationary during periods of high network usage because more ETH burns than is issued as block rewards.',
          validator: 'The priority fee (also called a tip or miner tip) goes directly to the validator who includes your transaction. Setting a higher tip gets your transaction confirmed faster, especially during network congestion, because validators pick the highest-tipping transactions first.',
          unit:      'Gwei is one billionth of one ETH (1 ETH = 1,000,000,000 Gwei). Gas prices are quoted in Gwei because the absolute ETH amounts are tiny fractions. A typical transaction might cost 20–50 Gwei per gas unit during normal conditions.',
        },
      },
      {
        id: 'mempool',
        title: 'The Mempool',
        instruction: 'Before a transaction makes it into a block, it passes through the mempool. Drag each concept into the stage it represents.',
        items: [
          { id: 'broadcast', label: 'Broadcast Tx',     desc: 'A signed transaction just sent to the network',       abbr: 'NEW', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'waiting' },
          { id: 'highfee',   label: 'High-Fee Tx',      desc: '50 Gwei tip — validators will pick this first',        abbr: 'HI',  color: '#15803D', bg: '#F0FDF4', correctZone: 'priority'},
          { id: 'lowfee',    label: 'Low-Fee Tx',       desc: '1 Gwei tip — sits waiting when blocks are full',       abbr: 'LO',  color: '#B06800', bg: '#FEF5E7', correctZone: 'backlog' },
          { id: 'confirmed', label: 'Confirmed Tx',     desc: 'Included in a block — finalized on the chain',         abbr: 'OK',  color: '#7C3AED', bg: '#F5F3FF', correctZone: 'included'},
        ],
        zones: [
          { id: 'waiting',  label: 'Pending Pool',    desc: 'Unconfirmed transactions waiting for inclusion',      icon: 'list'         },
          { id: 'priority', label: 'Priority Queue',  desc: 'High-fee txs validators select first',                icon: 'trending-up'  },
          { id: 'backlog',  label: 'Stuck Backlog',   desc: 'Low-fee txs delayed during high congestion',          icon: 'arrow-down'   },
          { id: 'included', label: 'Block Inclusion', desc: 'Transaction successfully written to the blockchain',  icon: 'layers'       },
        ],
        explanations: {
          waiting:  'When you broadcast a transaction, it enters every node\'s mempool (memory pool) — a temporary holding area for unconfirmed transactions. Mempools across the network are not perfectly identical; each node manages its own local list. Transactions stay here until they get picked up by a miner or validator.',
          priority: 'Validators and miners sort the mempool by fee rate — Gwei per gas unit — and pick the most profitable transactions to fill the next block. During an NFT launch or DeFi boom, the mempool can hold hundreds of thousands of transactions, and only the top-paying ones get in quickly.',
          backlog:  'Low-fee transactions during congested periods can sit in the mempool for hours, days, or even get dropped entirely if nodes clear their mempools. You can speed up a stuck transaction by rebroadcasting it with a higher fee — wallets like MetaMask have a "speed up" feature that does this automatically.',
          included: 'Once a validator selects your transaction and includes it in a block, it becomes part of the immutable blockchain. On Ethereum, one confirmation means your transaction is in a block. For high-value transfers, waiting for multiple confirmations is standard practice since the probability of a chain reorganisation drops sharply with each additional block.',
        },
      },
      {
        id: 'consensus',
        title: 'Consensus Mechanisms',
        instruction: 'Different blockchains use different methods to agree on what transactions are valid. Match each concept to its consensus model.',
        items: [
          { id: 'miner',    label: 'Hash Mining',      desc: 'Solving SHA-256 puzzles to add blocks',        abbr: 'MIN', color: '#B06800', bg: '#FEF5E7', correctZone: 'pow'  },
          { id: 'staker',   label: 'Stake Validator',  desc: 'Locking ETH to propose and vote on blocks',    abbr: 'VAL', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'pos'  },
          { id: 'delegate', label: 'Token Delegation', desc: 'Assigning your voting weight to a representative', abbr: 'DEL', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'dpos' },
          { id: 'finality', label: 'Instant Finality', desc: 'Transactions confirmed in a single round',     abbr: 'FIN', color: '#15803D', bg: '#F0FDF4', correctZone: 'pbft' },
        ],
        zones: [
          { id: 'pow',  label: 'Proof of Work',  desc: "Bitcoin's energy-intensive consensus model",    icon: 'layers'   },
          { id: 'pos',  label: 'Proof of Stake', desc: "Ethereum's staking-based consensus model",     icon: 'star'     },
          { id: 'dpos', label: 'Delegated PoS',  desc: 'Used in EOS and TRON, representative voting',  icon: 'arrow-up' },
          { id: 'pbft', label: 'BFT Finality',   desc: 'Used in Cosmos and enterprise blockchains',    icon: 'shield'   },
        ],
        explanations: {
          pow:  "Proof of Work requires miners to spend real energy solving hash puzzles. The first miner to solve it adds the block and earns the reward. Bitcoin has used this since 2009. It is battle-tested but uses enormous amounts of electricity.",
          pos:  "Proof of Stake replaced mining on Ethereum in 2022. Validators lock up 32 ETH as collateral and get randomly selected to propose blocks. Cheating results in slashing, where part of their staked ETH is destroyed as punishment.",
          dpos: "Delegated Proof of Stake lets token holders vote for a small group of block producers who take turns creating blocks. It is faster than PoW or PoS but more centralized since only a handful of entities produce blocks.",
          pbft: "Byzantine Fault Tolerant consensus achieves finality in one round with no forks. Transactions are final the moment they are included in a block. It works well in permissioned networks where validators are known in advance.",
        },
      },
    ],
  },
  advanced: {
    title: 'Advanced Web3 Concepts',
    color: '#7C3AED',
    steps: [
      {
        id: 'hash-functions',
        title: 'How Cryptographic Hashes Work',
        instruction: 'Hash functions are the engine of blockchain security. Every block, transaction, and address depends on them. Match each property to what it actually means.',
        items: [
          { id: 'preimage',     label: 'Pre-image Resistance', desc: 'You cannot reverse a hash to find the original input', abbr: 'OWY', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'oneway'     },
          { id: 'avalanche',    label: 'Avalanche Effect',      desc: 'Change one character and the output changes completely',  abbr: 'AVL', color: '#B91C1C', bg: '#FEF2F2', correctZone: 'sensitive' },
          { id: 'deterministic',label: 'Deterministic Output',  desc: 'Same input always produces the exact same hash',          abbr: 'DET', color: '#15803D', bg: '#F0FDF4', correctZone: 'consistent'},
          { id: 'collision',    label: 'Collision Resistance',  desc: 'Finding two inputs with the same hash is near impossible', abbr: 'COL', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'unique'    },
        ],
        zones: [
          { id: 'oneway',      label: 'One-Way Function',    desc: 'Hashes only go one direction — forward',             icon: 'lock'         },
          { id: 'sensitive',   label: 'High Sensitivity',    desc: 'Tiny input change causes a wildly different output',  icon: 'trending-up'  },
          { id: 'consistent',  label: 'Consistent Output',   desc: 'Repeat the same input, get the same hash every time', icon: 'star'         },
          { id: 'unique',      label: 'Unique Fingerprint',  desc: 'Each hash output is practically unique',              icon: 'shield'       },
        ],
        explanations: {
          oneway:     'SHA-256 (Bitcoin) and Keccak-256 (Ethereum) are one-way functions. You can hash "hello" instantly and get a fixed output. But if someone gives you that hash, there is no formula to work backwards and get "hello." This is what makes blockchain addresses and signatures safe.',
          sensitive:  'This is called the avalanche effect. Change just one letter in a 1,000-word document and the hash output looks completely different. This is why even the smallest change to a block\'s data is immediately detectable — the hash will never match.',
          consistent: 'The same input will always produce exactly the same hash. This is how nodes verify data. If two nodes hash the same block and get different results, one of them has corrupted data. Determinism makes the whole system auditable.',
          unique:     'The probability of two different inputs producing the same SHA-256 hash is astronomically small — smaller than picking the same atom in the universe twice. This is what lets transaction IDs and block hashes serve as unique identifiers.',
        },
      },
      {
        id: 'smart-contracts',
        title: 'Inside a Smart Contract',
        instruction: 'Smart contracts are programs that live and run on the blockchain. Match each Solidity concept to the role it plays inside a contract.',
        items: [
          { id: 'function',  label: 'Function',         desc: 'A block of code that executes when called',               abbr: 'FN',  color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'execute' },
          { id: 'event',     label: 'Event',            desc: 'A notification logged on-chain when something happens',   abbr: 'EVT', color: '#15803D', bg: '#F0FDF4', correctZone: 'log'     },
          { id: 'mapping',   label: 'Mapping',          desc: 'Key-value storage used to track balances and ownership',  abbr: 'MAP', color: '#B06800', bg: '#FEF5E7', correctZone: 'store'   },
          { id: 'modifier',  label: 'Modifier',         desc: 'A rule that must pass before a function can execute',     abbr: 'MOD', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'guard'   },
        ],
        zones: [
          { id: 'execute', label: 'Executable Logic', desc: 'Runs code when triggered by a user or another contract', icon: 'layers'       },
          { id: 'log',     label: 'On-chain Log',     desc: 'Emitted and indexed so front-end apps can listen to it', icon: 'list'         },
          { id: 'store',   label: 'State Storage',    desc: 'Persists data permanently on the blockchain',            icon: 'file'         },
          { id: 'guard',   label: 'Access Control',   desc: 'Enforces permissions and conditions before code runs',   icon: 'lock'         },
        ],
        explanations: {
          execute:  'Functions are the actions a smart contract can perform — like transfer(), approve(), or swap(). When you interact with a DeFi protocol by clicking "Swap" in a dApp, your wallet is calling a function on a smart contract. The Ethereum Virtual Machine (EVM) executes the code and updates the blockchain state.',
          log:      'Events are like receipts. When a transfer happens, the contract emits a Transfer event. Explorers like EtherScan and front-end dApps listen for these events to update balances and show transaction history without reading the entire chain. They are stored in logs, not in state, so they cost less gas.',
          store:    'Mappings are the most common data structure in Solidity. The ERC-20 token standard uses mapping(address => uint256) to store every wallet\'s balance. Think of it as an infinitely large spreadsheet where wallet addresses are rows and balances are the values. Reading this data is what your wallet does when it shows your token balance.',
          guard:    'Modifiers wrap functions with preconditions. The most common is onlyOwner, which checks that the caller is the contract owner before allowing a sensitive function to run. Without modifiers, anyone could call admin functions and drain your protocol.',
        },
      },
      {
        id: 'layer-two',
        title: 'Layer 2 Scaling Solutions',
        instruction: 'Layer 1 blockchains like Ethereum can be slow and expensive. Layer 2 networks process transactions off the main chain to fix this. Match each L2 type to how it works.',
        items: [
          { id: 'optimistic', label: 'Optimistic Rollup', desc: 'Submits batches assuming validity, with a fraud challenge window', abbr: 'OPT', color: '#B06800', bg: '#FEF5E7', correctZone: 'fraud'    },
          { id: 'zk',         label: 'ZK Rollup',         desc: 'Uses zero-knowledge proofs to verify batches instantly',           abbr: 'ZKP', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'validity'  },
          { id: 'channel',    label: 'State Channel',     desc: 'Two parties transact off-chain and settle the result on-chain',    abbr: 'SCH', color: '#15803D', bg: '#F0FDF4', correctZone: 'offchain'  },
          { id: 'sidechain',  label: 'Sidechain',         desc: 'A separate chain that bridges assets and runs its own consensus',  abbr: 'SID', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'parallel'  },
        ],
        zones: [
          { id: 'fraud',    label: 'Fraud-Proof System',  desc: 'Trusts by default, challenges during a waiting window',    icon: 'x-circle'     },
          { id: 'validity', label: 'Validity-Proof System',desc: 'Proves correctness with math before accepting a batch',   icon: 'shield'       },
          { id: 'offchain', label: 'Off-Chain Settlement', desc: 'Private transactions with a single on-chain final record', icon: 'trending-down'},
          { id: 'parallel', label: 'Parallel Chain',       desc: 'Separate chain that connects to Ethereum via a bridge',   icon: 'layers'       },
        ],
        explanations: {
          fraud:    'Optimistic Rollups (like Arbitrum and Optimism) bundle thousands of transactions and post them to Ethereum without proving correctness upfront. They are "optimistic" — they assume transactions are valid. A 7-day challenge window lets anyone submit a fraud proof if they find an invalid transaction. This makes them slower to finalize but cheaper to run.',
          validity: 'ZK Rollups (like zkSync and Polygon zkEVM) use zero-knowledge proofs to mathematically prove that every transaction in a batch is valid before posting to Ethereum. No waiting period is needed. They are faster to finalize but computationally harder to generate. ZK is widely considered the future of Ethereum scaling.',
          offchain: 'State Channels (like the Lightning Network on Bitcoin) let two parties lock funds in a smart contract, then transact back and forth off-chain with no fees. Only the opening and closing transactions touch the blockchain. Perfect for micropayments and gaming, not for interacting with arbitrary smart contracts.',
          parallel: 'Sidechains (like Polygon PoS) are independent blockchains with their own validators and consensus rules. They connect to Ethereum through bridges that lock and mint assets. They are less secure than rollups because Ethereum does not validate their blocks, but they can be much faster and cheaper for everyday use.',
        },
      },
      {
        id: 'governance',
        title: 'DAO Governance',
        instruction: 'DAOs replace company boards with community voting. Match each governance concept to what role it plays in running a decentralized protocol.',
        items: [
          { id: 'dao',      label: 'DAO',               desc: 'An organization governed by code and community vote',        abbr: 'DAO', color: '#7C3AED', bg: '#F5F3FF', correctZone: 'org'       },
          { id: 'token',    label: 'Governance Token',  desc: 'Gives holders voting rights on protocol changes',             abbr: 'GOV', color: '#1D4ED8', bg: '#EFF6FF', correctZone: 'power'     },
          { id: 'proposal', label: 'On-chain Proposal', desc: 'A formal change request submitted for community vote',        abbr: 'PRO', color: '#B06800', bg: '#FEF5E7', correctZone: 'motion'    },
          { id: 'quorum',   label: 'Quorum',             desc: 'The minimum voter participation needed for a vote to count',  abbr: 'QRO', color: '#15803D', bg: '#F0FDF4', correctZone: 'threshold' },
        ],
        zones: [
          { id: 'org',       label: 'Decentralized Org',    desc: 'Runs via code with no CEO or central authority',        icon: 'layers'   },
          { id: 'power',     label: 'Voting Power',         desc: 'Token holdings determine influence on decisions',        icon: 'star'     },
          { id: 'motion',    label: 'Governance Motion',    desc: 'A change request put to a community vote',               icon: 'file'     },
          { id: 'threshold', label: 'Participation Min.',   desc: 'Required turnout before a vote result is valid',         icon: 'shield'   },
        ],
        explanations: {
          org:       'A DAO (Decentralized Autonomous Organization) is governed entirely by smart contracts and token holder votes. There is no company, no CEO, and no board. Changes to the protocol happen only when the community votes for them. Uniswap, Aave, and Compound are all run this way. Anyone holding governance tokens has a say.',
          power:     'Governance tokens are the voting shares of a DAO. Holding 1% of the token supply gives you 1% of the votes. They are usually distributed to early users, investors, and contributors. In the Philippines, participating in DeFi protocols early can sometimes earn you governance tokens that later have significant voting power — and value.',
          motion:    'A proposal is a formal, on-chain request to change something — adjust interest rates, add a new token to a pool, change fee parameters, or allocate treasury funds. Anyone holding enough tokens (often a minimum threshold) can submit a proposal. It then goes to a voting period, typically 3 to 7 days.',
          threshold: 'Quorum prevents a small group from passing a proposal when most token holders do not participate. If a vote requires 4% quorum and only 3% of tokens vote, the result is invalid even if 99% of those votes said yes. This protects protocols from governance attacks where attackers exploit low turnout to pass malicious proposals.',
        },
      },
    ],
  },
}

export function getModule(key) {
  return MODULES[key] || null
}
