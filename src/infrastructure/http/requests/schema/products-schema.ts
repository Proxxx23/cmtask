import * as joi from 'joi';
import {MAX_STOCK_LEVEL} from '../../../../domain/product/validators';

// todo: think for something like joi-extract-type library to extract types out of schemas

export const createProductSchema = joi.object({
  name: joi.string().max(50).required(),
  description: joi.string().max(50).required(),
  price: joi.number().positive().required(),
  stock: joi.number().positive().max(MAX_STOCK_LEVEL).required(),
  productCategoryId: joi.string().uuid().required(),
});

export const changeProductStockLevelSchema = joi.object({
    stock: joi.number().positive().max(MAX_STOCK_LEVEL).required(),
});
