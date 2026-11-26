import { ProductModel } from '../models/product.model.js';

export class ProductRepository {
    async findAll({ page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            ProductModel.find().skip(skip).limit(limit).lean(),
            ProductModel.countDocuments()
        ]);
        return {
            docs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1
        };
    }

    async findById(id) {
        return await ProductModel.findById(id).lean();
    }

    async create(productData) {
        return await ProductModel.create(productData);
    }
}