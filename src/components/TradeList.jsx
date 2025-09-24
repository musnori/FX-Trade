export default function TradeList({ items = [], onDelete }) {
  if (!items.length) {
    return (
      <div className="panel" style={{ color: '#9fb0c3' }}>
        まだ保存されたトレードはありません。
      </div>
    )
  }

  return (
    <div className="list">
      {items.map(t => (
        <div className="panel" key={t.id}>
          <div className="row row-4-2-2">
            <div>
              <div className="section-title" style={{ margin: 0 }}>エントリー</div>
              <div style={{ fontSize: 16 }}>
                {t.entryDate} {t.entryTime} / <strong>{t.pair}</strong>
              </div>
              <div style={{ color: '#9fb0c3', marginTop: 4 }}>
                価格: {t.entryPrice}
              </div>
            </div>

            <div>
              <div className="section-title" style={{ margin: 0 }}>決済/損切</div>
              <div>決済価格: {t.takeProfit ?? '-'}</div>
              <div>損切価格: {t.stopLoss ?? '-'}</div>
            </div>

            <div>
              <div className="section-title" style={{ margin: 0 }}>予想</div>
              <div>予想利益(円): {t.expectedProfit ?? '-'}</div>
              <div>予想損失(円): {t.expectedLoss ?? '-'}</div>
            </div>
          </div>

          <hr className="sep" />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-danger" onClick={() => onDelete(t.id)}>削除</button>
          </div>
        </div>
      ))}
    </div>
  )
}
