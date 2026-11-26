import { logger } from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
    // Captura de payload excedido generado por express.json() / body-parser
    if (error.type === 'entity.too.large' || error.status === 413 || error.statusCode === 413) {
        logger.error(`Error de cliente [PAYLOAD_TOO_LARGE]: El cuerpo de la petición excede el límite de 100kb`);
        return res.status(413).json({
            status: 'error',
            error: 'PAYLOAD_TOO_LARGE',
            message: 'El tamaño de la petición excede el límite permitido (máximo 100kb).'
        });
    }

    const statusCode = error.code || error.status || error.statusCode || 500;
    const errorName = error.name || 'InternalServerError';

    // Clasificación de logs según severidad
    if (statusCode >= 500) {
        logger.fatal(`Falla crítica del sistema [${errorName}]: ${error.message} - Stack: ${error.stack}`);
    } else if (statusCode >= 400 && statusCode < 500) {
        logger.error(`Error de cliente [${errorName}]: ${error.message}`);
    } else {
        logger.warning(`Advertencia [${errorName}]: ${error.message}`);
    }

    return res.status(statusCode).json({
        status: 'error',
        error: errorName,
        message: error.message,
        cause: error.cause || null
    });
};