import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Mock data
const userArray = [
  {
    _id: '1',
    name: 'Test User 1',
    email: 'test1@example.com',
    password: 'pass123',
    mobile: '1234567890',
  },
  {
    _id: '2',
    name: 'Test User 2',
    email: 'test2@example.com',
    password: 'pass123',
    mobile: '0987654321',
  },
];

const userDocumentArray = userArray.map(user => ({
  ...user,
  _id: user._id.toString(), // Mock Mongoose Types.ObjectId
  updateOne: jest.fn(),
}));

const mockUserModel = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mock before each test
    mockUserModel.findOne.mockReset();
    mockUserModel.findOneAndUpdate.mockReset();
    mockUserModel.findByIdAndUpdate.mockReset();
    mockUserModel.create.mockReset();
  });

  describe('signIn', () => {
    // it('should throw an error if email does not exist', async () => {
    //   mockUserModel.findOne.mockResolvedValue(null);
    //   await expect(
    //     service.signIn({
    //       email: 'nonexistent@example.com',
    //       password: 'pass123',
    //     }),
    //   ).rejects.toThrow(UnauthorizedException);
    // });
    // it('should throw an error if password is wrong', async () => {
    //   mockUserModel.findOne.mockResolvedValue(userDocumentArray[0]);
    //   const mockCompare = jest.spyOn(bcrypt, 'compare') as jest.Mock;
    //   mockCompare.mockResolvedValue(false);
    //   await expect(
    //     service.signIn({
    //       email: 'test1@example.com',
    //       password: 'wrongpassword',
    //     }),
    //   ).rejects.toThrow(UnauthorizedException);
    // });
    // it('should return tokens for valid sign in', async () => {
    //   mockUserModel.findOne.mockResolvedValue(userDocumentArray[0]);
    //   const mockBcryptCompare = jest.spyOn(bcrypt, 'compare') as jest.Mock;
    //   mockBcryptCompare.mockResolvedValue(true);
    //   jest.spyOn(jwt, 'sign').mockImplementation(() => 'token');
    //   const tokens = await service.signIn({
    //     email: 'test1@example.com',
    //     password: 'pass123',
    //   });
    //   expect(tokens).toHaveProperty('accessToken');
    //   expect(tokens).toHaveProperty('refreshToken');
    // });
  });

  describe('signUp', () => {
    // it('should throw an error if email already exists', async () => {
    //   mockUserModel.findOne.mockResolvedValue(userDocumentArray[0]);
    //   await expect(
    //     service.signUp({
    //       name: 'Test User 3',
    //       email: 'test1@example.com',
    //       mobile: '1111111111',
    //       password: 'pass123',
    //     }),
    //   ).rejects.toThrow(UnauthorizedException);
    // });
    // it('should create a new user with hashed password', async () => {
    //   mockUserModel.findOne.mockResolvedValue(null);
    //   const mockBcryptHash = jest.spyOn(bcrypt, 'hash') as jest.Mock;
    //   mockBcryptHash.mockResolvedValue('hashedPassword');
    //   mockUserModel.create.mockResolvedValue(userDocumentArray[0]);
    //   await service.signUp({
    //     name: 'Test User 3',
    //     email: 'new@example.com',
    //     mobile: '2222222222',
    //     password: 'pass123',
    //   });
    //   expect(mockUserModel.create).toHaveBeenCalledWith({
    //     name: 'Test User 3',
    //     email: 'new@example.com',
    //     mobile: '2222222222',
    //     password: 'hashedPassword',
    //   });
    // });
  });

  describe('signOut', () => {
    // it('should clear user tokens', async () => {
    //   mockUserModel.findOneAndUpdate.mockResolvedValue(userDocumentArray[0]);
    //   await service.signOut('aRefreshToken');
    //   expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
    //     { refreshToken: 'aRefreshToken' },
    //     { accessToken: null, refreshToken: null },
    //   );
    // });
    // it('should throw an error if sign out is attempted with an invalid token', async () => {
    //   mockUserModel.findOneAndUpdate.mockResolvedValue(null);
    //   await expect(service.signOut('invalidToken')).rejects.toThrow(
    //     UnauthorizedException,
    //   );
    // });
  });

  describe('refreshAccess', () => {
    // it('should throw an error if refresh token is not provided', async () => {
    //   await expect(service.refreshAccess('')).rejects.toThrow(
    //     UnauthorizedException,
    //   );
    // });
    // it('should throw an error if user does not exist', async () => {
    //   mockUserModel.findOne.mockResolvedValue(null);
    //   await expect(service.refreshAccess('someRefreshToken')).rejects.toThrow(
    //     UnauthorizedException,
    //   );
    // });
    //   it('should return a new access token if refresh token is valid', async () => {
    //     mockUserModel.findOne.mockResolvedValue(userDocumentArray[0]);
    //     jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '1' }));
    //     jest.spyOn(jwt, 'sign').mockImplementation(() => 'newAccessToken');
    //     const result = await service.refreshAccess('validRefreshToken');
    //     expect(result).toEqual({ accessToken: 'newAccessToken' });
    //   });
  });
});
