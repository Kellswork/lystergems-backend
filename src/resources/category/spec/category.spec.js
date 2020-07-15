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

const pass = hashPassword(user.password);
beforeAll(async () => {
  await db.raw('truncate users cascade');
  await db.raw('truncate categories cascade');
  await db.raw(
    `INSERT INTO users (firstname, lastname, email, password, role) VALUES('kells', 'leo', 'kelsi3rvvt@gmail.com', '${pass}', 'admin')`,
  );
  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .set('content-type', 'application/json')
    .send({ email: user.email, password: user.password });
  adminToken = loginResponse.body.token;

  user.email = 'kelsirvy2fc32r@gmail.com';
  const userResponse = await request(app)
    .post('/api/v1/auth/register')
    .set('content-type', 'application/json')
    .send(user);
  userToken = userResponse.body.token;
});

describe('POST Categories', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set({ Accept: 'application/json' })
      .send({ name: 'new category' });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });

  it('should fail if logged in user is not an admin', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ name: 'new category' });
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toEqual(
      'You are not authorized to perform this action',
    );
  });

  it('should fail if token is invalid', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': 'rubbish token', Accept: 'application/json' })
      .send({ name: 'name' });
    expect(response.statusCode).toBe(401);
  });

  it('creates a valid category if logged in user is an admin', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'name' });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual('Category created successfully');
  });

  it('should fail if name is alphanumeric', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'category123' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Name must contain only alphabets']),
    );
  });

  it('should fail if name is empty', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: '' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Category name must be at least 3 characters long',
      ]),
    );
  });

  it('should fail if category already exists', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'name' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Error: A category with this name already exists',
      ]),
    );
  });
});

describe('GET Categories', () => {
  it('should fail if user is not logged in', async () => {
    const response = await request(app)
      .get('/api/v1/categories')
      .set({ Accept: 'application/json' });

    expect(response.statusCode).toBe(401);
  });

  it('should fetch categories if logged in user is not an admin', async () => {
    const response = await request(app)
      .get('/api/v1/categories')
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Categories fetched successfully');
  });

  it('should fail if token is invalid', async () => {
    const response = await request(app)
      .get('/api/v1/categories')
      .set({ 'x-auth-token': 'invalid token', Accept: 'application/json' });

    expect(response.statusCode).toBe(401);
  });

  it('should fetch categories if logged in user is an admin', async () => {
    const response = await request(app)
      .get('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Categories fetched successfully');
    expect(response.body.categories.length).toBe(1);
    expect(response.body.categories[0].name).toEqual('name');
  });
});

describe('Patch Categories', () => {
  it('should fail if token is invalid', async () => {
    const response = await request(app)
      .patch('/api/v1/categories/1')
      .set({ 'x-auth-token': 'invalid token', Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
  });
  it('should fail if logged in user is not an admin', async () => {
    const response = await request(app)
      .patch('/api/v1/categories/1')
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toEqual(
      'You are not authorized to perform this action',
    );
  });

  it('should fail if name is alphanumeric', async () => {
    const response = await request(app)
      .patch('/api/v1/categories/1')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'category123' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Name must contain only alphabets']),
    );
  });

  it('should fail if name is empty', async () => {
    const response = await request(app)
      .patch('/api/v1/categories/1')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: '' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Category name must be at least 3 characters long',
      ]),
    );
  });
  it('should fail if category already exists', async () => {
    const response = await request(app)
      .patch('/api/v1/categories/1')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'name' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Error: A category with this name already exists',
      ]),
    );
  });
  it('should return an error message if category with id is not found', async () => {
    const response = await request(app)
      .patch('/api/v1/categories/2038')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'not found' });
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toEqual('Category with id not found');
  });
  it('should patch categories if logged in user is an admin', async () => {
    const category = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'alte glasses' });
    const response = await request(app)
      .patch(`/api/v1/categories/${category.body.id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'retro glasses' });
    expect(response.statusCode).toBe(202);
    expect(response.body.message).toEqual('Category updated successfully');
  });
});

describe('Delete Categories', () => {
  it('should fail if token is invalid', async () => {
    const response = await request(app)
      .delete('/api/v1/categories/1')
      .set({ 'x-auth-token': 'invalid token', Accept: 'application/json' });
    expect(response.statusCode).toBe(401);
  });
  it('should fail if logged in user is not an admin', async () => {
    const response = await request(app)
      .delete('/api/v1/categories/1')
      .set({ 'x-auth-token': userToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toEqual(
      'You are not authorized to perform this action',
    );
  });
  it('should return a error message if category with id is not found', async () => {
    const response = await request(app)
      .delete('/api/v1/categories/2038')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' });
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toEqual('Category with id not found');
  });
  it('should delete categories if logged in user is an admin', async () => {
    const category = await request(app)
      .post('/api/v1/categories')
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'no more fears' });
    const response = await request(app)
      .delete(`/api/v1/categories/${category.body.id}`)
      .set({ 'x-auth-token': adminToken, Accept: 'application/json' })
      .send({ name: 'retro glasses' });
    expect(response.statusCode).toBe(204);
    expect(response.body.message).toEqual('Category has been deleted');
  });
});
