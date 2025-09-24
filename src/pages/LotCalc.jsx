import Header from '../components/Header.jsx'
import { useState } from 'react'

export default function LotCalc() {
  const [capital, setCapital] = useState('')
  const [riskPct, setRiskPct] = useState('')
  const [stopPips, setStopPips] = useState('')

  // USDJPY 1ロット=100,000通貨、1pips=0.01円想定の簡易例
  const lot = (() => {
    const cap = Number(capital)
    const r = Number(riskPct)
    const pips = Number(stopPips)
    if (!cap || !r || !pips) return ''
    const riskAmount = cap * (r / 100)           // 許容損失額(円)
    const yenPerPipPerLot = 100000 * 0.01        // USDJPYの1ロット1pipsの円価値 ≒ 1,000円
    const lots = riskAmount / (yenPerPipPerLot * pips)
    return Math.floor(lots * 10) / 10            // 小数1桁で丸め
  })()

  return (
    <div className="container">
      <Header />
      <div className="panel">
        <div className="section-title" style={{ marginTop: 0 }}>ロット数（簡易計算）</div>
        <div className="grid grid-3">
          <div>
            <label>軍資金（円）</label>
            <input type="number" placeholder="例) 13000000" value={capital} onChange={e=>setCapital(e.target.value)} />
          </div>
          <div>
            <label>損失許容率（%）</label>
            <input type="number" step="0.1" placeholder="例) 2" value={riskPct} onChange={e=>setRiskPct(e.target.value)} />
          </div>
          <div>
            <label>損切ラインまでの距離（pips）</label>
            <input type="number" step="0.1" placeholder="例) 20" value={stopPips} onChange={e=>setStopPips(e.target.value)} />
          </div>
        </div>

        <hr className="sep" />

        <div style={{ fontSize: 18 }}>
          エントリーロット数（目安）: <strong style={{ color: '#58d68d' }}>{lot !== '' ? `${lot} ロット` : '-'}</strong>
        </div>

        <div className="section-title">注意</div>
        <div style={{ color: '#c7d4e6' }}>
          通貨ペアごとに1pipsの価値は異なります。ここではUSDJPYの簡易モデル（1ロット=100,000通貨、1pips=0.01円）で試算しています。
          実運用ではブローカー仕様や為替レートに応じて調整してください。
        </div>
      </div>
    </div>
  )
}
