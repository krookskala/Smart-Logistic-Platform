import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourierDto } from "./dto/create-courier.dto";
import { UpdateMyAvailabilityDto } from "./dto/update-my-availability.dto";

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
      orderBy: [{ availability: "desc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: {
            shipments: true
          }
        },
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

  async updateMyAvailability(userId: string, dto: UpdateMyAvailabilityDto) {
    return this.prisma.courier.update({
      where: { userId },
      data: {
        availability: dto.availability
      },
      include: {
        _count: {
          select: {
            shipments: true
          }
        },
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

  async findMe(userId: string) {
    return this.prisma.courier.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            shipments: true
          }
        },
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
