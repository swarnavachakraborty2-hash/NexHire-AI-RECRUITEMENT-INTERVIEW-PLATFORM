import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname.endsWith("/candidate/applications")
    ? "applications"
    : location.pathname.endsWith("/candidate/interviews")
    ? "interviews"
    : "feed";

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
              onClick={() => navigate("/")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active === 'feed'
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
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active === 'applications'
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
                4
              </span>
            </div>

            {/* AI Interviews Link */}
            <div
              onClick={() => navigate("/candidate/interviews")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active === 'interviews'
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
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <img
                className="w-9 h-9 rounded-full object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Alex Morgan"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-none">Alex Morgan</div>
                <div className="text-[11px] text-slate-500 mt-1">Full-stack Candidate</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
