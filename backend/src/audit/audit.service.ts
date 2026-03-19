import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

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
        metadata: input.metadata as any
      }
    });
  }
}

