import request from 'supertest';
import app from '../../../server';
import db from '../../../db/dbconfig';

let dbUser;
let userToken;

beforeAll(async () => {
  await db.raw('truncate users cascade');
});

const user = {
  firstname: 'kells',
  lastname: 'leo',
  email: 'kelsie@gmail.com',
  password: 'pass12345',
  confirmPassword: 'pass12345',
};
describe('Register', () => {
  it('POST, status 201', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    dbUser = response.body.user;
    userToken = response.body.token;
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual('user created successfully');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.firstname).toEqual('kells');
    expect(response.body.user.lastname).toEqual('leo');
    expect(response.body.user.email).toEqual('kelsie@gmail.com');
    expect(response.body).toHaveProperty('token');
  });

  it('should return 400 if email has been registered', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('email has already been registered');
  });

  it('should fail if password and confirmPassword do not match', async () => {
    user.confirmPassword = 'wedonotmatch';
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Password confirmation does not match password']),
    );
  });
});

describe('Login', () => {
  it('logs in a registered user and returns http code 200', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Login successful');
    expect(response.body.user.firstname).toEqual(user.firstname);
    expect(response.body).toHaveProperty('token');
    expect(response.headers).toHaveProperty('x-auth-token');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('fails if no user with this email is registered', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'omenkish@gmail.com', password: user.password });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Invalid Email/Password');
  });

  it('fails if email is not valid', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: '', password: user.password });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Please input a valid email address']),
    );
  });
  it('fails if password is empty', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: '' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining(['Please input a password']),
    );
  });
  it('fails if password is incorrect', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'bad password' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Invalid Email/Password');
  });
});

describe('Profile', () => {
  describe('Fetch Profile', () => {
    it('should fail if user is not authenticated', async () => {
      const response = await request(app).get(
        `/api/v1/users/${dbUser.id}/profile`,
      );
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });
    it('should fail if logged in user is not profile owner', async () => {
      const response = await request(app)
        .get(`/api/v1/users/1111/profile`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        "You cannot access a resource you didn't create",
      );
    });
    it('should return user profile', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${dbUser.id}/profile`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(
        `${[response.body].length} profile found`,
      );
    });
  });
  describe('Update Profile', () => {
    it('should fail if user is not authenticated', async () => {
      const response = await request(app).patch(
        `/api/v1/users/${dbUser.id}/profile`,
      );
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        'Access denied. You are not authorized to access this route',
      );
    });
    it('should fail if logged in user is not profile owner', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/1111/profile`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(
        "You cannot access a resource you didn't create",
      );
    });
    it('should fail if firstname is empty', async () => {
      const duplicateUser = { ...user };
      duplicateUser.firstname = '';
      const response = await request(app)
        .patch(`/api/v1/users/${dbUser.id}/profile/`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ duplicateUser });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['field cannot be empty']),
      );
    });
    it('should fail if lastname is empty', async () => {
      const duplicateUser = { ...user };
      duplicateUser.lastname = '';
      const response = await request(app)
        .patch(`/api/v1/users/${dbUser.id}/profile/`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ duplicateUser });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['lastname must contain only alphabets']),
      );
    });
    it('should fail if email is empty', async () => {
      const duplicateUser = { ...user };
      duplicateUser.email = '';
      const response = await request(app)
        .patch(`/api/v1/users/${dbUser.id}/profile/`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ duplicateUser });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['Please input a valid email address']),
      );
    });
    it('should fail if email is empty', async () => {
      const duplicateUser = { ...user };
      duplicateUser.password = '';
      const response = await request(app)
        .patch(`/api/v1/users/${dbUser.id}/profile/`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send({ duplicateUser });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining(['password must have atleast 5 characters']),
      );
    });
    it('should update profile for the logged in user', async () => {
      const duplicateUser = {
        firstname: 'Boogie',
        lastname: 'SlenderMan',
        email: 'kelsie@gmail.com',
        password: 'pass12345',
        confirmPassword: 'pass12345',
      };
      const response = await request(app)
        .patch(`/api/v1/users/${dbUser.id}/profile`)
        .set({ 'x-auth-token': userToken, Accept: 'application/json' })
        .send(duplicateUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual(
        'Profile has been updated successfully',
      );
      expect(response.body.profile.firstname).toEqual('Boogie');
      expect(response.body.profile.lastname).toEqual('SlenderMan');
      expect(response.body.profile.email).toEqual('kelsie@gmail.com');
    });
  });
});
