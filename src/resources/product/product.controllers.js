/* eslint-disable camelcase */
import { addProduct } from './models/index.models';
import { formatResponse } from '../../helpers/baseHelper';

const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      image1,
      image2,
      image3,
      description,
      quantity,
      is_available,
      color,
      price,
      size,
    } = req.body;
    const product = await addProduct({
      category_id,
      name: name.toLowerCase(),
      image1,
      image2,
      image3,
      description,
      quantity,
      is_available,
      color,
      price,
      size,
    });

    const data = {
      product,
    };
    return formatResponse(
      res,
      { message: 'Product added successfully' },
      201,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not add product, please try again later' },
      500,
    );
  }
};

export default createProduct;
