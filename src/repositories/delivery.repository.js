import { DeliveryModel } from '../models/delivery.model.js';

export class DeliveryRepository {
    async findAll({ page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            DeliveryModel.find().skip(skip).limit(limit),
            DeliveryModel.countDocuments()
        ]);
        return {
            docs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1
        };
    }
}