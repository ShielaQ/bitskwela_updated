import { useNavigate, Link } from 'react-router-dom'

// svg icons
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconFacebook() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
}
function IconInstagram() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
}
function IconX() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
}
function IconYoutube() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
}

// module list shown on the learn page
const MODULES = [
  {
    color: '#F7931A',
    colorLight: '#FEF5E7',
    colorBorder: '#FDDFA0',
    route: '/learn/financial',
    label: 'Module 1',
    title: 'Web3 Financial Simulations',
    desc: "Crypto finance made practical. From choosing the right wallet to understanding DeFi — each step is a drag-and-drop exercise with instant feedback. No real money, no risk.",
    difficulty: 'Beginner',
    subItems: [
      { label: 'Wallet Types',             desc: 'Hot wallets, cold wallets, Web3/DeFi wallets, and safe seed phrase storage' },
      { label: 'Buy and Sell Strategies',  desc: 'Buying the dip, DCA accumulation, taking profit, and setting stop-losses' },
      { label: 'DeFi Protocol Types',      desc: 'DEX swapping, yield farming, flash loans, and liquidity providing' },
      { label: 'Crypto Security Practices', desc: 'Hardware wallets, spotting phishing, setting up 2FA, and avoiding cloud backups' },
    ],
  },
  {
    color: '#2563EB',
    colorLight: '#EFF6FF',
    colorBorder: '#BFDBFE',
    route: '/learn/technical',
    label: 'Module 2',
    title: 'Web3 Technical Concepts',
    desc: "Blockchain isn't magic — it's math. Build transactions, assemble blocks, explore the mempool, understand gas fees, and compare consensus models. Beginner through advanced.",
    difficulty: 'Beginner → Advanced',
    subItems: [
      { label: 'Transaction Creation',   desc: 'Sender inputs, recipient outputs, fees, and digital signatures' },
      { label: 'Block Building',         desc: 'Previous hash, block header, transaction body, and the nonce' },
      { label: 'Blockchain Linking',     desc: 'How hashes connect blocks, tamper detection, full nodes, and forks' },
      { label: 'Gas & Transaction Fees', desc: 'Gas limit, base fee (EIP-1559 burn), priority tip, and Gwei units — Advanced' },
      { label: 'The Mempool',            desc: 'Pending pool, priority queue, stuck backlog, and block inclusion — Advanced' },
      { label: 'Consensus Mechanisms',   desc: 'Proof of Work, Proof of Stake, Delegated PoS, and BFT finality' },
    ],
  },
  {
    color: '#7C3AED',
    colorLight: '#F5F3FF',
    colorBorder: '#DDD6FE',
    route: '/learn/advanced',
    label: 'Module 3',
    title: 'Advanced Web3 Concepts',
    desc: "Go deeper into how blockchain really works. From cryptographic hash functions to smart contracts, Layer 2 scaling, and DAO governance — these are the concepts serious Web3 builders need to know.",
    difficulty: 'Intermediate',
    subItems: [
      { label: 'How Cryptographic Hashes Work', desc: 'Pre-image resistance, avalanche effect, determinism, and collision resistance' },
      { label: 'Inside a Smart Contract',        desc: 'Functions, events, mappings, and modifiers in Solidity explained' },
      { label: 'Layer 2 Scaling Solutions',      desc: 'Optimistic rollups, ZK rollups, state channels, and sidechains' },
      { label: 'DAO Governance',                 desc: 'DAOs, governance tokens, on-chain proposals, and quorum requirements' },
    ],
  },
]

const SOCIALS = [
  { icon: <IconFacebook />, href: 'https://www.facebook.com/bitskwela', label: 'Facebook' },
  { icon: <IconInstagram />, href: 'https://www.instagram.com/bitskwela', label: 'Instagram' },
  { icon: <IconX />, href: 'https://twitter.com/bitskwela', label: 'X (Twitter)' },
  { icon: <IconYoutube />, href: 'https://www.youtube.com/@bitskwela', label: 'YouTube' },
]

