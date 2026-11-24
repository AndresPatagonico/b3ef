import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {

    static async getUsers(req, res, next) {
        try {
            const rawPage = parseInt(req.query.page, 10) || 1;
            const rawLimit = parseInt(req.query.limit, 10) || 10;
            
            // Sanitización de paginación: límite estrictamente acotado entre 1 y 50
            const page = Math.max(1, rawPage);
            const limit = Math.min(Math.max(1, rawLimit), 50);

            const result = await userService.getUsers({ page, limit });
            const docs = Array.isArray(result) ? result : (result.docs || []);

            return res.status(200).json({
                status: 'success',
                payload: docs,
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

            // Delegación del chequeo de ObjectId, persistencia y errores estandarizados al UserService
            const updatedUser = await userService.uploadUserDocument(uid, file, docType);

            return res.status(200).json({
                status: 'success',
                message: 'Documento subido y registrado correctamente',
                payload: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }
}