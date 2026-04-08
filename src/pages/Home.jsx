import { Link } from 'react-router-dom'

// shared icon
function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

// social icon links for footer
const Socials = [
  {
    label: 'Facebook', href: 'https://www.facebook.com/bitskwela',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  },
  {
    label: 'Instagram', href: 'https://www.instagram.com/bitskwela',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
  {
    label: 'X', href: 'https://twitter.com/bitskwela',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: 'YouTube', href: 'https://www.youtube.com/@bitskwela',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>,
  },
]

// topic chips shown in hero
const TOPICS = [
  { label: 'Bitcoin',    bg: '#FEF5E7', color: '#B06800' },
  { label: 'Wallets',    bg: '#F5F3FF', color: '#6D28D9' },
  { label: 'Blockchain', bg: '#EFF6FF', color: '#1D4ED8' },
  { label: 'DeFi',       bg: '#F0FDF4', color: '#15803D' },
  { label: 'Staking',    bg: '#FDF2F8', color: '#9D174D' },
  { label: 'Web3',       bg: '#FEF5E7', color: '#B06800' },
  { label: 'NFTs',       bg: '#EFF6FF', color: '#1D4ED8' },
]

// tool cards for the three main features
const TOOLS = [
  {
    accent:       '#F7931A',
    accentMid:    '#E0840F',
    accentLight:  '#FFF8EE',
    accentBorder: '#FDDFA0',
    category:     'Simulation',
    title:        'Web3 Financial Simulations',
    desc:         'Practice wallets, trading strategies, DeFi protocols, and security basics. Each step is a drag-and-drop exercise with instant feedback. No real money involved.',
    topics: [
      { label: 'Wallet Types',      bg: '#FEF5E7', color: '#B06800' },
      { label: 'Buy and Sell',      bg: '#F0FDF4', color: '#15803D' },
      { label: 'DeFi Protocols',    bg: '#F5F3FF', color: '#6D28D9' },
      { label: 'Crypto Security',   bg: '#FEF2F2', color: '#B91C1C' },
    ],
    cta:   'Start Simulating',
    route: '/learn/financial',
  },
  {
    accent:       '#2563EB',
    accentMid:    '#1D4ED8',
    accentLight:  '#EFF6FF',
    accentBorder: '#BFDBFE',
    category:     'Simulation',
    title:        'Web3 Technical Concepts',
    desc:         'See how blockchain actually works from the inside. Build transactions, assemble blocks, link the chain, and compare consensus mechanisms. Hands-on exercises only.',
    topics: [
      { label: 'Transactions',         bg: '#EFF6FF', color: '#1D4ED8' },
      { label: 'Block Building',       bg: '#F5F3FF', color: '#6D28D9' },
      { label: 'Blockchain Linking',   bg: '#F0FDF4', color: '#15803D' },
      { label: 'Consensus Mechanisms', bg: '#FEF5E7', color: '#B06800' },
    ],
    cta:   'Start Simulating',
    route: '/learn/technical',
  },
  {
    accent:       '#059669',
    accentMid:    '#047857',
    accentLight:  '#ECFDF5',
    accentBorder: '#A7F3D0',
    category:     'Calculator',
    title:        'Investment Calculator',
    desc:         'Put in a peso amount, pick an asset, set a time horizon. Compare Bitcoin, Pag-IBIG MP2, Treasury Bills, time deposits, and REITs side by side.',
    topics: [
      { label: 'Bitcoin and Crypto',  bg: '#FEF5E7', color: '#B06800' },
      { label: 'Pag-IBIG MP2',        bg: '#EFF6FF', color: '#1D4ED8' },
      { label: 'Treasury Bills',      bg: '#F0FDF4', color: '#15803D' },
      { label: 'REITs',               bg: '#F5F3FF', color: '#6D28D9' },
    ],
    cta:   'Open Calculator',
    route: '/calculator',
  },
]

// how it works steps
const HOW = [
  {
    n: '01', color: '#F7931A', bg: '#FEF5E7',
    title: 'Pick a module',
    desc:  'Choose Financial Simulations, Technical Concepts, or jump straight to the Calculator. All three are free and built for beginners.',
  },
  {
    n: '02', color: '#2563EB', bg: '#EFF6FF',
    title: 'Drag and drop',
    desc:  'Each exercise gives you four items to categorize. Drop one in the wrong zone and you get a hint. Drop it correctly and you get the explanation.',
  },
  {
    n: '03', color: '#059669', bg: '#ECFDF5',
    title: 'Read the explanation',
    desc:  'Every correct answer reveals a plain-language breakdown of why it is right. No textbooks, no jargon, just the key point you need.',
  },
  {
    n: '04', color: '#7C3AED', bg: '#F5F3FF',
    title: 'Run the numbers',
    desc:  'Switch to the Investment Calculator. Enter any amount in pesos and see how it grows across different asset classes over different time horizons.',
  },
]

// footer nav links
const FOOTER_LINKS = [
  { label: 'Home',                 to: '/'           },
  { label: 'Learn Web3',           to: '/learn'       },
  { label: 'Investment Calculator',to: '/calculator'  },
  { label: 'Financial Simulations',to: '/learn/financial' },
  { label: 'Technical Concepts',   to: '/learn/technical' },
]

// main page component
export default function Home() {
  return (
    <div style={{ paddingTop: 64, background: '#fff' }}>

      {/* hero */}
      <section style={{ background: '#fff', padding: '72px 48px 68px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap',
        }}>

          {/* Left */}
          <div style={{ flex: '1 1 400px', minWidth: 300 }}>
            <span style={{
              display: 'inline-block',
              background: '#FEF5E7', color: '#B06800',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 999,
              marginBottom: 22,
            }}>
              Free Web3 Learning Platform
            </span>

            <h1 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 'clamp(28px, 3.8vw, 46px)',
              fontWeight: 800,
              color: '#1A1A1A',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              marginBottom: 18,
            }}>
              Crypto, <span className="italic-georgia" style={{ fontWeight: 400, fontSize: '0.92em', color: '#F7931A' }}>in a language</span><br />that actually clicks.
            </h1>

            <p style={{
              fontSize: 16, color: '#555', lineHeight: 1.75,
              marginBottom: 32, maxWidth: 460,
            }}>
              Bitskwela teaches Bitcoin and blockchain through hands-on exercises,
              a peso investment calculator, and an AI assistant you can ask anything.
              Free. No account needed.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link to="/learn" style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                height: 48, padding: '0 28px', borderRadius: 999,
                background: '#F7931A', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                transition: 'opacity 0.15s, transform 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}>
                Start Learning <IconArrow />
              </Link>
              <Link to="/calculator" style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                height: 48, padding: '0 28px', borderRadius: 999,
                border: '2px solid #E8E8E8', background: 'transparent',
                color: '#555', fontWeight: 700, fontSize: 15, textDecoration: 'none',
                transition: 'border-color 0.15s, color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F7931A'; e.currentTarget.style.color = '#F7931A' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.color = '#555' }}>
                Try the Calculator
              </Link>
            </div>

            {/* Topic chips */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#AAA', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
                Topics covered
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {TOPICS.map(t => (
                  <span key={t.label} style={{
                    fontSize: 12, fontWeight: 600,
                    padding: '4px 13px', borderRadius: 999,
                    background: t.bg, color: t.color,
                  }}>
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: hero image */}
          <div style={{ flex: '1 1 320px', minWidth: 260, display: 'flex', justifyContent: 'center' }}>
            <img
              src="/hero-collage.png"
              alt="Learn crypto and blockchain with Bitskwela"
              style={{
                width: '100%', maxWidth: 440, objectFit: 'contain',
                filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.09))',
              }}
            />
          </div>
        </div>
      </section>

      {/* tools section */}
      <section style={{ background: '#FBF7F0', padding: '72px 48px', borderTop: '1px solid #EDE4D4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ maxWidth: 540, marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 'clamp(20px, 2.4vw, 30px)', fontWeight: 700,
              color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.01em',
            }}>
              Pick your starting point.
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.75 }}>
              Two simulation modules and an investment calculator. All built to give you
              a real feel for crypto and Web3, without any actual risk.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {TOOLS.map(tool => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* how it works section */}
      <section style={{ background: '#fff', padding: '72px 48px', borderTop: '1px solid #EBEBEB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ maxWidth: 480, marginBottom: 52 }}>
            <h2 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 'clamp(18px, 2.2vw, 28px)', fontWeight: 700,
              color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.01em',
            }}>
              You do not need to read a 50-page guide.
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.75 }}>
              Just pick a module and start dragging. Here is how the platform works.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 0,
          }}>
            {HOW.map((step, i) => (
              <div
                key={step.n}
                style={{
                  padding: '32px 28px',
                  borderLeft: i > 0 ? '1px solid #EBEBEB' : 'none',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: step.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: step.color,
                  fontFamily: "'Unbounded', sans-serif",
                  marginBottom: 18,
                }}>
                  {step.n}
                </div>
                <h3 style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* callout banner */}
      <section style={{
        background: '#F7931A',
        padding: '56px 48px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 'clamp(18px, 2.2vw, 26px)', fontWeight: 700,
              color: '#fff', marginBottom: 10, letterSpacing: '-0.01em',
            }}>
              Para sa Lahat ng Pilipino.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 520 }}>
              Bitskwela was built so that every Filipino, anywhere in the country,
              can understand crypto and blockchain without needing a finance degree.
              Free education for everyone.
            </p>
          </div>
          <Link to="/learn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 48, padding: '0 28px', borderRadius: 999,
            background: '#fff', color: '#F7931A',
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
            flexShrink: 0, transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Start Learning <IconArrow />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer style={{ background: '#fff', padding: '56px 48px 40px', borderTop: '1px solid #EBEBEB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            gap: 48,
            paddingBottom: 40,
            borderBottom: '1px solid #EBEBEB',
          }}>

            {/* About */}
            <div>
              <img src="/BitskwelaLogo-04.png" alt="Bitskwela" style={{ height: 28, marginBottom: 18 }} />
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.8, marginBottom: 16 }}>
                Bitskwela is a Filipino-led edutech platform that strives to make
                Bitcoin and cryptocurrency education accessible to all Filipinos
                of any ethnicity.
              </p>
              <p style={{ fontSize: 12, color: '#BBB', marginBottom: 10 }}>
                Copyright 2025. All Rights Reserved.
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                {['Terms and Conditions', 'Privacy Policy', 'Legal Disclaimer'].map(t => (
                  <span key={t} style={{ fontSize: 11, color: '#BBB', cursor: 'pointer', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F7931A'}
                    onMouseLeave={e => e.currentTarget.style.color = '#BBB'}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Key sections */}
            <div>
              <p style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 12, fontWeight: 700, color: '#F7931A', marginBottom: 18, letterSpacing: '0.01em' }}>
                Key Sections
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px 16px' }}>
                {FOOTER_LINKS.map(({ label, to }) => (
                  <Link key={label} to={to} style={{ fontSize: 13, color: '#555', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F7931A'}
                    onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div>
              <p style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 12, fontWeight: 700, color: '#F7931A', marginBottom: 18, letterSpacing: '0.01em' }}>
                Follow Our Socials
              </p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {Socials.map(({ icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{
                      width: 40, height: 40, borderRadius: '50%', background: '#F7931A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', textDecoration: 'none',
                      transition: 'opacity 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'scale(1.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}>
                    {icon}
                  </a>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#AAA', lineHeight: 1.65 }}>
                Stay updated with the latest Web3<br />news and learning content.
              </p>
            </div>
          </div>

          <p style={{ marginTop: 24, fontSize: 11, color: '#CCC', lineHeight: 1.8 }}>
            All simulations and projections on this platform are for educational purposes only.
            No real money is involved. Cryptocurrency is highly volatile. Past performance does
            not guarantee future results. Consult a licensed financial advisor before investing.
            Bitskwela is not a brokerage, exchange, or financial institution.
          </p>
        </div>
      </footer>

    </div>
  )
}

// tool card component
function ToolCard({ tool }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${tool.accentBorder}`,
        borderTop: `4px solid ${tool.accent}`,
        borderRadius: 14,
        padding: '28px 26px 26px',
        display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.08)`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Category chip */}
      <span style={{
        alignSelf: 'flex-start',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '3px 10px', borderRadius: 999,
        background: tool.accentLight, color: tool.accent,
        marginBottom: 14,
      }}>
        {tool.category}
      </span>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Unbounded', sans-serif",
        fontSize: 15, fontWeight: 700,
        color: '#1A1A1A', marginBottom: 10, lineHeight: 1.35, letterSpacing: '-0.01em',
      }}>
        {tool.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 13, color: '#666', lineHeight: 1.75,
        marginBottom: 20, flexGrow: 1,
      }}>
        {tool.desc}
      </p>

      {/* Topic chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
        {tool.topics.map(t => (
          <span key={t.label} style={{
            fontSize: 11, fontWeight: 600,
            padding: '3px 11px', borderRadius: 999,
            background: t.bg, color: t.color,
          }}>
            {t.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        to={tool.route}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 40, padding: '0 20px', borderRadius: 999,
          background: tool.accent, color: '#fff',
          fontWeight: 700, fontSize: 13, textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        {tool.cta} <IconArrow />
      </Link>
    </div>
  )
}
