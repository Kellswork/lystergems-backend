/* eslint-disable camelcase */
import {
  addProduct,
  getAllProductsInaCategory,
  getProductByAttribute,
  updateProduct,
  deleteProduct,
} from './models/index.models';
import { formatResponse } from '../../helpers/baseHelper';
import { getCategoryByAttribute } from '../category/models/index.model';

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

    const response = await getCategoryByAttribute({ id: categoryId });
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
      { error: 'Error getting products, please try again later' },
      500,
    );
  }
};

export const fetchOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByAttribute({ id });
    return formatResponse(
      res,
      { message: 'product fetched succesfully' },
      200,
      {
        product: product[0],
      },
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Error getting products, please try again later' },
      500,
    );
  }
};
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await updateProduct(id, req.body);

    return formatResponse(
      res,
      { message: 'Product updated successfully' },
      200,
      response[0],
    );
  } catch (error) {
    return formatResponse(res, { error: 'Unable to update this product' }, 500);
  }
};

export const removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProduct(id);

    return formatResponse(
      res,
      { message: 'Product deleted successfully' },
      204,
    );
  } catch (error) {
    return formatResponse(res, { error: 'Unable to delete this product' }, 500);
  }
};
