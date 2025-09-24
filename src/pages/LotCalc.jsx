import Header from "../components/Header.jsx";
import { useState, useMemo, useEffect } from "react";

const SETTINGS_KEY = "fx_calc_settings_v1";
const fmt = (n, digits = 0) =>
  Number.isFinite(n) ? n.toLocaleString("ja-JP", { maximumFractionDigits: digits, minimumFractionDigits: digits }) : "-";

export default function LotCalc() {
  const [capital, setCapital] = useState(13_000_000);
  const [riskPct, setRiskPct] = useState(2);
  const [stopPips, setStopPips] = useState(20);   // ← 共有保存する
  const [rr, setRr] = useState(1.5);              // ← 共有保存する
  const [winRate, setWinRate] = useState(60);

  // 初期ロード時：保存済み設定を復元
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

  // 値が変わるたび共有保存
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ stopPips, rr }));
  }, [stopPips, rr]);

  const { riskAmount, lots, tpDistance, takeProfitAmt, expectedProfit } = useMemo(() => {
    const cap = Number(capital) || 0;
    const rp = Number(riskPct) || 0;
    const sp = Number(stopPips) || 0;
    const rrLocal = Number(rr) || 0;

    const riskAmount = cap * (rp / 100);
    const lots = sp > 0 ? riskAmount / (sp / 100) / 10000 : 0;
    const tpDistance = sp * rrLocal;
    const takeProfitAmt = lots * (tpDistance / 100) * 10000;
    const expectedProfit = takeProfitAmt - riskAmount;

    return { riskAmount, lots, tpDistance, takeProfitAmt, expectedProfit };
  }, [capital, riskPct, stopPips, rr]);

  return (
    <div className="container">
      <Header />
      <div className="panel">
        <div className="section-title" style={{ marginTop: 0 }}>ロット計算</div>

        <div className="grid grid-3" style={{ marginBottom: 12 }}>
          <div>
            <label>軍資金（円）</label>
            <input type="number" inputMode="numeric" value={capital} onChange={(e)=>setCapital(Number(e.target.value))}/>
          </div>
          <div>
            <label>損失許容率（％）</label>
            <input type="number" step="0.1" value={riskPct} onChange={(e)=>setRiskPct(Number(e.target.value))}/>
          </div>
          <div>
            <label>損切りラインまでの距離（pips）</label>
            <input type="number" step="0.1" value={stopPips} onChange={(e)=>setStopPips(Number(e.target.value))}/>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginBottom: 12 }}>
          <div>
            <label>リスクリワード</label>
            <input type="number" step="0.1" value={rr} onChange={(e)=>setRr(Number(e.target.value))}/>
          </div>
          <div>
            <label>勝率（％）</label>
            <input type="number" step="0.1" value={winRate} onChange={(e)=>setWinRate(Number(e.target.value))}/>
          </div>
          <div><label style={{visibility:"hidden"}}>spacer</label><div className="badge">設定はホームと共有</div></div>
        </div>

        <hr className="sep" />

        <div className="grid grid-3">
          <div><label>損失許容額（円）</label><input value={fmt(Math.round(riskAmount))} readOnly/></div>
          <div><label>エントリーロット数</label><input value={Number.isFinite(lots)?(Math.round(lots*10)/10).toFixed(1):"-"} readOnly/></div>
          <div><label>利確ラインまでの距離（pips）</label><input value={Number.isFinite(tpDistance)?(Math.round(tpDistance*10)/10).toFixed(1):"-"} readOnly/></div>
        </div>

        <div className="grid grid-3" style={{ marginTop: 12 }}>
          <div><label>利確額（円）</label><input value={fmt(Math.round(takeProfitAmt))} readOnly/></div>
          <div><label>損切り額（円）</label><input value={fmt(Math.round(riskAmount))} readOnly/></div>
          <div><label>トレード期待利益（円）</label><input value={fmt(Math.round(expectedProfit))} readOnly/></div>
        </div>
      </div>
    </div>
  );
}
