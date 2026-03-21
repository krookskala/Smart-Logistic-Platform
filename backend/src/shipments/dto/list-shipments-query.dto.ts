import { IsIn, IsOptional, IsString } from "class-validator";

export class ListShipmentsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  assignedCourierId?: string;

  @IsOptional()
  @IsIn(["createdAt", "title", "status"])
  sortBy?: "createdAt" | "title" | "status";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}
