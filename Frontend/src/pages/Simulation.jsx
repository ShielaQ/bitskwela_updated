import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDrag, useDrop } from 'react-dnd'
import { getModule } from '../data/simulationData'

const ITEM_TYPE = 'SIM_ITEM'

// svg icons
function IconReset() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function IconGrip() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="#C8C8C8">
      <circle cx="2" cy="2" r="1.5"/>  <circle cx="8" cy="2" r="1.5"/>
      <circle cx="2" cy="8" r="1.5"/>  <circle cx="8" cy="8" r="1.5"/>
      <circle cx="2" cy="14" r="1.5"/> <circle cx="8" cy="14" r="1.5"/>
    </svg>
  )
}

// map icon name strings to actual svg
const ZONE_ICONS = {
  'wallet':        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M22 10H2"/><path d="M7 15h4"/></svg>,
  'lock':          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  'file':          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  'x-circle':      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  'trending-up':   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  'trending-down': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  'star':          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  'arrow-down':    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  'arrow-up':      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  'dollar-sign':   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  'shield':        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'layers':        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  'list':          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  'edit':          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  'trash-2':       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
}

// the drag card on the left
function DragCard({ item, isUsed }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: item.id, correctZone: item.correctZone },
    canDrag: !isUsed,
    collect: m => ({ isDragging: m.isDragging() }),
  }), [item, isUsed])

  return (
    <div
      ref={drag}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid #E8E8E8',
        background: '#fff',
        opacity: isUsed ? 0.3 : isDragging ? 0.55 : 1,
        cursor: isUsed ? 'default' : isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.14)' : '0 1px 3px rgba(0,0,0,0.05)',
        transform: isDragging ? 'scale(1.03) rotate(1deg)' : 'none',
        transition: 'box-shadow 0.15s, opacity 0.15s',
        pointerEvents: isUsed ? 'none' : 'auto',
        userSelect: 'none',
      }}
    >
      <span style={{ flexShrink: 0 }}><IconGrip /></span>

      {/* Colored icon box */}
      <div style={{
        width: 32, height: 32, borderRadius: 6, flexShrink: 0,
        background: item.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>
          {item.abbr}
        </span>
      </div>

      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#222', lineHeight: 1.3 }}>
          {item.label}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#999', lineHeight: 1.3 }}>
          {item.desc}
        </p>
      </div>
    </div>
  )
}

// the drop target area
function DropZone({ zone, placedItem, onDrop, explanation, shaking }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: draggedItem => onDrop(draggedItem, zone.id),
    collect: m => ({ isOver: m.isOver() }),
  }), [zone.id, onDrop])

  const filled       = !!placedItem
  const validHover   = isOver && !filled
  const invalidHover = isOver && filled

  let borderColor = '#DEDEDE'
  let bg          = '#FAFAFA'
  if (filled && !invalidHover) { borderColor = '#16A34A'; bg = '#F0FDF4' }
  else if (invalidHover)       { borderColor = '#DC2626'; bg = '#FEF2F2' }
  else if (validHover)         { borderColor = '#F7931A'; bg = '#FFFBF4' }

  return (
    <div
      ref={drop}
      className={shaking ? 'shake' : ''}
      style={{
        border: `2px dashed ${borderColor}`,
        borderRadius: 12,
        background: bg,
        padding: '28px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 160,
        transition: 'border-color 0.15s, background 0.15s',
        position: 'relative',
      }}
    >
      {!filled ? (
        <>
          {/* Zone icon */}
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: invalidHover ? '#FEE2E2' : validHover ? '#FEF5E7' : '#F0F0F0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
            color: invalidHover ? '#DC2626' : validHover ? '#F7931A' : '#AAAAAA',
            transition: 'background 0.15s, color 0.15s',
          }}>
            {ZONE_ICONS[zone.icon] || null}
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#333' }}>
            {zone.label}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#999', maxWidth: 160 }}>
            {zone.desc}
          </p>
          {validHover && (
            <p style={{ margin: '8px 0 0', fontSize: 12, fontWeight: 600, color: '#F7931A' }}>
              Drop here
            </p>
          )}
          {invalidHover && (
            <p style={{ margin: '8px 0 0', fontSize: 12, fontWeight: 600, color: '#DC2626' }}>
              Zone already filled
            </p>
          )}
        </>
      ) : (
        <>
          {/* Check badge */}
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
          }}>
            <IconCheck />
          </div>

          {/* Placed item chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 8,
            background: '#fff', border: '1px solid #A3E4B8',
            marginBottom: explanation ? 10 : 0,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 5,
              background: placedItem.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: placedItem.color, flexShrink: 0,
              fontFamily: 'monospace',
            }}>
              {placedItem.abbr}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#222' }}>
                {placedItem.label}
              </p>
              <p style={{ margin: '1px 0 0', fontSize: 11, color: '#16A34A' }}>Correct</p>
            </div>
          </div>

          {/* Explanation */}
          {explanation && (
            <p style={{
              margin: 0, fontSize: 12, color: '#555',
              lineHeight: 1.55, maxWidth: 220,
              background: '#fff',
              border: '1px solid #E8E8E8',
              borderRadius: 6,
              padding: '8px 10px',
              textAlign: 'left',
            }}>
              {explanation}
            </p>
          )}
        </>
      )}
    </div>
  )
}

