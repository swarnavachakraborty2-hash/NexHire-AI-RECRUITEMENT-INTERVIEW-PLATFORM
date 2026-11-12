import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CandidateHome from './pages/Candidate.home'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sidebar />}>
          <Route index element={<CandidateHome />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
