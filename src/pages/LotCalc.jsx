import Header from "../components/Header.jsx";
import { useState, useMemo } from "react";

// 3桁区切り
const fmt = (n, digits = 0) =>
  Number.isFinite(n) ? n.toLocaleString("ja-JP", { maximumFractionDigits: digits, minimumFractionDigits: digits }) : "-";

export default function LotCalc() {
  // 入力（ユーザーが変更できるのは：軍資金、損失許容率、損切り距離、RR、勝率）
  const [capital, setCapital] = useState(13_000_000); // 軍資金（円）
  const [riskPct, setRiskPct] = useState(2);          // 損失許容率（%）
  const [stopPips, setStopPips] = useState(20);       // 損切りラインまでの距離（pips）
  const [rr, setRr] = useState(1.5);                  // リスクリワード
  const [winRate, setWinRate] = useState(60);         // 勝率（%）※現仕様では計算に使わない

  // 計算（ご指定の式に厳密に従います）
  const {
    riskAmount,     // 損失許容額（円）
    lots,           // エントリーロット数
    tpDistance,     // 利確ラインまでの距離（pips）
    takeProfitAmt,  // 利確額（円）
    expectedProfit, // トレード期待利益 = 利確額 - 損切り額
  } = useMemo(() => {
    const cap = Number(capital) || 0;
    const rp = Number(riskPct) || 0;
    const sp = Number(stopPips) || 0;
    const rrLocal = Number(rr) || 0;

    // 損失許容額 = 軍資金 * 損失許容率(%)
    const riskAmount = cap * (rp / 100);

    // エントリーロット数 = 損失許容額 / (損切ラインまでの距離/100) / 10000
    // （指示式をそのまま使用）
    const lots =
      sp > 0 ? riskAmount / (sp / 100) / 10000 : 0;

    // 利確ラインまでの距離 = 損切り距離 × リスクリワード
    const tpDistance = sp * rrLocal;

    // 利確額 = エントリーロット数 × (利確距離/100) × 10000
    const takeProfitAmt = lots * (tpDistance / 100) * 10000;

    // トレード期待利益 = 利確額 - 損切り額
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
            <input
              type="number"
              inputMode="numeric"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              placeholder="例) 13000000"
            />
          </div>
          <div>
            <label>損失許容率（％）</label>
            <input
              type="number"
              step="0.1"
              value={riskPct}
              onChange={(e) => setRiskPct(Number(e.target.value))}
              placeholder="例) 2"
            />
          </div>
          <div>
            <label>損切りラインまでの距離（pips）</label>
            <input
              type="number"
              step="0.1"
              value={stopPips}
              onChange={(e) => setStopPips(Number(e.target.value))}
              placeholder="例) 20"
            />
          </div>
        </div>

        <div className="grid grid-3" style={{ marginBottom: 12 }}>
          <div>
            <label>リスクリワード</label>
            <input
              type="number"
              step="0.1"
              value={rr}
              onChange={(e) => setRr(Number(e.target.value))}
              placeholder="例) 1.5"
            />
          </div>
          <div>
            <label>勝率（％）</label>
            <input
              type="number"
              step="0.1"
              value={winRate}
              onChange={(e) => setWinRate(Number(e.target.value))}
              placeholder="例) 60"
            />
          </div>
          <div>
            {/* ダミーのスペーサ（行の高さ合わせ） */}
            <label style={{ visibility: "hidden" }}>spacer</label>
            <div className="badge">※現仕様の期待値は勝率を使いません</div>
          </div>
        </div>

        <hr className="sep" />

        {/* 結果表示（読み取り専用） */}
        <div className="grid grid-3">
          <div>
            <label>損失許容額（円）</label>
            <input value={fmt(Math.round(riskAmount))} readOnly />
          </div>
          <div>
            <label>エントリーロット数</label>
            <input value={Number.isFinite(lots) ? (Math.round(lots * 10) / 10).toFixed(1) : "-"} readOnly />
          </div>
          <div>
            <label>利確ラインまでの距離（pips）</label>
            <input value={Number.isFinite(tpDistance) ? (Math.round(tpDistance * 10) / 10).toFixed(1) : "-"} readOnly />
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: 12 }}>
          <div>
            <label>利確額（円）</label>
            <input value={fmt(Math.round(takeProfitAmt))} readOnly />
          </div>
          <div>
            <label>損切り額（円）</label>
            <input value={fmt(Math.round(riskAmount))} readOnly />
          </div>
          <div>
            <label>トレード期待利益（円）</label>
            <input value={fmt(Math.round(expectedProfit))} readOnly />
          </div>
        </div>

        <div className="section-title">計算式</div>
        <div style={{ color: "#c7d4e6", lineHeight: 1.6 }}>
          損失許容額 = 軍資金 × 損失許容率（%）<br />
          エントリーロット数 = 損失許容額 ÷ (損切り距離/100) ÷ 10000<br />
          利確距離 = 損切り距離 × リスクリワード<br />
          利確額 = エントリーロット数 × (利確距離/100) × 10000<br />
          トレード期待利益 = 利確額 − 損切り額
        </div>
      </div>
    </div>
  );
}
