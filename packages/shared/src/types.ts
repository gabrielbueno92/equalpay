// Shared TypeScript types between frontend and backend

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  creator: User;
  members: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  payer: User;
  group: Group;
  participants: User[];
  splitType: SplitType;
  notes?: string;
  category?: ExpenseCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseSplit {
  id: number;
  expense: Expense;
  user: User;
  amount: number;
}

export interface Balance {
  userId: number;
  userName: string;
  balance: number;
  owes: BalanceDetail[];
  owedBy: BalanceDetail[];
}

export interface BalanceDetail {
  userId: number;
  userName: string;
  amount: number;
}

export interface Settlement {
  from: User;
  to: User;
  amount: number;
}

export enum SplitType {
  EQUAL = 'EQUAL',
  PERCENTAGE = 'PERCENTAGE',
  EXACT_AMOUNT = 'EXACT_AMOUNT'
}

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  UTILITIES = 'UTILITIES',
  TRAVEL = 'TRAVEL',
  HEALTH = 'HEALTH',
  OTHER = 'OTHER'
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Form types
export interface CreateUserForm {
  name: string;
  email: string;
}

export interface CreateGroupForm {
  name: string;
  description?: string;
  creatorId: number;
}

export interface CreateExpenseForm {
  description: string;
  amount: number;
  payerId: number;
  groupId: number;
  participantIds: number[];
  splitType: SplitType;
  notes?: string;
  category?: ExpenseCategory;
}

// UI types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}