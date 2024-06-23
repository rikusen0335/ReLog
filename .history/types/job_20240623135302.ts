export type Job = {
  slug: string;
  jobTitle: string;
  companyName: string;
  joinedAt: string; // ISO DATE STRING
  leftAt: string // ISO DATE STRING
  usedSkills: Record<'os' | 'language' | 'framework' | 'database' | 'tool', string>;
  position: string;
  scale: number
  body: {
    overview: string; // プロジェクトの概要
    phase: 'youkenteigi' | 'architect' | 'development' | 'test' // 担当工程
    detail: string // 業務内容
    achivement: string // 実績、取り組み
  }
}

export type Skill = Record<string, string> & {
  name: string;
  level: 'beginner' |  'intermediate' | 'advanced' | 'expert';
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
  
  histories: Job[]
}