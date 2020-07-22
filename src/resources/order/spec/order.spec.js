import request from 'supertest';
import app from '../../../server';
import db from '../../../db/dbconfig';

let userToken;

const user = {
  firstname: 'kells',
  lastname: 'leo',
  email: 'order@gmail.com',
  password: 'pass12345',
  confirmPassword: 'pass12345',
};

const order = {
  status: 'pending',
  shipping_address: 'No 1 my street, my city, ,my state',
  shipping_fee: 3.99,
};

beforeAll(async () => {
  await db.raw('truncate users cascade');
  await db.raw('truncate orders cascade');

  user.email = 'kelly4eva@gmail.com';
  const userResponse = await request(app)
    .post('/api/v1/auth/register')
    .set('content-type', 'application/json')
    .send(user);
  userToken = userResponse.body.token;
});

describe('POST Order', () => {
  describe('Authentication', () => {
    it('should fail if user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ Accept: 'application/json' })
        .send(order);
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });

    it('should create an order', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send(order);
      expect(response.statusCode).toBe(201);
    });
  });
});
