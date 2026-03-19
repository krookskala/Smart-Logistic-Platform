import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { AccessControlService } from "../auth/access-control.service";
import { CreateShipmentDto } from "./dto/create-shipment.dto";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";
import { AuthUser } from "../auth/auth-user.type";

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly accessControlService: AccessControlService
  ) {}

  private async getShipmentOrThrow(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id }
    });

    if (!shipment) {
      throw new NotFoundException("Shipment Not Found");
    }

    return shipment;
  }

  private async getCourierByUserId(userId: string) {
    return this.prisma.courier.findUnique({
      where: { userId }
    });
  }

  async create(dto: CreateShipmentDto, createdById: string) {
    return this.prisma.shipment.create({
      data: {
        title: dto.title,
        description: dto.description,
        pickupAddress: dto.pickupAddress,
        deliveryAddress: dto.deliveryAddress,
        createdById
      }
    });
  }

  async findAll(user: { userId: string; role: string }) {
    if (user.role === "ADMIN") {
      return this.prisma.shipment.findMany({
        orderBy: { createdAt: "desc" }
      });
    }

    if (user.role === "COURIER") {
      const courier = await this.getCourierByUserId(user.userId);

      if (!courier) {
        return [];
      }

      return this.prisma.shipment.findMany({
        where: {
          assignedCourierId: courier.id
        },
        orderBy: { createdAt: "desc" }
      });
    }

    return this.prisma.shipment.findMany({
      where: {
        createdById: user.userId
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async findOne(id: string, user: { userId: string; role: string }) {
    return this.accessControlService.assertShipmentAccess(id, user);
  }

  async update(id: string, dto: UpdateShipmentDto, user: AuthUser) {
    const shipment = await this.getShipmentOrThrow(id);

    if (user.role === "ADMIN") {
      return this.prisma.shipment.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          pickupAddress: dto.pickupAddress,
          deliveryAddress: dto.deliveryAddress
        }
      });
    }

    if (user.role === "USER" && shipment.createdById === user.userId) {
      return this.prisma.shipment.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          pickupAddress: dto.pickupAddress,
          deliveryAddress: dto.deliveryAddress
        }
      });
    }

    throw new NotFoundException("Shipment Not Found");
  }

  async assignCourier(
    shipmentId: string,
    courierId: string,
    actorUserId: string
  ) {
    const shipment = await this.getShipmentOrThrow(shipmentId);
    const previousAssignedCourierId = shipment.assignedCourierId;

    const courier = await this.prisma.courier.findUnique({
      where: { id: courierId }
    });

    if (!courier) {
      throw new NotFoundException("Courier Not Found");
    }

    const updatedShipment = await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        assignedCourierId: courierId,
        status: "ASSIGNED"
      }
    });

    await this.auditService.log({
      actorUserId,
      actionType: "SHIPMENT_ASSIGNED_COURIER",
      targetType: "Shipment",
      targetId: shipmentId,
      metadata: {
        courierId,
        previousAssignedCourierId
      }
    });

    return updatedShipment;
  }

  async getMetrics() {
    const total = await this.prisma.shipment.count();
    const delivered = await this.prisma.shipment.count({
      where: { status: "DELIVERED" }
    });
    const inTransit = await this.prisma.shipment.count({
      where: { status: "IN_TRANSIT" }
    });
    const assigned = await this.prisma.shipment.count({
      where: { status: "ASSIGNED" }
    });
    const created = await this.prisma.shipment.count({
      where: { status: "CREATED" }
    });

    return {
      total,
      delivered,
      inTransit,
      assigned,
      created
    };
  }
}
