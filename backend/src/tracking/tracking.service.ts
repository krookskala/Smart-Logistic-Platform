import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTrackingDto } from "./dto/create-tracking.dto";
import { TrackingGateway } from "./tracking.gateway";

@Injectable()
export class TrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trackingGateway: TrackingGateway
  ) {}

  async create(
    shipmentId: string,
    dto: CreateTrackingDto,
    user: { userId: string; role: string }
  ) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId }
    });

    if (!shipment) {
      throw new NotFoundException("Shipment Not Found");
    }

    if (user.role === "COURIER") {
      const courier = await this.prisma.courier.findUnique({
        where: { userId: user.userId }
      });

      if (!courier || shipment.assignedCourierId !== courier.id) {
        throw new NotFoundException("Shipment Not Found");
      }
    }

    const tracking = await this.prisma.trackingEvent.create({
      data: {
        shipmentId,
        status: dto.status,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng,
        note: dto.note
      }
    });

    await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: dto.status }
    });

    this.trackingGateway.emitShipmentUpdate({
      shipmentId,
      status: dto.status,
      locationLat: dto.locationLat,
      locationLng: dto.locationLng
    });

    return tracking;
  }

  async findByShipment(
    shipmentId: string,
    user: { userId: string; role: string }
  ) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId }
    });

    if (!shipment) {
      throw new NotFoundException("Shipment Not Found");
    }

    if (user.role === "ADMIN") {
      return this.prisma.trackingEvent.findMany({
        where: { shipmentId },
        orderBy: { createdAt: "asc" }
      });
    }

    if (user.role === "USER" && shipment.createdById === user.userId) {
      return this.prisma.trackingEvent.findMany({
        where: { shipmentId },
        orderBy: { createdAt: "asc" }
      });
    }

    if (user.role === "COURIER") {
      const courier = await this.prisma.courier.findUnique({
        where: { userId: user.userId }
      });

      if (courier && shipment.assignedCourierId === courier.id) {
        return this.prisma.trackingEvent.findMany({
          where: { shipmentId },
          orderBy: { createdAt: "asc" }
        });
      }
    }

    throw new NotFoundException("Shipment Not Found");
  }
}
