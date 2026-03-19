import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class TrackingGateway {
  @WebSocketServer()
  server!: Server;

  emitShipmentUpdate(payload: {
    shipmentId: string;
    status: string;
    locationLat?: number;
    locationLng?: number;
  }) {
    this.server.emit("shipment-status-update", payload);
  }
}
