import { DeliveryService } from '../services/delivery.service.js';

const deliveryService = new DeliveryService();

export class DeliveryController {
    static async getDeliveries(req, res, next) {
        try {
            const rawPage = parseInt(req.query.page, 10) || 1;
            const rawLimit = parseInt(req.query.limit, 10) || 10;
            
            // Sanitización y tope máximo estricto de 50 registros por página
            const page = Math.max(1, rawPage);
            const limit = Math.min(Math.max(1, rawLimit), 50);

            const result = await deliveryService.getDeliveries({ page, limit });

            return res.status(200).json({ 
                status: 'success', 
                payload: result.docs || result,
                pagination: result.totalPages ? {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                    limit: result.limit
                } : undefined
            });
        } catch (error) {
            next(error);
        }
    }
}