import "./env/load-env";
import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { RequestLoggingInterceptor } from "./common/interceptors/request-logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  const allowedOrigins =
    allowedOriginsEnv
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  app.enableCors({
    origin:
      allowedOrigins.length > 0 ? allowedOrigins : "http://localhost:3000",
    credentials: true
  });

  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Smart Logistics API")
    .setDescription(
      "REST API for shipment management, courier assignment, real-time tracking, and audit logging"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
}

bootstrap();
