export interface LoadedSections {
  about: boolean;
  aboutMe: boolean;
  projects: boolean;
  skills: boolean;
  contact: boolean;
  footer: boolean;
}

export interface LoadingScheduleItem {
  section: keyof LoadedSections;
  delay: number;
}