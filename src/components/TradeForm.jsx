import { useEffect, useMemo, useState } from "react";

const PAIRS = [
  { value: "USDJPY", label: "ドル/円 (USDJPY)", pipSize: 0.01 },
  { value: "EURUSD", label: "ユーロ/ドル (EURUSD)", pipSize: 0.0001 },
  { value: "GBPUSD", label: "ポンド/ドル (GBPUSD)", pipSize: 0.0001 },
  { value: "AUDUSD", label: "豪ドル/ドル (AUDUSD)", pipSize: 0.0001 },
];

const SETTINGS_KEY = "fx_calc_settings_v1";

export default function TradeForm({ onSave }) {
  // デフォルト日時
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");

  const [entryDate, setEntryDate] = useState(`${yyyy}-${mm}-${dd}`);
  const [entryTime, setEntryTime] = useState(`${hh}:${mi}`);
  const [pair, setPair] = useState("USDJPY");
  const [entryPrice, setEntryPrice] = useState("");

  // 自動入力される（編集可）
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");

  const [expectedProfit, setExpectedProfit] = useState("");
  const [expectedLoss, setExpectedLoss] = useState("");

  // ロット計算の共有設定（損切pips & RR）
  const [stopPips, setStopPips] = useState(20);
  const [rr, setRr] = useState(1.5);

  // 初期ロード時に設定を復元
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const { stopPips: sp, rr: rrSaved } = JSON.parse(raw);
        if (typeof sp === "number") setStopPips(sp);
        if (typeof rrSaved === "number") setRr(rrSaved);
      }
    } catch {}
  }, []);

  // 選択ペアのpipsサイズ
  const pipSize = useMemo(() => {
    const meta = PAIRS.find(p => p.value === pair);
    return meta?.pipSize ?? 0.0001;
  }, [pair]);

  // エントリー価格変更に応じて TP/SL を自動入力（ロング前提）
  useEffect(() => {
    const ep = Number(entryPrice);
    if (!ep || !pipSize) return;

    const sl = ep - stopPips * pipSize;
    const tp = ep + stopPips * rr * pipSize;

    // 小数桁：JPYは小数2, 他は小数5を目安
    const digits = pair.endsWith("JPY") ? 3 : 5;
    setStopLoss(sl.toFixed(digits));
    setTakeProfit(tp.toFixed(digits));
  }, [entryPrice, pair, pipSize, stopPips, rr]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entryDate || !entryTime || !pair || !entryPrice) {
      alert("エントリー日/時間/通貨ペア/エントリー価格 は必須です");
      return;
    }

    const trade = {
      id: crypto.randomUUID(),
      entryDate,
      entryTime,
      pair,
      entryPrice: Number(entryPrice),
      takeProfit: takeProfit !== "" ? Number(takeProfit) : null,
      stopLoss: stopLoss !== "" ? Number(stopLoss) : null,
      expectedProfit: expectedProfit !== "" ? Number(expectedProfit) : null,
      expectedLoss: expectedLoss !== "" ? Number(expectedLoss) : null,
      createdAt: new Date().toISOString(),
    };

    onSave(trade);
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="grid grid-2">
        <div>
          <label>エントリー日</label>
          <input type="date" value={entryDate} onChange={(e)=>setEntryDate(e.target.value)} />
        </div>
        <div>
          <label>時間</label>
          <input type="time" value={entryTime} onChange={(e)=>setEntryTime(e.target.value)} />
        </div>
      </div>

      <div className="section-title">エントリー情報</div>
      <div className="grid grid-3">
        <div>
          <label>通貨ペア</label>
          <select value={pair} onChange={(e)=>setPair(e.target.value)}>
            {PAIRS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label>エントリー価格（数値）</label>
          <input
            type="number"
            step="0.00001"
            placeholder="例) 157.250"
            value={entryPrice}
            onChange={(e)=>setEntryPrice(e.target.value)}
          />
        </div>
        <div>
          <label>決済価格（自動・編集可）</label>
          <input
            type="number"
            step="0.00001"
            value={takeProfit}
            onChange={(e)=>setTakeProfit(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 12 }}>
        <div>
          <label>損切価格（自動・編集可）</label>
          <input
            type="number"
            step="0.00001"
            value={stopLoss}
            onChange={(e)=>setStopLoss(e.target.value)}
          />
        </div>
        <div>
          <label>予想利益（任意・円）</label>
          <input type="number" step="1" placeholder="例) 390000" value={expectedProfit} onChange={(e)=>setExpectedProfit(e.target.value)} />
        </div>
        <div>
          <label>予想損失（任意・円）</label>
          <input type="number" step="1" placeholder="例) 260000" value={expectedLoss} onChange={(e)=>setExpectedLoss(e.target.value)} />
        </div>
      </div>

      <div className="kpi" style={{ marginTop: 12 }}>
        <span className="badge">ロット計算の pips/RR を使用</span>
        <span className="badge">通貨別のpipsサイズで自動換算</span>
        <span className="badge">ロング前提（TP↑ SL↓）</span>
      </div>

      <hr className="sep" />
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" type="submit">保存</button>
        <button className="btn btn-ghost" type="button" onClick={()=>{
          setEntryPrice(""); setTakeProfit(""); setStopLoss(""); setExpectedProfit(""); setExpectedLoss("");
        }}>入力クリア</button>
      </div>
    </form>
  );
}
