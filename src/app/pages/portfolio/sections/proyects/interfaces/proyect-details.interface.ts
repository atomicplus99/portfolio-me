export interface ProjectGalleryItem {
  id: string;
  type: 'image' | 'gif' | 'video';
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

export interface PerformanceMetrics {
  lightHouseScore: number;
  loadTime: string;
  bundleSize: string;
  coreWebVitals: string;
  firstContentfulPaint: string;
  largestContentfulPaint: string;
  cumulativeLayoutShift: string;
}

export interface DevelopmentProcess {
  methodology: string;
  duration: string;
  teamSize: number;
  startDate?: string;
  endDate?: string;
  role?: string;
}

export interface ProjectDetailExtended {
  project: any; // Project interface
  extendedDescription: string;
  objectives: string[];
  keyFeatures: string[];
  architecture: string;
  gallery: ProjectGalleryItem[];
  developmentProcess: DevelopmentProcess;
  learnings: string[];
  highlights?: string[];
  futureImprovements?: string[];
}