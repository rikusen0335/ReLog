export type Job = {
  slug: string;
  name: string;
  joinedAt: string; // ISO DATE STRING
  leftAt: string // ISO DATE STRING
}

export type JobHistory = {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  birthDate: string; // ISO DATE STRING
  livingAt: string; // 居住地
  finalEducation: string;
  
  histories: Job[]
}