import mongoose from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { logger } from '../utils/logger.js';

export class UserController {

    static async getUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;

            const [users, total] = await Promise.all([
                UserModel.find().skip(skip).limit(limit),
                UserModel.countDocuments()
            ]);

            return res.status(200).json({
                status: 'success',
                payload: users,
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit) || 1,
                    limit
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async uploadUserDocument(req, res, next) {
        try {
            const { uid } = req.params;
            const file = req.file;
            const { docType } = req.body;

            if (!file) {
                return res.status(400).json({
                    status: 'error',
                    error: 'MISSING_FILE',
                    message: 'No se envió ningún archivo en la petición (campo esperado: "document")'
                });
            }

            const validDocTypes = ['DNI', 'Licencia', 'Comprobante', 'CUIT'];
            if (!docType || !validDocTypes.includes(docType)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'INVALID_DOC_TYPE',
                    message: `El tipo de documento '${docType}' es inválido o no fue provisto`
                });
            }

            if (!mongoose.Types.ObjectId.isValid(uid)) {
                return res.status(400).json({
                    status: 'error',
                    error: 'INVALID_ID',
                    message: 'El ID de usuario provisto no es un ObjectId válido'
                });
            }

            const user = await UserModel.findById(uid);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    error: 'USER_NOT_FOUND',
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

            user.documents.push(newDocument);
            await user.save();

            logger.info(`Documento '${docType}' subido exitosamente para el usuario ${uid}`);

            return res.status(200).json({
                status: 'success',
                message: 'Documento subido y registrado correctamente',
                payload: user
            });
        } catch (error) {
            next(error);
        }
    }
}