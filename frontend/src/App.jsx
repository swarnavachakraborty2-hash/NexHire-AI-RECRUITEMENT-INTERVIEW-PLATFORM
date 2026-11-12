import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CandidateHome from './pages/Candidate.home'
import Sidebar from './components/Sidebar'
import CandidateProfile from './pages/Candidate.profile'
import CandidateApplications from './pages/Candidate.applications'
import CandidateInterviews from './pages/Candidate.interviews'
import CandidatePractice from './pages/Candidate.practice'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sidebar />}>
          <Route index element={<CandidateHome />} />
          <Route path="/candidate/applications" element={<CandidateApplications />} />
          <Route path="/candidate/interviews" element={<CandidateInterviews />} />
        </Route>
        <Route path="/candidate/practice" element={<CandidatePractice />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
      </Routes>
    </Router>
  )
}

export default App
