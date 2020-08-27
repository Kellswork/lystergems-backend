import request from 'supertest';
import app from '../../../server';
import db from '../../../db/dbconfig';
import { hashPassword } from '../../../helpers/baseHelper';

let adminToken;
let userToken;
let dbUser;
let category;
let product;

const user = {
  firstname: 'kells',
  lastname: 'leo',
  email: 'order@gmail.com',
  password: 'pass12345',
  confirmPassword: 'pass12345',
};

const pass = hashPassword(user.password);

beforeAll(async () => {
  await db.raw('truncate users cascade');

  await db.raw(
    `INSERT INTO users (firstname, lastname, email, password, role) 
            VALUES('${user.firstname}', '${user.lastname}', '${user.email}', '${pass}', 'admin')`,
  );

  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .set('content-type', 'application/json')
    .send({ email: user.email, password: user.password });
  adminToken = loginResponse.body.token;

  user.email = 'kelly4eva@gmail.com';
  const userResponse = await request(app)
    .post('/api/v1/auth/register')
    .set('content-type', 'application/json')
    .send(user);

  dbUser = userResponse.body.user;
  userToken = userResponse.body.token;
});

describe('POST to wishlist', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/wishlists`)
      .set({ Accept: 'application/json' })
      .send({ product_id: 5 });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });

  it('should add product to wishlist for the logged in user', async () => {
    category = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'wedding rings' });

    product = await request(app)
      .post(`/api/v1/categories/${category.body.id}/products`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({
        name: 'copy pointsss',
        description: `it's a ring that has a copy ball lol i dunno mehn`,
        quantity: 10,
        price: 2.99,
        is_available: true,
      });
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/wishlists`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ product_id: Number(product.body.product.id) });
    console.log('product_iddd', product.body.product.id);
    expect(response.statusCode).toBe(201);
    expect(response.body.wishlist.product_id).toEqual(product.body.product.id);
    expect(response.body.wishlist.user_id).toEqual(dbUser.id);
    expect(response.body.message).toEqual('Product has been saved to wishlist');
  });
  it('should fail if product_id is empty', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/wishlists`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ product_id: '' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['please input a product id']),
    );
  });
  it('should fail if product id is not a number', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/wishlists`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ product_id: 'many men' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['product id has to be a number']),
    );
  });
  it('should not add product again if it is already in wishlist', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/wishlists`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ product_id: product.body.product.id });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      'product has already been added to wishlist',
    );
  });
});
