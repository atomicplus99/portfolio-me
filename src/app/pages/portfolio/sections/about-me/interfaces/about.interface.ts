export interface AboutMeConfig {
  header: HeaderConfig;
  profile: ProfileConfig;
  stats: StatConfig[];
  story: StoryConfig;
}

export interface HeaderConfig {
  title: string;
  subtitle?: string;
}

export interface ProfileConfig {
  name: string;
  title: string;
  location: string;
  image: string;
  fallbackText: string;
}

export interface StatConfig {
  value: string;
  label: string;
}

export interface StoryConfig {
  title: string;
  icon: string;
  paragraphs: string[];
}