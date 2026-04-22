import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { fmtPeso } from '../utils/formatters'

// investment type data
const INVESTMENT_TYPES = {
  Crypto: [
    { value: 'bitcoin',  label: 'Bitcoin (BTC)',     annualReturn: 0.80, risk: 'high',   color: '#F7931A' },
    { value: 'ethereum', label: 'Ethereum (ETH)',    annualReturn: 0.60, risk: 'high',   color: '#627EEA' },
    { value: 'solana',   label: 'Solana (SOL)',      annualReturn: 1.20, risk: 'high',   color: '#9945FF' },
    { value: 'usdt',     label: 'USDT Staking',      annualReturn: 0.08, risk: 'low',    color: '#26A17B' },
  ],
  Government: [
    { value: 'pagibig',  label: 'Pag-IBIG MP2',          annualReturn: 0.070, risk: 'none',   color: '#1D4ED8' },
    { value: 'tbill',   label: 'Treasury Bills',          annualReturn: 0.062, risk: 'none',   color: '#2563EB' },
    { value: 'rtb',     label: 'Retail Treasury Bonds',   annualReturn: 0.065, risk: 'none',   color: '#3B82F6' },
  ],
  Banking: [
    { value: 'savings',    label: 'Regular Savings Account', annualReturn: 0.005, risk: 'none', color: '#64748B' },
    { value: 'td',         label: 'Time Deposit (1 yr)',      annualReturn: 0.045, risk: 'none', color: '#475569' },
    { value: 'hysavings',  label: 'High-Yield Savings',       annualReturn: 0.025, risk: 'none', color: '#334155' },
  ],
  'Real Estate': [
    { value: 'realestate', label: 'Philippine Real Estate', annualReturn: 0.08, risk: 'medium', color: '#78350F' },
    { value: 'reit',       label: 'REITs (AREIT)',           annualReturn: 0.06, risk: 'medium', color: '#92400E' },
  ],
}

const HORIZONS = [
  { label: '5 Days',   days: 5   },
  { label: '30 Days',  days: 30  },
  { label: '3 Months', days: 90  },
  { label: '6 Months', days: 180 },
  { label: '1 Year',   days: 365 },
  { label: '5 Years',  days: 1825},
]

const MODES      = ['Conservative', 'Moderate', 'Aggressive']
const MODE_MULT  = { Conservative: 0.45, Moderate: 1.0, Aggressive: 1.75 }

// helpers
function buildChartData(principal, annualReturn, days, modeMult) {
  const effective = annualReturn * modeMult
  const points    = Math.min(days, 60)
  return Array.from({ length: points + 1 }, (_, i) => {
    const d     = Math.round((days / points) * i)
    const val   = principal * Math.pow(1 + effective / 365, d)
    const lo    = principal * Math.pow(1 + (effective * 0.5) / 365, d)
    const hi    = principal * Math.pow(1 + (effective * 1.6) / 365, d)
    const label = d < 30 ? `D${d}` : d < 365 ? `${Math.round(d/30)}mo` : `${(d/365).toFixed(1)}yr`
    return { label, value: Math.round(val), lower: Math.round(lo), upper: Math.round(hi) }
  })
}

// custom chart tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1A1A2E', color: '#fff', borderRadius: 8,
      padding: '8px 12px', fontSize: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <p style={{ margin: '0 0 4px', color: '#9E9EB0' }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 600, color: '#F7931A' }}>
        {fmtPeso(payload[0]?.value)}
      </p>
    </div>
  )
}

// risk level badge
function RiskBadge({ risk }) {
  const map = {
    high:   { bg: '#FEF2F2', color: '#DC2626', label: 'High risk' },
    medium: { bg: '#FEF5E7', color: '#F7931A', label: 'Medium risk' },
    low:    { bg: '#F0FDF4', color: '#16A34A', label: 'Low risk' },
    none:   { bg: '#F0FDF4', color: '#16A34A', label: 'Very low risk' },
  }
  const s = map[risk] || map.none
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
      background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  )
}

