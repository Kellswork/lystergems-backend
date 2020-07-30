import request from 'supertest';
import app from '../../../server';
import db from '../../../db/dbconfig';
import { hashPassword } from '../../../helpers/baseHelper';

let userToken;
let adminToken;
let otherUserToken;
let newOrder;

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

const pass = hashPassword(user.password);
beforeAll(async () => {
  await db.raw('truncate users cascade');
  await db.raw('truncate orders cascade');
  await db.raw(
    `INSERT INTO users (firstname, lastname, email, password, role) VALUES('kells1', 'leo1', 'order@gmail1.com', '${pass}', 'admin')`,
  );

  const cat = await db.raw(
    `INSERT INTO categories (name) VALUES('kells1') returning id`,
  );

  await db.raw(
    `INSERT INTO products (category_id, name, description, quantity, price) VALUES ('${cat.rows[0].id}','new name', 'new description', '13', '14.99')`,
  );
  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .set('content-type', 'application/json')
    .send({ email: 'order@gmail1.com', password: user.password });
  adminToken = loginResponse.body.token;

  user.email = 'kelly4eva@gmail.com';
  const userResponse = await request(app)
    .post('/api/v1/auth/register')
    .set('content-type', 'application/json')
    .send(user);
  userToken = userResponse.body.token;

  user.email = 'aloy@gmail.com';
  const otherUserResponse = await request(app)
    .post('/api/v1/auth/register')
    .set('content-type', 'application/json')
    .send(user);
  otherUserToken = otherUserResponse.body.token;
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

      newOrder = response.body.order;
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

describe('PATCH order', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app)
      .patch(`/api/v1/orders/${newOrder.id}`)
      .set({ Accept: 'application/json' })
      .send({ status: 'pending' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });

  it('should fail if user is not an admin', async () => {
    const response = await request(app)
      .patch(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ status: 'pending' });
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toEqual(
      'You are not authorized to perform this action',
    );
  });

  it('should fail if status provided is not valid', async () => {
    const response = await request(app)
      .patch(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ status: 'transit' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Status is not valid');
  });

  it('should fail if order does not exist', async () => {
    const response = await request(app)
      .patch(`/api/v1/orders/${newOrder.id * 14}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ status: 'in_transit' });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Order not found');
  });

  it('should fail if updated status is not "in_transit"', async () => {
    const response = await request(app)
      .patch(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ status: 'delivered' });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      'The status of this order cannot be updated to delivered',
    );
  });

  it('should fail if updated status is not "delivered"', async () => {
    const updateOrder = await db.raw(
      `UPDATE orders SET status = 'in_transit' WHERE id='${newOrder.id}' returning *`,
    );

    const updatedOrder = updateOrder.rows[0];
    newOrder = updatedOrder;
    const response = await request(app)
      .patch(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ status: 'in_transit' });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      'The status of this order cannot be updated to in_transit',
    );
  });

  it('should update status', async () => {
    const response = await request(app)
      .patch(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ status: 'delivered' });
    expect(response.statusCode).toBe(200);
    expect(response.body.order.status).toEqual('delivered');
    expect(response.body.message).toEqual('Order status successfully updated');
  });

  it('should fail if order is canceled', async () => {
    const updateOrder = await db.raw(
      `UPDATE orders SET status = 'cancelled' WHERE id='${newOrder.id}' returning id`,
    );

    const { id } = updateOrder.rows[0];
    const response = await request(app)
      .patch(`/api/v1/orders/${id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ status: 'in_transit' });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Cannot update a cancelled order');
  });

  it('should fail if order is delivered', async () => {
    const updateOrder = await db.raw(
      `UPDATE orders SET status = 'delivered' WHERE id='${newOrder.id}' returning id`,
    );

    const { id } = updateOrder.rows[0];
    const response = await request(app)
      .patch(`/api/v1/orders/${id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ status: 'in_transit' });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Cannot update a delivered order');
  });
});

describe('GET orders', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app)
      .get(`/api/v1/orders/${newOrder.id}`)
      .set({ Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });

  it('should fail if order does not exist', async () => {
    const response = await request(app)
      .get(`/api/v1/orders/${newOrder.id * 5}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Order not found');
  });

  it('should fail if order id is not an integer', async () => {
    const response = await request(app)
      .get('/api/v1/orders/900p')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toEqual('An error occurred');
  });

  it('should fail if user is neither owner nor admin', async () => {
    const response = await request(app)
      .get(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': otherUserToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'You are not allowed to access this order',
    );
  });

  it('should fetch order if user is the owner', async () => {
    const response = await request(app)
      .get(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.order.id).toEqual(newOrder.id);
    expect(response.body.message).toEqual('Order fetched successfully');
  });

  it('should fail if there is no product', async () => {
    await db.raw('DELETE FROM products');
    const response = await request(app)
      .get(`/api/v1/orders/${newOrder.id}`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toEqual(
      'Cannot fetch order at the moment, try again later',
    );
  });
});
