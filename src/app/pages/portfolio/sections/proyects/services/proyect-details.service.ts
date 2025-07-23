import { Injectable } from '@angular/core';
import { Project } from '../interfaces/proyect.interface';
import { PerformanceMetrics, ProjectDetailExtended, ProjectGalleryItem } from '../interfaces/proyect-details.interface';
import { AppLifecycleManagerService } from '../../../../../core/global/config/app-life-cycle.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectDetailService {

    private readonly projectDetailsCache = new Map<number, ProjectDetailExtended>();

    getProjectDetail(project: Project): ProjectDetailExtended {

        const existing = this.projectDetailsCache.get(project.id);
        if (existing) {
            return existing;
        }

        const detail = this.generateProjectDetail(project);
        this.projectDetailsCache.set(project.id, detail);

        return detail;
    }

    clearCache(): void {
        this.projectDetailsCache.clear();
    }

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
            'E-COMMERCE de tienda de comida rapida': `${project.description} La plataforma incluye carrito de compras, sistema de pedidos en línea, gestión de usuarios, reportes de ventas y herramientas para optimizar las operaciones diarias del restaurante. `,

            'Sistema de control de asistencia': `${project.description} lo cual desarrolle una plataforma que moderniza el control de asistencia para colegios en el caso de los alumnos, aprovechando las tabletas del gobierno como estaciones de escaneo. Los estudiantes usan códigos QR únicos para registrar su entrada y salida, mientras que los auxiliares supervisan todo desde un panel administrativo intuitivo.
El sistema genera reportes automáticos para subdirectores y envía notificaciones en tiempo real a los padres cuando sus hijos llegan o salen del colegio. Esto elimina el papeleo manual y mejora significativamente la comunicación entre la escuela y las familias.`};

        return descriptions[project.name] || `${project.description} Este proyecto implementa tecnologías de vanguardia para resolver desafíos complejos del mundo real, combinando diseño innovador con arquitectura robusta y escalable.`;
    }

    private getObjectives(project: Project): string[] {

        const specificObjectives: Record<string, string[]> = {
            'E-COMMERCE de tienda de comida rapida': [
                'Ofrecer una experiencia de compra comoda y eficiente para el cliente',
                'Digitalizar las ventas y expandir el alcance del negocio',
                'Reducir los costos operativos automatizando los procesos manuales',
                'Simplificar el proceso de pago de pedido de los clientes',
                'Facilitar el acceso al menu con los precios constantemente actualizados'
            ],
            'Sistema de control de asistencia': [
                'Desarrollar una plataforma de registro de asistencia que permita la captura simultánea de códigos QR estudiantiles a través de dispositivos de escaneo especializados',
                'Aprovechar eficientemente las tabletas gubernamentales del Perú, configurándolas como dispositivos de escaneo dedicados para el control de asistencia estudiantil.',
                'Crear un sistema de identificación único mediante códigos QR individuales para cada estudiante, facilitando el registro preciso de ingresos y salidas.',
                'Implementar un panel administrativo integral que permita a los auxiliares educativos supervisar y gestionar el control de asistencia de manera centralizada.',
                'Desarrollar herramientas de generación de reportes especializados para subdirectores administrativos, facilitando la toma de decisiones basada en datos de asistencia.',
                'Establecer un sistema de notificaciones automáticas en tiempo real que informe a los padres de familia sobre el estado de asistencia de sus hijos.'
            ],
        };

        return [...(specificObjectives[project.name] || [])];
    }

    private getKeyFeatures(project: Project): string[] {

        const specificFeatures: Record<string, string[]> = {
            'E-COMMERCE de tienda de comida rapida': [
                'Carrito de compras funcional con cálculo automático de totales de precio',
                'Seccion de checkout completo con resumen del pedido',
                'Métodos de pago (Yape, Plin)',
                'Filtros para múltiples campos',
                'Panel de tienda para gestionar usuarios, precios, stock, productos, promociones, etc.',
                'Diseño responsive adaptado para dispositivos moviles'

            ],
            'Sistema de control de asistencia': [
                'Acceso multi-usuario con roles para supervision de la asistencia de los estudiantes',
                'Registro y control de asistencia de estudiantes mediante codigos QR',
                'Procesamiento en tiempo real de notificaciones de asistencia',
                'Interfaz web de escaner y panel administrativo con diseño responsive',
                'Configuraciones de emisiones y recepciones de notificaciones y generadores de codigos QR',
                'Asistente virtual implementado para atencion personalizada al personal administrativo.'
            ],

        };

        return [...(specificFeatures[project.name] || [])];
    }

    private getTechnicalChallenges(project: Project): string[] {

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

        return [...(specificChallenges[project.name] || [])];
    }

    private getArchitecture(project: Project): string {
        const architectures: Record<string, string> = {
            'Sistema de control de asistencia': 'Arquitectura hexagonal con separacion entre dominio y infraestructura. ',
            'E-COMMERCE de tienda de comida rapida': 'Arquitectura cliente-servidor con React y Laravel',
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

        const complexProjects = ['NEURAL DASHBOARD', 'E-COMMERCE NEXUS'];
        if (complexProjects.includes(project.name)) {
            baseMetrics.lightHouseScore -= 2;
            baseMetrics.bundleSize = `${Math.floor(300 + Math.random() * 150)}KB`;
            baseMetrics.loadTime = `${(1.3 + Math.random() * 0.7).toFixed(1)}s`;
        }

        return baseMetrics;
    }

    private getGallery(project: Project): ProjectGalleryItem[] {
        const projectGalleries: Record<string, ProjectGalleryItem[]> = {
            'Sistema de control de asistencia': [
                {
                    id: `${project.id}-asistente-virtual`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/ASISTENTE-VIRTUAL-DE-AYUDA.png',
                    title: 'Asistente virtual',
                    description: 'Chat bot integrado "Andrés Bot" para soporte al personal administrativo respecto al uso del escaner',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/ASISTENTE-VIRTUAL-DE-AYUDA.png'
                },
                {
                    id: `${project.id}-escaner-qr-de-estudiantes`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/ESCANER-QR-DE-ESTUDIANTES.png',
                    title: 'Panel de registro de asistencia con escaneo QR',
                    description: 'Registro de asistencia de estudiantes mediante codigos QR de estudiantes',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/ESCANER-QR-DE-ESTUDIANTES.png'
                },
                {
                    id: `${project.id}-lista-estudiantes`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/LISTA-ALUMNOS.png',
                    title: 'Lista de alumnos',
                    description: 'Intefaz de estudiantes de la institucion educativa "Andres de los reyes". ',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/LISTA-ALUMNOS.png'
                },
                {
                    id: `${project.id}-lista-asistencia-estudiantes`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/LISTA-DE-ASISTENCIA.png',
                    title: 'Lista de asistencia de estudiantes',
                    description: 'Interfaz de control de asistencia de estudiantes, en el podemos visualizar y ver mas detalles de asistencia de cada alumno y darle seguimiento.',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/LISTA-DE-ASISTENCIA.png'
                },
                {
                    id: `${project.id}-login`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/LOGIN.png',
                    title: 'Login principal',
                    description: 'Interfaz de login para acceder al sistema panel de administrador, donde tiene acceso el personal administrativo de la institucion.',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/LOGIN.png'
                },
                {
                    id: `${project.id}-notificacion`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/NOTIFICACION-A-PADRE-DE-FAMILIA.jpg',
                    title: 'Notificaciones automaticas Telegram',
                    description: 'Sitio de notificaciones en tiempo real para cada apoderado del alumno indicando el estado actual del alumno segun asistencia',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/NOTIFICACION-A-PADRE-DE-FAMILIA.jpg'
                },
                {
                    id: `${project.id}-menu-principal`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/PANTALLA-PRINCIPAL.png',
                    title: 'Menu Principal',
                    description: 'Interfaz principal del panel administrador donde puede gestionar multiples procesos respecto al control de asistencia',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/PANTALLA-PRINCIPAL.png'
                },
                {
                    id: `${project.id}-qr-estudiantes`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/QR-ESTUDIANTES.png',
                    title: 'Generador de codigos QR',
                    description: 'Interfaz generador de codigos QR unicos para cada estudiante de la institucion',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/QR-ESTUDIANTES.png'
                },
                {
                    id: `${project.id}-registro-estudiantes`,
                    type: 'image',
                    url: 'assets/proyects/sistema-de-control-de-asistencia/REGISTRO-DE-ALUMNOS.png',
                    title: 'Interfaz de registro de alumnos',
                    description: 'Interfaz de registro de estudiantes de la institucion',
                    thumbnail: 'assets/proyects/sistema-de-control-de-asistencia/REGISTRO-DE-ALUMNOS.png'
                },



            ],
            'E-COMMERCE de tienda de comida rapida': [
                {
                    id: `${project.id}-presentacion`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/PRESENTACION.png',
                    title: 'Interfaz de bienvenida',
                    description: 'Interfaz principal de acceso al panel administrador',
                    thumbnail: 'assets/proyects/ecommerce-virtual/PRESENTACION.png',
                },
                {
                    id: `${project.id}-admin-productos`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/ADMIN-PRODUCTOS.png',
                    title: 'Interfaz de productos',
                    description: 'Interfaz para gestionar los productos de tienda virtual',
                    thumbnail: 'assets/proyects/ecommerce-virtual/ADMIN-PRODUCTOS.png',
                },
                {
                    id: `${project.id}-ADMIN-USUARIO`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/ADMIN-USUARIO.png',
                    title: 'Interfaz de usuarios',
                    description: 'Interfaz para administrar el control de usuario',
                    thumbnail: 'assets/proyects/ecommerce-virtual/ADMIN-USUARIO.png',
                },
                {
                    id: `${project.id}-CARRITO`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/CARRITO.png',
                    title: 'Interfaz de carrito de compras',
                    description: 'Vista para visualizar a detalle productos de cliente',
                    thumbnail: 'assets/proyects/ecommerce-virtual/CARRITO.png',
                },
                {
                    id: `${project.id}-CATEGORIA`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/CATEGORIA.png',
                    title: 'Interfaz categorias de productos',
                    description: 'Interfaz para clasificar los productos de tienda para mejores busquedas en los filtros',
                    thumbnail: 'assets/proyects/ecommerce-virtual/CATEGORIA.png',
                },
                {
                    id: `${project.id}-CHECKOUT`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/CHECKOUT.png',
                    title: 'Intefaz para completar compra',
                    description: 'Interfaz para ingresar a detalles datos de facturacion y carrito de compras',
                    thumbnail: 'assets/proyects/ecommerce-virtual/CHECKOUT.png',
                },
                {
                    id: `${project.id}-CHECKOUT`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/CHECKOUT.png',
                    title: 'Intefaz para completar compra',
                    description: 'Interfaz para ingresar a detalles datos de facturacion y carrito de compras',
                    thumbnail: 'assets/proyects/ecommerce-virtual/CHECKOUT.png',
                },
                {
                    id: `${project.id}-CLIENTES`,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/CLIENTES.png',
                    title: 'Interfaz de clientes',
                    description: 'Interfaz para visualizar nuestros clientes registrados',
                    thumbnail: 'assets/proyects/ecommerce-virtual/CLIENTES.png',
                },
                {
                    id: `${project.id}-CONFIG `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/CONFIG-PERFIL.png',
                    title: 'Interfaz de configuracion de perfil',
                    description: 'Vista de configuracion para actualizar nuestros datos de perfil',
                    thumbnail: 'assets/proyects/ecommerce-virtual/CONFIG-PERFIL.png',
                },
                {
                    id: `${project.id}-DETALLE-PEDIDO `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/DETALLE-PEDIDO.png',
                    title: 'Interfaz de pedido de cliente',
                    description: 'Vista para visualizar detalles de pedidos de cliente',
                    thumbnail: 'assets/proyects/ecommerce-virtual/DETALLE-PEDIDO.png',
                },
                {
                    id: `${project.id}-DETALLE-PRODUCTO `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/DETALLE-PRODUCTO.png',
                    title: 'Vista de producto',
                    description: 'Vista para visualizar detalles de producto, descripcion y precio',
                    thumbnail: 'assets/proyects/ecommerce-virtual/DETALLE-PRODUCTO.png',
                },
                {
                    id: `${project.id}-INICIO-PANEL `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/INICIO-PANEL.png',
                    title: 'Vista principal de administrador',
                    description: 'Menu principal de panel de administrador',
                    thumbnail: 'assets/proyects/ecommerce-virtual/INICIO-PANEL.png',
                },
                {
                    id: `${project.id}-LOGIN `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/LOGIN.png',
                    title: 'Login panel administrador',
                    description: 'Login para usuarios de personal de tienda',
                    thumbnail: 'assets/proyects/ecommerce-virtual/LOGIN.png',
                },
                {
                    id: `${project.id}-LOGIN-BACK `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/LOGIN-BACK.png',
                    title: 'Login clientes',
                    description: 'Login para clientes para acceder a compras los productos',
                    thumbnail: 'assets/proyects/ecommerce-virtual/LOGIN-BACK.png',
                },
                {
                    id: `${project.id}-PAGO `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/PAGO.png',
                    title: 'Interfaz de pago',
                    description: 'Vista para clientes donde realizara el medio de pago de su preferencia',
                    thumbnail: 'assets/proyects/ecommerce-virtual/PAGO.png',
                },
                {
                    id: `${project.id}-TIENDA `,
                    type: 'image',
                    url: 'assets/proyects/ecommerce-virtual/TIENDA.png',
                    title: 'Vista de listado de productos de tienda',
                    description: 'Vista para los clientes donde pueden visualizar y buscar productos de tienda',
                    thumbnail: 'assets/proyects/ecommerce-virtual/TIENDA.png',
                },
            ]

        };

        return projectGalleries[project.name] || [];
    }

    private getDevelopmentProcess(project: Project): any {

        const processes = {
            'Sistema de control de asistencia': {
                methodology: 'Scrum',
                duration: '3 meses',
                teamSize: 1,
                startDate: '2025-03-01',
                endDate: '2025-06-01',
                role: 'Full Stack Developer'
            },
            'E-COMMERCE de tienda de comida rapida': {
                methodology: 'Scrum',
                duration: '3 meses',
                teamSize: 1,
                startDate: '2024-09-01',
                endDate: '2024-12-01',
                role: 'Full Stack Developer'
            },


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


        const specificLearnings: Record<string, string[]> = {
            'Sistema de control de asistencia': [
                'Desarrollo de notificaciones automaticas con telegram para comunicacion entre institucion y padres de familia',
                'Desarrollo de API REST para sincronizacion de registros simultaneos de estudiantes con codigos QR',
                'Implementacion de arquitectura hexagonal para separacion clara de dominio y infraestructura',
                'Aplicacion de principios SOLID en capos de dominio y aplicacion',
                'Integracion de tecnologias Angular con NestJS y MySQL para sistema de control de asistencia.',
                'Control de estados de asistencia automaticos para reportes administrativos de asistencia.'
            ],
            'E-COMMERCE de tienda de comida rapida': [
                'Desarrollé lógica para actualizar cantidades y calcular totales en tiempo real sin afectar el performance',
                'Desarrollé validación de vouchers de pago mediante upload de imágenes',
                'Implementé tokens de sesión con expiración automática para usuarios inactivos',
                'Implementacion de query scopes con eloquent para filtros dinamicos en busquedas mas especificas de productos',
                'Implementé Laravel Echo Server con Pusher para comunicación en tiempo real',
            ],

        };

        return [...(specificLearnings[project.name] || [])];
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