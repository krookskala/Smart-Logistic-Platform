import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { AccessControlService } from "../auth/access-control.service";
import { CreateShipmentDto } from "./dto/create-shipment.dto";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";
import { AuthUser } from "../auth/auth-user.type";
import { ListShipmentsQueryDto } from "./dto/list-shipments-query.dto";

const CANCELLABLE_SHIPMENT_STATUSES = new Set(["CREATED", "ASSIGNED"]);
const EDITABLE_SHIPMENT_STATUSES = new Set(["CREATED"]);

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

  private getShipmentInclude() {
    return {
      createdBy: {
        select: {
          id: true,
          email: true,
          role: true
        }
      },
      assignedCourier: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      }
    } as const;
  }

  private buildAdminShipmentWhere(query: ListShipmentsQueryDto): PrismaLikeWhereInput {
    const andFilters: PrismaLikeWhereInput[] = [];

    if (query.search) {
      andFilters.push({
        OR: [
          {
            title: {
              contains: query.search,
              mode: "insensitive"
            }
          },
          {
            pickupAddress: {
              contains: query.search,
              mode: "insensitive"
            }
          },
          {
            deliveryAddress: {
              contains: query.search,
              mode: "insensitive"
            }
          }
        ]
      });
    }

    if (query.status) {
      andFilters.push({
        status: query.status
      });
    }

    if (query.assignedCourierId) {
      andFilters.push({
        assignedCourierId: query.assignedCourierId
      });
    }

    return andFilters.length > 0 ? { AND: andFilters } : {};
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

  async findAll(user: { userId: string; role: string }, query: ListShipmentsQueryDto) {
    if (user.role === "ADMIN") {
      return this.prisma.shipment.findMany({
        where: this.buildAdminShipmentWhere(query) as never,
        orderBy: {
          [query.sortBy ?? "createdAt"]: query.sortOrder ?? "desc"
        } as never,
        include: this.getShipmentInclude()
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
        orderBy: { createdAt: "desc" },
        include: this.getShipmentInclude()
      });
    }

    return this.prisma.shipment.findMany({
      where: {
        createdById: user.userId
      },
      orderBy: { createdAt: "desc" },
      include: this.getShipmentInclude()
    });
  }

  async findOne(id: string, user: { userId: string; role: string }) {
    await this.accessControlService.assertShipmentAccess(id, user);

    return this.prisma.shipment.findUnique({
      where: { id },
      include: this.getShipmentInclude()
    });
  }

  async update(id: string, dto: UpdateShipmentDto, user: AuthUser) {
    const shipment = await this.getShipmentOrThrow(id);

    if (!EDITABLE_SHIPMENT_STATUSES.has(shipment.status)) {
      throw new BadRequestException(
        "Only shipments in CREATED status can be edited."
      );
    }

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

    if (!courier.availability) {
      throw new BadRequestException("Selected courier is unavailable.");
    }

    if (!["CREATED", "ASSIGNED"].includes(shipment.status)) {
      throw new BadRequestException(
        "Courier assignment is only allowed for CREATED or ASSIGNED shipments."
      );
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

  async cancel(id: string, user: AuthUser) {
    const shipment = await this.getShipmentOrThrow(id);

    if (user.role !== "ADMIN" && shipment.createdById !== user.userId) {
      throw new NotFoundException("Shipment Not Found");
    }

    if (!CANCELLABLE_SHIPMENT_STATUSES.has(shipment.status)) {
      throw new BadRequestException(
        "Only CREATED or ASSIGNED shipments can be cancelled."
      );
    }

    const cancelledShipment = await this.prisma.shipment.update({
      where: { id },
      data: {
        status: "CANCELLED" as never,
        assignedCourierId: null
      }
    });

    await this.auditService.log({
      actorUserId: user.userId,
      actionType: "SHIPMENT_CANCELLED",
      targetType: "Shipment",
      targetId: id,
      metadata: {
        previousStatus: shipment.status,
        previousAssignedCourierId: shipment.assignedCourierId
      }
    });

    return cancelledShipment;
  }

  async getMetrics() {
    const total = await this.prisma.shipment.count();
    const delivered = await this.prisma.shipment.count({
      where: { status: "DELIVERED" }
    });
    const inTransit = await this.prisma.shipment.count({
      where: { status: "IN_TRANSIT" }
    });
    const pickedUp = await this.prisma.shipment.count({
      where: { status: "PICKED_UP" }
    });
    const assigned = await this.prisma.shipment.count({
      where: { status: "ASSIGNED" }
    });
    const created = await this.prisma.shipment.count({
      where: { status: "CREATED" }
    });
    const cancelled = await this.prisma.shipment.count({
      where: { status: "CANCELLED" as never }
    });

    return {
      total,
      delivered,
      pickedUp,
      inTransit,
      assigned,
      created,
      cancelled
    };
  }
}

type PrismaLikeWhereInput = {
  AND?: PrismaLikeWhereInput[];
  OR?: PrismaLikeWhereInput[];
  title?: { contains: string; mode: "insensitive" };
  pickupAddress?: { contains: string; mode: "insensitive" };
  deliveryAddress?: { contains: string; mode: "insensitive" };
  status?: string;
  assignedCourierId?: string;
};
