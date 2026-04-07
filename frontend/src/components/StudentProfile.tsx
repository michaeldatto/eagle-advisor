import { StudentProfile } from '../App'
import { ALL_COURSES } from './courseData'

interface Props {
  profile: StudentProfile
  onProfileChange: (p: StudentProfile) => void
}

const GRADE_LEVELS = [
  { value: 'freshman', label: 'Freshman', credits: '0–29' },
  { value: 'sophomore', label: 'Sophomore', credits: '30–59' },
  { value: 'junior', label: 'Junior', credits: '60–89' },
  { value: 'senior', label: 'Senior', credits: '90+' },
]

const AID_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'pell', label: 'Pell Grant' },
  { value: 'loan', label: 'Student Loan' },
  { value: 'work-study', label: 'Work-Study' },
  { value: 'multiple', label: 'Multiple Sources' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold tracking-widest text-white/30 uppercase mb-2 px-1">
      {children}
    </div>
  )
}

export default function StudentProfilePanel({ profile, onProfileChange }: Props) {
  const update = (partial: Partial<StudentProfile>) => onProfileChange({ ...profile, ...partial })
  const updatePrefs = (partial: Partial<StudentProfile['preferences']>) =>
    update({ preferences: { ...profile.preferences, ...partial } })
  const updateAid = (partial: Partial<StudentProfile['financialAid']>) =>
    update({ financialAid: { ...profile.financialAid, ...partial } })

  const toggleCourse = (code: string) => {
    const set = new Set(profile.completedCourses)
    if (set.has(code)) set.delete(code); else set.add(code)
    update({ completedCourses: Array.from(set) })
  }

  const completedCount = profile.completedCourses.length
  const totalCourses = ALL_COURSES.length

  return (
    <div className="h-full flex flex-col py-4 px-3 gap-4">
      {/* Profile Summary */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="text-xs font-semibold text-white/80 mb-1">Your Profile</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((completedCount/totalCourses)*100)}%`, background: 'linear-gradient(90deg, #C9A84C, #E8CC7A)' }} />
          </div>
          <span className="text-[10px] text-white/40">{completedCount}/{totalCourses}</span>
        </div>
        <div className="text-[10px] text-white/40 mt-1">courses completed</div>
      </div>

      {/* Grade Level */}
      <div>
        <SectionLabel>Grade Level</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {GRADE_LEVELS.map(g => (
            <button key={g.value}
              onClick={() => update({ gradeLevel: g.value as StudentProfile['gradeLevel'] })}
              className={`rounded-lg px-2 py-2 text-left transition-all duration-150 ${
                profile.gradeLevel === g.value
                  ? 'ring-1 ring-[#C9A84C]/40'
                  : 'hover:bg-white/5'
              }`}
              style={profile.gradeLevel === g.value
                ? { background: 'rgba(201,168,76,0.1)' }
                : { background: 'rgba(255,255,255,0.03)' }}
            >
              <div className={`text-xs font-medium ${profile.gradeLevel === g.value ? 'text-[#E8CC7A]' : 'text-white/70'}`}>{g.label}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{g.credits} cr</div>
            </button>
          ))}
        </div>
      </div>

      {/* GPA */}
      <div>
        <SectionLabel>Current GPA</SectionLabel>
        <input
          type="number" min="0" max="4" step="0.01"
          placeholder="e.g. 3.5"
          value={profile.gpa}
          onChange={e => update({ gpa: e.target.value })}
          className="w-full rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/20 outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      {/* Target Graduation */}
      <div>
        <SectionLabel>Target Graduation</SectionLabel>
        <input
          type="text"
          placeholder="e.g. Spring 2027"
          value={profile.targetGradSemester}
          onChange={e => update({ targetGradSemester: e.target.value })}
          className="w-full rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/20 outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      {/* Preferences */}
      <div>
        <SectionLabel>Preferences</SectionLabel>
        <div className="space-y-2">
          {[
            { key: 'preferMorning' as const, label: 'Morning classes' },
            { key: 'preferSmallClass' as const, label: 'Small class size' },
            { key: 'preferOnline' as const, label: 'Open to online' },
            { key: 'interestedInMinor' as const, label: 'Pursuing a minor' },
            { key: 'internshipFocus' as const, label: 'Internship focused' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => updatePrefs({ [key]: !profile.preferences[key] })}
                className={`w-4 h-4 rounded flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
                  profile.preferences[key] ? 'ring-1 ring-[#C9A84C]/50' : ''
                }`}
                style={profile.preferences[key]
                  ? { background: 'rgba(201,168,76,0.2)' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {profile.preferences[key] && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-xs transition-colors ${profile.preferences[key] ? 'text-white/80' : 'text-white/40 group-hover:text-white/60'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Financial Aid */}
      <div>
        <SectionLabel>Financial Aid</SectionLabel>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div
              onClick={() => updateAid({ hasAid: !profile.financialAid.hasAid })}
              className={`w-4 h-4 rounded flex items-center justify-center transition-all duration-150 flex-shrink-0`}
              style={profile.financialAid.hasAid
                ? { background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)' }
                : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {profile.financialAid.hasAid && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5 3.5-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-xs text-white/60">Receiving financial aid</span>
          </label>

          {profile.financialAid.hasAid && (
            <div className="pl-6 space-y-2 animate-fade-up">
              <select
                value={profile.financialAid.aidType}
                onChange={e => updateAid({ aidType: e.target.value as StudentProfile['financialAid']['aidType'] })}
                className="w-full rounded-lg px-3 py-2 text-xs text-white/80 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {AID_TYPES.map(a => <option key={a.value} value={a.value} style={{ background: '#0F1629' }}>{a.label}</option>)}
              </select>
              <div className="flex gap-1.5">
                {(['full', 'part'] as const).map(load => (
                  <button key={load}
                    onClick={() => updateAid({ creditLoad: load })}
                    className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${profile.financialAid.creditLoad === load ? 'text-[#E8CC7A]' : 'text-white/40 hover:text-white/60'}`}
                    style={profile.financialAid.creditLoad === load
                      ? { background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {load === 'full' ? 'Full-time' : 'Part-time'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Taken */}
      <div className="flex-1">
        <SectionLabel>Courses Completed</SectionLabel>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {ALL_COURSES.map(course => (
            <div key={course.code}
              onClick={() => toggleCourse(course.code)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                profile.completedCourses.includes(course.code) ? 'ring-1 ring-[#C9A84C]/20' : 'hover:bg-white/[0.03]'
              }`}
              style={profile.completedCourses.includes(course.code)
                ? { background: 'rgba(201,168,76,0.06)' }
                : { background: 'rgba(255,255,255,0.02)' }}
            >
              <div className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center`}
                style={profile.completedCourses.includes(course.code)
                  ? { background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)' }
                  : { background: 'transparent', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {profile.completedCourses.includes(course.code) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l1.5 1.5 3.5-3.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium truncate ${profile.completedCourses.includes(course.code) ? 'text-[#E8CC7A]' : 'text-white/60'}`}>
                  {course.code}
                </div>
                <div className="text-[10px] text-white/30 truncate">{course.name}</div>
              </div>
              <div className="text-[10px] text-white/20">{course.credits}cr</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
