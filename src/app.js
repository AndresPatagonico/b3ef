import express from 'express';
import { productRouter } from './routes/product.routes.js';
import { userRouter } from './routes/user.routes.js';
import { mockRouter } from './routes/mock.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { logger } from './utils/logger.js';
import { loggerRouter } from './routes/logger.routes.js';
import { setupSwagger } from './config/swagger.config.js';
import { orderRouter } from './routes/order.routes.js';
import { deliveryRouter } from './routes/delivery.routes.js';
import { validateEnv, config } from './config/env.config.js';
import fs from 'fs';
import path from 'path';

const app = express();

validateEnv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de Health Check (Disponible en todos los entornos)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        environment: config.env,
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString()
    });
});

// Rutas de Producción
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/deliveries', deliveryRouter);

// Rutas e interfaces exclusivas para Desarrollo y Testing (Deshabilitadas en Producción)
if (config.env !== 'production') {
    setupSwagger(app);
    app.use('/api/mocks', mockRouter);
    app.use('/api/loggerTest', loggerRouter);
    app.use('/api', loggerRouter);
}

app.get('/', (req, res) => {
    logger.http('Acceso a ruta raíz /');
    res.json({ status: 'success', message: 'API ShipNow funcionando correctamente' });
});

app.use(errorHandler);

const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

export default app;