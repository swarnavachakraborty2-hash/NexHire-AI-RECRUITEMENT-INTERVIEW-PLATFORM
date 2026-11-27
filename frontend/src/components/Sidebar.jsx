import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import api from "../api/axios.js"
import { asyncHandler } from "../api/axios.js"
import { ClearAccessToken } from "../api/memory.tokenStore.js"
import NotificationModal from "./Notification.modal"

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=f43f5e&color=fff&bold=true&size=128';


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState(0)

  const active = location.pathname.endsWith("/candidate/applications")
    ? "applications"
    : location.pathname.endsWith("/candidate/interviews")
      ? "interviews"
      : "feed";

  const [user, setUser] = useState({})
  const [notifications, setNotifications] = useState([])
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)

  useEffect(() => {
    asyncHandler(async () => {
      const res = await api.get("/user/get-curr-user")
      if (res?.data?.data?.user) {
        setUser(res.data.data.user)
      }
    })
  }, [])

  const fetchApplications = async () => {
    try {
      await asyncHandler(async () => {
        const res = await api.get('/job/user-applications');
        if (res?.data?.data) {
          setApplications(res.data.data.length);
        }
      });
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = async () => {
    api.get('/user/logout')
      .then(() => {
        ClearAccessToken()
        localStorage.clear('currentUser')
        navigate("/")
      })
      .catch((err) => {
        console.log(err.response.message || "could'nt log out")
      })
  }


  useEffect(() => {
    let isMounted = true
    try {
      asyncHandler(async function () {
        const res = await api.get("/notification/all")
        if (isMounted && res?.data?.data) {
          const list = (res.data.data || []).filter(
            (n) => n.type === 'JOB_APPLICATION' || !n.type
          )
          setNotifications(list)
        }
      })
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message)
    }
    return () => {
      isMounted = false
    }
  }, [])




  return (
    <div className="flex min-h-screen bg-[#fdeaea]">
      <aside className="w-64 border-r border-[#f7d6d6] bg-white flex flex-col justify-between shrink-0 p-5 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">NexHire</span>
              <span className="text-[10px] block font-semibold uppercase tracking-wider text-rose-600 -mt-0.5">Candidate Hub</span>
            </div>
          </div>

          {/* Navigation Group */}
          <div className="space-y-1">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Student Workspace
            </p>

            {/* Job Feed Link */}
            <div
              onClick={() => navigate("/candidate/home")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${active === 'feed'
                ? 'bg-[#fdeaea] text-rose-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#fdeaea]/60'
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${active === 'feed' ? 'text-rose-600' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span>Job Feed</span>
              </div>
              {active === 'feed' && <span className="w-2 h-2 rounded-full bg-rose-600"></span>}
            </div>

            {/* My Applications Link */}
            <div
              onClick={() => navigate("/candidate/applications")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${active === 'applications'
                ? 'bg-[#fdeaea] text-rose-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#fdeaea]/60'
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>My Applications</span>
              </div>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#fdeaea] text-rose-600 border border-[#f7d6d6]">
                {applications}
              </span>
            </div>

            {/* AI Interviews Link */}
            <div
              onClick={() => navigate("/candidate/interviews")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${active === 'interviews'
                ? 'bg-[#fdeaea] text-rose-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#fdeaea]/60'
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>AI Interviews</span>
              </div>
            </div>

            {/* Notifications Link */}
            <div
              onClick={() => setIsNotificationModalOpen(true)}
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

        {/* Bottom Section: AI Practice CTA & User Profile */}
        <div className="space-y-4">
          {/* Solid AI Practice Card */}
          <div className="rounded-2xl p-4 bg-slate-900 text-white relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                AI Avatar Prep
              </span>
            </div>

            <h4 className="font-semibold text-sm leading-snug">Build interview confidence</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Practice technical questions with an AI interviewer avatar.
            </p>

            <div
              onClick={() => navigate("/candidate/practice")}
              className="mt-3.5 w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Try a practice session</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          {/* Profile Details */}
          <div onClick={() => navigate("/candidate/profile")} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <img
                className="w-9 h-9 rounded-full object-cover shadow-sm"
                src={user?.avatar || `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || 'User')}`}
                alt={user?.name || 'User Avatar'}
                onError={(e) => {
                  e.currentTarget.src = `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || 'User')}`
                }}
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Candidate'}</div>
                <div className="text-[11px] text-slate-500 mt-1 capitalize">{user?.role || 'Candidate'}</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  );
}
