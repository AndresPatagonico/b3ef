import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
    static async getProducts(req, res, next) {
        try {
            const rawPage = parseInt(req.query.page, 10) || 1;
            const rawLimit = parseInt(req.query.limit, 10) || 10;
            
            // Sanitización y tope máximo estricto de 50 registros por página
            const page = Math.max(1, rawPage);
            const limit = Math.min(Math.max(1, rawLimit), 50);

            const result = await productService.getProducts({ page, limit });
            
            return res.status(200).json({ 
                status: 'success', 
                payload: result.docs || result,
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

    static async createProduct(req, res, next) {
        try {
            const newProduct = await productService.createProduct(req.body);
            return res.status(201).json({ status: 'success', payload: newProduct });
        } catch (error) {
            next(error);
        }
    }
}