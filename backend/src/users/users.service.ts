import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        courier: true
      }
    });
  }

  async updateRole(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        courier: true
      }
    });

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role
      }
    });

    if (role === "COURIER" && !user.courier) {
      await this.prisma.courier.create({
        data: {
          userId: user.id
        }
      });
    }

    return this.prisma.user.findUnique({
      where: { id: updatedUser.id },
      include: {
        courier: true
      }
    });
  }
}
