import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import LotCalc from './pages/LotCalc.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lot" element={<LotCalc />} />
    </Routes>
  )
}
