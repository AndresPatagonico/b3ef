# ShipNow - API Backend Profesional

API RESTful profesional para la gestión de envíos, logística, órdenes, usuarios y simulaciones (mocks), desarrollada con Node.js, Express y MongoDB bajo arquitectura en capas.

---

## Arquitectura del Proyecto

El proyecto implementa una **Arquitectura por Capas estricta (Controller → Service → Repository)**:

- **Routers (`/src/routes`)**: Definen las rutas de la API y delegan la ejecución a los controladores.
- **Controllers (`/src/controllers`)**: Manejan las peticiones HTTP, validan la entrada inicial y estructuran las respuestas.
- **Services (`/src/services`)**: Contienen la lógica de negocio pura de la aplicación.
- **Repositories & Models (`/src/repositories`, `/src/models`)**: Abstraen la interacción y persistencia en MongoDB.
- **Middlewares (`/src/middlewares`)**: Manejo global de errores, logs de peticiones y carga de archivos con Multer.

---

## Tecnologías Utilizadas

- **Entorno:** Node.js (v20+), Express.js
- **Base de Datos:** MongoDB, Mongoose ORM
- **Documentación:** Swagger UI, OpenAPI 3.0 (`swagger-ui-express`)
- **Logging:** Winston (`winston-daily-rotate-file` / consola en desarrollo)
- **Carga de Archivos:** Multer
- **Testing:** Mocha, Chai, Supertest (17/17 tests funcionales)
- **Containerización:** Docker, Docker Compose

---

## Variables de Entorno

Copiar el archivo `.env.example` a `.env` y configurar las variables requeridas:

```bash
cp .env.example .env


# Variable          Descripción                                 Valor Por Defecto
# PORT              Puerto donde corre la API                   8080
# NODE_ENV          Entorno (development / production / test)   development
# MONGO_URI         Cadena de conexión a MongoDB                mongodb://localhost:27017/shipnow
# MAX_FILE_SIZE_MB  Límite máximo para subida de archivos (MB)  5

### Instalación y Ejecución Local
1. Clonar e instalar dependencias
git clone [https://github.com/AndresPatagonico/b3pe8.git](https://github.com/AndresPatagonico/b3pe8.git)
cd b3pe8
npm install

2. Iniciar en modo desarrollo
npm run dev

### Ejecución con Docker Compose (Recomendado)
# Inicia tanto la base de datos MongoDB como la aplicación backend con un solo comando:
# Levantar los servicios en segundo plano
docker compose up -d
# Ver los logs en tiempo real
docker compose logs -f app
# Detener los servicios
docker compose down

### Pruebas Funcionales (Testing)
El proyecto incluye una suite completa de pruebas de integración end-to-end:
npm test

### Documentación de la API (Swagger)
Con el servidor corriendo (en entorno distinto de production), podés acceder a la interfaz interactiva de Swagger UI en:

# -> http://localhost:8080/api/docs/

Endpoints Principales:
GET /api/health — Verificación del estado del servidor.

POST /api/mocks/seed — Generación de datos simulados.

GET /api/orders / POST /api/orders — Gestión de pedidos/envíos.

POST /api/users/:uid/documents — Carga de archivos y comprobantes (Multer).

GET /api/test-logger — Pruebas del sistema de logging centralizado.

Aclaraciones sobre Logs y Directorios de Archivos
Logs (/logs): Los archivos .log son generados dinámicamente por Winston y están excluidos del control de versiones (.gitignore).
Subidas (/uploads): La carpeta uploads/ se crea automáticamente al arrancar la aplicación si no existe. Se encuentra saneada de archivos temporales de prueba.