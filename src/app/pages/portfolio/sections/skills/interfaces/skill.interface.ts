// skills/interfaces/skill.interface.ts
export interface Skill {
  name: string;
  level: number;
  icon: string;
  category: string;
  color: string;
  description: string;
}

export interface SkillCategory {
  name: string;
  color: string;
  skills?: Skill[];
}

// skills/interfaces/stats.interface.ts
export interface LanguageInfo {
  name: string;
  level: string;
  levelColor: string;
}

export interface ExperienceInfo {
  years: string;
  description: string;
}

export interface AvailabilityInfo {
  status: string;
  description: string;
  statusColor: string;
}

export interface StatsInfo {
  languages: LanguageInfo[];
  experience: ExperienceInfo;
  availability: AvailabilityInfo;
}