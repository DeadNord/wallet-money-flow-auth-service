import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser('f343f3f')); // Use cookieParser with your secret
    await app.init();
  });

  it('/auth/signUp (POST) - User registration', async () => {
    const randomSuffix = Date.now(); // Ensures uniqueness of the email
    await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({
        name: `John Doe ${randomSuffix}`,
        email: `john${randomSuffix}@example.com`,
        password: 'password123',
        mobile: '1234567890',
      })
      .expect(201); // Checks that the registration was successful
  });

  it('/auth/signIn (POST) - User login', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({
        email: 'john@example.com',
        password: 'password123',
      })
      .expect(200); // Checks that the login was successful

    expect(loginResponse.body).toHaveProperty('accessToken');
    accessToken = loginResponse.body.accessToken; // Store the accessToken for subsequent tests
    // Extract refreshToken from the set-cookie header
    const cookies = Array.isArray(loginResponse.headers['set-cookie'])
      ? loginResponse.headers['set-cookie']
      : [loginResponse.headers['set-cookie']]; // Ensure it's an array
    cookies.forEach((cookie: string) => {
      if (cookie.startsWith('refreshToken=')) {
        const refreshTokenCookie = cookie.split(';')[0]; // Get the cookie string before ';'
        refreshToken = refreshTokenCookie.split('=')[1]; // Extract the token value
      }
    });
    expect(refreshToken).not.toBe('');
  });

  it('/auth/refresh (GET) - Refresh access token', async () => {
    const refreshResponse = await request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200); // Checks that the token was successfully refreshed

    expect(refreshResponse.body).toHaveProperty('accessToken');
  });

  it('/auth/user (GET) - Get current user info', async () => {
    const userResponse = await request(app.getHttpServer())
      .get('/auth/user')
      .set('Authorization', `Bearer ${accessToken}`) // Use accessToken for authentication
      .expect(200); // Checks that the user information was successfully retrieved

    expect(userResponse.body).toHaveProperty('name');
    expect(userResponse.body).toHaveProperty('email');
    expect(userResponse.body).toHaveProperty('mobile');
  });

  it('/auth/access (GET) - Get current user access information', async () => {
    const accessResponse = await request(app.getHttpServer())
      .get('/auth/access')
      .set('Authorization', `Bearer ${accessToken}`) // Use accessToken for authentication
      .expect(200); // Checks that the user access information was successfully retrieved

    expect(accessResponse.body).toHaveProperty('id');
  });

  it('/auth/signOut (POST) - User logout', async () => {
    await request(app.getHttpServer())
      .post('/auth/signOut')
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(204); // Checks that the logout was successful
  });

  afterAll(async () => {
    await app.close();
  });
});
