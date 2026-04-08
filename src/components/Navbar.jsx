import { Link, useLocation } from 'react-router-dom'
import { useChatbot } from '../context/ChatbotContext'

const NAV_LINKS = [
  { to: '/',           label: 'Home'        },
  { to: '/learn',      label: 'Learn Web3'  },
  { to: '/calculator', label: 'Calculator'  },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { setIsOpen } = useChatbot()

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: '#ffffff',
      borderBottom: '1px solid #EBEBEB',
      display: 'flex', alignItems: 'center',
      padding: '0 48px',
    }}>

      {/* Logo */}
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: 48, flexShrink: 0 }}
      >
        <img src="/BitskwelaLogo-04.png" alt="Bitskwela" style={{ height: 30, display: 'block' }} />
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 36, flex: 1 }}>
        {NAV_LINKS.map(({ to, label }) => {
          const active = isActive(to)
          return (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: 15,
                fontWeight: active ? 700 : 600,
                color: active ? '#F7931A' : '#555',
                textDecoration: 'none',
                paddingBottom: 3,
                borderBottom: active ? '2px solid #F7931A' : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#F7931A' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#555' } }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 36, padding: '0 16px',
            borderRadius: 999,
            border: '1.5px solid #E8E8E8',
            background: '#fff',
            color: '#666',
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#F7931A'; e.currentTarget.style.color = '#F7931A' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.color = '#666' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Ask AI
        </button>

        <Link
          to="/learn"
          style={{
            display: 'inline-flex', alignItems: 'center',
            height: 40, padding: '0 22px',
            borderRadius: 999,
            background: '#F7931A',
            color: '#fff',
            fontSize: 14, fontWeight: 700,
            textDecoration: 'none',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Start Learning
        </Link>
      </div>
    </nav>
  )
}
