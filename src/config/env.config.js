import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'PORT'];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
        console.error(`❌ ERROR CRÍTICO: Faltan las siguientes variables de entorno: ${missing.join(', ')}`);
        process.exit(1);
    }
};

export const config = {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGODB_URI,
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
};