# ShipNow - API Backend Profesional

API RESTful profesional para la gestión de envíos, logística, órdenes, usuarios y simulaciones (mocks), desarrollada con Node.js, Express y MongoDB bajo arquitectura en capas.

---

## Arquitectura del Proyecto

El proyecto implementa una **Arquitectura por Capas estricta (Controller → Service → Repository)**:

- **Routers (`/src/routes`)**: Definen las rutas de la API y delegan la ejecución a los controladores.
- **Controllers (`/src/controllers`)**: Manejan las peticiones HTTP, sanitizan la paginación (máximo 50 elementos) y estructuran las respuestas.
- **Services (`/src/services`)**: Contienen la lógica de negocio pura y la gestión estandarizada de errores.
- **Repositories & Models (`/src/repositories`, `/src/models`)**: Abstraen la interacción y persistencia en MongoDB.
- **Middlewares (`/src/middlewares`)**: Manejo global de errores, logs de peticiones y carga de archivos con Multer.

---

## Tecnologías Utilizadas

- **Entorno:** Node.js (v20+), Express.js
- **Base de Datos:** MongoDB, Mongoose ORM
- **Documentación:** Swagger UI, OpenAPI 3.0 (`swagger-ui-express`)
- **Logging:** Winston (`winston-daily-rotate-file` / consola en desarrollo)
- **Carga de Archivos:** Multer (límite configurable vía `MAX_FILE_SIZE_MB`)
- **Testing:** Mocha, Chai, Supertest (17/17 tests funcionales aprobados)
- **Containerización:** Docker, Docker Compose

---

## Variables de Entorno

Copiar el archivo `.env.example` a `.env` y configurar las variables requeridas:

```bash
cp .env.example .env


# Variable          Descripción                                         Valor Por Defecto
----------------------------------------------------------------------------------------------------------------------
# PORT              Puerto donde corre la API                           8080
# NODE_ENV          Entorno (development / production / test)           development
# MONGODB_URI       Cadena de conexión a MongoDB                        mongodb://localhost:27017/shipnow
# MONGODB_URI_TEST  Cadena de conexión a MongoDB exclusiva para Tests   mongodb://localhost:27017/shipnow_test
# MAX_FILE_SIZE_MB  Límite máximo para subida de archivos (MB)          5

### Instalación y Ejecución Local
1. Clonar e instalar dependencias
git clone [https://github.com/AndresPatagonico/b3ef.git](https://github.com/AndresPatagonico/b3ef.git)
cd b3ef
npm install

2. Iniciar en modo desarrollo
npm run dev

### Ejecución con Docker y Docker Compose
## Opción A: Ejecución con Docker CLI directo
# Construir la imagen Docker
docker build -t shipnow-api .
# Correr el contenedor enlazando variables de entorno
docker run -d -p 8080:8080 --name shipnow-container --env-file .env shipnow-api

## Opción B: Ejecución con Docker Compose (Recomendado)
# Levantar y construir los servicios en segundo plano (MongoDB + API en modo producción)
docker compose up -d --build
# Ver los logs en tiempo real
docker compose logs -f app
# Detener y remover contenedores y volúmenes
docker compose down -v

### Pruebas Funcionales (Testing)
El proyecto incluye una suite completa de 17 pruebas de integración end-to-end ejecutadas sobre una base de datos aislada (MONGODB_URI_TEST):
npm test

# Ejecución dentro del contenedor Docker:
docker exec -it shipnow-app npm test

## Criterio sobre Endpoints Internos y Documentación en Producción
# Por motivos de seguridad, rendimiento y buenas prácticas en entornos productivos:

Swagger UI (/api/docs), Generador de Mocks (/api/mocks) y Probador de Logger (/api/loggerTest) están habilitados únicamente cuando NODE_ENV !== 'production'.

En entorno de producción (NODE_ENV=production), cualquier intento de acceso a estos endpoints responderá automáticamente con un código de estado 404 Not Found.

## Endpoints Principales
GET /api/health — Verificación pública del estado del servidor (Health Check).

GET /api/products — Listado paginado de productos (máx. 50 por página).

GET /api/orders / POST /api/orders — Gestión de pedidos/envíos.

GET /api/users — Listado paginado de usuarios sin exponer contraseñas.

POST /api/users/:uid/documents — Carga de archivos y comprobantes vía Multer.

POST /api/mocks/seed — Generación de datos simulados (solo en modo desarrollo).

## Aclaraciones sobre Logs y Directorios de Archivos
Logs (/logs): Los archivos .log son generados dinámicamente por Winston y están excluidos del control de versiones (.gitignore).

Subidas (/uploads): La carpeta uploads/ se crea automáticamente si no existe y su contenido está ignorado por Git.