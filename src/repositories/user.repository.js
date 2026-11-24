import { UserModel } from '../models/user.model.js';

export class UserRepository {
    async findAll({ page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            UserModel.find().skip(skip).limit(limit),
            UserModel.countDocuments()
        ]);
        return {
            docs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1
        };
    }

    async findByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async findById(id) {
        return await UserModel.findById(id);
    }

    async create(userData) {
        return await UserModel.create(userData);
    }

    async addDocument(uid, documentData) {
        const user = await UserModel.findById(uid);
        if (!user) return null;
        user.documents.push(documentData);
        return await user.save();
    }
}