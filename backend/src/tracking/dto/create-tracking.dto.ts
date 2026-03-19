import { IsEnum, IsOptional, IsNumber, IsString } from "class-validator";
import { ShipmentStatus } from "@prisma/client";

export class CreateTrackingDto {
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @IsOptional()
  @IsNumber()
  locationLng?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
