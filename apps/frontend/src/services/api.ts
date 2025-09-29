// API Base Configuration
const API_BASE_URL = 'http://localhost:8080/api'

// Types
export interface User {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Group {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  members: User[]
}

// Removed GroupMember interface - backend uses User directly

export interface Expense {
  id: number
  description: string
  amount: number
  expenseDate: string
  createdAt: string
  updatedAt: string
  splitType: 'EQUAL' | 'PERCENTAGE' | 'EXACT_AMOUNT'
  notes?: string
  payerId: number
  payer: User
  groupId: number
  group: Group
  participants: User[]
  splits: ExpenseSplit[]
  amountPerParticipant: number
  participantCount: number
}

export interface ExpenseSplit {
  userId: number
  userName: string
  amountOwed: number
  percentage: number
}

export interface Balance {
  groupId: number
  groupName: string
  totalExpenses: number
  userBalances: UserBalance[]
  settlements: Debt[]
}

export interface UserBalance {
  userId: number
  userName: string
  totalPaid: number
  totalOwed: number
  netBalance: number
}

export interface Debt {
  debtorId: number
  debtorName: string
  creditorId: number
  creditorName: string
  amount: number
}

export interface CreateGroupRequest {
  name: string
  description: string
}

export interface CreateExpenseRequest {
  description: string
  amount: number
  groupId: number
  splitType: 'EQUAL' | 'PERCENTAGE' | 'EXACT_AMOUNT'
  paidById: number
  expenseDate: string
  participantIds: number[]
  notes?: string
}

// Removed CreateExpenseSplitRequest - backend handles splits automatically

// API Client Class
class ApiClient {
  private baseURL: string
  private authToken: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Try to get token from localStorage
    this.authToken = localStorage.getItem('authToken')
  }

  setAuthToken(token: string) {
    this.authToken = token
    localStorage.setItem('authToken', token)
  }

  clearAuthToken() {
    this.authToken = null
    localStorage.removeItem('authToken')
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        
        // Try to get error message from response body
        try {
          const errorText = await response.text()
          if (errorText) {
            errorMessage = errorText
          }
        } catch (e) {
          // If we can't parse the error body, use the default message
        }
        
        if (response.status === 401) {
          this.clearAuthToken()
          const error = new Error('Authentication required')
          ;(error as any).response = { status: response.status, message: errorMessage }
          throw error
        }
        
        const error = new Error(errorMessage)
        ;(error as any).response = { status: response.status, message: errorMessage }
        throw error
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return response.text() as unknown as T
      }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    
    this.setAuthToken(response.token)
    return response
  }

  async register(username: string, email: string, password: string, fullName: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, fullName }),
    })
    
    this.setAuthToken(response.token)
    return response
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  async logout(): Promise<void> {
    this.clearAuthToken()
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users')
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }

  // Group endpoints
  async getGroups(): Promise<Group[]> {
    return this.request<Group[]>('/groups')
  }

  async getGroupById(id: number): Promise<Group> {
    return this.request<Group>(`/groups/${id}`)
  }

  async createGroup(group: CreateGroupRequest, creatorId: number): Promise<Group> {
    return this.request<Group>(`/groups?creatorId=${creatorId}`, {
      method: 'POST',
      body: JSON.stringify(group),
    })
  }

  async updateGroup(id: number, group: Partial<CreateGroupRequest>): Promise<Group> {
    return this.request<Group>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    })
  }

  async deleteGroup(id: number): Promise<void> {
    return this.request<void>(`/groups/${id}`, {
      method: 'DELETE',
    })
  }

  async addMemberToGroup(groupId: number, userId: number): Promise<Group> {
    return this.request<Group>(`/groups/${groupId}/members/${userId}`, {
      method: 'POST',
    })
  }

  async removeMemberFromGroup(groupId: number, userId: number): Promise<void> {
    return this.request<void>(`/groups/${groupId}/members/${userId}`, {
      method: 'DELETE',
    })
  }

  // Expense endpoints
  async getExpenses(groupId?: number): Promise<Expense[]> {
    const endpoint = groupId ? `/expenses?groupId=${groupId}` : '/expenses'
    return this.request<Expense[]>(endpoint)
  }

  async getExpensesByGroup(groupId: number): Promise<Expense[]> {
    return this.request<Expense[]>(`/expenses/group/${groupId}`)
  }

  async getExpenseById(id: number): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`)
  }

  async createExpense(expense: CreateExpenseRequest): Promise<Expense> {
    // Transform frontend format to backend ExpenseDTO format
    const expenseDTO = {
      description: expense.description,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      splitType: expense.splitType,
      notes: expense.notes,
      payerId: expense.paidById,
      groupId: expense.groupId,
      participants: expense.participantIds.map(id => ({ id }))
    }
    
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseDTO),
    })
  }

  async updateExpense(id: number, expense: Partial<CreateExpenseRequest>): Promise<Expense> {
    // Transform frontend format to backend ExpenseDTO format (same as createExpense)
    const expenseDTO = {
      description: expense.description,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      splitType: expense.splitType,
      notes: expense.notes,
      payerId: expense.paidById,
      groupId: expense.groupId,
      participants: expense.participantIds ? expense.participantIds.map(id => ({ id })) : undefined
    }
    
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseDTO),
    })
  }

  async deleteExpense(id: number): Promise<void> {
    return this.request<void>(`/expenses/${id}`, {
      method: 'DELETE',
    })
  }

  async markExpenseSplitAsPaid(expenseId: number, splitId: number): Promise<Expense> {
    return this.request<Expense>(`/expenses/${expenseId}/splits/${splitId}/mark-paid`, {
      method: 'POST',
    })
  }

  // Balance endpoints
  async getGroupBalance(groupId: number): Promise<Balance> {
    return this.request<Balance>(`/balances/group/${groupId}`)
  }

  async getUserDebts(userId: number): Promise<Debt[]> {
    return this.request<Debt[]>(`/balances/user/${userId}/debts`)
  }

  async getUserNetBalance(userId: number, groupId: number): Promise<number> {
    return this.request<number>(`/balances/user/${userId}/group/${groupId}/net-balance`)
  }

  // Dashboard/Statistics endpoints
  async getDashboardStats(userId: number): Promise<{
    totalSpent: number
    activeGroups: number
    netBalance: number
    monthlyChange: {
      totalSpent: number
      activeGroups: number
      netBalance: number
    }
  }> {
    return this.request(`/dashboard/stats?userId=${userId}`)
  }

  async getRecentActivity(userId: number, limit: number = 10): Promise<{
    expenses: {
      id: number
      description: string
      amount: number
      category: string
      groupName: string
      paidByName: string
      createdAt: string
    }[]
    settlements: any[]
  }> {
    return this.request(`/dashboard/activity?userId=${userId}&limit=${limit}`)
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export default
export default apiClient