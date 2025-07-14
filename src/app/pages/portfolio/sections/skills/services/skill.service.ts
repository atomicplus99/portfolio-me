import { Injectable, signal } from '@angular/core';
import { Skill, SkillCategory, StatsInfo } from '../interfaces/skill.interface';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private readonly skills = signal<Skill[]>([
    // FRONTEND - Angular como EXPERTO
    {
      name: 'Angular',
      level: 95,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg',
      category: 'Frontend',
      color: '#DD0031',
      description: '⭐ EXPERTO - Signals, RxJs, NgRx, Standalone'
    },
    {
      name: 'React',
      level: 75,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
      category: 'Frontend',
      color: '#61DAFB',
      description: 'Hooks, Context API, State Management'
    },

    {
      name: 'NestJS',
      level: 85,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-original.svg',
      category: 'Backend',
      color: '#E0234E',
      description: 'Microservices, Guards, Interceptors'
    },
    {
      name: '.NET',
      level: 90,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/dotnetcore/dotnetcore-original.svg',
      category: 'Backend',
      color: '#512BD4',
      description: 'Web API, Entity Framework, C#'
    },

    {
      name: 'SQL Server',
      level: 88,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/microsoftsqlserver/microsoftsqlserver-original.svg',
      category: 'Database',
      color: '#CC2927',
      description: 'T-SQL, Stored Procedures, Indexes'
    },

    {
      name: 'Git',
      level: 90,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg',
      category: 'Tools',
      color: '#F05032',
      description: 'Branching, Merging, CI/CD Workflows'
    },
    {
      name: 'Docker',
      level: 80,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
      category: 'Tools',
      color: '#2496ED',
      description: 'Containerization, Docker Compose'
    },
    {
      name: 'AWS',
      level: 70,
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      category: 'Cloud',
      color: '#FF9900',
      description: 'EC2, S3, Lambda, RDS'
    }
  ]);

  private readonly categories = signal<SkillCategory[]>([
    { name: 'Frontend', color: 'from-blue-500 to-purple-500' },
    { name: 'Backend', color: 'from-green-500 to-emerald-500' },
    { name: 'Database', color: 'from-orange-500 to-red-500' },
    { name: 'Tools', color: 'from-gray-500 to-slate-600' },
    { name: 'Cloud', color: 'from-cyan-500 to-blue-600' }
  ]);

  private readonly statsInfo = signal<StatsInfo>({
    languages: [
      { name: 'Español', level: 'Nativo', levelColor: 'green' },
      { name: 'Inglés', level: 'B1-B2', levelColor: 'blue' }
    ],
    experience: {
      years: '+2 años',
      description: 'Full Stack Development (.NET + Angular)'
    },
    availability: {
      status: 'Disponible',
      description: 'Para nuevos proyectos',
      statusColor: 'green'
    }
  });

  getSkills() {
    return this.skills();
  }

  getCategories() {
    return this.categories();
  }

  getStatsInfo() {
    return this.statsInfo();
  }

  getSkillsByCategory(categoryName: string): Skill[] {
    return this.skills().filter(skill => skill.category === categoryName);
  }

  getTotalSkills(): number {
    return this.skills().length;
  }

  getAverageLevel(): number {
    const skills = this.skills();
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / skills.length);
  }

  getSkillsCount(): { [key: string]: number } {
    const skills = this.skills();
    return skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  // Métodos adicionales para destacar expertise
  getExpertSkills(): Skill[] {
    return this.skills().filter(skill => skill.level >= 90);
  }

  getSkillsByExperience(): { expert: Skill[], advanced: Skill[], intermediate: Skill[] } {
    const skills = this.skills();
    return {
      expert: skills.filter(skill => skill.level >= 90),
      advanced: skills.filter(skill => skill.level >= 80 && skill.level < 90),
      intermediate: skills.filter(skill => skill.level < 80)
    };
  }
}