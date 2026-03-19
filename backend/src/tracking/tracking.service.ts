import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { AccessControlService } from "../auth/access-control.service";
import { CreateTrackingDto } from "./dto/create-tracking.dto";
import { TrackingGateway } from "./tracking.gateway";

@Injectable()
export class TrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trackingGateway: TrackingGateway,
    private readonly auditService: AuditService,
    private readonly accessControlService: AccessControlService
  ) {}

  async create(
    shipmentId: string,
    dto: CreateTrackingDto,
    user: { userId: string; role: string }
  ) {
    await this.accessControlService.assertShipmentAccess(shipmentId, user);

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

    await this.auditService.log({
      actorUserId: user.userId,
      actionType: "TRACKING_EVENT_CREATED",
      targetType: "Shipment",
      targetId: shipmentId,
      metadata: {
        status: dto.status,
        note: dto.note,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng
      }
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
    await this.accessControlService.assertShipmentAccess(shipmentId, user);

    return this.prisma.trackingEvent.findMany({
      where: { shipmentId },
      orderBy: { createdAt: "asc" }
    });
  }
}
