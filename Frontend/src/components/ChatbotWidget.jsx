import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useChatbot } from '../hooks/useChatbot'

// svg icons
function IconChat() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g

const renderInline = (text, keyPrefix) => {
  if (!text) return null
  return text
    .split(INLINE_PATTERN)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith('**') && segment.endsWith('**')) {
        return (
          <strong key={`${keyPrefix}-bold-${index}`}>
            {segment.slice(2, -2)}
          </strong>
        )
      }
      if (segment.startsWith('*') && segment.endsWith('*')) {
        return (
          <em key={`${keyPrefix}-italic-${index}`}>
            {segment.slice(1, -1)}
          </em>
        )
      }
      return <span key={`${keyPrefix}-text-${index}`}>{segment}</span>
    })
}

const renderRichText = (text) => {
  if (typeof text !== 'string') return text
  const lines = text.split(/\r?\n/)
  const blocks = []
  let listItems = []

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'list', items: listItems })
      listItems = []
    }
  }

  lines.forEach((line) => {
    const match = line.match(/^\s*[-*]\s+(.*)$/)
    if (match) {
      listItems.push(match[1])
      return
    }
    flushList()
    blocks.push({ type: 'paragraph', text: line })
  })

  flushList()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={`list-${index}`} style={{ margin: 0, paddingLeft: 18 }}>
              {block.items.map((item, itemIndex) => (
                <li
                  key={`list-${index}-item-${itemIndex}`}
                  style={{ marginBottom: itemIndex === block.items.length - 1 ? 0 : 4 }}
                >
                  {renderInline(item, `list-${index}-item-${itemIndex}`)}
                </li>
              ))}
            </ul>
          )
        }
        if (!block.text.trim()) {
          return <div key={`spacer-${index}`} style={{ height: 6 }} />
        }
        return (
          <p key={`p-${index}`} style={{ margin: 0 }}>
            {renderInline(block.text, `p-${index}`)}
          </p>
        )
      })}
    </div>
  )
}

// chatbot widget component
export default function ChatbotWidget() {
  const {
    isOpen, setIsOpen,
    messages, showQuickReplies, quickReplies,
    inputText, setInputText, sendMessage,
  } = useChatbot()

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80)
  }, [isOpen])

  const submit = () => {
    const text = inputText.trim()
    if (text) sendMessage(text)
  }

  return (
    <>
      {/* ── Floating button ──────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open AI Assistant"
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 200,
            width: 56, height: 56, borderRadius: '50%',
            background: '#F7931A',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(247,147,26,0.40)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.07)'
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(247,147,26,0.50)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(247,147,26,0.40)'
          }}
        >
          <IconChat />
        </button>
      )}

      {/* ── Chat panel ───────────────────────────────────── */}
      {isOpen && (
        <div
          className="slide-up"
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 200,
            width: 380,
            maxHeight: 'min(540px, calc(100vh - 100px))',
            display: 'flex', flexDirection: 'column',
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #E8E8E8',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            flexShrink: 0,
            background: '#F7931A',
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff' }}>
                  Bitskwela Assistant
                </p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
                  Web3 learning help
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.30)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <IconClose />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '18px 16px',
            display: 'flex', flexDirection: 'column', gap: 12,
            minHeight: 0,
          }}>
            {messages.map(msg => (
              <div key={msg.id}>
                <div style={{
                  display: 'flex', gap: 8, maxWidth: '86%',
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                  marginLeft:  msg.type === 'user' ? 'auto' : 0,
                }}>
                  {/* Avatar dot */}
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: msg.type === 'bot' ? '#FEF5E7' : '#EBEBEB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700,
                    color: msg.type === 'bot' ? '#F7931A' : '#888',
                    marginTop: 2,
                  }}>
                    {msg.type === 'bot' ? 'B' : 'U'}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.type === 'bot'
                      ? '2px 10px 10px 10px'
                      : '10px 2px 10px 10px',
                    fontSize: 13, lineHeight: 1.55,
                    background: msg.type === 'bot' ? '#F4F4F8' : '#F7931A',
                    color:      msg.type === 'bot' ? '#444' : '#fff',
                  }}>
                    {renderRichText(msg.text)}
                  </div>
                </div>

                {/* "Go to Module" link */}
                {msg.showLearnLink && (
                  <div style={{ paddingLeft: 32, marginTop: 8 }}>
                    <Link
                      to="/learn"
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: 12, fontWeight: 600,
                        padding: '5px 12px', borderRadius: 6,
                        background: '#FEF5E7',
                        color: '#B06800',
                        border: '1px solid #FDDFA0',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      Go to Modules <IconArrow />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Quick replies */}
            {showQuickReplies && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 32 }}>
                {quickReplies.map(qr => (
                  <button
                    key={qr}
                    onClick={() => sendMessage(qr)}
                    style={{
                      fontSize: 12, fontWeight: 500, padding: '5px 12px',
                      borderRadius: 999,
                      background: '#FEF5E7', color: '#B06800',
                      border: '1px solid #FDDFA0',
                      fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#F7931A'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = '#F7931A'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#FEF5E7'
                      e.currentTarget.style.color = '#B06800'
                      e.currentTarget.style.borderColor = '#FDDFA0'
                    }}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            borderTop: '1px solid #F0F0F0',
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Ask anything about Web3..."
              style={{
                flex: 1, height: 36,
                border: '1px solid #E8E8E8', borderRadius: 999,
                padding: '0 14px', fontSize: 13, color: '#222',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none', background: '#fff',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#F7931A'}
              onBlur={e  => e.target.style.borderColor = '#E8E8E8'}
            />
            <button
              onClick={submit}
              style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: '#F7931A', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E0840F'}
              onMouseLeave={e => e.currentTarget.style.background = '#F7931A'}
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
