export interface Course {
  code: string
  name: string
  credits: number
  category: 'lower-core' | 'upper-core' | 'elective' | 'gen-ed'
  prereqs: string[]
  description: string
  year: number
  semester: 'fall' | 'spring' | 'both'
}

export const ALL_COURSES: Course[] = [
  // Lower Division Core
  { code: 'MAC 1105', name: 'College Algebra', credits: 3, category: 'lower-core', prereqs: [], description: 'Fundamentals of algebra required for business and science courses.', year: 1, semester: 'both' },
  { code: 'STA 2023', name: 'Introductory Statistics', credits: 3, category: 'lower-core', prereqs: ['MAC 1105'], description: 'Introduction to statistical methods and data analysis.', year: 1, semester: 'both' },
  { code: 'ECO 2013', name: 'Macroeconomics', credits: 3, category: 'lower-core', prereqs: [], description: 'Study of national income, inflation, unemployment, and monetary policy.', year: 1, semester: 'both' },
  { code: 'ECO 2023', name: 'Microeconomics', credits: 3, category: 'lower-core', prereqs: [], description: 'Analysis of individual economic behavior and market systems.', year: 1, semester: 'both' },
  { code: 'ACG 2021', name: 'Financial Accounting', credits: 3, category: 'lower-core', prereqs: [], description: 'Principles of financial accounting, statements, and reporting.', year: 2, semester: 'both' },
  { code: 'ACG 2071', name: 'Managerial Accounting', credits: 3, category: 'lower-core', prereqs: ['ACG 2021'], description: 'Cost accounting and managerial decision making.', year: 2, semester: 'both' },
  { code: 'BUL 2241', name: 'Business Law', credits: 3, category: 'lower-core', prereqs: [], description: 'Legal environment of business including contracts and liability.', year: 2, semester: 'both' },
  { code: 'CGS 1100', name: 'Microcomputer Applications', credits: 3, category: 'lower-core', prereqs: [], description: 'Office productivity software and digital literacy.', year: 1, semester: 'both' },
  // Upper Division Core
  { code: 'ENT 3003', name: 'Introduction to Entrepreneurship', credits: 3, category: 'upper-core', prereqs: [], description: 'Gateway course — overview of the entrepreneurial mindset and process.', year: 2, semester: 'both' },
  { code: 'ENT 3113', name: 'Opportunity Recognition & Creativity', credits: 3, category: 'upper-core', prereqs: ['ENT 3003'], description: 'Identifying market gaps and generating innovative business ideas.', year: 3, semester: 'both' },
  { code: 'ENT 3805', name: 'Entrepreneurial Finance', credits: 3, category: 'upper-core', prereqs: ['ACG 2021'], description: 'Financial planning, funding strategies, and investor relations for startups.', year: 3, semester: 'both' },
  { code: 'ENT 4114', name: 'Business Model Innovation', credits: 3, category: 'upper-core', prereqs: ['ENT 3003'], description: 'Designing, testing, and iterating scalable business models.', year: 3, semester: 'both' },
  { code: 'ENT 4204', name: 'Marketing for Entrepreneurs', credits: 3, category: 'upper-core', prereqs: ['ENT 3003'], description: 'Customer discovery, branding, and digital marketing for startups.', year: 3, semester: 'both' },
  { code: 'ENT 4503', name: 'Legal Aspects of Entrepreneurship', credits: 3, category: 'upper-core', prereqs: [], description: 'IP, entity formation, contracts, and regulatory compliance.', year: 3, semester: 'both' },
  { code: 'ENT 4554', name: 'Entrepreneurial Leadership', credits: 3, category: 'upper-core', prereqs: ['ENT 3003'], description: 'Building and leading high-performance startup teams.', year: 4, semester: 'both' },
  { code: 'ENT 4724', name: 'Operations & Technology Management', credits: 3, category: 'upper-core', prereqs: ['ENT 3003'], description: 'Scaling operations, supply chain, and technology adoption.', year: 4, semester: 'both' },
  { code: 'ENT 4934', name: 'Entrepreneurship Capstone', credits: 3, category: 'upper-core', prereqs: ['ENT 4114'], description: 'Launch your venture — capstone project requiring senior standing.', year: 4, semester: 'both' },
  // Electives
  { code: 'ENT 3XXX', name: 'ENT Elective I', credits: 3, category: 'elective', prereqs: ['ENT 3003'], description: 'Choose from approved ENT elective list.', year: 3, semester: 'both' },
  { code: 'ENT 3XXX-B', name: 'ENT Elective II', credits: 3, category: 'elective', prereqs: ['ENT 3003'], description: 'Choose from approved ENT elective list.', year: 3, semester: 'both' },
  { code: 'ENT 4XXX', name: 'ENT Elective III', credits: 3, category: 'elective', prereqs: ['ENT 3003'], description: 'Choose from approved ENT elective list.', year: 4, semester: 'both' },
  { code: 'ENT 4XXX-B', name: 'ENT Elective IV', credits: 3, category: 'elective', prereqs: ['ENT 3003'], description: 'Choose from approved ENT elective list.', year: 4, semester: 'both' },
]

export const COURSE_CATEGORIES = {
  'lower-core': { label: 'Lower Division Core', color: '#4A7CC7', bg: 'rgba(74,124,199,0.12)', border: 'rgba(74,124,199,0.25)' },
  'upper-core': { label: 'Upper Division Core', color: '#C9A84C', bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.25)' },
  'elective': { label: 'ENT Elective', color: '#7C6FC9', bg: 'rgba(124,111,201,0.12)', border: 'rgba(124,111,201,0.25)' },
  'gen-ed': { label: 'General Education', color: '#4AC47C', bg: 'rgba(74,196,124,0.12)', border: 'rgba(74,196,124,0.25)' },
}

export const SEMESTER_PLAN = [
  { year: 1, sem: 'Fall', courses: ['MAC 1105', 'ECO 2013', 'CGS 1100'] },
  { year: 1, sem: 'Spring', courses: ['STA 2023', 'ECO 2023'] },
  { year: 2, sem: 'Fall', courses: ['ACG 2021', 'BUL 2241', 'ENT 3003'] },
  { year: 2, sem: 'Spring', courses: ['ACG 2071'] },
  { year: 3, sem: 'Fall', courses: ['ENT 3113', 'ENT 3805', 'ENT 4114'] },
  { year: 3, sem: 'Spring', courses: ['ENT 4204', 'ENT 3XXX', 'ENT 3XXX-B'] },
  { year: 4, sem: 'Fall', courses: ['ENT 4503', 'ENT 4554', 'ENT 4724', 'ENT 4XXX'] },
  { year: 4, sem: 'Spring', courses: ['ENT 4934', 'ENT 4XXX-B'] },
]
