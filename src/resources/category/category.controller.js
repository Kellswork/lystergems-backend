import { createCategory } from './models/index.model';
import { formatResponse } from '../../helpers/baseHelper';

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await createCategory({ name: name.toLowerCase() });

    const data = {
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
    return formatResponse(
      res,
      { message: 'Category created successfully' },
      201,
      data,
    );
  } catch (error) {
    // console.log(error);
    return formatResponse(
      res,
      { error: 'could not create category, please try again later' },
      500,
    );
  }
};

export default addCategory;
