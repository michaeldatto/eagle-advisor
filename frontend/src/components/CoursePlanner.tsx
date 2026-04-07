import { useState } from 'react'
import { StudentProfile } from '../App'
import { ALL_COURSES, SEMESTER_PLAN, COURSE_CATEGORIES, Course } from './courseData'
interface Props { profile: StudentProfile; onAskAdvisor: (q: string) => void }
function st(code: string, done: string[]) {
  if (done.includes(code)) return 'completed'
  const c = ALL_COURSES.find(x => x.code === code)
  return !c || c.prereqs.every(p => done.includes(p)) ? 'available' : 'locked'
}
export default function CoursePlanner({ profile, onAskAdvisor }: Props) {
  const [sel, setSel] = useState<Course | null>(null)
  const done = profile.completedCourses
  const doneC = ALL_COURSES.filter(c => done.includes(c.code)).reduce((s, c) => s + c.credits, 0)
  const rem = ALL_COURSES.filter(c => !done.includes(c.code))
  const pct = Math.min(100, Math.round((doneC / 120) * 100))
  const avail = rem.filter(c => st(c.code, done) === 'available')
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-6 px-6 py-4 border-b border-white/[0.05]">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/40">Degree Progress</span>
            <span className="text-xs font-semibold text-[#E8CC7A]">{doneC} / 120 cr</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C9A84C, #E8CC7A)' }} />
          </div>
        </div>
        <div className="flex gap-5">
          {[['Remaining', rem.length + ' courses'], ['Credits Left', (120-doneC) + ' cr'], ['Available', avail.length + ' now']].map(([l,v]) => (
            <div key={l} className="text-center"><div className="text-sm font-semibold text-white">{v}</div><div className="text-[10px] text-white/30 mt-0.5">{l}</div></div>
          ))}
        </div>
        <button onClick={() => onAskAdvisor(`Based on my profile (${profile.gradeLevel}, GPA ${profile.gpa||'N/A'}, completed: ${done.join(', ')||'none'}), what should I take next semester?`)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all hover:opacity-90"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#E8CC7A' }}>
          Ask Advisor →
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4">
            {SEMESTER_PLAN.map((sem, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div><div className="text-xs font-semibold text-white/75">Year {sem.year} — {sem.sem}</div><div className="text-[10px] text-white/30 mt-0.5">{sem.courses.reduce((s, code) => s + (ALL_COURSES.find(x => x.code === code)?.credits || 0), 0)} cr</div></div>
                </div>
                <div className="p-3 space-y-2">
                  {sem.courses.map(code => {
                    const course = ALL_COURSES.find(c => c.code === code)
                    if (!course) return null
                    const status = st(code, done)
                    const cat = COURSE_CATEGORIES[course.category]
                    return (
                      <div key={code} onClick={() => setSel(sel?.code === code ? null : course)}
                        className="course-tag rounded-lg px-3 py-2.5 cursor-pointer flex items-start gap-2"
                        style={{ background: status==='completed'?'rgba(74,196,124,0.07)':status==='available'?cat.bg:'rgba(255,255,255,0.015)', border:`1px solid ${status==='completed'?'rgba(74,196,124,0.18)':status==='available'?cat.border:'rgba(255,255,255,0.04)'}`, opacity: status==='locked'?0.45:1 }}>
                        <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: status==='completed'?'rgba(74,196,124,0.2)':cat.bg }}>
                          {status==='completed'&&<svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l1.5 1.5 3.5-3.5" stroke="#4AC47C" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                          {status==='available'&&<div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />}
                          {status==='locked'&&<svg width="7" height="7" viewBox="0 0 7 7" fill="none"><rect x="1" y="3" width="5" height="3.5" rx="0.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/><path d="M2 3V2a1.5 1.5 0 013 0v1" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/></svg>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-medium truncate ${status==='completed'?'text-emerald-400/80':status==='available'?'text-white/85':'text-white/25'}`}>{code}</span>
                            <span className="text-[10px] text-white/20 flex-shrink-0">{course.credits}cr</span>
                          </div>
                          <div className="text-[10px] text-white/30 truncate mt-0.5">{course.name}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 px-1 flex-wrap">
            {Object.entries(COURSE_CATEGORIES).map(([k,v]) => (
              <div key={k} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: v.color }} /><span className="text-[10px] text-white/25">{v.label}</span></div>
            ))}
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400/60" /><span className="text-[10px] text-white/25">Completed</span></div>
          </div>
        </div>
        {sel && (
          <div className="w-64 flex-shrink-0 border-l border-white/[0.05] p-4 overflow-y-auto animate-fade-up">
            <div className="flex items-start justify-between mb-3">
              <div><div className="text-xs text-white/35 mb-0.5">{sel.code}</div><div className="text-sm font-semibold text-white">{sel.name}</div></div>
              <button onClick={()=>setSel(null)} className="text-white/20 hover:text-white/50 ml-2"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-white/50 leading-relaxed">{sel.description}</p>
              {sel.prereqs.length>0&&<div><div className="text-[10px] text-white/25 mb-1.5 uppercase tracking-wider">Prerequisites</div><div className="flex flex-wrap gap-1.5">{sel.prereqs.map(p=><span key={p} className="px-2 py-0.5 rounded text-[10px]" style={done.includes(p)?{background:'rgba(74,196,124,0.1)',color:'#4AC47C',border:'1px solid rgba(74,196,124,0.2)'}:{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.08)'}}>{p}{done.includes(p)?' ✓':''}</span>)}</div></div>}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}><div className="text-lg font-semibold text-white">{sel.credits}</div><div className="text-[10px] text-white/25">Credits</div></div>
                <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}><div className="text-sm font-semibold text-white capitalize">{sel.semester}</div><div className="text-[10px] text-white/25">Offered</div></div>
              </div>
              <button onClick={()=>onAskAdvisor(`Tell me about ${sel.code} - ${sel.name}. When should I take it?`)} className="w-full py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-all" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)', color: '#E8CC7A' }}>Ask Advisor →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
