import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  // Assuming you have auth-related endpoints

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        mobile: '1234567890',
      })
      .expect(201); // Assuming that the status code for a successful signup is 201
  });

  it('/auth/signin (POST)', async () => {
    // Sign in after successful sign-up to check if the user can log in with the registered details
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'john@example.com', password: 'password123' })
      .expect(200); // Assuming that the status code for a successful sign-in is 200

    // Check if response body contains access token
    expect(response.body).toHaveProperty('accessToken');
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('UserProfile (e2e)', () => {
  // Assuming you have user profile-related endpoints and users are authenticated
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Log in to obtain access token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'john@example.com', password: 'password123' });
    accessToken = loginResponse.body.accessToken;
  });

  it('/profile (GET)', () => {
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${accessToken}`) // Use the obtained access token
      .expect(200) // Assuming that the status code for a successful profile retrieval is 200
      .then(response => {
        // Assuming you want to check if certain fields are present in the response
        expect(response.body).toHaveProperty('name', 'John Doe');
        expect(response.body).toHaveProperty('email', 'john@example.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
