const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type UserRole = 'admin' | 'doctor' | 'billing_clerk';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone_number?: string;
  specialty?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Doctor extends User {
  specialty?: string;
  license_number?: string;
  department?: string;
}

export interface DoctorWithStats extends Doctor {
  totalPatients: number;
  totalInvoices: number;
  totalRevenue: number;
  averageInvoiceValue: number;
  activePatients: number;
  recentInvoices: Invoice[];
  patients: Patient[];
  invoices: Invoice[];
}

export interface DoctorDetails {
  doctor: Doctor;
  stats: {
    totalPatients: number;
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
    activePatients: number;
  };
  patients: Patient[];
  invoices: Invoice[];
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface BillableItem {
  id: string;
  item_code: string;
  name: string;
  description: string;
  category: string;
  unit_price: number;
  tax_rate: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  package_code: string;
  name: string;
  description: string;
  pricing_type: 'fixed' | 'itemized';
  fixed_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items?: PackageItem[];
}

export interface PackageItem {
  id: string;
  package_id: string;
  billable_item_id: string;
  quantity: number;
  billable_item?: BillableItem;
  billable_name?: string;
  unit_price?: number;
  tax_rate?: number;
  category?: string;
}

export interface Treatment {
  id: string;
  treatment_code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items?: TreatmentItem[];
}

export interface TreatmentItem {
  id: string;
  treatment_id: string;
  billable_item_id: string | null;
  package_id: string | null;
  quantity: number;
  created_at: string;
  billable_item?: BillableItem;
  package?: Package;
}

export interface Patient {
  id: string;
  patient_code: string;
  full_name: string;
  contact_number: string;
  email: string;
  address: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  blood_group?: string;
  emergency_contact?: string;
  doctor_id?: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
  invoices?: Invoice[];
}

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  doctor_id?: string;
  created_by: string;
  status: 'draft' | 'finalized' | 'paid' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  discount_reason: string;
  notes: string;
  finalized_at: string | null;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  patient_code?: string;
  doctor_name?: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  item_type: 'billable' | 'package';
  billable_item_id: string | null;
  package_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  category: string;
  parent_package_id: string | null;
  created_at: string;
}

