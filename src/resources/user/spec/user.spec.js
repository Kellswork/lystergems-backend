import request from 'supertest';
import app from '../../../server';
import User from '../models/user.model';

beforeAll(async () => {
  await User.raw('truncate users cascade');
});

describe('Test for user info', () => {
  it('POST', async () => {
    const user = {
      firstname: 'kells',
      lastname: 'leo',
      email: 'kelsiie@gmail.com',
      password: 'pass12345',
      confirmPassword: 'pass1234',
    };
    const response = await request(app).post('/api/auth/register').send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual('user created successfully');
  });
});
