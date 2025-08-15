// API Base Configuration
const API_BASE_URL = 'http://localhost:8080/api'

// Types
export interface User {
  id: number
  username: string
  email: string
  fullName: string
}

export interface Group {
  id: number
  name: string
  description: string
  createdAt: string
  members: GroupMember[]
  totalExpenses: number
  currency: string
}

export interface GroupMember {
  id: number
  userId: number
  username: string
  fullName: string
  role: 'ADMIN' | 'MEMBER'
  joinedAt: string
}

export interface Expense {
  id: number
  description: string
  amount: number
  currency: string
  category: string
  groupId: number
  groupName: string
  paidById: number
  paidByName: string
  createdAt: string
  splits: ExpenseSplit[]
}

export interface ExpenseSplit {
  id: number
  userId: number
  username: string
  amount: number
  paid: boolean
}

export interface Balance {
  fromUserId: number
  fromUsername: string
  toUserId: number
  toUsername: string
  amount: number
  groupId: number
  groupName: string
}

export interface CreateGroupRequest {
  name: string
  description: string
  currency: string
}

export interface CreateExpenseRequest {
  description: string
  amount: number
  currency: string
  category: string
  groupId: number
  splits: CreateExpenseSplitRequest[]
}

export interface CreateExpenseSplitRequest {
  userId: number
  amount: number
}

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
        if (response.status === 401) {
          this.clearAuthToken()
          throw new Error('Authentication required')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
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

  async createGroup(group: CreateGroupRequest): Promise<Group> {
    return this.request<Group>('/groups', {
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
    return this.request<Group>(`/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
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

  async getExpenseById(id: number): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`)
  }

  async createExpense(expense: CreateExpenseRequest): Promise<Expense> {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    })
  }

  async updateExpense(id: number, expense: Partial<CreateExpenseRequest>): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
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
  async getBalances(groupId?: number): Promise<Balance[]> {
    const endpoint = groupId ? `/balances?groupId=${groupId}` : '/balances'
    return this.request<Balance[]>(endpoint)
  }

  async getUserBalances(userId: number): Promise<Balance[]> {
    return this.request<Balance[]>(`/users/${userId}/balances`)
  }

  async settleBalance(fromUserId: number, toUserId: number, amount: number, groupId?: number): Promise<void> {
    return this.request<void>('/balances/settle', {
      method: 'POST',
      body: JSON.stringify({ fromUserId, toUserId, amount, groupId }),
    })
  }

  // Dashboard/Statistics endpoints
  async getDashboardStats(): Promise<{
    totalSpent: number
    activeGroups: number
    netBalance: number
    monthlyChange: {
      totalSpent: number
      activeGroups: number
      netBalance: number
    }
  }> {
    return this.request('/dashboard/stats')
  }

  async getRecentActivity(limit: number = 10): Promise<{
    expenses: Expense[]
    settlements: any[]
  }> {
    return this.request(`/dashboard/activity?limit=${limit}`)
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export default
export default apiClient