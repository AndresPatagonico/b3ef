import { OrderModel } from '../models/order.model.js';

export class OrderRepository {
    async findAll({ page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            OrderModel.find().skip(skip).limit(limit),
            OrderModel.countDocuments()
        ]);
        return {
            docs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1
        };
    }

    async create(orderData) {
        return await OrderModel.create(orderData);
    }

    async findById(id) {
        return await OrderModel.findById(id);
    }

    async updateStatus(id, status) {
        return await OrderModel.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: 'after' }
        );
    }

    async addReceipt(oid, receiptData) {
        const order = await OrderModel.findById(oid);
        if (!order) return null;
        order.receipts.push(receiptData);
        return await order.save();
    }
}