import { useState } from 'react'

const PAIRS = [
  { value: 'USDJPY', label: 'ドル/円 (USDJPY)' },
  { value: 'EURUSD', label: 'ユーロ/ドル (EURUSD)' },
  { value: 'GBPUSD', label: 'ポンド/ドル (GBPUSD)' },
  { value: 'AUDUSD', label: '豪ドル/ドル (AUDUSD)' },
]

export default function TradeForm({ onSave }) {
  // デフォルトで現在日時（日本時間想定）をセット
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')

  const [entryDate, setEntryDate] = useState(`${yyyy}-${mm}-${dd}`)
  const [entryTime, setEntryTime] = useState(`${hh}:${mi}`)
  const [pair, setPair] = useState('USDJPY')
  const [entryPrice, setEntryPrice] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [expectedProfit, setExpectedProfit] = useState('')
  const [expectedLoss, setExpectedLoss] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!entryDate || !entryTime || !pair || !entryPrice) {
      alert('エントリー日/時間/通貨ペア/エントリー価格 は必須です')
      return
    }

    const trade = {
      id: crypto.randomUUID(),
      entryDate,
      entryTime,
      pair,
      entryPrice: Number(entryPrice),
      takeProfit: takeProfit !== '' ? Number(takeProfit) : null,
      stopLoss: stopLoss !== '' ? Number(stopLoss) : null,
      expectedProfit: expectedProfit !== '' ? Number(expectedProfit) : null,
      expectedLoss: expectedLoss !== '' ? Number(expectedLoss) : null,
      createdAt: new Date().toISOString(),
    }

    onSave(trade)

    // 送信後は最小限だけ初期化（任意）
    // setEntryPrice('')
    // setTakeProfit('')
    // setStopLoss('')
    // setExpectedProfit('')
    // setExpectedLoss('')
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="grid grid-2">
        <div>
          <label>エントリー日</label>
          <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
        </div>
        <div>
          <label>時間</label>
          <input type="time" value={entryTime} onChange={e => setEntryTime(e.target.value)} />
        </div>
      </div>

      <div className="section-title">エントリー情報</div>
      <div className="grid grid-3">
        <div>
          <label>通貨ペア</label>
          <select value={pair} onChange={e => setPair(e.target.value)}>
            {PAIRS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label>エントリー価格（数値）</label>
          <input type="number" step="0.00001" placeholder="例) 157.250" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} />
        </div>
        <div>
          <label>決済価格（任意）</label>
          <input type="number" step="0.00001" placeholder="例) 157.550" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 12 }}>
        <div>
          <label>損切価格（任意）</label>
          <input type="number" step="0.00001" placeholder="例) 156.950" value={stopLoss} onChange={e => setStopLoss(e.target.value)} />
        </div>
        <div>
          <label>予想利益（任意・円）</label>
          <input type="number" step="1" placeholder="例) 390000" value={expectedProfit} onChange={e => setExpectedProfit(e.target.value)} />
        </div>
        <div>
          <label>予想損失（任意・円）</label>
          <input type="number" step="1" placeholder="例) 260000" value={expectedLoss} onChange={e => setExpectedLoss(e.target.value)} />
        </div>
      </div>

      <div className="kpi" style={{ marginTop: 12 }}>
        <span className="badge">必須: 日・時・通貨・価格</span>
        <span className="badge">保存すると下部に追加</span>
        <span className="badge">ローカル保存</span>
      </div>

      <hr className="sep" />
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary" type="submit">保存</button>
        <button className="btn btn-ghost" type="button" onClick={()=>{
          setEntryPrice(''); setTakeProfit(''); setStopLoss('');
          setExpectedProfit(''); setExpectedLoss('');
        }}>入力クリア</button>
      </div>
    </form>
  )
}
