export type Job = {
  slug: string;
  jobTitle: string;
  companyName: string;
  joinedAt: string; // ISO DATE STRING
  leftAt: string // ISO DATE STRING
  usedSkills: string[];
  position: string;
  scale: number
  body: {
    overview: string;
    phase: 'youkenteigi' | 'architect' | 'development' | 'test'
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