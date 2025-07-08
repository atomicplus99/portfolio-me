// projects/models/project.model.ts
export interface Project {
  id: number;
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'dashboard';
  techStack: string[];
  demoUrl?: string;
  codeUrl?: string;
  status: 'online' | 'development' | 'maintenance';
  imageUrl?: string;
}

export interface ProjectStats {
  totalProjects: number;
  onlineProjects: number;
  technologiesUsed: number;
}

