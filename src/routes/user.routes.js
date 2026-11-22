import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { upload } from '../config/multer.config.js';
import { handleMulterError } from '../middlewares/multerError.middleware.js';

const router = Router();

router.get('/', UserController.getUsers);

router.post(
    '/:uid/documents',
    upload.single('document'),
    handleMulterError,
    UserController.uploadUserDocument
);

export const userRouter = router;