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

const fakeProducts = [
  { id: 1, quantity: 2 },
  { id: 3, quantity: 5 },
  { id: 14, quantity: 45 },
];

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
        .send({ order, products: {} });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });

    it('should fail if products IDs do not exist', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ order, products: fakeProducts });
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toEqual('Products Ids do not exist');
    });

    it('should create an order', async () => {
      const dbProducts = await db.raw('SELECT id FROM products');

      const products = dbProducts.rows.map((product, idx) => {
        const prod = {};
        prod.id = product.id;
        prod.quantity = idx + 1;
        return prod;
      });
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ order, products });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toEqual('Order created successfully');
    });
  });
});
