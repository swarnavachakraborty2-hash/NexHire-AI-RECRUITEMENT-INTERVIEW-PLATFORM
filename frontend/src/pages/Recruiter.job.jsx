import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { asyncHandler } from '../api/axios.js'

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=f43f5e&color=fff&bold=true&size=128'

function getStatusBadge(status) {
  switch (status) {
    case 'Accepted':
    case 'Shortlisted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'Due':
    case 'Pending':
    case 'Pending Review':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

export default function RecruiterJob() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [jobLoading, setJobLoading] = useState(true)

  const [candidates, setCandidates] = useState([])
  const [candidatesLoading, setCandidatesLoading] = useState(true)

  const [errorMsg, setErrorMsg] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'due' | 'accepted' | 'rejected'

  // 1. Fetch Job Details with reload-safe asyncHandler
  useEffect(() => {
    let isMounted = true
    const fetchJob = async () => {
      setJobLoading(true)
      setErrorMsg(null)
      try {
        await asyncHandler(async () => {
          const res = await api.get(`/job/job-details/${id}`)
          if (isMounted && res?.data?.data) {
            setJob(res.data.data)
          }
        })
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load job details:', err)
          setErrorMsg(err.response?.data?.message || 'Failed to load job details')
        }
      } finally {
        if (isMounted) setJobLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }

    return () => { isMounted = false }
  }, [id])

  // 2. Fetch Job Applicants with reload-safe asyncHandler
  useEffect(() => {
    let isMounted = true
    const fetchApplicants = async () => {
      setCandidatesLoading(true)
      try {
        await asyncHandler(async () => {
          const res = await api.get(`/job/job-applicants/${id}`)
          if (isMounted) {
            const list = res?.data?.data || []
            setCandidates(list)
          }
        })
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load job applicants:', err)
        }
      } finally {
        if (isMounted) setCandidatesLoading(false)
      }
    }

    if (id) {
      fetchApplicants()
    }

    return () => { isMounted = false }
  }, [id])

  const handleViewResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer')
    } else {
      alert('No resume URL provided by candidate.')
    }
  }

  // Accept & Reject with optimistic UI update and API persistence
  const handleAccept = async (candidateId) => {
    setCandidates((prev) =>
      prev.map((c) =>
        (c._id === candidateId || c.candidateId === candidateId)
          ? { ...c, status: 'Accepted' }
          : c
      )
    )
    try {
      await asyncHandler(async () => {
        await api.post(`/job/accept-application/${candidateId}`)
      })
    } catch (err) {
      console.error('Failed to accept application:', err)
    }
  }

  const handleReject = async (candidateId) => {
    setCandidates((prev) =>
      prev.map((c) =>
        (c._id === candidateId || c.candidateId === candidateId)
          ? { ...c, status: 'Rejected' }
          : c
      )
    )
    try {
      await asyncHandler(async () => {
        await api.post(`/job/reject-application/${candidateId}`)
      })
    } catch (err) {
      console.error('Failed to reject application:', err)
    }
  }

  // Filter into the 3 distinct fields
  const dueCandidates = candidates.filter(
    (c) => !c.status || c.status === 'Due' || c.status === 'Pending' || c.status === 'Pending Review'
  )
  const acceptedCandidates = candidates.filter(
    (c) => c.status === 'Accepted' || c.status === 'Shortlisted'
  )
  const rejectedCandidates = candidates.filter(
    (c) => c.status === 'Rejected'
  )

  // Reusable candidate card item
  const renderCandidateCard = (cand, groupType) => (
    <div
      key={cand._id || cand.candidateId}
      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-rose-50/20 transition"
    >
      {/* Candidate Profile Info */}
      <div className="flex items-center gap-4">
        <img
          className="w-11 h-11 rounded-xl object-cover border border-rose-200 flex-shrink-0"
          src={cand.avatar || `${DEFAULT_AVATAR}&name=${encodeURIComponent(cand.name || 'Candidate')}`}
          alt={cand.name || 'Candidate Avatar'}
          onError={(e) => {
            e.currentTarget.src = `${DEFAULT_AVATAR}&name=${encodeURIComponent(cand.name || 'Candidate')}`
          }}
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-900 text-sm">{cand.name || 'Anonymous Applicant'}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(cand.status)}`}>
              {cand.status || 'Due'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {cand.email || 'Email not provided'}
          </p>
          {cand.createdAt && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Applied on {new Date(cand.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* View Resume Button */}
        <button
          onClick={() => handleViewResume(cand.resumeUrl)}
          className="px-3.5 py-1.5 rounded-xl border border-[#f7d6d6] text-rose-600 bg-white hover:bg-rose-50 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          title="Open candidate resume"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>View</span>
        </button>

        {/* Buttons for DUE applicants only */}
        {groupType === 'due' && (
          <>
            <button
              onClick={() => handleAccept(cand._id || cand.candidateId)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Accept</span>
            </button>
            <button
              onClick={() => handleReject(cand._id || cand.candidateId)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 hover:border-rose-200 border border-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reject</span>
            </button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fdeaea] font-sans pb-16">
      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Back Navigation */}
        <div>
          <button
            onClick={() => navigate('/recruiter/home')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#f7d6d6] text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>
        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* ── Job Details Hero Card ─────────────────────────────────────────── */}
        {jobLoading ? (
          <div className="bg-white rounded-2xl border border-[#f7d6d6] p-10 text-center text-xs text-slate-400 font-semibold shadow-xs">
            Loading job details...
          </div>
        ) : job ? (
          <div className="bg-white rounded-2xl border border-[#f7d6d6] p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f7d6d6]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-xl flex items-center justify-center flex-shrink-0 shadow-xs">
                  {job.title?.slice(0, 2)?.toUpperCase() || 'JB'}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${job.status === 'Closed' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {job.status || 'Open'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span>{job.type || 'Full-time'}</span>
                    <span>&bull;</span>
                    <span>{job.method || 'Remote'}</span>
                    <span>&bull;</span>
                    <span>{job.location || 'Anywhere'}</span>
                    <span>&bull;</span>
                    <span className="font-semibold text-slate-700">{job.salary || 'Competitive'}</span>
                  </p>
                </div>
              </div>

              {/* Quick stats badges */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total</span>
                  <span className="text-lg font-extrabold text-rose-600">{candidates.length}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Shortlisted</span>
                  <span className="text-lg font-extrabold text-emerald-700">{acceptedCandidates.length}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Vacancies</span>
                  <span className="text-lg font-extrabold text-slate-800">{job.vacancies || 1}</span>
                </div>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-[#fff9f9] border border-[#f7d6d6]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{job.experience || 'Not specified'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#fff9f9] border border-[#f7d6d6]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Job Type</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{job.type || 'Full-time'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#fff9f9] border border-[#f7d6d6]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Work Mode</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{job.method || 'Remote'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#fff9f9] border border-[#f7d6d6]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{job.location || 'Remote'}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Job Description</h2>
              <div className="text-xs text-slate-600 leading-relaxed bg-[#fff9f9] p-4 rounded-xl border border-[#f7d6d6] whitespace-pre-line">
                {job.description || 'No description provided for this job opening.'}
              </div>
            </div>

            {/* Required Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* ── Status Tab Navigation Bar ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#f7d6d6] p-2 flex items-center gap-2 overflow-x-auto shadow-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <span>All Candidates</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {candidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('due')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'due'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Due Candidates</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'due' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {dueCandidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'accepted'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Accepted / Shortlisted</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'accepted' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {acceptedCandidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rejected'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Rejected Candidates</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'rejected' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
            }`}>
              {rejectedCandidates.length}
            </span>
          </button>
        </div>

        {/* ── Candidate Fields ──────────────────────────────────────────────── */}
        {candidatesLoading ? (
          <div className="bg-white rounded-2xl border border-[#f7d6d6] p-12 text-center text-xs text-slate-400 font-semibold shadow-xs">
            Loading applied candidates...
          </div>
        ) : (
          <div className="space-y-8">
            {/* ── 1. DUE CANDIDATES FIELD ───────────────────────────────────── */}
            {(activeTab === 'all' || activeTab === 'due') && (
              <section className="bg-white rounded-2xl border border-[#f7d6d6] shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#f7d6d6] bg-[#fffcf8] flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Due Candidates</h3>
                      <p className="text-xs text-slate-500">Applicants awaiting review and decision</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {dueCandidates.length} {dueCandidates.length === 1 ? 'Candidate' : 'Candidates'}
                  </span>
                </div>

                {dueCandidates.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    No pending/due candidates for this position.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {dueCandidates.map((cand) => renderCandidateCard(cand, 'due'))}
                  </div>
                )}
              </section>
            )}

            {/* ── 2. ACCEPTED / SHORTLISTED CANDIDATES FIELD ─────────────────── */}
            {(activeTab === 'all' || activeTab === 'accepted') && (
              <section className="bg-white rounded-2xl border border-emerald-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-emerald-200 bg-[#f7fcf9] flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Accepted / Shortlisted Candidates</h3>
                      <p className="text-xs text-slate-500">Candidates selected to move forward to next round / interview</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {acceptedCandidates.length} {acceptedCandidates.length === 1 ? 'Candidate' : 'Candidates'}
                  </span>
                </div>

                {acceptedCandidates.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    No accepted or shortlisted candidates yet. Click "Accept" on due applicants to shortlist them here.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {acceptedCandidates.map((cand) => renderCandidateCard(cand, 'accepted'))}
                  </div>
                )}
              </section>
            )}

            {/* ── 3. REJECTED CANDIDATES FIELD ───────────────────────────────── */}
            {(activeTab === 'all' || activeTab === 'rejected') && (
              <section className="bg-white rounded-2xl border border-[#f7d6d6] shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#f7d6d6] bg-[#fff9f9] flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Rejected Candidates</h3>
                      <p className="text-xs text-slate-500">Applications that did not match the criteria</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    {rejectedCandidates.length} {rejectedCandidates.length === 1 ? 'Candidate' : 'Candidates'}
                  </span>
                </div>

                {rejectedCandidates.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    No rejected candidates for this position.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {rejectedCandidates.map((cand) => renderCandidateCard(cand, 'rejected'))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