// main page component
export default function Calculator() {
  const [amount,       setAmount]       = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [horizonDays,  setHorizonDays]  = useState(365)
  const [mode,         setMode]         = useState('Moderate')
  const [result,       setResult]       = useState(null)

  const allOptions = Object.entries(INVESTMENT_TYPES).flatMap(([group, items]) =>
    items.map(i => ({ ...i, group }))
  )
  const selectedInfo = allOptions.find(o => o.value === selectedType)
  const isCrypto     = selectedInfo?.group === 'Crypto'
  const isValid      = amount && parseFloat(amount) > 0 && selectedType

  const handleCalculate = () => {
    if (!isValid) return
    const principal  = parseFloat(amount)
    const modeMult   = isCrypto ? MODE_MULT[mode] : 1
    const effective  = selectedInfo.annualReturn * modeMult
    const projected  = principal * Math.pow(1 + effective / 365, horizonDays)
    const profit     = projected - principal
    const pct        = (profit / principal) * 100
    const chartData  = buildChartData(principal, selectedInfo.annualReturn, horizonDays, modeMult)

    setResult({ projected, profit, pct, chartData, isCrypto,
      color: selectedInfo.color, label: selectedInfo.label })
  }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#F8F8F8' }}>

      {/* ── Page header ──────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '48px 48px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: '#AAA' }}>
            <Link to="/" style={{ color: '#AAA', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F7931A'}
              onMouseLeave={e => e.currentTarget.style.color = '#AAA'}>Home</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span style={{ color: '#333', fontWeight: 600 }}>Investment Calculator</span>
          </div>

          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F7931A',
            background: '#FEF5E7', padding: '4px 12px', borderRadius: 999, marginBottom: 16,
          }}>
            Interactive Tool
          </span>
          <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 26, fontWeight: 800, color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.01em' }}>
            Investment Calculator
          </h1>
          <p style={{ fontSize: 16, color: '#666', maxWidth: 540, lineHeight: 1.7 }}>
            Put in a peso amount, pick an asset, set a time horizon. See how it grows —
            whether that's Bitcoin, Pag-IBIG MP2, a time deposit, or a REIT.
            Educational projections only, not financial advice.
          </p>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: result ? '1fr 1fr' : 'minmax(0, 560px)',
          gap: 24,
          alignItems: 'start',
        }}>

          {/* ── LEFT — Inputs ──────────────────────────────── */}
          <div style={{
            background: '#fff',
            border: '1px solid #E8E8E8',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {/* Panel header */}
            <div style={{
              padding: '20px 28px',
              borderBottom: '1px solid #F0F0F0',
            }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#222' }}>
                Simulation Inputs
              </h3>
            </div>

            <div style={{ padding: '28px' }}>

              {/* Peso amount */}
              <Field label="Investment Amount">
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 14, fontWeight: 600, color: '#AAAAAA',
                    userSelect: 'none',
                  }}>
                    ₱
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="e.g. 10000"
                    style={{
                      width: '100%', height: 44,
                      paddingLeft: 30, paddingRight: 14,
                      border: '1px solid #E8E8E8', borderRadius: 8,
                      fontSize: 14, color: '#222',
                      fontFamily: 'Poppins, sans-serif',
                      outline: 'none',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#F7931A'}
                    onBlur={e  => e.target.style.borderColor = '#E8E8E8'}
                  />
                </div>
              </Field>

              {/* Investment type */}
              <Field label="Investment Type" style={{ marginTop: 20 }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    style={{
                      width: '100%', height: 44,
                      padding: '0 32px 0 14px',
                      border: '1px solid #E8E8E8', borderRadius: 8,
                      fontSize: 14,
                      color: selectedType ? '#222' : '#AAAAAA',
                      fontFamily: 'Poppins, sans-serif',
                      appearance: 'none',
                      background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23AAAAAA'/%3E%3C/svg%3E") no-repeat right 12px center`,
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#F7931A'}
                    onBlur={e  => e.target.style.borderColor = '#E8E8E8'}
                  >
                    <option value="">Select investment type...</option>
                    {Object.entries(INVESTMENT_TYPES).map(([group, items]) => (
                      <optgroup key={group} label={group}>
                        {items.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.label} — {(item.annualReturn * 100).toFixed(1)}%/yr est.
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {selectedInfo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: selectedInfo.color, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 12, color: '#999' }}>
                      Est. {(selectedInfo.annualReturn * 100).toFixed(1)}% annual return
                    </span>
                    <RiskBadge risk={selectedInfo.risk} />
                  </div>
                )}
              </Field>

              {/* Time horizon */}
              <Field label="Time Horizon" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {HORIZONS.map(({ label, days }) => (
                    <button
                      key={label}
                      onClick={() => setHorizonDays(days)}
                      style={{
                        height: 34, padding: '0 16px',
                        borderRadius: 999,
                        border: `1px solid ${horizonDays === days ? '#F7931A' : '#E8E8E8'}`,
                        background: horizonDays === days ? '#F7931A' : '#fff',
                        color: horizonDays === days ? '#fff' : '#555',
                        fontSize: 13, fontWeight: 500,
                        fontFamily: 'Poppins, sans-serif',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Prediction mode (crypto only) */}
              <Field
                label="Prediction Mode"
                hint={!isCrypto ? 'Crypto only' : undefined}
                style={{ marginTop: 20 }}
              >
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {MODES.map(m => (
                    <button
                      key={m}
                      onClick={() => isCrypto && setMode(m)}
                      style={{
                        height: 34, padding: '0 16px',
                        borderRadius: 999,
                        border: `1px solid ${mode === m && isCrypto ? '#222' : '#E8E8E8'}`,
                        background: mode === m && isCrypto ? '#222' : '#fff',
                        color: mode === m && isCrypto ? '#fff' : '#555',
                        fontSize: 13, fontWeight: 500,
                        fontFamily: 'Poppins, sans-serif',
                        cursor: isCrypto ? 'pointer' : 'not-allowed',
                        opacity: isCrypto ? 1 : 0.4,
                        transition: 'all 0.15s',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>

              {/* CTA */}
              <button
                onClick={handleCalculate}
                disabled={!isValid}
                style={{
                  marginTop: 28,
                  width: '100%', height: 46,
                  borderRadius: 999,
                  background: isValid ? '#F7931A' : '#EBEBEB',
                  color: isValid ? '#fff' : '#AAAAAA',
                  fontSize: 15, fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                  border: 'none',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (isValid) e.currentTarget.style.background = '#E0840F' }}
                onMouseLeave={e => { if (isValid) e.currentTarget.style.background = '#F7931A' }}
              >
                Calculate Projection
              </button>
            </div>
          </div>

          {/* ── RIGHT — Results ─────────────────────────────── */}
          {result && (
            <div
              className="slide-up"
              style={{
                background: '#fff',
                border: '1px solid #E8E8E8',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              {/* Panel header */}
              <div style={{
                padding: '20px 28px',
                borderBottom: '1px solid #F0F0F0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#222' }}>
                  Projected Results
                </h3>
                <span style={{ fontSize: 12, color: '#999' }}>{result.label}</span>
              </div>

              <div style={{ padding: '28px' }}>
                {/* Projected value */}
                <p style={{ margin: '0 0 4px', fontSize: 12, color: '#999' }}>
                  Projected Value
                </p>
                <p style={{
                  margin: '0 0 10px',
                  fontSize: 44, fontWeight: 800, color: '#222',
                  lineHeight: 1, letterSpacing: '-1px',
                }}>
                  {fmtPeso(result.projected)}
                </p>

                {/* P/L */}
                <div style={{ marginBottom: 28 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 14, fontWeight: 600, padding: '4px 14px', borderRadius: 999,
                    background: result.profit >= 0 ? '#F0FDF4' : '#FEF2F2',
                    color:      result.profit >= 0 ? '#16A34A' : '#DC2626',
                  }}>
                    {result.profit >= 0 ? '+' : ''}{fmtPeso(result.profit)}
                    {' '}({result.pct >= 0 ? '+' : ''}{result.pct.toFixed(1)}%)
                  </span>
                </div>

                {/* Chart */}
                <div style={{
                  background: '#F8F8F8', borderRadius: 10,
                  padding: '16px', marginBottom: 20,
                }}>
                  <p style={{
                    margin: '0 0 12px',
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
                    textTransform: 'uppercase', color: '#999',
                  }}>
                    Growth Trajectory
                  </p>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={result.color} stopOpacity={0.16}/>
                          <stop offset="95%" stopColor={result.color} stopOpacity={0}/>
                        </linearGradient>
                        {result.isCrypto && (
                          <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={result.color} stopOpacity={0.05}/>
                            <stop offset="95%" stopColor={result.color} stopOpacity={0}/>
                          </linearGradient>
                        )}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" strokeWidth={0.5}/>
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#BBBBBB', fontFamily: 'Poppins' }}
                        axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize: 10, fill: '#BBBBBB', fontFamily: 'Poppins' }}
                        axisLine={false} tickLine={false}
                        tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}/>
                      <Tooltip content={<ChartTooltip />}/>
                      {result.isCrypto && (
                        <>
                          <Area dataKey="upper" stroke="none" fill="url(#bandFill)"/>
                          <Area dataKey="lower" stroke="none" fill="white"/>
                        </>
                      )}
                      <Area type="monotone" dataKey="value"
                        stroke={result.color} strokeWidth={2}
                        fill="url(#gradFill)" dot={false}
                        activeDot={{ r: 4, fill: result.color, strokeWidth: 0 }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* AI insight */}
                <div style={{
                  background: '#F8F8F8', borderRadius: 8,
                  padding: '14px 16px', marginBottom: 16,
                  border: '1px solid #EBEBEB',
                }}>
                  <p style={{
                    margin: '0 0 6px',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: '#AAAAAA',
                  }}>
                    Insight
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                    {result.isCrypto
                      ? `${result.label} is historically volatile — real returns can vary wildly above or below the projection shown. The shaded band shows the range under ${mode.toLowerCase()} conditions. A lot of Filipino investors pair crypto with something stable like Pag-IBIG MP2 to balance the overall risk.`
                      : `${result.label} gives you stable, predictable growth with very low downside. It won't make you rich overnight, but it won't collapse either — which makes it a solid foundation. Consider pairing it with a small crypto allocation if you want some growth upside.`
                    }
                  </p>
                </div>

                {/* Disclaimer */}
                <div style={{
                  padding: '12px 16px', borderRadius: 8,
                  background: '#FEF5E7', border: '1px solid #FDDFA0',
                  fontSize: 12, color: '#666', lineHeight: 1.6,
                }}>
                  <strong style={{ color: '#222' }}>For educational purposes only.</strong>
                  {' '}Projections are estimates based on historical averages and do not guarantee future
                  returns. Consult a licensed financial advisor before investing.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Field wrapper ─────────────────────────────────────────────── */
function Field({ label, hint, children, style }) {
  return (
    <div style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block' }}>
          {label}
        </label>
        {hint && (
          <span style={{ fontSize: 11, color: '#AAAAAA' }}>({hint})</span>
        )}
      </div>
      {children}
    </div>
  )
}
