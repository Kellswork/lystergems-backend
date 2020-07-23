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
  shipping_address: 'No 1 my street, my city, ,my state',
  shipping_fee: 3.99,
  total_price: 10.99,
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
        .send({ ...order, products: {} });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });

    it('should fail if products IDs do not exist', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ ...order, products: fakeProducts });
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toEqual('Products Ids do not exist');
    });

    it('should create an order', async () => {
      const dbProducts = await db.raw('SELECT id FROM products');

      const products = dbProducts.rows.map((product, idx) => {
        const prod = {};
        prod.id = product.id;
        prod.quantity = idx + 1;
        prod.total_price = 10.0 + idx * 2;
        return prod;
      });
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ ...order, products });
      console.log(':::::::::::::', response.body);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toEqual('Order created successfully');
    });

    it('should fail if address is empty', async () => {
      const badOrder = { ...order };
      badOrder.shipping_address = '';
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ ...badOrder, products: fakeProducts });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['Please input the shipping address']),
      );
    });

    it('should fail if address is not up to 3 characters', async () => {
      const badOrder = { ...order };
      badOrder.shipping_address = 'No';
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ ...badOrder, products: fakeProducts });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['Address must be at least 3 characters']),
      );
    });

    it('should fail if shipping_fee is empty', async () => {
      const badOrder = { ...order };
      badOrder.shipping_fee = '';
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ ...badOrder, products: fakeProducts });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['Please input the shipping fee']),
      );
    });

    it('should fail if shipping_fee is not a floating number', async () => {
      const badOrder = { ...order };
      badOrder.shipping_fee = '1i';
      const response = await request(app)
        .post('/api/v1/orders')
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ ...badOrder, products: fakeProducts });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['Shipping fee must be a float number']),
      );
    });
  });

  it('should fail if total price is empty', async () => {
    const badOrder = { ...order };
    badOrder.total_price = '';
    const response = await request(app)
      .post('/api/v1/orders')
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...badOrder, products: fakeProducts });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Please input the total price']),
    );
  });

  it('should fail if total price is not a floating number', async () => {
    const badOrder = { ...order };
    badOrder.total_price = '1i';
    const response = await request(app)
      .post('/api/v1/orders')
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...badOrder, products: fakeProducts });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Total price must be a float number']),
    );
  });
});
