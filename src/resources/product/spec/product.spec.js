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
  await db.raw(
    `INSERT INTO users (firstname, lastname, email, password, role) VALUES('kells', 'leo', 'kelsi3rvvt@gmail.com', '${pass}', 'admin')`,
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
        .post('/api/v1/product')
        .set({ Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });

    it('should fail if logged in user is not an admin', async () => {
      const response = await request(app)
        .post('/api/v1/product')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(403);
      expect(response.body.error).toEqual(
        'You are not authorized to perform this action.',
      );
    });
    it('should fail if token is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/product')
        .set({ 'x-auth-token': 'mumu token lol', Accept: 'application/json' })
        .send(product);
      expect(response.statusCode).toBe(401);
    });

    it('adds a product if logged in user is an admin', async () => {
      const category = await request(app)
        .post('/api/v1/categories')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send({ name: 'wedding rings' });

      const response = await request(app)
        .post('/api/v1/product')
        .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
        .send({
          category_id: category.body.id,
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

  describe('validation', () => {
    it('should fail if name is empty', async () => {
      const response = await request(app)
        .post('/api/v1/product')
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
      const response = await request(app)
        .post('/api/v1/product')
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
