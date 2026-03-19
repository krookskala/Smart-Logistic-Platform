import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourierDto } from "./dto/create-courier.dto";

@Injectable()
export class CouriersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourierDto) {
    return this.prisma.courier.create({
      data: {
        userId: dto.userId,
        vehicleType: dto.vehicleType
      }
    });
  }

  async findAll() {
    return this.prisma.courier.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });
  }
}
