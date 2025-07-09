import { Injectable } from '@angular/core';
import { Project } from '../interfaces/proyect.interface';
import { PerformanceMetrics, ProjectDetailExtended, ProjectGalleryItem } from '../interfaces/proyect-details.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectDetailService {

    // ✅ Cache simple sin signals para evitar problemas con computed
    private readonly projectDetailsCache = new Map<number, ProjectDetailExtended>();

    // ✅ Método sin side effects - seguro para usar en computed
    getProjectDetail(project: Project): ProjectDetailExtended {
        console.log('🔧 Getting project detail for:', project.name, project.id);

        const existing = this.projectDetailsCache.get(project.id);
        if (existing) {
            console.log('✅ Found in cache');
            return existing;
        }

        console.log('🏗️ Generating new detail');
        const detail = this.generateProjectDetail(project);
        this.projectDetailsCache.set(project.id, detail);

        console.log('📦 Generated detail:', detail);
        return detail;
    }

    // ✅ Método público para limpiar cache si es necesario
    clearCache(): void {
        this.projectDetailsCache.clear();
    }

    // ✅ Método público para limpiar un proyecto específico del cache
    clearProjectCache(projectId: number): void {
        this.projectDetailsCache.delete(projectId);
    }

    private generateProjectDetail(project: Project): ProjectDetailExtended {
        return {
            project,
            extendedDescription: this.getExtendedDescription(project),
            objectives: this.getObjectives(project),
            keyFeatures: this.getKeyFeatures(project),
            technicalChallenges: this.getTechnicalChallenges(project),
            architecture: this.getArchitecture(project),
            designPatterns: this.getDesignPatterns(project),
            performanceMetrics: this.getPerformanceMetrics(project),
            gallery: this.getGallery(project),
            developmentProcess: this.getDevelopmentProcess(project),
            learnings: this.getLearnings(project),
            highlights: this.getHighlights(project),
            futureImprovements: this.getFutureImprovements(project)
        };
    }

    private getExtendedDescription(project: Project): string {
        const descriptions: Record<string, string> = {
            'E-COMMERCE NEXUS': `${project.description} Este proyecto representa una revolución en el comercio electrónico, implementando inteligencia artificial avanzada para predecir comportamientos de compra y realidad aumentada para visualizar productos. La plataforma utiliza algoritmos de machine learning para personalizar la experiencia de cada usuario, mientras que la integración AR permite a los clientes ver productos en su entorno real antes de comprar.`,

            'NEURAL DASHBOARD': `${project.description} Una interfaz de comando futurística diseñada para científicos de datos y analistas que necesitan procesar grandes volúmenes de información en tiempo real. El dashboard implementa visualizaciones interactivas avanzadas usando D3.js y Three.js, permitiendo manipular datos multidimensionales de forma intuitiva y descubrir patrones ocultos mediante algoritmos de deep learning.`,

            'QUANTUM MOBILE': `${project.description} Esta aplicación móvil pionera implementa computación cuántica para ofrecer un nivel de seguridad sin precedentes en comunicaciones móviles. Utiliza algoritmos cuánticos para encriptación y desencriptación de mensajes, garantizando comunicaciones completamente seguras contra cualquier tipo de interceptación o ataque cibernético.`,

            'BLOCKCHAIN HUB': `${project.description} Un centro de comando completo para el ecosistema DeFi, diseñado para gestionar múltiples protocolos blockchain simultáneamente. La plataforma permite crear, desplegar y monitorear contratos inteligentes, mientras proporciona análisis en tiempo real de transacciones y liquidez en diferentes redes blockchain.`,

            'AI INTERFACE': `${project.description} Un terminal de comunicación avanzado que permite interacción directa con múltiples modelos de IA especializados. La interfaz utiliza procesamiento de lenguaje natural para interpretar comandos complejos y distribuir tareas a diferentes sistemas de IA, optimizando respuestas y proporcionando insights inteligentes.`,

            'CYBER DEFENSE': `${project.description} Sistema de defensa cibernética de próxima generación que utiliza machine learning para detectar y neutralizar amenazas en tiempo real. Implementa análisis predictivo para anticipar ataques, mientras que su sistema de respuesta automatizada puede tomar medidas preventivas sin intervención humana.`
        };

        return descriptions[project.name] || `${project.description} Este proyecto implementa tecnologías de vanguardia para resolver desafíos complejos del mundo real, combinando diseño innovador con arquitectura robusta y escalable.`;
    }

    private getObjectives(project: Project): string[] {
        const commonObjectives = [
            'Crear una interfaz de usuario intuitiva y moderna',
            'Implementar arquitectura escalable y mantenible',
            'Optimizar el rendimiento para todos los dispositivos',
            'Asegurar la accesibilidad y usabilidad universal',
            'Aplicar las mejores prácticas de desarrollo'
        ];

        const specificObjectives: Record<string, string[]> = {
            'E-COMMERCE NEXUS': [
                'Integrar IA predictiva para recomendaciones personalizadas',
                'Implementar realidad aumentada para visualización de productos',
                'Crear sistema de pagos seguro y fluido',
                'Desarrollar dashboard de analytics para vendedores'
            ],
            'NEURAL DASHBOARD': [
                'Procesar big data en tiempo real',
                'Crear visualizaciones interactivas complejas',
                'Implementar machine learning para insights automáticos',
                'Optimizar rendimiento para datasets masivos'
            ],
            'QUANTUM MOBILE': [
                'Implementar encriptación cuántica segura',
                'Optimizar para dispositivos móviles diversos',
                'Crear comunicación P2P sin servidores centrales',
                'Desarrollar interfaz intuitiva para tecnología compleja'
            ]
        };

        return [...commonObjectives, ...(specificObjectives[project.name] || [])];
    }

    private getKeyFeatures(project: Project): string[] {
        const baseFeatures = [
            'Diseño responsive mobile-first',
            'Arquitectura de componentes reutilizables',
            'Sistema de estado global optimizado',
            'Implementación de PWA con soporte offline',
            'Optimizaciones de performance avanzadas',
            'Sistema de testing automatizado completo',
            'Integración con APIs REST y GraphQL',
            'Modo oscuro/claro dinámico'
        ];

        const specificFeatures: Record<string, string[]> = {
            'E-COMMERCE NEXUS': [
                'Motor de recomendaciones con IA',
                'Visualizador AR de productos',
                'Sistema de pagos múltiples',
                'Chat en tiempo real con vendedores',
                'Sistema de reviews inteligente',
                'Gestión de inventario automatizada'
            ],
            'NEURAL DASHBOARD': [
                'Visualizaciones 3D interactivas',
                'Procesamiento de datos en tiempo real',
                'Algoritmos de machine learning integrados',
                'Sistema de alertas inteligentes',
                'Exportación de reportes automática',
                'Colaboración en tiempo real'
            ],
            'QUANTUM MOBILE': [
                'Encriptación cuántica end-to-end',
                'Comunicación P2P segura',
                'Autenticación biométrica avanzada',
                'Backup cuántico de datos',
                'Interfaz adaptativa inteligente'
            ]
        };

        return [...baseFeatures, ...(specificFeatures[project.name] || [])];
    }

    private getTechnicalChallenges(project: Project): string[] {
        const commonChallenges = [
            'Optimización de renderizado para interfaces complejas',
            'Manejo eficiente de estado global con múltiples fuentes',
            'Implementación de lazy loading y code splitting',
            'Compatibilidad cross-browser y dispositivos legacy',
            'Optimización de bundle size y performance'
        ];

        const specificChallenges: Record<string, string[]> = {
            'E-COMMERCE NEXUS': [
                'Integración de modelos de IA en el frontend',
                'Implementación de AR en navegadores web',
                'Sincronización de inventario en tiempo real',
                'Optimización de recomendaciones personalizadas'
            ],
            'NEURAL DASHBOARD': [
                'Renderizado eficiente de grandes datasets',
                'Implementación de WebGL para visualizaciones 3D',
                'Procesamiento de datos sin bloquear la UI',
                'Sincronización en tiempo real con WebSockets'
            ],
            'QUANTUM MOBILE': [
                'Implementación de algoritmos cuánticos en JavaScript',
                'Optimización de encriptación para dispositivos móviles',
                'Manejo de comunicaciones P2P complejas',
                'Interfaz adaptativa para diferentes niveles técnicos'
            ]
        };

        return [...commonChallenges, ...(specificChallenges[project.name] || [])];
    }

    private getArchitecture(project: Project): string {
        const architectures: Record<string, string> = {
            'E-COMMERCE NEXUS': 'Arquitectura hexagonal con separación clara entre dominio, infraestructura y presentación. Implementa CQRS para separar operaciones de lectura y escritura, especialmente para el motor de recomendaciones. Utiliza Event Sourcing para auditoría de transacciones y patrón Saga para manejar procesos de compra distribuidos.',

            'NEURAL DASHBOARD': 'Clean Architecture con capas bien definidas y patrón Repository para abstracción de datos. Implementa Observer Pattern para actualizaciones en tiempo real y Strategy Pattern para diferentes algoritmos de visualización. Utiliza Worker Threads para procesamiento intensivo sin bloquear la UI principal.',

            'QUANTUM MOBILE': 'Arquitectura orientada a microservicios con comunicación asíncrona. Implementa patrón Circuit Breaker para resilencia y CQRS para optimizar consultas. Utiliza Event-Driven Architecture para comunicación entre componentes cuánticos y traditional.'
        };

        return architectures[project.name] || 'Clean Architecture con separación de responsabilidades en capas (Presentation, Domain, Infrastructure). Implementa patrón Repository para el manejo de datos, Observer para comunicación entre componentes y Factory para creación de objetos complejos. Utiliza Dependency Injection para desacoplamiento y facilitar testing.';
    }

    private getDesignPatterns(project: Project): string[] {
        const commonPatterns = [
            'Observer Pattern',
            'Repository Pattern',
            'Factory Pattern',
            'Singleton Pattern',
            'Strategy Pattern'
        ];

        const specificPatterns: Record<string, string[]> = {
            'E-COMMERCE NEXUS': ['Command Pattern', 'Saga Pattern', 'CQRS Pattern', 'Event Sourcing'],
            'NEURAL DASHBOARD': ['Builder Pattern', 'Decorator Pattern', 'Chain of Responsibility', 'State Pattern'],
            'QUANTUM MOBILE': ['Circuit Breaker Pattern', 'Adapter Pattern', 'Facade Pattern', 'Proxy Pattern']
        };

        return [...commonPatterns, ...(specificPatterns[project.name] || [])];
    }

    private getPerformanceMetrics(project: Project): PerformanceMetrics {
        const baseMetrics = {
            lightHouseScore: 95 + Math.floor(Math.random() * 5),
            loadTime: `${(1.0 + Math.random() * 0.8).toFixed(1)}s`,
            bundleSize: `${Math.floor(200 + Math.random() * 100)}KB`,
            coreWebVitals: 'Excellent',
            firstContentfulPaint: `${(0.8 + Math.random() * 0.4).toFixed(1)}s`,
            largestContentfulPaint: `${(1.2 + Math.random() * 0.6).toFixed(1)}s`,
            cumulativeLayoutShift: `0.0${Math.floor(Math.random() * 3 + 1)}`
        };

        // Ajustar métricas según complejidad del proyecto
        const complexProjects = ['NEURAL DASHBOARD', 'E-COMMERCE NEXUS'];
        if (complexProjects.includes(project.name)) {
            baseMetrics.lightHouseScore -= 2;
            baseMetrics.bundleSize = `${Math.floor(300 + Math.random() * 150)}KB`;
            baseMetrics.loadTime = `${(1.3 + Math.random() * 0.7).toFixed(1)}s`;
        }

        return baseMetrics;
    }

    private getGallery(project: Project): ProjectGalleryItem[] {
        const baseGallery: ProjectGalleryItem[] = [
            {
                id: `${project.id}-hero`,
                type: 'image',
                url: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/hero-screenshot.jpg`,
                title: 'Vista Principal',
                description: 'Captura de la interfaz principal del proyecto mostrando el diseño y funcionalidades clave',
                thumbnail: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/hero-screenshot-thumb.jpg`
            },
            {
                id: `${project.id}-demo`,
                type: 'gif',
                url: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/interaction-demo.gif`,
                title: 'Demostración Interactiva',
                description: 'Animación mostrando las principales interacciones y flujos de usuario',
                thumbnail: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/interaction-demo-thumb.jpg`
            },
            {
                id: `${project.id}-video`,
                type: 'video',
                url: `assets/videos/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/full-demo.mp4`,
                title: 'Video Completo',
                description: 'Demostración completa de todas las características y funcionalidades del proyecto',
                thumbnail: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/video-thumb.jpg`
            },
            {
                id: `${project.id}-mobile`,
                type: 'image',
                url: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/mobile-responsive.jpg`,
                title: 'Versión Móvil',
                description: 'Diseño responsive optimizado para dispositivos móviles y tablets',
                thumbnail: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/mobile-responsive-thumb.jpg`
            },
            {
                id: `${project.id}-architecture`,
                type: 'image',
                url: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/architecture-diagram.jpg`,
                title: 'Diagrama de Arquitectura',
                description: 'Estructura técnica detallada y flujo de datos del sistema',
                thumbnail: `assets/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/architecture-diagram-thumb.jpg`
            }
        ];

        return baseGallery;
    }

    private getDevelopmentProcess(project: Project): any {
        const processes = {
            'E-COMMERCE NEXUS': {
                methodology: 'Agile Scrum + Design Thinking',
                duration: '4 meses',
                teamSize: 6,
                startDate: '2024-01-15',
                endDate: '2024-05-15',
                role: 'Full Stack Developer & Tech Lead'
            },
            'NEURAL DASHBOARD': {
                methodology: 'Lean Startup + DevOps',
                duration: '3 meses',
                teamSize: 4,
                startDate: '2024-02-01',
                endDate: '2024-05-01',
                role: 'Frontend Lead & Data Visualization Specialist'
            },
            'QUANTUM MOBILE': {
                methodology: 'Waterfall + Research Spikes',
                duration: '6 meses',
                teamSize: 8,
                startDate: '2023-10-01',
                endDate: '2024-04-01',
                role: 'Mobile Developer & Security Specialist'
            }
        };

        return processes[project.name as keyof typeof processes] || {
            methodology: 'Agile Scrum',
            duration: '3 meses',
            teamSize: 4,
            startDate: '2024-01-01',
            endDate: '2024-04-01',
            role: 'Full Stack Developer'
        };
    }

    private getLearnings(project: Project): string[] {
        const commonLearnings = [
            'Implementación avanzada de patrones de diseño en aplicaciones complejas',
            'Optimización de performance con técnicas de rendering selectivo',
            'Desarrollo de componentes reutilizables con alta cohesión y bajo acoplamiento',
            'Testing automatizado con coverage superior al 90%',
            'Metodologías ágiles aplicadas a proyectos de alta complejidad'
        ];

        const specificLearnings: Record<string, string[]> = {
            'E-COMMERCE NEXUS': [
                'Integración de modelos de IA en aplicaciones web frontend',
                'Implementación de realidad aumentada en navegadores web',
                'Optimización de algoritmos de recomendación personalizada',
                'Manejo de transacciones complejas con Event Sourcing'
            ],
            'NEURAL DASHBOARD': [
                'Visualización de datos complejos con D3.js y Three.js',
                'Procesamiento eficiente de big data en el cliente',
                'Implementación de WebGL para gráficos de alta performance',
                'Arquitectura para aplicaciones data-intensive'
            ],
            'QUANTUM MOBILE': [
                'Implementación de algoritmos cuánticos en JavaScript',
                'Desarrollo de aplicaciones móviles con Flutter avanzado',
                'Criptografía cuántica aplicada a comunicaciones móviles',
                'Optimización para dispositivos con recursos limitados'
            ]
        };

        return [...commonLearnings, ...(specificLearnings[project.name] || [])];
    }

    private getHighlights(project: Project): string[] {
        return [
            'Reconocido por innovación técnica y diseño excepcional',
            'Implementación exitosa en producción con alta disponibilidad',
            'Feedback positivo de usuarios y stakeholders',
            'Arquitectura escalable probada bajo carga de producción',
            'Contribución significativa al portfolio profesional'
        ];
    }

    private getFutureImprovements(project: Project): string[] {
        const improvements: Record<string, string[]> = {
            'E-COMMERCE NEXUS': [
                'Integración con más proveedores de IA',
                'Expansión de capacidades AR a más dispositivos',
                'Implementación de blockchain para trazabilidad',
                'Sistema de recomendaciones más sofisticado'
            ],
            'NEURAL DASHBOARD': [
                'Implementación de más algoritmos de ML',
                'Soporte para más tipos de visualizaciones',
                'Optimización para datasets aún más grandes',
                'Funcionalidades de colaboración avanzadas'
            ],
            'QUANTUM MOBILE': [
                'Soporte para más algoritmos cuánticos',
                'Interfaz aún más intuitiva',
                'Expansión a más plataformas móviles',
                'Integración con más servicios cuánticos'
            ]
        };

        return improvements[project.name] || [
            'Optimizaciones adicionales de performance',
            'Nuevas funcionalidades basadas en feedback',
            'Mejoras en la experiencia de usuario',
            'Expansión de capacidades técnicas'
        ];
    }
}