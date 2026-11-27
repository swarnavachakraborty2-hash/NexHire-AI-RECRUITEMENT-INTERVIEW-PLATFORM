import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { asyncHandler } from '../api/axios.js'
import { ClearAccessToken } from '../api/memory.tokenStore.js'
import NotificationModal from '../components/Notification.modal'

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=f43f5e&color=fff&bold=true&size=128'

// ─── Dummy Data for AI Interviews (pending backend API) ──────────────────────
const DUMMY_INTERVIEWS = [
  {
    _id: 'iv-1',
    jobTitle: 'Full Stack Engineer (MERN)',
    candidateName: 'Aarav Sharma',
    candidateEmail: 'aarav.sharma@example.com',
    interviewType: 'Technical & System Design',
    difficulty: 'Intermediate',
    duration: '45 mins',
    status: 'Completed',
    date: 'Nov 22, 2026',
    score: 94,
    verdict: 'Recommended',
  },
  {
    _id: 'iv-2',
    jobTitle: 'Frontend Developer (React)',
    candidateName: 'Riya Sengupta',
    candidateEmail: 'riya.sen@example.com',
    interviewType: 'Core React & Architecture',
    difficulty: 'Advanced',
    duration: '30 mins',
    status: 'Completed',
    date: 'Nov 20, 2026',
    score: 91,
    verdict: 'Excellent',
  },
  {
    _id: 'iv-3',
    jobTitle: 'Backend Systems Engineer',
    candidateName: 'Devansh Verma',
    candidateEmail: 'devansh.v@example.com',
    interviewType: 'DSA & Database Scaling',
    difficulty: 'Advanced',
    duration: '50 mins',
    status: 'Pending Review',
    date: 'Nov 18, 2026',
    score: null,
    verdict: null,
  },
  {
    _id: 'iv-4',
    jobTitle: 'UI/UX & Product Engineer',
    candidateName: 'Ananya Roy',
    candidateEmail: 'ananya.roy@example.com',
    interviewType: 'Product Thinking & CSS',
    difficulty: 'Intermediate',
    duration: '35 mins',
    status: 'Completed',
    date: 'Nov 15, 2026',
    score: 87,
    verdict: 'Qualified',
  },
]

