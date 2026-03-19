import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CouriersService } from "./couriers.service";
import { CreateCourierDto } from "./dto/create-courier.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("couriers")
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateCourierDto) {
    return this.couriersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.couriersService.findAll();
  }
}
