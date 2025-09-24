export default function TradeList({ items = [], onDelete }) {
  if (!items.length) {
    return (
      <div className="panel" style={{ color: "#6c757d" }}>
        まだ保存されたトレードはありません。
      </div>
    );
  }

  return (
    <div className="panel">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
            <th style={th}>日時</th>
            <th style={th}>通貨ペア</th>
            <th style={th}>エントリー価格</th>
            <th style={th}>決済価格</th>
            <th style={th}>損切価格</th>
            <th style={th}>予想利益(円)</th>
            <th style={th}>予想損失(円)</th>
            <th style={th}>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid #dee2e6" }}>
              <td style={td}>{t.entryDate} {t.entryTime}</td>
              <td style={td}>{t.pair}</td>
              <td style={td}>{t.entryPrice}</td>
              <td style={td}>{t.takeProfit ?? "-"}</td>
              <td style={td}>{t.stopLoss ?? "-"}</td>
              <td style={td}>{t.expectedProfit ?? "-"}</td>
              <td style={td}>{t.expectedLoss ?? "-"}</td>
              <td style={td}>
                <button
                  className="btn btn-danger"
                  style={{ padding: "4px 8px", fontSize: 12 }}
                  onClick={() => onDelete(t.id)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: "8px 6px",
  fontSize: "13px",
  borderBottom: "2px solid #dee2e6",
};

const td = {
  padding: "8px 6px",
  fontSize: "14px",
  verticalAlign: "middle",
};
