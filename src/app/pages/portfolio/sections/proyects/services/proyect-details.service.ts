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
            architecture: this.getArchitecture(project),
            gallery: this.getGallery(project),
            developmentProcess: this.getDevelopmentProcess(project),
            learnings: this.getLearnings(project),
            highlights: this.getHighlights(project),
            futureImprovements: this.getFutureImprovements(project)
        };
    }

    private getExtendedDescription(project: Project): string {
        const descriptions: Record<string, string> = {

            'Gifs App': `${project.description}. Esta aplicacion logra realizar varias peticiones generando nuevos gifs app permitiendo que el usuario pueda tener mas variedad de elegir el gif de su preferencia. `,

            'Sistema de guias de remision remitente': `${project.description}. El sistema puede registrar las ventas donde detalla empresa remitente, datos del destinatario, datos del producto y generacion de documento de guia. Esta aplicacion hecha con Excel VBA cumple con una parte fundamental de la automatizacion de guias de remision cumpliendo con el formato que dicta la SUNAT, para una empresa madedera especializada en fabricacion de los pallets, asi mismo tiene la capacidad de mantener un historial correlativo de las guias generadas para reportes generales. esta solucion fue implementada con exito alcanzando una optima reduccion de tiempo de proceso de registro en un 75% mas rapido en lo que era antes con el proceso manual. `,

            'E-COMMERCE de tienda de comida rapida': `${project.description} La plataforma incluye carrito de compras, sistema de pedidos en línea, gestión de usuarios, reportes de ventas y herramientas para optimizar las operaciones diarias del restaurante. `,

            'Sistema de control de asistencia': `${project.description} lo cual desarrolle una plataforma que moderniza el control de asistencia para colegios en el caso de los alumnos, aprovechando las tabletas del gobierno como estaciones de escaneo. Los estudiantes usan códigos QR únicos para registrar su entrada y salida, mientras que los auxiliares supervisan todo desde un panel administrativo intuitivo.
El sistema genera reportes automáticos para subdirectores y envía notificaciones en tiempo real a los padres cuando sus hijos llegan o salen del colegio. Esto elimina el papeleo manual y mejora significativamente la comunicación entre la escuela y las familias.`};

        return descriptions[project.name] || `${project.description} Este proyecto implementa tecnologías de vanguardia para resolver desafíos complejos del mundo real, combinando diseño innovador con arquitectura robusta y escalable.`;
    }

    private getObjectives(project: Project): string[] {

        const specificObjectives: Record<string, string[]> = {

            'Gifs App': [
                'Proporcionar entretenimiento y diversion a usuarios de diferentes edades',
                'Organizacion eficiente de contenido por busquedas de interes',
                'Facil navegacion para interactuar con la aplicacion de diferentes pantallas'
            ],
            'Sistema de guias de remision remitente': [
                'Reducir el tiempo de emision de guias de remision remitente',
                'Centralizar la informacion de historial de registros para futuros reportes',
                'Conectar procesos de venta, logistica y facturacion de manera modularizada',
            ],
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

            'Gifs App': [
                'Búsqueda de GIFs mediante campo de búsqueda',
                'trending para mostrar contenido popular',
                'Visualización en galería optimizada',
                'Menu de historial de busqueda de gifs'
            ],
            'Sistema de guias de remision remitente': [
                'Emision de forma automatizada de guias de remision cumpliendo con el formato que dicta la SUNAT',
                'Registro automatico de historial centralizado para futuros reportes',
                'Autocompletado de datos de empresa remitente y destinataria junto con datos de logistica y venta',
                'Autorellenado de formato de guia para previa impresion',
                'Interfaces de actualizacion de datos para diversos modulos.',
                'Distribuido para personal administrativo podia acceder al sistema desde la red de la empresa'
            ],
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



    private getArchitecture(project: Project): string {
        const architectures: Record<string, string> = {
            'Gifs App': 'Aplicacion SPA mediante arquitectura organizada de componentes',
            'Sistema de guias de remision remitente': 'Arquitectura monotitica con separacion de interfaces',
            'Sistema de control de asistencia': 'Arquitectura hexagonal con separacion entre dominio y infraestructura. ',
            'E-COMMERCE de tienda de comida rapida': 'Arquitectura cliente-servidor con React y Laravel',
        };

        return architectures[project.name] || 'Clean Architecture con separación de responsabilidades en capas (Presentation, Domain, Infrastructure). Implementa patrón Repository para el manejo de datos, Observer para comunicación entre componentes y Factory para creación de objetos complejos. Utiliza Dependency Injection para desacoplamiento y facilitar testing.';
    }





    private getGallery(project: Project): ProjectGalleryItem[] {
        const projectGalleries: Record<string, ProjectGalleryItem[]> = {
            'Sistema de guias de remision remitente': [
                {
                    id: `${project.id}-LOGIN-PRINCIPAL`,
                    type: 'image',
                    url: 'assets/proyects/sistema-guias/LOGIN-PRINCIPAL.png',
                    title: 'Login Principal',
                    description: 'Esta interfaz es para autenticar a los usuarios autorizados para manejar los registros fiscales que se requieren mediante ventas de la empresa',
                    thumbnail: 'assets/proyects/sistema-guias/LOGIN-PRINCIPAL.png'
                },
                {
                    id: `${project.id}-REGISTRO-VENTA-EMPRESA.png`,
                    type: 'image',
                    url: 'assets/proyects/sistema-guias/REGISTRO-VENTA-EMPRESA.png',
                    title: 'Interfaz principal de registro',
                    description: 'Esta interfaz tiene la funcionalidad de registrar ventas de clientes detallandao la informacion necesario como la orden de compra adquirida, tipo de contrato, logistica, transportista y la descripcion de producto de la venta junto con la cantidad solicitada. Esta interfaz es el principal responsable para realizar la operacion de guias de remision.',
                    thumbnail: 'assets/proyects/sistema-guias/REGISTRO-VENTA-EMPRESA.png'
                },
                {
                    id: `${project.id}-VISTA-PREVIA-IMPRESION-GUIA.png`,
                    type: 'image',
                    url: 'assets/proyects/sistema-guias/VISTA-PREVIA-IMPRESION-GUIA.png',
                    title: 'Vista previa de guia',
                    description: 'Esta vista nos permite corroborar la informacion ingresada para su impresion respectiva de la guia',
                    thumbnail: 'assets/proyects/sistema-guias/VISTA-PREVIA-IMPRESION-GUIA.png'
                },
                {
                    id: `${project.id}-GESTOR-CLIENTES.png`,
                    type: 'image',
                    url: 'assets/proyects/sistema-guias/GESTOR-CLIENTES.png',
                    title: 'Interfaz de registro de clientes',
                    description: 'Esta interfaz permite al usuario poder actualizar y registrar datos de los clientes para acceder a toda su informacion y realizar el proceso de impresion de guia',
                    thumbnail: 'assets/proyects/sistema-guias/GESTOR-CLIENTES.png'
                },

            ],
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

            'Gifs App': [
                {
                    id: `${project.id}-PRINCIPAL`,
                    type: 'image',
                    url: 'assets/proyects/gifs-app/PRINCIPAL.png',
                    title: 'Interfaz principal de aplicacion de gifs app',
                    description: 'Interfaz para visualizar los gifs de mayor tendencia',
                    thumbnail: 'assets/proyects/gifs-app/PRINCIPAL.png',
                },
                {
                    id: `${project.id}-BUSQUEDA`,
                    type: 'image',
                    url: 'assets/proyects/gifs-app/BUSQUEDA.png',
                    title: 'Interfaz de busqueda de gifs de preferencia',
                    description: 'El usuario puede buscar su gifs preferidos mediante el buscador, tambien puede visualizar el historial de sus busquedas y volver a ver sus gifs ',
                    thumbnail: 'assets/proyects/gifs-app/BUSQUEDA.png',
                },
                {
                    id: `${project.id}-RESULTADO-BUSQUEDA`,
                    type: 'image',
                    url: 'assets/proyects/gifs-app/RESULTADO-BUSQUEDA.png',
                    title: 'Interfaz de resultado de gifs mediante busqueda',
                    description: 'El usuario visualizara su gif solicitado para divertirse un poco a lado de familiares y amigos ',
                    thumbnail: 'assets/proyects/gifs-app/RESULTADO-BUSQUEDA.png',
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
            'Sistema de guias de remision remitente': {
                methodology: 'Cascada',
                duration: '3 meses',
                teamSize: 1,
                startDate: '2023-1-01',
                endDate: '2024-01-19',
                role: 'Asistente de sistemas'
            },
            'Gifs App': {
                methodology: 'Cascada',
                duration: '2 semanas',
                teamSize: 1,
                startDate: '2025-06-11',
                endDate: '2025-07-01',
                role: 'Estudiante'
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
            'Gifs App': [
                'Integracion de Giphy API para la carga de los gifs',
                'Manejo de peticiones con Http Client con los operadores de RxJs',
                'Paginacion y lazy loading',
                'Manejo de localstorage y caché',
                'Diseño responsive de la aplicacion'
            ],
            'Sistema de guias de remision remitente': [
                'Comprension de los campos necesarios para guias de remision remitente',
                'Mapear el flujo completo desde la venta hasta la documentacion fiscal',
                'Diseñar autocompletado que reduzca la carga cognitiva del usuario',
                'Poder crear interfaces intuitivas para usuarios puedan usar sin capacitacion exhaustiva',
                'Validar que el sistema funcione bajo condiciones reales del trabajo'
            ],
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