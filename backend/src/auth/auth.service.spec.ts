import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

jest.mock("bcrypt");

describe("AuthService", () => {
  function buildPrisma(overrides: Record<string, unknown> = {}) {
    return {
      user: { create: jest.fn(), findUnique: jest.fn() },
      refreshToken: {
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
        delete: jest.fn().mockResolvedValue({})
      },
      ...overrides
    } as any;
  }

  it("registers a user with hashed password and default role", async () => {
    const prisma = buildPrisma();
    const jwtService = {} as JwtService;
    const service = new AuthService(prisma, jwtService);

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    prisma.user.create.mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      role: "USER"
    });

    const dto: RegisterDto = {
      email: "test@example.com",
      password: "secret123"
    } as RegisterDto;

    const result = await service.register(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: dto.email,
        password: "hashed-password",
        role: "USER"
      }
    });
    expect(result).toEqual({
      id: "u1",
      email: "test@example.com",
      role: "USER"
    });
  });

  it("always registers with USER role regardless of input", async () => {
    const prisma = buildPrisma();
    const jwtService = {} as JwtService;
    const service = new AuthService(prisma, jwtService);

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    prisma.user.create.mockResolvedValue({
      id: "u2",
      email: "admin@example.com",
      role: "USER"
    });

    const dto: RegisterDto = {
      email: "admin@example.com",
      password: "secret123"
    } as RegisterDto;

    await service.register(dto);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: dto.email,
        password: "hashed-password",
        role: "USER"
      }
    });
  });

  it("throws UnauthorizedException for login with non-existing user", async () => {
    const prisma = buildPrisma();
    const jwtService = { signAsync: jest.fn() } as any;
    const service = new AuthService(prisma, jwtService);

    prisma.user.findUnique.mockResolvedValue(null);

    const dto: LoginDto = {
      email: "missing@example.com",
      password: "secret123"
    } as LoginDto;

    await expect(service.login(dto)).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it("throws UnauthorizedException for login with invalid password", async () => {
    const prisma = buildPrisma();
    const jwtService = { signAsync: jest.fn() } as any;
    const service = new AuthService(prisma, jwtService);

    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      role: "USER",
      password: "stored-hash"
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const dto: LoginDto = {
      email: "test@example.com",
      password: "wrong-pass"
    } as LoginDto;

    await expect(service.login(dto)).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it("logs in and returns access token, refresh token, and sanitized user", async () => {
    const prisma = buildPrisma();
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue("jwt-token")
    } as any;
    const service = new AuthService(prisma, jwtService);

    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      role: "USER",
      password: "stored-hash"
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const dto: LoginDto = {
      email: "test@example.com",
      password: "secret123"
    } as LoginDto;

    const result = await service.login(dto);

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: "u1",
      email: "test@example.com",
      role: "USER"
    });

    expect(result.access_token).toBe("jwt-token");
    expect(result.refresh_token).toBeDefined();
    expect(typeof result.refresh_token).toBe("string");
    expect(result.user).toEqual({
      id: "u1",
      email: "test@example.com",
      role: "USER"
    });
    expect(prisma.refreshToken.create).toHaveBeenCalled();
  });

  it("refresh rotates tokens and returns new pair", async () => {
    const prisma = buildPrisma();
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue("new-jwt-token")
    } as any;
    const service = new AuthService(prisma, jwtService);

    prisma.refreshToken.findUnique.mockResolvedValue({
      id: "rt1",
      token: "old-refresh-token",
      userId: "u1",
      expiresAt: new Date(Date.now() + 86400000),
      user: { id: "u1", email: "test@example.com", role: "USER" }
    });

    const result = await service.refresh("old-refresh-token");

    expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
      where: { id: "rt1" }
    });
    expect(result.access_token).toBe("new-jwt-token");
    expect(result.refresh_token).toBeDefined();
    expect(result.user.email).toBe("test@example.com");
  });

  it("refresh throws for expired token", async () => {
    const prisma = buildPrisma();
    const jwtService = { signAsync: jest.fn() } as any;
    const service = new AuthService(prisma, jwtService);

    prisma.refreshToken.findUnique.mockResolvedValue({
      id: "rt1",
      token: "expired-token",
      userId: "u1",
      expiresAt: new Date(Date.now() - 86400000),
      user: { id: "u1", email: "test@example.com", role: "USER" }
    });

    await expect(service.refresh("expired-token")).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it("refresh throws for non-existing token", async () => {
    const prisma = buildPrisma();
    const jwtService = { signAsync: jest.fn() } as any;
    const service = new AuthService(prisma, jwtService);

    prisma.refreshToken.findUnique.mockResolvedValue(null);

    await expect(service.refresh("missing-token")).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });
});
