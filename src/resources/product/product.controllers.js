/* eslint-disable camelcase */
import { addProduct, getAllProductsInaCategory } from './models/index.models';
import { formatResponse } from '../../helpers/baseHelper';
import { getCategoryById } from '../category/models/index.model';

export const createProduct = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
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

    const response = await getCategoryById(categoryId);
    if (!response.length) {
      return formatResponse(
        res,
        { error: 'Could not find category with id' },
        404,
      );
    }

    const product = await addProduct({
      category_id: Number(categoryId),
      name: name.toLowerCase(),
      image1,
      image2,
      image3,
      description,
      quantity: Number(quantity),
      is_available,
      color,
      price: parseFloat(price),
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

export const fetchProductsInaCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await getAllProductsInaCategory(categoryId);
    return formatResponse(
      res,
      { message: 'products fetched succesfully' },
      200,
      {
        products,
      },
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Error getting categories, please try again later' },
      500,
    );
  }
};
