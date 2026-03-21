import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { seconds, ThrottlerModule } from "@nestjs/throttler";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ShipmentsModule } from "./shipments/shipments.module";
import { CouriersModule } from "./couriers/couriers.module";
import { TrackingModule } from "./tracking/tracking.module";
import { UsersModule } from "./users/users.module";
import { AuditModule } from "./audit/audit.module";
import { HttpThrottlerGuard } from "./common/guards/http-throttler.guard";

@Module({
  imports: [
    // Basic, in-memory rate limiting to reduce abuse on auth-heavy endpoints.
    ThrottlerModule.forRoot([
      {
        ttl: seconds(60),
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
  controllers: [HealthController],
  providers: [
    // Restrict global throttling to HTTP requests so websocket tracking stays stable.
    { provide: APP_GUARD, useClass: HttpThrottlerGuard }
  ]
})
export class AppModule {}