// main page component
export default function Simulation() {
  const { module } = useParams()
  const navigate   = useNavigate()
  const moduleData = getModule(module)

  const [stepIndex,  setStepIndex]  = useState(0)
  const [placements, setPlacements] = useState({})
  const [shaking,    setShaking]    = useState(null)
  const [wrongHint,  setWrongHint]  = useState(null)

  if (!moduleData) {
    return (
      <main style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#222', marginBottom: 16 }}>Module not found.</p>
          <Link to="/learn" style={{ color: '#F7931A', fontWeight: 600 }}>Back to Learn Hub</Link>
        </div>
      </main>
    )
  }

  const step       = moduleData.steps[stepIndex]
  const totalSteps = moduleData.steps.length
  const placedCount = Object.keys(placements).length
  const totalZones  = step.zones.length
  const allDone     = placedCount >= totalZones
  const usedItems   = new Set(Object.values(placements).map(p => p.id))
  const progressPct = Math.round((placedCount / totalZones) * 100)

  const handleDrop = (dragged, zoneId) => {
    if (dragged.correctZone === zoneId) {
      const fullItem = step.items.find(i => i.id === dragged.id)
      setPlacements(prev => ({ ...prev, [zoneId]: fullItem }))
      setWrongHint(null)
    } else {
      setShaking(zoneId)
      const zoneName = step.zones.find(z => z.id === zoneId)?.label
      setWrongHint(`That one doesn't go in "${zoneName}" — give another zone a try.`)
      setTimeout(() => setShaking(null), 380)
    }
  }

  const handleReset = () => {
    setPlacements({})
    setShaking(null)
    setWrongHint(null)
  }

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex(s => s + 1)
      setPlacements({})
      setShaking(null)
      setWrongHint(null)
    } else {
      navigate('/learn')
    }
  }

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      paddingTop: 64,
      background: '#F8F8F8',
    }}>

      {/* ── Top bar ────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        height: 52,
        background: '#1A1A2E',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 13, color: '#9E9EB0' }}>
            {moduleData.title.replace('Simulations', '').replace('Concepts', '').trim()}
            {' / '}
            <strong style={{ color: '#fff', fontWeight: 600 }}>{step.title}</strong>
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4,
            background: 'rgba(247,147,26,0.14)', color: '#F7931A',
          }}>
            Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>

        <button
          onClick={handleReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: '#9E9EB0',
            fontFamily: 'Poppins, sans-serif', padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#9E9EB0'}
        >
          <IconReset /> Reset
        </button>
      </div>

      {/* ── Main body ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left sidebar */}
        <div style={{
          flexShrink: 0, width: 268,
          background: '#fff',
          borderRight: '1px solid #E8E8E8',
          padding: '18px 14px',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#AAAAAA',
            marginBottom: 12, marginTop: 0,
          }}>
            Drag these items
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {step.items.map(item => (
              <DragCard key={item.id} item={item} isUsed={usedItems.has(item.id)} />
            ))}
          </div>

          {wrongHint && (
            <div style={{
              marginTop: 16, padding: '10px 12px',
              borderRadius: 8, border: '1px solid #FECACA',
              background: '#FEF2F2',
              fontSize: 12, color: '#DC2626', lineHeight: 1.55,
            }}>
              {wrongHint}
            </div>
          )}
        </div>

        {/* Main canvas */}
        <div style={{
          flex: 1, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          padding: '20px 28px',
          gap: 16,
          minWidth: 0,
        }}>

          {/* Instruction banner */}
          <div style={{
            flexShrink: 0,
            padding: '12px 16px',
            borderRadius: 8,
            background: allDone ? '#F0FDF4' : '#FEF5E7',
            border: `1px solid ${allDone ? '#A3E4B8' : '#FDDFA0'}`,
            fontSize: 14, color: '#444', lineHeight: 1.55,
          }}>
            {allDone ? (
              <span>
                <strong style={{ color: '#16A34A' }}>All items placed correctly.</strong>
                {' '}You have completed the {step.title} step. Review the explanations below or continue to the next step.
              </span>
            ) : (
              <span>
                <strong style={{ color: '#222' }}>Task: </strong>
                {step.instruction}
              </span>
            )}
          </div>

          {/* Drop zones */}
          <div style={{
            flex: 1, minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 16,
          }}>
            {step.zones.map(zone => (
              <DropZone
                key={zone.id}
                zone={zone}
                placedItem={placements[zone.id] || null}
                onDrop={handleDrop}
                explanation={placements[zone.id] ? step.explanations[zone.id] : null}
                shaking={shaking === zone.id}
              />
            ))}
          </div>

          {/* Next step CTA */}
          {allDone && (
            <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleNext}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  height: 40, padding: '0 22px',
                  borderRadius: 999,
                  background: '#F7931A', color: '#fff',
                  fontWeight: 600, fontSize: 14,
                  fontFamily: 'Poppins, sans-serif',
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E0840F'}
                onMouseLeave={e => e.currentTarget.style.background = '#F7931A'}
              >
                {stepIndex < totalSteps - 1 ? 'Next Step' : 'Finish Module'} <IconArrow />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Progress bar ───────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, height: 44,
        background: '#fff', borderTop: '1px solid #E8E8E8',
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '0 40px',
      }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#999', flexShrink: 0 }}>
          Progress
        </span>
        <div style={{
          flex: 1, height: 4, borderRadius: 2, background: '#EBEBEB', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: allDone ? '#16A34A' : '#F7931A',
            width: `${progressPct}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#555', flexShrink: 0 }}>
          {progressPct}%
        </span>
      </div>
    </div>
  )
}