function getStatusBadge(status) {
  switch (status) {
    case 'AI Interview Passed':
    case 'Completed':
    case 'Accepted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Review Pending':
    case 'Pending Review':
    case 'Due':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Shortlisted':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'Interview Scheduled':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Rejected':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

export default function RecruiterHome() {
  const navigate = useNavigate()

  // Recruiter user data
  const [currUser, setCurrUser] = useState()

  // Navigation: 'jobs' | 'interviews' | 'profile'
  const [activeTab, setActiveTab] = useState('jobs')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Recruiter's posted jobs
  const [myJobs, setMyJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)

  // Notifications state
  const [notifications, setNotifications] = useState([])
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)

  // Create Interview modal state
  const [createInterviewModal, setCreateInterviewModal] = useState(false)
  const [selectedJobForInterview, setSelectedJobForInterview] = useState(null)

  // 1. Fetch current logged-in user on mount with reload-safe asyncHandler
  useEffect(() => {
    let isMounted = true
    const fetchUser = async () => {
      try {
        await asyncHandler(async () => {
          const res = await api.get('/user/get-curr-user')
          if (isMounted && res?.data?.data?.user) {
            setCurrUser(res.data.data.user)
          }
        })
      } catch (err) {
        console.error('Failed to load current user:', err)
      }
    }
    fetchUser()
    return () => { isMounted = false }
  }, [])

  // 2. Fetch jobs posted only by this recruiter with reload-safe asyncHandler
  useEffect(() => {
    let isMounted = true
    const fetchMyJobs = async () => {
      setJobsLoading(true)
      try {
        await asyncHandler(async () => {
          const res = await api.get('/job/recruiter-jobs')
          if (isMounted) {
            const list = res.data?.data || res.data?.jobs || []
            setMyJobs(list)
          }
        })
      } catch (err) {
        console.error('Failed to load recruiter jobs:', err)
      } finally {
        if (isMounted) setJobsLoading(false)
      }
    }
    fetchMyJobs()
    return () => { isMounted = false }
  }, [])

  // 3. Fetch recruiter notifications
  useEffect(() => {
    let isMounted = true
    const fetchNotifications = async () => {
      try {
        await asyncHandler(async () => {
          const res = await api.get('/notification/all')
          if (isMounted && res?.data?.data) {
            const list = res.data.data
            setNotifications(list)
          }
        })
      } catch (err) {
        console.error('Failed to load notifications:', err)
      }
    }
    fetchNotifications()
    return () => { isMounted = false }
  }, [])


  // 3. Logout handler wrapped in asyncHandler
  const handleLogout = async () => {
    try {
      await asyncHandler(async () => {
        await api.get('/user/logout')
      })
    } catch {
      // Continue cleanup even if network fails
    }
    ClearAccessToken()
    navigate('/')
  }

  const onCreateJob = asyncHandler()

  // Stats: Kept ONLY Active Job Openings and AI Interviews Held
  const stats = [
    {
      label: 'Active Job Openings',
      value: jobsLoading ? '—' : myJobs.filter(j => j.isActive !== false).length || myJobs.length || '0',
      change: 'Currently active',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        </svg>
      ),
    },
    {
      label: 'AI Interviews Held',
      value: DUMMY_INTERVIEWS.length.toString(),
      change: `${DUMMY_INTERVIEWS.filter(i => i.status === 'Completed').length} completed`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9zM9 1v2M15 1v2M9 21v2M15 21v2M1 9h2M1 15h2M21 9h2M21 15h2" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-[#fdeaea] font-sans">
      {/* ── Mobile Backdrop ────────────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Full-Height Left Sidebar ──────────────────────────────────────── */}
      <aside
        className={`
          w-64 border-r border-[#f7d6d6] bg-white flex flex-col justify-between shrink-0 p-5
          fixed lg:sticky top-0 h-screen z-40 transition-transform duration-200
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">NexHire</span>
              <span className="text-[10px] block font-semibold uppercase tracking-wider text-rose-600 -mt-0.5">
                Recruiter Portal
              </span>
            </div>
          </div>

          {/* Navigation Group */}
          <div className="space-y-1">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Recruiter Workspace
            </p>

            {/* My Posted Jobs */}
            <div
              onClick={() => { setActiveTab('jobs'); setMobileSidebarOpen(false) }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === 'jobs'
                ? 'bg-[#fdeaea] text-rose-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#fdeaea]/60'
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${activeTab === 'jobs' ? 'text-rose-600' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>My Posted Jobs</span>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-white border border-rose-200 px-1.5 py-0.5 rounded-md">
                {myJobs.length}
              </span>
            </div>

            {/* AI Interviews */}
            <div
              onClick={() => { setActiveTab('interviews'); setMobileSidebarOpen(false) }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === 'interviews'
                ? 'bg-[#fdeaea] text-rose-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#fdeaea]/60'
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${activeTab === 'interviews' ? 'text-rose-600' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>AI Interviews</span>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                {DUMMY_INTERVIEWS.length}
              </span>
            </div>

            {/* Notifications Tab */}
            <div
              onClick={() => {
                setIsNotificationModalOpen(true)
                setMobileSidebarOpen(false)
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-[#fdeaea]/60"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.some((n) => !n.isRead) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  )}
                </div>
                <span>Notifications</span>
              </div>
              {notifications.length > 0 && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                  notifications.some((n) => !n.isRead)
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-[#fdeaea] text-rose-600 border-[#f7d6d6]'
                }`}>
                  {notifications.filter((n) => !n.isRead).length || notifications.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar Bottom: Create Interview Action + User Profile Avatar + Logout ───── */}
        <div className="space-y-3 pt-4 border-t border-[#f7d6d6]">
          {/* Create Interview Button (above profile) */}
          <button
            onClick={() => {
              setSelectedJobForInterview(myJobs[0] || null)
              setCreateInterviewModal(true)
            }}
            className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Interview</span>
          </button>

          {/* Profile Details with Avatar and Name in Sidebar */}
          <div
            onClick={() => { navigate("/recruiter/profile");  setMobileSidebarOpen(false) }}
            className={`flex items-center justify-between p-2 rounded-xl transition border cursor-pointer ${activeTab === 'profile'
              ? 'bg-rose-50 border-rose-200'
              : 'hover:bg-slate-100 border-transparent hover:border-slate-200'
              }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                className="w-9 h-9 rounded-full object-cover shadow-xs border border-rose-200 flex-shrink-0"
                src={currUser?.avatar || `${DEFAULT_AVATAR}&name=${encodeURIComponent(currUser?.name || 'Recruiter')}`}
                alt={currUser?.name || 'Recruiter Avatar'}
                onError={(e) => {
                  e.currentTarget.src = `${DEFAULT_AVATAR}&name=${encodeURIComponent(currUser?.name || 'Recruiter')}`
                }}
              />
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-slate-800 leading-none truncate">
                  {currUser?.name || 'Recruiter'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 capitalize truncate">
                  {currUser?.role || 'Recruiter'}
                </div>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Logout / Sign-out Button in Sidebar */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 overflow-y-auto">
        {/* Mobile Header Toggle (Only visible on small mobile screens) */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#f7d6d6]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white border border-[#f7d6d6] text-slate-700 shadow-xs cursor-pointer"
              aria-label="Open Sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-base font-bold text-slate-900">NexHire Recruiter</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover border border-rose-200"
              src={currUser?.avatar || `${DEFAULT_AVATAR}&name=${encodeURIComponent(currUser?.name || 'Recruiter')}`}
              alt=""
            />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold tracking-wide uppercase mb-1">
              <span>Talent Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {currUser?.name?.split(' ')[0].charAt(0).toUpperCase() + "" + currUser?.name?.split(' ')[0].slice(1, currUser.length) || 'Recruiter'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Manage your job postings, candidate applications, and AI interview rounds.
            </p>
          </div>

          <button
            onClick={() => {
              activeTab == "jobs" ? onCreateJob() :
                setSelectedJobForInterview(myJobs[0] || null)
              setCreateInterviewModal(true)
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>{activeTab == 'jobs' ? "Create Job" : "Create Interview"}</span>
          </button>
        </div>

        {/* Stats Grid: ONLY Active Job Openings and AI Interviews Held */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[#f7d6d6] shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">{item.label}</span>
                <div className="text-2xl font-extrabold text-slate-900 leading-tight my-0.5">{item.value}</div>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block">
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: MY POSTED JOBS (Recruiter's Own Jobs)                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-[#f7d6d6] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#f7d6d6] flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Jobs Posted By You</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click "View" on any job to open the full job details and applicant candidate list
                </p>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                {myJobs.filter((job) => job.isActive !== false).length} {myJobs.length === 1 ? 'Job' : 'Jobs'} Live
              </span>
            </div>

            {jobsLoading ? (
              <div className="p-12 text-center text-xs text-slate-400 font-semibold">
                Loading your job openings...
              </div>
            ) : myJobs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-800">No jobs posted yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When you post job openings on NexHire, they will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-rose-50/20 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-extrabold text-rose-700 text-sm flex-shrink-0">
                        {job.title?.slice(0, 2)?.toUpperCase() || 'JB'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
                            className="font-bold text-slate-900 text-sm hover:text-rose-600 cursor-pointer transition"
                          >
                            {job.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${job.isActive === false ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                            {job.isActive === false ? 'Closed' : 'Active'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                          <span>{job.jobType || job.type || 'Full-time'}</span>
                          <span>&bull;</span>
                          <span>{job.location || 'Remote'}</span>
                          <span>&bull;</span>
                          <span>{job.experience || 'Not specified'}</span>
                          {job.salary && (
                            <>
                              <span>&bull;</span>
                              <span className="font-semibold text-slate-700">{job.salary}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Job Actions: Click View to Navigate to /recruiter/jobs/:id */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <span>View</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: AI INTERVIEWS (Screenings & Completed Rounds)               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'interviews' && (
          <div className="bg-white rounded-2xl border border-[#f7d6d6] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#f7d6d6] flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">AI Screening Interviews</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated technical, system design, and behavioral evaluations
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedJobForInterview(myJobs[0] || null)
                  setCreateInterviewModal(true)
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Interview
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {DUMMY_INTERVIEWS.map((interview) => (
                <div key={interview._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-rose-50/20 transition">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      AI
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm">{interview.candidateName}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(interview.status)}`}>
                          {interview.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {interview.jobTitle} &bull; <span className="font-medium text-slate-700">{interview.interviewType}</span> &bull; {interview.duration}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Conducted on {interview.date} &bull; Difficulty: {interview.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    {interview.score !== null ? (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">AI Match Score</span>
                        <span className="text-sm font-extrabold text-rose-600">{interview.score}%</span>
                        {interview.verdict && (
                          <span className="text-[10px] font-bold text-emerald-600 block">{interview.verdict}</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md inline-block">
                          Awaiting Evaluation
                        </span>
                      </div>
                    )}

                    <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition">
                      View Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: RECRUITER PROFILE                                          */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-[#f7d6d6] p-6 shadow-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-[#f7d6d6]">
              <img
                className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-200 shadow-xs flex-shrink-0"
                src={currUser?.avatar || `${DEFAULT_AVATAR}&name=${encodeURIComponent(currUser?.name || 'Recruiter')}`}
                alt={currUser?.name || 'Recruiter'}
                onError={(e) => {
                  e.currentTarget.src = `${DEFAULT_AVATAR}&name=${encodeURIComponent(currUser?.name || 'Recruiter')}`
                }}
              />
              <div>
                <h2 className="text-lg font-bold text-slate-900">{currUser?.name || 'Recruiter'}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{currUser?.email || 'recruiter@nexhire.com'}</p>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md mt-1.5 inline-block uppercase">
                  Recruiter Account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{currUser?.name || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{currUser?.email || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Account Role</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5 capitalize">{currUser?.role || 'Recruiter'}</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Postings</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{myJobs.length} Live Positions</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Create Interview Modal ─────────────────────────────────────────── */}
      {createInterviewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#f7d6d6] shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#f7d6d6]">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create AI Interview</h3>
                <p className="text-xs text-slate-500 mt-0.5">Configure interview parameters for candidate screening</p>
              </div>
              <button
                onClick={() => setCreateInterviewModal(false)}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3.5 my-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Job Opening</label>
                <select
                  defaultValue={selectedJobForInterview?._id || ''}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-rose-400"
                >
                  {myJobs.length > 0 ? (
                    myJobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)
                  ) : (
                    <option value="">Full Stack Engineer (MERN)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Interview Type</label>
                <select className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-rose-400">
                  <option>Technical & Coding Round</option>
                  <option>System Design & Architecture</option>
                  <option>Behavioral & Culture Fit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty Level</label>
                <select className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-rose-400">
                  <option>Entry Level</option>
                  <option>Intermediate</option>
                  <option>Senior / Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
                <select className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-rose-400">
                  <option>30 Minutes</option>
                  <option>45 Minutes</option>
                  <option>60 Minutes</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f7d6d6]">
              <button
                onClick={() => setCreateInterviewModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('AI Interview requisition created successfully!')
                  setCreateInterviewModal(false)
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Create Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Recruiter Notification Modal ────────────────────────────────────────── */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  )
}
