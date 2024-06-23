export const SkillKind = {
  OS: 'os',
  Language: 'language',
  Framework: 'framework',
  Database: 'database',
  Tool: 'tool'
} as const

export const JobKind = {
  Engineer: 'engineer',
  Manager: 'manager',
  Designer: 'designer',
} as const

export type Job = {
  slug: string;
  jobTitle: string;
  companyName: string;
  joinedAt: string; // ISO DATE STRING
  leftAt: string | null // ISO DATE STRING
  usedSkills: {
    kind: keyof typeof SkillKind
    name: string;
  }[];
  position: string;
  scale: {
    kind: keyof typeof JobKind
    numberOfPeople: number;
  }[];
  body: {
    overview: string; // プロジェクトの概要
    phase: 'youkenteigi' | 'architect' | 'development' | 'test' // 担当工程
    detail: string // 業務内容
    achivement: string // 実績、取り組み
  }
}

export type Skill = {
  kind: keyof typeof SkillKind
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export type JobHistory = {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  birthDate: string; // ISO DATE STRING
  livingAt: string; // 居住地
  finalEducation: string;
  skills: Skill[];
  strength: string;
  
  histories: Job[]
}