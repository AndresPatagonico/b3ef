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

# Crear la carpeta de uploads para evitar fallos de permisos
RUN mkdir -p uploads/documents uploads/receipts uploads/profiles

# Exponer el puerto
EXPOSE 8080

# Definir la variable de entorno por defecto
ENV NODE_ENV=production

# Comando para arrancar la aplicación
CMD ["npm", "start"]