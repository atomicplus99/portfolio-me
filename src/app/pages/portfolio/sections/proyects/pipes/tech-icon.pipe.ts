import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'techIcon',
  standalone: true
})
export class TechIconPipe implements PipeTransform {
  
  transform(tech: string): string {
    const iconMap: Record<string, string> = {
      'Angular': '🅰️',
      'React': '⚛️',
      'Vue.js': '💚',
      'TypeScript': '📘',
      'JavaScript': '💛',
      'Node.js': '💚',
      'Python': '🐍',
      'Java': '☕',
      'C#': '#️⃣',
      'MongoDB': '🍃',
      'PostgreSQL': '🐘',
      'MySQL': '🐬',
      'Redis': '🔴',
      'Docker': '🐳',
      'AWS': '☁️',
      'Firebase': '🔥',
      'GraphQL': '📊',
      'REST': '🔗',
      'WebGL': '🎨',
      'Three.js': '📐',
      'D3.js': '📈',
      'Svelte': '🧡',
      'Flutter': '💙',
      'Dart': '🎯',
      'Rust': '🦀',
      'Go': '🐹',
      'Kubernetes': '⚓',
      'Next.js': '▲',
      'Nuxt.js': '💚',
      'TensorFlow': '🧠',
      'PyTorch': '🔥',
      'OpenAI': '🤖',
      'Blockchain': '⛓️',
      'Solidity': '💎',
      'Web3': '🌐',
      'IPFS': '📦',
      'FastAPI': '⚡',
      'Express': '🚀',
      'Nest.js': '🦅'
    };
    
    return iconMap[tech] || '⚙️';
  }
}