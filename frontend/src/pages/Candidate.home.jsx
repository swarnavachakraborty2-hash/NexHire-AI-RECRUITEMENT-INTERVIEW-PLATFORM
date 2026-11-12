import React from 'react';
import { useState } from 'react';

export default function CandidateHome() {
  const [activeTab, setActiveTab] = useState("Foryou");
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="px-10 py-8 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-2">
          <span>Workspace</span>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-800">Job Feed</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold tracking-wide uppercase mb-2">
          <span>Let's find your next chapter</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Big ambitions. Real opportunities.
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-2xl">
          Discover roles that fit your skills, interests, and what comes next. AI-powered matching surfaces the most relevant opportunities.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 mb-8">
        {/* Search Input Bar */}
        <div className="bg-white p-2 rounded-2xl border border-[#f7d6d6] shadow-sm hover:border-rose-300 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all flex items-center gap-3">
          <div className="pl-3 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Job title, company, or keyword"
            className="w-full text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
          />
          <button className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition shrink-0 cursor-pointer">
            Find jobs
          </button>
        </div>

        {/* Filter Chips & Sort */}
        <div>
          <div className="mb-2">
            <h2 className="text-base font-bold text-slate-900">Find your fit</h2>
            <p className="text-xs text-slate-500">Curated for your next big move</p>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab("Foryou")}
                className={
                  activeTab === "Foryou"
                    ? "px-4 py-1.5 rounded-lg bg-rose-600 text-white font-medium text-xs shadow-sm cursor-pointer"
                    : "px-4 py-1.5 rounded-lg bg-white hover:bg-[#fdeaea]/70 border border-[#f7d6d6] text-slate-700 font-medium text-xs transition cursor-pointer"
                }
              >
                For you
              </button>
              <button
                onClick={() => setActiveTab("Internships")}
                className={
                  activeTab === "Internships"
                    ? "px-4 py-1.5 rounded-lg bg-rose-600 text-white font-medium text-xs shadow-sm cursor-pointer"
                    : "px-4 py-1.5 rounded-lg bg-white hover:bg-[#fdeaea]/70 border border-[#f7d6d6] text-slate-700 font-medium text-xs transition cursor-pointer"
                }
              >
                Internships
              </button>
              <button
                onClick={() => setActiveTab("Entry-level")}
                className={
                  activeTab === "Entry-level"
                    ? "px-4 py-1.5 rounded-lg bg-rose-600 text-white font-medium text-xs shadow-sm cursor-pointer"
                    : "px-4 py-1.5 rounded-lg bg-white hover:bg-[#fdeaea]/70 border border-[#f7d6d6] text-slate-700 font-medium text-xs transition cursor-pointer"
                }
              >
                Entry-level
              </button>
              <button
                onClick={() => setActiveTab("Remote")}
                className={
                  activeTab === "Remote"
                    ? "px-4 py-1.5 rounded-lg bg-rose-600 text-white font-medium text-xs shadow-sm cursor-pointer"
                    : "px-4 py-1.5 rounded-lg bg-white hover:bg-[#fdeaea]/70 border border-[#f7d6d6] text-slate-700 font-medium text-xs transition cursor-pointer"
                }
              >
                Remote
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Sorted by:</span>
              <select className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer">
                <option>Highest Skill Match</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Feed */}
      <div className="space-y-4">
        {/* Job Card 1 */}
        <div className="bg-white rounded-2xl border border-[#f7d6d6] hover:border-rose-300 p-6 shadow-sm hover:shadow-md transition-all duration-150 group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fdeaea] border border-[#f7d6d6] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                  Product Design Intern
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">Orbit Studio</span>
                  <span>•</span>
                  <span>Bengaluru · Hybrid</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs">
                <span>98% match</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-3.5 leading-relaxed">
            Help shape thoughtful digital experiences for the next generation of creators.
          </p>

          <div className="flex items-center gap-2 flex-wrap mt-3.5">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Internship</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Design</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">3–6 months</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">✓ Figma</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">✓ Wireframing</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div className="font-bold text-slate-900 text-sm">
              ₹25,000–35,000 <span className="text-xs text-slate-500 font-normal">/ month</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">2 hours ago</span>
              <a href="#" className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                <span>View job</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Job Card 2 */}
        <div className="bg-white rounded-2xl border border-[#f7d6d6] hover:border-rose-300 p-6 shadow-sm hover:shadow-md transition-all duration-150 group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fdeaea] border border-[#f7d6d6] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                  Frontend Developer
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">Stackly</span>
                  <span>•</span>
                  <span>Remote · India</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs">
                <span>94% match</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-3.5 leading-relaxed">
            Build fast, accessible web experiences with a collaborative engineering team.
          </p>

          <div className="flex items-center gap-2 flex-wrap mt-3.5">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Full-time</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Engineering</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Entry-level</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">✓ React</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">✓ TypeScript</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div className="font-bold text-slate-900 text-sm">₹6–9 LPA</div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">5 hours ago</span>
              <a href="#" className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                <span>View job</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Job Card 3 */}
        <div className="bg-white rounded-2xl border border-[#f7d6d6] hover:border-rose-300 p-6 shadow-sm hover:shadow-md transition-all duration-150 group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fdeaea] border border-[#f7d6d6] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                  Data Analyst Intern
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">Brightside Analytics</span>
                  <span>•</span>
                  <span>Pune · On-site</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs">
                <span>91% match</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-3.5 leading-relaxed">
            Turn real-world data into insights that help teams make better decisions.
          </p>

          <div className="flex items-center gap-2 flex-wrap mt-3.5">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Internship</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">Data & Analytics</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">6 months</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">✓ SQL</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">✓ Python</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div className="font-bold text-slate-900 text-sm">
              ₹20,000–30,000 <span className="text-xs text-slate-500 font-normal">/ month</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">1 day ago</span>
              <a href="#" className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                <span>View job</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
