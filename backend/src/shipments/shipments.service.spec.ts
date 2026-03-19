import { NotFoundException } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";

describe("ShipmentsService", () => {
  it("findAll returns all shipments for ADMIN", async () => {
    const prisma = {
      shipment: {
        findMany: jest.fn().mockResolvedValue([{ id: "s1" }])
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);

    const result = await service.findAll({ userId: "u1", role: "ADMIN" });

    expect(prisma.shipment.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" }
    });
    expect(result).toEqual([{ id: "s1" }]);
  });

  it("findAll returns courier assigned shipments for COURIER", async () => {
    const prisma = {
      courier: {
        findUnique: jest.fn().mockResolvedValue({ id: "c1", userId: "u1" })
      },
      shipment: {
        findMany: jest.fn().mockResolvedValue([{ id: "s1" }])
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);

    await service.findAll({ userId: "u1", role: "COURIER" });

    expect(prisma.courier.findUnique).toHaveBeenCalledWith({
      where: { userId: "u1" }
    });
    expect(prisma.shipment.findMany).toHaveBeenCalledWith({
      where: { assignedCourierId: "c1" },
      orderBy: { createdAt: "desc" }
    });
  });

  it("findAll returns empty array for COURIER when courier record is missing", async () => {
    const prisma = {
      courier: {
        findUnique: jest.fn().mockResolvedValue(null)
      },
      shipment: {
        findMany: jest.fn()
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);

    const result = await service.findAll({ userId: "u1", role: "COURIER" });
    expect(result).toEqual([]);
    expect(prisma.shipment.findMany).not.toHaveBeenCalled();
  });

  it("findOne allows USER to access their own shipment", async () => {
    const prisma = {
      shipment: {}
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({
        id: "s1",
        createdById: "u1"
      })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);

    const result = await service.findOne("s1", { userId: "u1", role: "USER" });
    expect(result).toEqual({ id: "s1", createdById: "u1" });
  });

  it("findOne denies USER when shipment is not created by them", async () => {
    const prisma = {
      shipment: {}
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockRejectedValue(
        new NotFoundException("Shipment Not Found")
      )
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);

    await expect(
      service.findOne("s1", { userId: "u1", role: "USER" })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("findOne allows COURIER to access assigned shipment", async () => {
    const prisma = {
      shipment: {}
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({
        id: "s1",
        createdById: "u2",
        assignedCourierId: "c1"
      })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);

    const result = await service.findOne("s1", { userId: "u1", role: "COURIER" });
    expect(result).toEqual({
      id: "s1",
      createdById: "u2",
      assignedCourierId: "c1"
    });
  });

  it("update updates shipments for ADMIN", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({ id: "s1" }),
        update: jest.fn().mockResolvedValue({ id: "s1" })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);
    const dto: UpdateShipmentDto = {
      title: "Updated",
      pickupAddress: "A1",
      deliveryAddress: "B1"
    } as any;

    await service.update("s1", dto, { userId: "admin", role: "ADMIN" } as any);

    expect(prisma.shipment.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: {
        title: dto.title,
        description: dto.description,
        pickupAddress: dto.pickupAddress,
        deliveryAddress: dto.deliveryAddress
      }
    });
  });

  it("assignCourier sets assignedCourierId and status ASSIGNED", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({ id: "s1" }),
        update: jest.fn().mockResolvedValue({ id: "s1" })
      },
      courier: {
        findUnique: jest.fn().mockResolvedValue({ id: "c1", userId: "u1" })
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);
    await service.assignCourier("s1", "c1", "admin");

    expect(prisma.shipment.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { assignedCourierId: "c1", status: "ASSIGNED" }
    });
  });

  it("assignCourier throws when courier does not exist", async () => {
    const prisma = {
      shipment: {
        findUnique: jest.fn().mockResolvedValue({ id: "s1" }),
        update: jest.fn()
      },
      courier: {
        findUnique: jest.fn().mockResolvedValue(null)
      }
    } as any;

    const auditService = { log: jest.fn().mockResolvedValue(undefined) } as any;
    const accessControlService = {
      assertShipmentAccess: jest.fn().mockResolvedValue({ id: "s1" })
    } as any;
    const service = new ShipmentsService(prisma, auditService, accessControlService);

    await expect(
      service.assignCourier("s1", "missing", "admin")
    ).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
});

