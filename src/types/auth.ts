export interface AuthPayload {
  id: string;
  email: string;
  subscriptionTier: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    address: string;
    subscriptionTier: string;
    balance: number;
    latitude: number;
    longitude: number;
  };
  token: string;
  refreshToken: string;
}