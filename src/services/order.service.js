import { OrderRepository } from '../repositories/order.repository.js';
import { CustomError } from './errors/custom-error.js';
import { EErrors } from './errors/enums.error.js';
import mongoose from 'mongoose';

export class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async getOrders({ page = 1, limit = 10 } = {}) {
        return await this.orderRepository.findAll({ page, limit });
    }

    async createOrder(orderData) {
        return await this.orderRepository.create(orderData);
    }

    async getOrderById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            CustomError.createError({
                errorEnum: EErrors.INVALID_PARAM_ERROR,
                cause: `El ID '${id}' no es un ObjectId válido.`,
                message: 'El ID de pedido provisto no es un ObjectId válido'
            });
        }

        const order = await this.orderRepository.findById(id);
        if (!order) {
            CustomError.createError({
                errorEnum: { code: 404, name: 'ORDER_NOT_FOUND' },
                cause: `No existe pedido con ID '${id}'.`,
                message: 'El pedido especificado no existe'
            });
        }
        return order;
    }

    async updateOrderStatus(id, status) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            CustomError.createError({
                errorEnum: EErrors.INVALID_PARAM_ERROR,
                cause: `El ID '${id}' no es un ObjectId válido.`,
                message: 'El ID de pedido provisto no es un ObjectId válido'
            });
        }

        const updatedOrder = await this.orderRepository.updateStatus(id, status);
        if (!updatedOrder) {
            CustomError.createError({
                errorEnum: { code: 404, name: 'ORDER_NOT_FOUND' },
                cause: `No existe pedido con ID '${id}' para actualizar.`,
                message: 'El pedido especificado no existe'
            });
        }
        return updatedOrder;
    }

    async uploadOrderReceipt(oid, file) {
        if (!mongoose.Types.ObjectId.isValid(oid)) {
            CustomError.createError({
                errorEnum: EErrors.INVALID_PARAM_ERROR,
                cause: `El ID '${oid}' no es un ObjectId válido.`,
                message: 'El ID de pedido provisto no es un ObjectId válido'
            });
        }

        const order = await this.orderRepository.findById(oid);
        if (!order) {
            CustomError.createError({
                errorEnum: { code: 404, name: 'ORDER_NOT_FOUND' },
                cause: `No existe pedido con ID '${oid}' para adjuntar comprobante.`,
                message: 'El pedido especificado no existe'
            });
        }

        const newReceipt = {
            name: file.filename,
            originalName: file.originalname,
            reference: file.path,
            mimeType: file.mimetype,
            size: file.size,
            uploadedAt: new Date()
        };

        return await this.orderRepository.addReceipt(oid, newReceipt);
    }
}