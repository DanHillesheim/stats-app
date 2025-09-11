import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CheatsheetPage from './pages/CheatsheetPage'
import SolverPage from './pages/SolverPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cheatsheet" element={<CheatsheetPage />} />
        <Route path="solver" element={<SolverPage />} />
      </Route>
    </Routes>
  )
}

export default App