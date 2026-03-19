import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ShipmentsModule } from "./shipments/shipments.module";
import { CouriersModule } from "./couriers/couriers.module";
import { TrackingModule } from "./tracking/tracking.module";
import { UsersModule } from "./users/users.module";
import { AuditModule } from "./audit/audit.module";

@Module({
  imports: [
    // Basic, in-memory rate limiting to reduce abuse on auth-heavy endpoints.
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 20
      }
    ]),
    PrismaModule,
    AuthModule,
    ShipmentsModule,
    CouriersModule,
    TrackingModule,
    UsersModule,
    AuditModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
