import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

// Mock implementations for AuthService methods
const mockAuthService = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  refreshAccess: jest.fn(),
};

const mockUserModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

// Factory function for creating a mocked Request object
const createMockRequest = (refreshToken: string) =>
  ({
    signedCookies: {
      refreshToken,
    },
  }) as unknown as Request;

// Factory function for creating a mocked Response object
const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // Common setup for all tests
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: getModelToken(User.name), useValue: mockUserModel }, // Add this line
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // Tests for signIn endpoint
  describe('signIn', () => {
    const mockSignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const tokenResult = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    it('should call AuthService.signIn and return tokens', async () => {
      mockAuthService.signIn.mockResolvedValue(tokenResult);
      const response = createMockResponse();

      const result = await controller.signIn(mockSignInDto, response);

      expect(result).toEqual({ accessToken: 'access_token' });
      expect(service.signIn).toHaveBeenCalledWith(mockSignInDto);
      expect(response.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh_token',
        expect.any(Object),
      );
    });
  });

  // Tests for signUp endpoint
  describe('signUp', () => {
    const mockSignUpDto = {
      name: 'Test',
      email: 'test@example.com',
      mobile: '1234567890',
      password: 'password123',
    };

    it('should call AuthService.signUp', async () => {
      await controller.signUp(mockSignUpDto);
      expect(service.signUp).toHaveBeenCalledWith(mockSignUpDto);
    });
  });

  // Tests for signOut endpoint
  describe('signOut', () => {
    const refreshToken = 'some_refresh_token';

    it('should call AuthService.signOut and clear cookies', async () => {
      const request = createMockRequest(refreshToken);
      const response = createMockResponse();

      await controller.signOut(request, response);

      expect(service.signOut).toHaveBeenCalledWith(refreshToken);
      expect(response.clearCookie).toHaveBeenCalledWith('refreshToken');
    });
  });

  // Tests for refreshAccess endpoint
  describe('refreshAccess', () => {
    const newAccessToken = 'new_access_token';

    it('should call AuthService.refreshAccess and return new accessToken', async () => {
      mockAuthService.refreshAccess.mockResolvedValue({
        accessToken: newAccessToken,
      });
      const request = createMockRequest('some_refresh_token');

      const result = await controller.refreshAccess(request);

      expect(result).toEqual({ accessToken: newAccessToken });
      expect(service.refreshAccess).toHaveBeenCalledWith('some_refresh_token');
    });
  });

  // Tests for getUser endpoint
  describe('getUser', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      mobile: '1234567890',
    };

    it('should return user data', async () => {
      const result = await controller.getUser(userData);
      expect(result).toEqual(userData);
    });
  });

  // Tests for getAccess endpoint
  describe('getAccess', () => {
    const userData = {
      id: 'userId123',
      name: 'Test User',
      email: 'test@example.com',
      mobile: '1234567890',
    };

    it('should return user ID', async () => {
      const result = await controller.getAccess(userData);
      expect(result).toEqual({ id: 'userId123' });
    });
  });
});
