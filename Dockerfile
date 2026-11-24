# Imagen base liviana de Node.js
FROM node:20-alpine

# Definir directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Crear carpetas de uploads y asignar permisos al usuario node
RUN mkdir -p uploads/documents uploads/receipts uploads/profiles && \
    chown -R node:node /app

# Cambiar a usuario sin privilegios por seguridad
USER node

# Exponer el puerto
EXPOSE 8080

# Definir la variable de entorno por defecto
ENV NODE_ENV=production

# Chequeo de salud del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Comando de inicio del servidor
CMD ["node", "src/server.js"]