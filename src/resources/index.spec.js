import request from 'supertest';
import app from '../server';

describe('Test the root path', () => {
  it('should response the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Welcome to the shopping site');
  });
});
