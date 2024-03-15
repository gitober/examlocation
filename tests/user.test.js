const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
});

describe('User Routes', () => {

  describe('POST /api/users/signup', () => {
    it('should signup a new user with valid credentials', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'R3g5T7#gh',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        role: 'guest'
      };

      // Act
      const response = await api
        .post('/api/users/signup')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error with invalid credentials', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'invalidpassword'
      };

      // Act
      const response = await api
        .post('/api/users/signup')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return an error when email is missing during signup', async () => {
      // Arrange
      const userData = {
        password: 'R3g5T7#gh'
      };

      // Act
      const response = await api
        .post('/api/users/signup')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return an error when attempting to register with an existing email', async () => {
      // Arrange: Register a user first
      await api
        .post('/api/users/signup')
        .send({ email: 'test@example.com', password: 'R3g5T7#gh' });

      // Arrange: Attempt to register with the same email again
      const userData = {
        email: 'test@example.com',
        password: 'AnotherPassword'
      };

      // Act
      const response = await api
        .post('/api/users/signup')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
  it('should login a user with valid credentials', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'R3g5T7#gh'
    };

    // Act
    const response = await api
      .post('/api/users/login')
      .send(userData);

    // Assert
    expect(response.status).toBe(200); // Corrected the expected status code
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error with invalid credentials', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'invalidpassword'
    };

    // Act
    const response = await api
      .post('/api/users/login')
      .send(userData);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
});

afterAll(() => {
  mongoose.connection.close();
});
