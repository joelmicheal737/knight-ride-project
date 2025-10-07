const API_BASE_URL = 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bike_model?: string;
  license_number?: string;
  ride_stats?: {
    total_rides: number;
    total_distance: string;
    fuel_saved: string;
    safety_score: number;
  };
  emergency_contacts?: EmergencyContact[];
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface NearbyService {
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  distance: string;
  phone: string;
  is_open: boolean;
  services: string[];
}

interface ServiceRequest {
  service_type: string;
  location: {
    lat: number;
    lng: number;
  };
  message?: string;
  urgency?: string;
}

interface SOSAlert {
  location: {
    lat: number;
    lng: number;
  };
  message?: string;
  contact_ids?: string[];
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Try to get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('knight_ride_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication
  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    bike_model?: string;
    license_number?: string;
  }): Promise<ApiResponse<{ access_token: string; user: User }>> {
    const response = await this.request<{ access_token: string; user: User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );

    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ access_token: string; user: User }>> {
    const response = await this.request<{ access_token: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  // User Profile
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile');
  }

  // Services
  async getNearbyServices(
    serviceType?: string,
    lat?: number,
    lng?: number
  ): Promise<ApiResponse<{ services: NearbyService[] }>> {
    const params = new URLSearchParams();
    if (serviceType) params.append('service_type', serviceType);
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());

    const queryString = params.toString();
    const endpoint = `/location/nearby-services${queryString ? `?${queryString}` : ''}`;

    return this.request<{ services: NearbyService[] }>(endpoint);
  }

  async requestService(request: ServiceRequest): Promise<ApiResponse<{
    request_id: string;
    status: string;
    message: string;
  }>> {
    return this.request('/request-service', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Emergency
  async sendSOS(alert: SOSAlert): Promise<ApiResponse<{
    alert_id: string;
    status: string;
    message: string;
  }>> {
    return this.request('/sos/send', {
      method: 'POST',
      body: JSON.stringify(alert),
    });
  }

  // Emergency Contacts
  async addEmergencyContact(contact: EmergencyContact): Promise<ApiResponse<{
    message: string;
  }>> {
    return this.request('/contacts/add', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async getEmergencyContacts(): Promise<ApiResponse<{
    contacts: EmergencyContact[];
  }>> {
    return this.request('/contacts');
  }

  async deleteEmergencyContact(index: number): Promise<ApiResponse<{
    message: string;
  }>> {
    return this.request(`/contacts/${index}`, {
      method: 'DELETE',
    });
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('knight_ride_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('knight_ride_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export type { User, EmergencyContact, NearbyService, ServiceRequest, SOSAlert };