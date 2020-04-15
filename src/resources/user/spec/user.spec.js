import request from 'supertest';
// import { body } from 'express-validator';
import app from '../../../server';
import db from '../../../db/dbconfig';

beforeAll(async () => {
  await db.raw('truncate users cascade');
});

// I'll convert this to use async
describe('Test for user info', () => {
  it('POST', () => {
    const user = {
      firstname: 'kells',
      lastname: 'leo',
      email: 'kelsie@gmail.com',
      password: 'pass12345',
      confirmPassword: 'pass12345',
    };
    return request(app)
      .post('/api/v1/auth/register')
      .send(user)
      .expect('Content-Type', /json/)
      .then((response) => {
        console.log(response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual('user created successfully');
      });
  });
});
