import { ProductRepository } from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../utils/constants.js';
import { CustomError } from './errors/custom-error.js';
import { EErrors } from './errors/enums.error.js';

export class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getProducts({ page = 1, limit = 10 } = {}) {
        return await this.productRepository.findAll({ page, limit });
    }

    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            CustomError.createError({
                errorEnum: EErrors.NOT_FOUND_ERROR,
                cause: `No existe un producto con el ID '${id}'.`,
                message: 'El producto no existe'
            });
        }
        return product;
    }

    async createProduct(productData) {
        if (productData.stock === 0) {
            productData.status = PRODUCT_STATUS.OUT_OF_STOCK;
        }
        return await this.productRepository.create(productData);
    }
}