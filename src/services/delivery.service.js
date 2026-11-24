import { DeliveryRepository } from '../repositories/delivery.repository.js';

export class DeliveryService {
    constructor() {
        this.deliveryRepository = new DeliveryRepository();
    }

    async getDeliveries({ page = 1, limit = 10 } = {}) {
        return await this.deliveryRepository.findAll({ page, limit });
    }
}