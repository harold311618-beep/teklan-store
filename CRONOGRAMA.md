# Proyecto Teklan - Ecommerce

## Fase 1: Arquitectura y Configuracion Inicial

Objetivo: dejar la tuberia lista y conectada.

| Tarea | Estado |
| --- | --- |
| Inicializacion en VS Code: creacion del proyecto base utilizando Next.js y JavaScript. | Completado |
| Control de versiones: creacion del repositorio en GitHub y primer commit. | Completado |
| Integracion continua: conexion del repositorio de GitHub con Vercel para despliegue automatico por cada cambio guardado en una URL en vivo. | Completado |
| Configuracion de Firebase: creacion del proyecto en Firebase, reglas de seguridad y conexion del SDK para habilitar Firestore. | Completado |

## Fase 2: Desarrollo del Frontend

Objetivo: construir la cara visible, moderna y entretenida de Teklan.

| Tarea | Estado |
| --- | --- |
| Diseno base UI: configuracion de Tailwind CSS, paleta de colores, tipografias y estilo visual general. | Completado |
| Maquetacion del catalogo: pagina principal con cuadricula de telefonos, banner de novedades y filtros por marca o precio. | Completado |
| Pagina de detalles del producto: vista dedicada por celular con especificaciones tecnicas, precio de contado y galeria de imagenes. | Completado |

## Fase 3: Logica de Negocio

Objetivo: dar vida a las transacciones y a la captura de clientes.

| Tarea | Estado |
| --- | --- |
| Estado global del carrito: logica para agregar, eliminar y sumar productos para pago de contado. | Completado |
| Integracion del formulario de credito directo: modal con formulario basico de nombre, telefono, correo y horario de contacto. | Pendiente |
| Conexion con Firestore: guardar solicitudes en la coleccion `solicitudes_contacto_credito`. | Pendiente |

## Fase 4: Panel de Administracion

Objetivo: centro de control operativo para gestionar el negocio.

| Tarea | Estado |
| --- | --- |
| Autenticacion: inicio de sesion seguro con Firebase Auth para el equipo de ventas. | Pendiente |
| Gestion de leads: tabla interna en tiempo real desde Firestore para ver telefonos de clientes y cambiar estados como Pendiente, Contactado o En Negociacion. | Pendiente |
| Gestion de inventario: modulo basico para agregar celulares o modificar precios sin tocar codigo. | Pendiente |

## Fase 5: Pruebas, Optimizacion y Lanzamiento

Objetivo: pulir detalles antes de invertir presupuesto en campanas publicitarias.

| Tarea | Estado |
| --- | --- |
| Pruebas de responsividad: asegurar que la tienda se vea y funcione bien en todos los tamanos de pantalla. | Pendiente |
| Auditoria de rendimiento: optimizacion de imagenes y tiempos de carga para SEO y experiencia de usuario. | Pendiente |
| Despliegue final en Vercel: asignar dominio personalizado y hacer revision final en produccion. | Pendiente |
