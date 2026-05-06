---
id: aplicacin-para-propiedad-fraccionada
path: /blog/aplicacin-para-propiedad-fraccionada.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 17452116-a8b1-80ec-8aed-ed28ad6192e3
meta:
  title: Aplicación para propiedad fraccionada
  author: Rashid Azarang
  category: []
  main_tag: null
  tags: []
  featured: false
  featured_at: []
  language: Español
  post_type: Post
  status: Not started
  comment: Estructura Propuesta de Requerimiento de Proyecto
  cover_image: >-
    https://images.unsplash.com/photo-1613288092085-eb081fde1509?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb
---

# Aplicación para propiedad fraccionada


**Estructura Propuesta de Requerimiento de Proyecto**


A partir del transcript y de la idea general del negocio, se propone el siguiente documento para detallar las necesidades de la aplicación y sus funcionalidades:


---


## 1. Descripción General


El proyecto busca crear una aplicación que brinde una experiencia de organización y asignación de semanas de uso para diez propietarios de una o varias propiedades inmobiliarias bajo un esquema fraccionado.

- **Usuarios principales**:
    - **Propietarios** (10 dueños de cada propiedad).
    - **Administrador** (persona o rol que gestiona la configuración general y mantiene las propiedades).
- **Objetivos**:
    1. Asignar de forma equitativa las semanas de uso en cada propiedad fraccionada.
    2. Proveer un sistema de intercambio y negociación de semanas sin que los dueños tengan contacto directo.
    3. Considerar la rotación del orden de elección de semanas año tras año, de forma que cada propietario tenga oportunidades justas.
    4. Integrar funcionalidades para manejar dos semanas de mantenimiento al año y gestionar múltiples propiedades.

---


## 2. Funcionalidades Principales


### 2.1 Asignación de Semanas

- **Orden de elección**:
    - Año 1: El propietario #1 elige primero, seguido del propietario #2, etc., hasta el #10.
    - Año 2 y siguientes: El orden de elección rota para que no siempre el mismo propietario elija primero.
- **Separación de temporadas**:
    - Se definen semanas de temporada alta y semanas de temporada regular.
    - Cada propietario elige primero las semanas de temporada alta (una por turno), después las semanas de temporada regular (una por turno).
- **Semanas de mantenimiento**:
    - Se reservan 2 semanas al año por propiedad, sin asignarse a ningún dueño.

### 2.2 Intercambio de Semanas

- **Propuestas de intercambio**:
    - Cualquier propietario puede poner en oferta una o varias de sus semanas para intercambiarlas.
    - El sistema muestra los posibles intercambios disponibles y facilita la “compra” o “trueque” de semanas sin que los dueños deban negociar directamente.
- **Procesamiento automático**:
    - Una vez que un propietario confirma un intercambio, la transacción se registra de inmediato y se actualizan los calendarios.
    - Evitar la necesidad de llamadas o mensajes directos para pactar los cambios.

### 2.3 Multisede

- **Selección de propiedad**:
    - Posibilidad de intercambiar semanas no solo en la misma propiedad, sino con otra distinta, incluso en diferente ciudad.
    - Gestión de calendario y reservas por ubicación.

### 2.4 Manejo de Conflictos y Rotaciones

- **Evitar roces directos**:
    - Propuestas y aprobaciones automatizadas, con un sistema de notificaciones por correo o dentro de la aplicación.
- **Rotación de turnos**:
    - Definición clara de cómo se reordena a los dueños cada año (por ejemplo, el que fue primero pasa a ser último el siguiente año, o se recorre un lugar).

### 2.5 Panel de Administración

- **Configuración del calendario anual**:
    - Definir las 52 semanas, marcando cuáles son de temporada alta y cuáles de temporada regular.
    - Asignar y modificar las semanas de mantenimiento.
- **Gestión de usuarios**:
    - Registro, alta y baja de propietarios.
    - Cambio de roles (por ejemplo, si un dueño vende su fracción).
- **Reporte de uso**:
    - Estadísticas de ocupación por propietario.
    - Registro de intercambios realizados.

---


## 3. Consideraciones Técnicas y Requerimientos No Funcionales

1. **Seguridad de datos**:
    - Control de accesos y privacidad de la información.
    - Uso de sesiones seguras, cifrado en la transmisión.
2. **Escalabilidad**:
    - Posibilidad de añadir más propiedades y más propietarios a futuro.
3. **Disponibilidad**:
    - El sistema debe estar accesible en todo momento para que las reservas y los intercambios puedan ser consultados en tiempo real.
4. **Interfaz amigable**:
    - Diseño sencillo que permita a los propietarios seleccionar, intercambiar y ver el estado de sus semanas con facilidad en dispositivos móviles y web.

---


## 4. Flujo Básico de Usuario

1. **Registro e inicio de sesión**: El propietario se da de alta y accede a la plataforma.
2. **Selección de propiedad y semanas**:
    - Se muestra el calendario de la propiedad para la temporada en curso.
    - El usuario elige (en su turno) las semanas de temporada alta y luego de temporada regular.
3. **Intercambios**:
    - El usuario propone intercambios o busca ofertas publicadas.
    - Confirma la operación sin necesidad de contactar al propietario que ofrece la otra semana.
4. **Notificaciones**:
    - El sistema manda avisos cuando se acerque la fecha de uso o si alguien ha aceptado un intercambio que involucre semanas de ese usuario.

---

