import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import TradeForm from '../components/TradeForm.jsx'
import TradeList from '../components/TradeList.jsx'

const STORAGE_KEY = 'fx_manager_trades_v1'

export default function Home() {
  const [trades, setTrades] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setTrades(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
  }, [trades])

  const handleSave = (trade) => {
    setTrades(prev => [trade, ...prev])
  }

  const handleDelete = (id) => {
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="container">
      <Header />
      {/* ← 使い方カードを削除 */}

      <TradeForm onSave={handleSave} />

      <div className="section-title">保存済みトレード</div>
      <TradeList items={trades} onDelete={handleDelete} />
    </div>
  )
}
