import request from 'supertest';
// import { body } from 'express-validator';
import app from '../../../server';
import db from '../../../db/dbconfig';

beforeAll(async () => {
  await db.raw('truncate users cascade');
});

describe('Test for user info', () => {
  it('POST, status 201', async () => {
    const user = {
      firstname: 'kells',
      lastname: 'leo',
      email: 'kelsie@gmail.com',
      password: 'pass12345',
      confirmPassword: 'pass12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual('user created successfully');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('firstname');
    expect(response.body.user).toHaveProperty('lastname');
    expect(response.body.user).toHaveProperty('email');
  });

  it('should return 400 if email has been registered', async () => {
    const user = {
      firstname: 'kells',
      lastname: 'leo',
      email: 'kelsie@gmail.com',
      password: 'pass12345',
      confirmPassword: 'pass12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('email has already been registered');
  });
});
