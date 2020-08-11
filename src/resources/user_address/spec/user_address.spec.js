import request from 'supertest';
import app from '../../../server';
import db from '../../../db/dbconfig';

let userToken;
let dbUser;

const user = {
  firstname: 'kells',
  lastname: 'leo',
  email: 'order@gmail.com',
  password: 'pass12345',
  confirmPassword: 'pass12345',
};

const address = {
  phone_number: '008812343353',
  street_address: '123 my street, my street',
  city: 'my city',
  state: 'My state',
  country: 'My country',
  zipcode: '123456',
};
const addressUpdate = {
  phone_number: '008812343353',
  street_address: '123 my street, my street',
  city: 'myy city',
  state: 'Myy state',
  country: 'Myy country',
  zipcode: '123456',
};

beforeAll(async () => {
  await db.raw('truncate users cascade');

  user.email = 'kelly4eva@gmail.com';
  const userResponse = await request(app)
    .post('/api/v1/auth/register')
    .set('content-type', 'application/json')
    .send(user);

  dbUser = userResponse.body.user;
  userToken = userResponse.body.token;
});

describe('CREATE Address', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ Accept: 'application/json' })
      .send({ ...address });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });

  it('should create an address for the logged in user', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...address });
    expect(response.statusCode).toBe(201);
    expect(response.body.userAddress.city).toEqual(address.city);
    expect(response.body.message).toEqual(
      'Address has been added successfully',
    );
  });

  it('should fail if phone number is empty', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['please input a valid phone number']),
    );
  });

  it('should fail if phone number is empty', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['please input a valid phone number']),
    );
  });

  it('should fail if phone number is too long', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '1234567808765435678';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of phone number reached']),
    );
  });

  it('should fail if street address is empty', async () => {
    const newAddress = { ...address };
    newAddress.street_address = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['street address cannot be empty']),
    );
  });

  it('should fail if street address is too long', async () => {
    const newAddress = { ...address };
    newAddress.street_address = 'hello there,'.trim().repeat(10);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Street address should be at most 100 characters',
      ]),
    );
  });

  it('should fail if city is empty', async () => {
    const newAddress = { ...address };
    newAddress.city = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['City cannot be empty']),
    );
  });

  it('should fail if city is too long', async () => {
    const newAddress = { ...address };
    newAddress.city = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of characters reached']),
    );
  });

  it('should fail if state is empty', async () => {
    const newAddress = { ...address };
    newAddress.state = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot be empty']),
    );
  });

  it('should fail if state is too long', async () => {
    const newAddress = { ...address };
    newAddress.state = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot exceed 50 characters']),
    );
  });

  it('should fail if country is empty', async () => {
    const newAddress = { ...address };
    delete newAddress.country;
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot be empty']),
    );
  });

  it('should fail if country is too long', async () => {
    const newAddress = { ...address };
    newAddress.country = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot exceed 50 characters']),
    );
  });
});

describe('UPDATE Address', () => {
  it('should fail if user is not authenticated', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ Accept: 'application/json' })
      .send({ ...addressUpdate });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toEqual(
      'Access denied. You are not authorized to access this route',
    );
  });
  it('should fail if loggedin user id is not the same as the user id saved', async () => {
    const data = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...address });

    const response = await request(app)
      .post(`/api/v1/users/3/address/${data}`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...addressUpdate });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual(
      "You cannot update an address you didn't create",
    );
  });
  it('should update an address for the logged in user', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address/10`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...addressUpdate });
    expect(response.statusCode).toBe(200);
    expect(response.body.userAddress.city).toEqual(address.city);
    expect(response.body.message).toEqual(
      'Address has been updated successfully',
    );
  });

  it('should fail if phone number is empty', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['please input a valid phone number']),
    );
  });

  it('should fail if phone number is too long', async () => {
    const newAddress = { ...address };
    newAddress.phone_number = '1234567808765435678';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of phone number reached']),
    );
  });

  it('should fail if street address is empty', async () => {
    const newAddress = { ...address };
    newAddress.street_address = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['street address cannot be empty']),
    );
  });

  it('should fail if street address is too long', async () => {
    const newAddress = { ...address };
    newAddress.street_address = 'hello there,'.trim().repeat(10);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        'Street address should be at most 100 characters',
      ]),
    );
  });

  it('should fail if city is empty', async () => {
    const newAddress = { ...address };
    newAddress.city = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['City cannot be empty']),
    );
  });

  it('should fail if city is too long', async () => {
    const newAddress = { ...address };
    newAddress.city = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['maximum length of characters reached']),
    );
  });

  it('should fail if state is empty', async () => {
    const newAddress = { ...address };
    newAddress.state = '';
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot be empty']),
    );
  });

  it('should fail if state is too long', async () => {
    const newAddress = { ...address };
    newAddress.state = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['State cannot exceed 50 characters']),
    );
  });

  it('should fail if country is empty', async () => {
    const newAddress = { ...address };
    delete newAddress.country;
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot be empty']),
    );
  });

  it('should fail if country is too long', async () => {
    const newAddress = { ...address };
    newAddress.country = 'hello there,I'.trim().repeat(4);
    const response = await request(app)
      .post(`/api/v1/users/${dbUser.id}/address`)
      .set({ 'x-auth-token': userToken, Accept: 'application/json' })
      .send({ ...newAddress });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Country cannot exceed 50 characters']),
    );
  });
});