export interface DiscountReason {
  id: string;
  reason: string;
  requires_approval: boolean;
  max_percentage: number;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: string;
  new_values: string;
  created_at: string;
  user_email?: string;
  user_role?: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalPatients: number;
  totalPackages: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingInvoices: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, role: UserRole, data?: Partial<User>): Promise<User> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, ...data }),
    });
  }

  async getProfile(): Promise<User> {
    return this.request('/auth/profile');
  }

  // Users (including doctors)
  async getUsers(role?: UserRole): Promise<User[]> {
    const url = role ? `/users?role=${role}` : '/users';
    return this.request(url);
  }

  async getUser(id: string): Promise<User> {
    return this.request(`/users/${id}`);
  }

  async createUser(data: Partial<User> & { password: string }): Promise<User> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctors specific endpoints
  async getDoctors(): Promise<Doctor[]> {
    return this.request('/doctors');
  }

  async getDoctor(id: string): Promise<Doctor> {
    return this.request(`/doctors/${id}`);
  }

  async createDoctor(data: Partial<Doctor> & { password: string }): Promise<Doctor> {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'doctor' }),
    });
  }

  async updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor> {
    return this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDoctor(id: string): Promise<void> {
    return this.request(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  async getDoctorStats(id: string): Promise<{
    totalPatients: number;
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
    activePatients: number;
    recentInvoices: Invoice[];
  }> {
    return this.request(`/doctors/${id}/stats`);
  }

  async getDoctorDetails(id: string): Promise<DoctorDetails> {
    return this.request(`/doctors/${id}/details`);
  }

  async getDoctorsWithStats(): Promise<DoctorWithStats[]> {
    return this.request('/doctors/stats');
  }

  // Patients
  async createPatient(data: Partial<Patient>): Promise<Patient> {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPatients(search?: string, doctorId?: string): Promise<Patient[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (doctorId) params.append('doctor_id', doctorId);
    const query = params.toString();
    return this.request(`/patients${query ? `?${query}` : ''}`);
  }

  async getPatient(id: string): Promise<Patient> {
    return this.request(`/patients/${id}`);
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePatient(id: string): Promise<void> {
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  async getRecentPatients(limit: number = 5): Promise<Patient[]> {
    return this.request(`/patients/recent?limit=${limit}`);
  }

  // Billables
  async getBillableItems(category?: string, search?: string): Promise<BillableItem[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString();
    return this.request(`/billables${query ? `?${query}` : ''}`);
  }

  async getBillableCategories(): Promise<string[]> {
    return this.request('/billables/categories');
  }

  async createBillableItem(data: Partial<BillableItem>): Promise<BillableItem> {
    return this.request('/billables', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBillableItem(id: string, data: Partial<BillableItem>): Promise<BillableItem> {
    return this.request(`/billables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBillableItem(id: string): Promise<void> {
    return this.request(`/billables/${id}`, {
      method: 'DELETE',
    });
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return this.request('/packages');
  }

  async getPackage(id: string): Promise<Package> {
    return this.request(`/packages/${id}`);
  }

  async createPackage(data: Partial<Package> & { items?: Array<{ billable_item_id: string; quantity: number }> }): Promise<Package> {
    return this.request('/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePackage(id: string, data: Partial<Package> & { items?: Array<{ billable_item_id: string; quantity: number }> }): Promise<Package> {
    return this.request(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePackage(id: string): Promise<void> {
    return this.request(`/packages/${id}`, {
      method: 'DELETE',
    });
  }

  // Treatments
  async getTreatments(): Promise<Treatment[]> {
    return this.request('/treatments');
  }

  async getTreatment(id: string): Promise<Treatment> {
    return this.request(`/treatments/${id}`);
  }

  async createTreatment(data: Partial<Treatment> & { items?: Array<{ billable_item_id?: string; package_id?: string; quantity: number }> }): Promise<Treatment> {
    return this.request('/treatments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTreatment(id: string, data: Partial<Treatment> & { items?: Array<{ billable_item_id?: string; package_id?: string; quantity: number }> }): Promise<Treatment> {
    return this.request(`/treatments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTreatment(id: string): Promise<void> {
    return this.request(`/treatments/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoices
  async createInvoice(data: {
    patient_id: string;
    doctor_id?: string;
    items: Array<{
      item_type: 'billable' | 'package';
      billable_item_id?: string;
      package_id?: string;
      description: string;
      quantity: number;
      unit_price: number;
      tax_rate: number;
      category: string;
      parent_package_id?: string;
    }>;
    discount_percentage?: number;
    discount_reason?: string;
    notes?: string;
    status?: 'draft' | 'finalized';
  }): Promise<Invoice> {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInvoices(filters?: { 
    status?: string; 
    patient_id?: string; 
    doctor_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Invoice[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.patient_id) params.append('patient_id', filters.patient_id);
    if (filters?.doctor_id) params.append('doctor_id', filters.doctor_id);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    const query = params.toString();
    return this.request(`/invoices${query ? `?${query}` : ''}`);
  }

  async getInvoice(id: string): Promise<Invoice> {
    return this.request(`/invoices/${id}`);
  }

  async getRecentInvoices(limit: number = 5): Promise<Invoice[]> {
    return this.request(`/invoices/recent?limit=${limit}`);
  }

  async getDoctorInvoices(doctorId: string): Promise<Invoice[]> {
    return this.request(`/doctors/${doctorId}/invoices`);
  }

  async updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
    return this.request(`/invoices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    return this.request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.request(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats(): Promise<InvoiceStats> {
    return this.request('/invoices/stats');
  }

  // Discounts
  async getDiscountReasons(): Promise<DiscountReason[]> {
    return this.request('/discounts');
  }

  async createDiscountReason(data: Partial<DiscountReason>): Promise<DiscountReason> {
    return this.request('/discounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscountReason(id: string, data: Partial<DiscountReason>): Promise<DiscountReason> {
    return this.request(`/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscountReason(id: string): Promise<void> {
    return this.request(`/discounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Audit Logs
  async getAuditLogs(filters?: {
    entity_type?: string;
    entity_id?: string;
    start_date?: string;
    end_date?: string;
    action?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AuditLog>> {
    const params = new URLSearchParams();
    if (filters?.entity_type) params.append('entity_type', filters.entity_type);
    if (filters?.entity_id) params.append('entity_id', filters.entity_id);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const query = params.toString();
    return this.request(`/audit${query ? `?${query}` : ''}`);
  }

  // Audit logging
  async logAudit(data: {
    action: string;
    entity_type: string;
    entity_id: string;
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
  }): Promise<void> {
    return this.request('/audit/log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();