import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

jest.mock("bcrypt");

describe("AuthService", () => {
  it("registers a user with hashed password and default role", async () => {
    const prisma = {
      user: {
        create: jest.fn()
      }
    } as any;

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

  it("registers a user with explicit role", async () => {
    const prisma = {
      user: {
        create: jest.fn()
      }
    } as any;

    const jwtService = {} as JwtService;
    const service = new AuthService(prisma, jwtService);

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    prisma.user.create.mockResolvedValue({
      id: "u2",
      email: "admin@example.com",
      role: "ADMIN"
    });

    const dto: RegisterDto = {
      email: "admin@example.com",
      password: "secret123",
      role: "ADMIN" as any
    } as RegisterDto;

    await service.register(dto);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: dto.email,
        password: "hashed-password",
        role: dto.role
      }
    });
  });

  it("throws UnauthorizedException for login with non-existing user", async () => {
    const prisma = {
      user: {
        findUnique: jest.fn()
      }
    } as any;

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
    const prisma = {
      user: {
        findUnique: jest.fn()
      }
    } as any;

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

  it("logs in and returns signed JWT and sanitized user", async () => {
    const prisma = {
      user: {
        findUnique: jest.fn()
      }
    } as any;

    const jwtService = { signAsync: jest.fn().mockResolvedValue("jwt-token") } as any;
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

    expect(result).toEqual({
      access_token: "jwt-token",
      user: {
        id: "u1",
        email: "test@example.com",
        role: "USER"
      }
    });
  });
});

