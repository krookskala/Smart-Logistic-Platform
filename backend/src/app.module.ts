import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ShipmentsModule } from "./shipments/shipments.module";
import { CouriersModule } from "./couriers/couriers.module";
import { TrackingModule } from "./tracking/tracking.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ShipmentsModule,
    CouriersModule,
    TrackingModule,
    UsersModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
