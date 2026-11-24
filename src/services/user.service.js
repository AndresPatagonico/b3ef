import { UserRepository } from '../repositories/user.repository.js';
import { CustomError } from './errors/custom-error.js';
import { EErrors } from './errors/enums.error.js';
import mongoose from 'mongoose';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUsers({ page = 1, limit = 10 } = {}) {
        return await this.userRepository.findAll({ page, limit });
    }

    async createUser(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            CustomError.createError({
                errorEnum: EErrors.INVALID_PARAM_ERROR,
                cause: 'El correo electrónico ya existe.',
                message: 'El correo electrónico ya se encuentra registrado'
            });
        }
        return await this.userRepository.create(userData);
    }

    async uploadUserDocument(uid, file, docType) {
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            CustomError.createError({
                errorEnum: EErrors.INVALID_PARAM_ERROR,
                cause: `El ID de usuario '${uid}' no es un ObjectId de MongoDB válido.`,
                message: 'El ID de usuario provisto no es un ObjectId válido'
            });
        }

        const user = await this.userRepository.findById(uid);
        if (!user) {
            CustomError.createError({
                errorEnum: EErrors.NOT_FOUND_ERROR,
                cause: `No se encontró ningún usuario con el ID '${uid}'.`,
                message: 'El usuario especificado no existe'
            });
        }

        const newDocument = {
            name: file.filename,
            originalName: file.originalname,
            reference: file.path,
            mimeType: file.mimetype,
            size: file.size,
            docType: docType,
            uploadedAt: new Date()
        };

        return await this.userRepository.addDocument(uid, newDocument);
    }
}