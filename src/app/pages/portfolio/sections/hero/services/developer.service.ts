import { Injectable, signal } from '@angular/core';
import { CodeSnippet, Developer, Quote } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private readonly developer = signal<Developer>({
    name: 'Abel Arias',
    title: 'Full Stack Developer',
    description: 'Creando experiencias web extraordinarias con código limpio y arquitectura escalable. Especialista en ecosistemas JavaScript modernos.',
    location: 'Lima, Perú 🇵🇪',
    experience: '1+ años construyendo el futuro',
    email: 'abel.arias@email.com',
    skills: [''],
    status: {
      available: true,
      message: 'Disponibilidad inmediata'
    }
  });

  private readonly quote = signal<Quote>({
    text: 'El mejor código es el que resuelve problemas reales y hace la vida más fácil a las personas.',
    author: 'Abel Arias',
    year: '2025'
  });

  private readonly codeSnippets = signal<CodeSnippet[]>([
    {
      lines: [
        { text: "const [user, setUser] = useState(null);", class: "text-yellow-400" },
        { text: "const [loading, setLoading] = useState(false);", class: "text-cyan-300" },
        { text: "const [error, setError] = useState(null);", class: "text-red-300" }
      ]
    },
    {
      lines: [
        { text: "type User = {", class: "text-purple-400" },
        { text: "  id: number;", class: "text-blue-300" },
        { text: "  name: string;", class: "text-green-300" },
        { text: "  email?: string;", class: "text-cyan-300" },
        { text: "};", class: "text-purple-400" }
      ]
    },
    {
      lines: [
        { text: "const fetchUser = async (id) => {", class: "text-yellow-400" },
        { text: "  const response = await api.get(`/users/${id}`);", class: "text-blue-300" },
        { text: "  return response.data;", class: "text-green-300" },
        { text: "};", class: "text-yellow-400" }
      ]
    },
    {
      lines: [
        { text: "const Button = styled.button`", class: "text-purple-400" },
        { text: "  background: linear-gradient(45deg, #667eea);", class: "text-pink-300" },
        { text: "  border-radius: 8px;", class: "text-cyan-300" },
        { text: "`;", class: "text-purple-400" }
      ]
    },
    {
      lines: [
        { text: "class ErrorBoundary extends Component {", class: "text-purple-400" },
        { text: "  state = { hasError: false };", class: "text-blue-300" },
        { text: "  componentDidCatch() { /* handle */ }", class: "text-yellow-400" },
        { text: "}", class: "text-purple-400" }
      ]
    },
    {
      lines: [
        { text: "app.get('/api/users', async (req, res) => {", class: "text-yellow-400" },
        { text: "  const users = await User.find();", class: "text-cyan-300" },
        { text: "  res.json({ data: users });", class: "text-green-300" },
        { text: "});", class: "text-yellow-400" }
      ]
    },
    {
      lines: [
        { text: "const useLocalStorage = (key, initial) => {", class: "text-yellow-400" },
        { text: "  const [value, setValue] = useState(initial);", class: "text-blue-300" },
        { text: "  return [value, setValue];", class: "text-purple-400" },
        { text: "};", class: "text-yellow-400" }
      ]
    },
    {
      lines: [
        { text: "const config = {", class: "text-purple-400" },
        { text: "  baseURL: '/api/v1',", class: "text-blue-300" },
        { text: "  timeout: 5000,", class: "text-cyan-300" },
        { text: "  headers: { 'Content-Type': 'json' }", class: "text-green-300" },
        { text: "};", class: "text-purple-400" }
      ]
    }
  ]);

  readonly developerInfo = this.developer.asReadonly();
  readonly motivationalQuote = this.quote.asReadonly();
  readonly snippets = this.codeSnippets.asReadonly();

  openCV(): void {
    const cvUrl = 'assets/cv/CV-ARIASABEL-2025.pdf';
    const newWindow = window.open(cvUrl, '_blank', 'noopener,noreferrer');

    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const link = document.createElement('a');
      link.href = cvUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
  }

  openContact(): void {
    const dev = this.developer();
    const subject = encodeURIComponent('🚀 Colaboración Profesional - Abel Arias');
    const body = encodeURIComponent(`¡Hola Abel!

He revisado tu portfolio y me impresiona tu trabajo como Full Stack Developer.

Me gustaría explorar una posible colaboración en:
□ Desarrollo de aplicación web
□ Consultoría técnica
□ Proyecto a largo plazo
□ Otro: ___________

¿Podríamos agendar una reunión para discutir los detalles?

Saludos cordiales!`);

    const mailtoUrl = `mailto:${dev.email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  }
}