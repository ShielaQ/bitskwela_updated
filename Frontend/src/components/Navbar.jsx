import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useChatbot } from '../context/ChatbotContext'
import { useIsMobile } from '../utils/useIsMobile'

const NAV_LINKS = [
  { to: '/',           label: 'Home'        },
  { to: '/learn',      label: 'Learn Web3'  },
  { to: '/calculator', label: 'Calculator'  },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { setIsOpen } = useChatbot()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#ffffff',
      borderBottom: '1px solid #EBEBEB',
    }}>
      {/* Main bar */}
      <div style={{
        height: 64,
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '0 16px' : '0 48px',
      }}>
        {/* Logo */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: isMobile ? 0 : 48, flexShrink: 0, flex: isMobile ? 1 : 'none' }}
        >
          <img src={`${import.meta.env.BASE_URL}BitskwelaLogo-04.png`} alt="Bitskwela" style={{ height: 30, display: 'block' }} />
        </Link>

        {/* Desktop: Nav links */}
        {!isMobile && (
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
        )}

        {/* Desktop: Right side buttons */}
        {!isMobile && (
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
        )}

        {/* Mobile: Hamburger button */}
        {isMobile && (
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#333', flexShrink: 0,
            }}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile: Dropdown menu */}
      {isMobile && open && (
        <div style={{
          width: '100%',
          background: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          borderTop: '1px solid #EBEBEB',
          padding: '12px 16px 20px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {NAV_LINKS.map(({ to, label }) => {
            const active = isActive(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 15, fontWeight: active ? 700 : 600,
                  color: active ? '#F7931A' : '#333',
                  textDecoration: 'none',
                  padding: '10px 4px',
                  borderBottom: '1px solid #F5F5F5',
                  display: 'block',
                }}
              >
                {label}
              </Link>
            )
          })}

          <button
            onClick={() => { setIsOpen(true); setOpen(false) }}
            style={{
              marginTop: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              height: 40, borderRadius: 999,
              border: '1.5px solid #E8E8E8',
              background: '#fff', color: '#666',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Ask AI
          </button>

          <Link
            to="/learn"
            onClick={() => setOpen(false)}
            style={{
              marginTop: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 42, borderRadius: 999,
              background: '#F7931A', color: '#fff',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}
          >
            Start Learning
          </Link>
        </div>
      )}
    </nav>
  )
}
