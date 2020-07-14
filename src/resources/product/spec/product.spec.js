import request from 'supertest';
import app from '../../../server';
import db from '../../../db/dbconfig';
import { hashPassword } from '../../../helpers/baseHelper';

let adminToken;
let userToken;

const user = {
  firstname: 'kells',
  lastname: 'leo',
  email: 'kelsi3rvvt@gmail.com',
  password: 'pass12345',
  confirmPassword: 'pass12345',
};

const product = {
  category_id: 2,
  name: 'ball point',
  description: `it's a ring that has a ball i dunno mehn`,
  quantity: 100,
  price: 2.99,
  is_available: true,
};

const pass = hashPassword(user.password);
beforeAll(async () => {
  await db.raw('truncate users cascade');
  await db.raw('truncate categories cascade');
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
  userToken = userResponse.body.token;
});

describe('Product', () => {
  describe('authentication', () => {
    it('should fail if user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/categories/1/products')
        .set({ Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });

    it('should fail if logged in user is not an admin', async () => {
      const response = await request(app)
        .post('/api/v1/categories/1/products')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(403);
      expect(response.body.error).toEqual(
        'You are not authorized to perform this action.',
      );
    });
    it('should fail if token is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/categories/1/products')
        .set({ 'x-auth-token': 'mumu token lol', Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(401);
    });

    it('should fail if category doesnt exist', async () => {
      const response = await request(app)
        .post('/api/v1/categories/10/products')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(404);
    });

    it('should fail if category id is not a number', async () => {
      const response = await request(app)
        .post('/api/v1/categories/bad_id/products')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(500);
    });

    it('adds a product if logged in user is an admin', async () => {
      const category = await request(app)
        .post('/api/v1/categories')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send({ name: 'wedding rings' });

      const response = await request(app)
        .post(`/api/v1/categories/${category.body.id}/products`)
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send({
          name: 'ball point',
          description: `it's a ring that has a ball i dunno mehn`,
          quantity: 100,
          price: 2.99,
          is_available: true,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toEqual('Product added successfully');
    });
  });

  describe('update product', () => {
    it('should fail if user is not authenticated', async () => {
      const response = await request(app)
        .patch('/api/v1/products/1')
        .set({ Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });

    it('should fail if user is not an admin', async () => {
      const response = await request(app)
        .patch('/api/v1/products/1')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(403);
      expect(response.body.error).toEqual(
        'You are not authorized to perform this action.',
      );
    });

    it('should fail if product id does not exist', async () => {
      const response = await request(app)
        .patch('/api/v1/products/10010')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(404);
    });

    it('should fail if product id is not a number', async () => {
      const response = await request(app)
        .patch('/api/v1/products/bad_id')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(500);
    });

    it('should update the product', async () => {
      const dbProducts = await db.raw('SELECT * FROM products');
      const dbProduct = dbProducts.rows[0];
      const image1 = 'www.image.jpg';
      const description = 'I have been changed!';
      dbProduct.image1 = image1;
      dbProduct.description = description;

      const response = await request(app)
        .patch(`/api/v1/products/${dbProduct.id}`)
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send(dbProduct);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual('Product updated successfully');
      expect(response.body.image1).toEqual(image1);
      expect(response.body.description).toEqual(description);
    });
  });

  describe('validation', () => {
    it('should fail if name is empty', async () => {
      const category = await request(app)
        .post('/api/v1/categories')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send({ name: 'wedding rings' });

      const response = await request(app)
        .post(`/api/v1/categories/${category.body.id}/products`)
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send({ name: '' });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          'Product name must be at least 3 characters long',
        ]),
      );
    });

    it('should fail if product already exists', async () => {
      const category = await request(app)
        .post('/api/v1/categories')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send({ name: 'wedding rings' });

      const response = await request(app)
        .post(`/api/v1/categories/${category.body.id}/products`)
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          'Error: A product with this name already exists',
        ]),
      );
    });
  });
});
