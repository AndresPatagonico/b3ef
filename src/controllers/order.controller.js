import { OrderService } from '../services/order.service.js';

const orderService = new OrderService();

export class OrderController {
    
    static async getOrders(req, res, next) {
        try {
            const rawPage = parseInt(req.query.page, 10) || 1;
            const rawLimit = parseInt(req.query.limit, 10) || 10;
            
            // Sanitización y tope máximo estricto de 50 registros por página
            const page = Math.max(1, rawPage);
            const limit = Math.min(Math.max(1, rawLimit), 50);

            const result = await orderService.getOrders({ page, limit });

            return res.status(200).json({ 
                status: 'success', 
                payload: result.docs,
                pagination: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                    limit: result.limit
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async createOrder(req, res, next) {
        try {
            const { user, products, total_price, priority, status } = req.body;

            if (!user || !products || !Array.isArray(products) || products.length === 0 || !total_price) {
                return res.status(400).json({
                    status: 'error',
                    error: 'INVALID_ORDER_DATA',
                    message: 'Datos de pedido incompletos o inválidos'
                });
            }

            const newOrder = await orderService.createOrder({
                user,
                products,
                total_price,
                priority,
                status
            });

            return res.status(201).json({ status: 'success', payload: newOrder });
        } catch (error) {
            next(error);
        }
    }

    static async getOrderById(req, res, next) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);

            return res.status(200).json({ status: 'success', payload: order });
        } catch (error) {
            next(error);
        }
    }

    static async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'INVALID_STATUS',
                    message: `El estado '${status}' no es válido`
                });
            }

            const updatedOrder = await orderService.updateOrderStatus(id, status);
            return res.status(200).json({ status: 'success', payload: updatedOrder });
        } catch (error) {
            next(error);
        }
    }

    static async uploadOrderReceipt(req, res, next) {
        try {
            const { oid } = req.params;
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    status: 'error',
                    error: 'MISSING_FILE',
                    message: 'No se envió ningún archivo en la petición (campo esperado: "receipt")'
                });
            }

            const updatedOrder = await orderService.uploadOrderReceipt(oid, file);

            return res.status(200).json({
                status: 'success',
                message: 'Comprobante subido y registrado correctamente',
                payload: updatedOrder
            });
        } catch (error) {
            next(error);
        }
    }
}