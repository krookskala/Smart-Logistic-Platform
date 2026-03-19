export type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export type TrackingFormState = {
  status: string;
  note: string;
  locationLat: string;
  locationLng: string;
};

export type ShipmentUpdate = {
  shipmentId: string;
  status: string;
  locationLat?: number;
  locationLng?: number;
};
