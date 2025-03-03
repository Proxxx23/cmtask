import * as joi from 'joi';

export const createOrderSchema = joi.object({
    customerId: joi.string().uuid().required(),
    products: joi.array().items(joi.object(
        {
            id: joi.string().uuid().required(),
            quantity: joi.number().integer().min(1).required(),
        }
    )).required(),
});
