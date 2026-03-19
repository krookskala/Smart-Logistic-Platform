import { ShipmentUpdate } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
}

function clearAuthAndRedirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  const hasToken = Boolean(localStorage.getItem("access_token"));
  const hasUser = Boolean(localStorage.getItem("auth_user"));
  if (!hasToken && !hasUser) {
    return;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_user");
  window.location.href = "/login";
}

function handleFetchError(res: Response, message: string): never {
  if (res.status === 401 || res.status === 403) {
    clearAuthAndRedirectToLogin();
  }

  throw new Error(message);
}

export type Shipment = {
  id: string;
  title: string;
  description?: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  createdById: string;
  assignedCourierId?: string | null;
  createdAt: string;
};

export type Courier = {
  id: string;
  userId: string;
  vehicleType?: string | null;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
};

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  courier?: {
    id: string;
    userId: string;
    vehicleType?: string | null;
    availability?: boolean;
    createdAt: string;
  } | null;
};

export async function fetchUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to fetch users");
  }

  return res.json();
}

export async function updateUserRole(userId: string, role: string) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ role })
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to update user role");
  }

  return res.json();
}

export async function fetchCouriers(): Promise<Courier[]> {
  const res = await fetch(`${API_BASE_URL}/couriers`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to fetch couriers");
  }

  return res.json();
}

export async function assignCourierToShipment(
  shipmentId: string,
  courierId: string
) {
  const res = await fetch(
    `${API_BASE_URL}/shipments/${shipmentId}/assign-courier`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({ courierId })
    }
  );

  if (!res.ok) {
    handleFetchError(res, "Failed to assign courier");
  }

  return res.json();
}

export type CreateShipmentInput = {
  title: string;
  description?: string;
  pickupAddress: string;
  deliveryAddress: string;
};

export async function fetchShipments(): Promise<Shipment[]> {
  const res = await fetch(`${API_BASE_URL}/shipments`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to fetch shipments");
  }
  return res.json();
}

export async function createShipment(
  input: CreateShipmentInput
): Promise<Shipment> {
  const res = await fetch(`${API_BASE_URL}/shipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to create shipment");
  }

  return res.json();
}

export type RegisterInput = {
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to register");
  }

  return res.json();
}

export type LoginInput = {
  email: string;
  password: string;
};

export async function loginUser(input: LoginInput) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to login");
  }

  return res.json();
}

export type ShipmentMetrics = {
  total: number;
  delivered: number;
  inTransit: number;
  assigned: number;
  created: number;
};

export async function fetchShipmentMetrics(): Promise<ShipmentMetrics> {
  const res = await fetch(`${API_BASE_URL}/shipments/metrics`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to fetch shipment metrics");
  }

  return res.json();
}

export type CreateTrackingEventInput = {
  status: string;
  locationLat?: number;
  locationLng?: number;
  note?: string;
};

export async function createTrackingEvent(
  shipmentId: string,
  input: CreateTrackingEventInput
) {
  const res = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/tracking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to create tracking event");
  }

  return res.json();
}

export async function fetchTrackingEvents(
  shipmentId: string
): Promise<ShipmentUpdate[]> {
  const res = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/tracking`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!res.ok) {
    handleFetchError(res, "Failed to fetch tracking events");
  }

  return res.json();
}
