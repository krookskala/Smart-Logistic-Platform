import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

type AuditLogInput = {
  actorUserId?: string;
  actionType: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        actionType: input.actionType,
        targetType: input.targetType,
        targetId: input.targetId,
        // Prisma `Json?` expects a Prisma JSON input type.
        metadata: input.metadata as Prisma.InputJsonValue | undefined
      }
    });
  }
}
