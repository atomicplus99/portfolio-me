import { Injectable, signal } from '@angular/core';
import { Skill, SkillCategory, StatsInfo } from '../interfaces/skill.interface';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private readonly skills = signal<Skill[]>([
    {
      name: 'Angular',
      level: 85,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg',
      category: 'Frontend',
      color: '#DD0031',
      description: 'Signals, RxJs, NgRx'
    },
    {
      name: 'TypeScript',
      level: 80,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
      category: 'Frontend',
      color: '#3178C6',
      description: 'Type-safe development'
    },
    {
      name: 'React',
      level: 60,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
      category: 'Frontend',
      color: '#61DAFB',
      description: 'Hooks, Context API'
    },

    {
      name: 'NestJS',
      level: 85,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-original.svg',
      category: 'Backend',
      color: '#E0234E',
      description: 'Hexagonal Architecture'
    },
    {
      name: 'Node.js',
      level: 80,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg',
      category: 'Backend',
      color: '#339933',
      description: 'Server-side JavaScript'
    },

    {
      name: 'MySQL',
      level: 85,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg',
      category: 'Database',
      color: '#4479A1',
      description: 'Relational database'
    },
    {
      name: 'MongoDB',
      level: 80,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg',
      category: 'Database',
      color: '#47A248',
      description: 'NoSQL database'
    },

    {
      name: 'Git',
      level: 90,
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg',
      category: 'Tools',
      color: '#F05032',
      description: 'Version control'
    }
  ]);

  private readonly categories = signal<SkillCategory[]>([
    { name: 'Frontend', color: 'from-purple-500 to-pink-500' },
    { name: 'Backend', color: 'from-green-500 to-emerald-500' },
    { name: 'Database', color: 'from-blue-500 to-cyan-500' },
    { name: 'Tools', color: 'from-orange-500 to-red-500' }
  ]);

  private readonly statsInfo = signal<StatsInfo>({
    languages: [
      { name: 'Español', level: 'Nativo', levelColor: 'green' },
      { name: 'Inglés', level: 'B1', levelColor: 'blue' }
    ],
    experience: {
      years: '+2 años',
      description: 'Full Stack Development'
    },
    availability: {
      status: 'Inmediata',
      description: 'Tiempo completo',
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
}