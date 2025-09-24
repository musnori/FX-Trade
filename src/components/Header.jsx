import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  return (
    <div className="header">
      <h1 className="h1">FX管理アプリ</h1>

      {isHome ? (
        <Link to="/lot" className="btn btn-primary top-right">ロット計算ページへ</Link>
      ) : (
        <Link to="/" className="btn top-right">ホームへ戻る</Link>
      )}
    </div>
  )
}
