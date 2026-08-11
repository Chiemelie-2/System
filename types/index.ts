// src/types/index.ts
import type { 
  User, 
  CustomerProfile, 
  BankAccount, 
  Transaction,
  VerificationStatus,
  Role 
} from '@prisma/client'

// Registration form types
export interface RegistrationData {
  userId?: string
  email?: string
  password?: string
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  maritalStatus?: string
  nationality?: string
  phoneNumber?: string
  idType?: string
  idNumber?: string
  residencyStatus?: string
  passportNumber?: string
  countryOfCitizenship?: string
  residentialAddress?: string
  apartmentSuite?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  profilePhoto?: File
  governmentIdFile?: File
  termsAccepted?: boolean
}

// Dashboard types
export interface CustomerDashboardData {
  profile: CustomerProfile | null
  account: (BankAccount & {
    transactions: Transaction[]
  }) | null
}

export interface AdminDashboardData {
  totalUsers: number
  pendingVerifications: number
  totalBalances: number
  recentActions: AuditLogWithUser[]
}

// Admin types
export interface AuditLogWithUser {
  id: string
  action: string
  targetUserId: string | null
  details: any
  ipAddress: string | null
  createdAt: Date
  admin: {
    email: string
  }
}

export interface UserWithProfile extends User {
  profile: CustomerProfile | null
  identification: {
    idType: string
    idNumber: string
    governmentIdFile: string | null
  } | null
  address: {
    residentialAddress: string
    city: string
    state: string
    country: string
  } | null
  accounts: BankAccount[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
  totalPages: number
}