export interface ProfileData {
  name: string;
  title: string;
  location: string;
  image: string;
  fallbackText: string;
  status: {
    text: string;
    available: boolean;
  };
}

export interface StatData {
  value: string;
  label: string;
}

export interface StorySection {
  title: string;
  icon: string;
  paragraphs: string[];
}

export interface AboutMeConfig {
  header: {
    title: string;
    subtitle: string;
  };
  profile: ProfileData;
  stats: StatData[];
  story: StorySection;
}