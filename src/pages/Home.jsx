import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import TradeForm from '../components/TradeForm.jsx'
import TradeList from '../components/TradeList.jsx'

const STORAGE_KEY = 'fx_manager_trades_v1'

export default function Home() {
  const [trades, setTrades] = useState([])

  // 初回ロードでlocalStorageから復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setTrades(parsed)
      }
    } catch {
      // 破損時は無視
    }
  }, [])

  // 変更のたびに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
  }, [trades])

  const handleSave = (trade) => {
    setTrades(prev => [trade, ...prev]) // 新しいものを上に
  }

  const handleDelete = (id) => {
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="container">
      <Header />

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginTop: 0 }}>使い方</div>
        <div style={{ color: '#c7d4e6' }}>
          上部で「エントリー日・時間・通貨ペア・エントリー価格」「決済価格・損切価格・予想利益・予想損失」を入力して
          <strong>保存</strong>すると、下にどんどん並びます。右上のボタンから「ロット計算ページ」へ移動できます。
        </div>
      </div>

      <TradeForm onSave={handleSave} />

      <div className="section-title">保存済みトレード</div>
      <TradeList items={trades} onDelete={handleDelete} />
    </div>
  )
}