// main page component
export default function LearnHub() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: 64, background: '#fff', minHeight: '100vh' }}>

      {/* ── Page hero ────────────────────────────────────────────── */}
      <div style={{
        background: '#1A1A2E',
        padding: '52px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,147,26,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 40, flexWrap: 'wrap',
        }}>
          {/* Left text */}
          <div style={{ flex: '1 1 400px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13 }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F7931A'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                Home
              </Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Learn Web3</span>
            </div>

            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F7931A',
              background: 'rgba(247,147,26,0.15)', padding: '4px 12px', borderRadius: 999, marginBottom: 16,
            }}>
              Interactive Modules
            </span>
            <h1 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
              color: '#fff', marginBottom: 14, letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>
              Learn Web3
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 460, lineHeight: 1.75 }}>
              Drag-and-drop simulations that teach you crypto and blockchain by doing —
              not just reading. Free, beginner-friendly, restart as many times as you want.
            </p>
          </div>

          {/* Right image */}
          <div style={{ flex: '0 0 auto' }}>
            <img
              src="/learn-banner.png"
              alt="Web3 learning modules"
              style={{
                height: 160,
                objectFit: 'contain',
                filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.3))',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Module cards ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {MODULES.map((mod) => (
            <ModuleCard key={mod.title} mod={mod} onStart={() => navigate(mod.route)} />
          ))}
        </div>

        {/* Info note */}
        <div style={{
          marginTop: 28, padding: '16px 20px', borderRadius: 10,
          background: '#FBF7EF', border: '1px solid #EDE4D4',
          fontSize: 13, color: '#666', lineHeight: 1.65,
        }}>
          <strong style={{ color: '#1A1A1A' }}>How the simulations work: </strong>
          Each step gives you 4 items to drag into 4 answer zones.
          Drop an item in the wrong zone and you'll get a hint. Drop it correctly and
          you'll see a plain-language explanation of why. No timer, no pressure — go at your own pace.
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{ background: '#fff', padding: '48px 48px 36px', borderTop: '1px solid #EBEBEB', marginTop: 32 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 48, paddingBottom: 36, borderBottom: '1px solid #EBEBEB',
          }}>
            <div>
              <img src="/BitskwelaLogo-04.png" alt="Bitskwela" style={{ height: 26, marginBottom: 16 }} />
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.75, marginBottom: 10 }}>
                Filipino-led Web3 education. Free for everyone.
              </p>
              <p style={{ fontSize: 12, color: '#AAA' }}>Copyright 2025. All Rights Reserved.</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 11, fontWeight: 700, color: '#F7931A', marginBottom: 16, letterSpacing: '0.01em' }}>Key Sections</p>
              {[['/', 'Home'], ['/learn', 'Learn Web3'], ['/calculator', 'Investment Calculator']].map(([to, label]) => (
                <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: '#555', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F7931A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 11, fontWeight: 700, color: '#F7931A', marginBottom: 16, letterSpacing: '0.01em' }}>Follow Our Socials</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {SOCIALS.map(({ icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{
                      width: 40, height: 40, borderRadius: '50%', background: '#F7931A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      textDecoration: 'none', transition: 'opacity 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; e.currentTarget.style.transform = 'scale(1.08)' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p style={{ marginTop: 24, fontSize: 11, color: '#CCC', lineHeight: 1.7 }}>
            All simulations are for educational purposes only. No real money is involved. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

// individual module card
function ModuleCard({ mod, onStart }) {
  return (
    <div
      style={{
        background: '#fff', border: '1px solid #E8E8E8',
        borderRadius: 16, overflow: 'hidden',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = mod.colorBorder
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E8E8E8'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top accent stripe */}
      <div style={{ height: 4, background: mod.color }} />

      <div style={{ padding: '36px 40px', display: 'flex', gap: 48, flexWrap: 'wrap' }}>

        {/* Left */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#AAA',
            }}>
              {mod.label}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px',
              borderRadius: 999,
              background: mod.difficulty.includes('Advanced') ? '#EFF6FF' : '#F0FDF4',
              color: mod.difficulty.includes('Advanced') ? '#1D4ED8' : '#16A34A',
              border: `1px solid ${mod.difficulty.includes('Advanced') ? '#BFDBFE' : '#BBF7D0'}`,
            }}>
              {mod.difficulty}
            </span>
          </div>

          <h2 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 17, fontWeight: 800, color: '#1A1A1A', marginBottom: 12, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            {mod.title}
          </h2>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 24, maxWidth: 520 }}>
            {mod.desc}
          </p>

          <button
            onClick={onStart}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              height: 44, padding: '0 24px', borderRadius: 999,
              background: mod.color, color: '#fff',
              fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Start Module <IconArrow />
          </button>
        </div>

        {/* Right — steps list */}
        <div style={{ minWidth: 220, maxWidth: 300 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: '#AAA', marginBottom: 16,
          }}>
            {mod.subItems.length} Steps
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mod.subItems.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                  background: mod.colorLight, color: mod.color,
                  fontSize: 11, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#222', margin: 0, lineHeight: 1.35 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: '#999', margin: '2px 0 0', lineHeight: 1.45 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
