import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../services/api'
import type { 
  User, 
  Group, 
  Expense, 
  Balance, 
  CreateGroupRequest, 
  CreateExpenseRequest 
} from '../services/api'

// Query Keys
export const queryKeys = {
  auth: ['auth'] as const,
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  groups: ['groups'] as const,
  group: (id: number) => ['groups', id] as const,
  expenses: (groupId?: number) => ['expenses', groupId] as const,
  expense: (id: number) => ['expenses', id] as const,
  balances: (groupId?: number) => ['balances', groupId] as const,
  userBalances: (userId: number) => ['balances', 'user', userId] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
  recentActivity: ['dashboard', 'activity'] as const,
}

// Auth Hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth,
    queryFn: () => apiClient.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem('authToken'), // Only run if token exists
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      apiClient.login(username, password),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth, data.user)
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['balances'] })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      username, 
      email, 
      password, 
      fullName 
    }: { 
      username: string
      email: string 
      password: string
      fullName: string 
    }) => apiClient.register(username, email, password, fullName),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth, data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

// User Hooks
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiClient.getUsers(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiClient.getUserById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

// Group Hooks
export function useGroups() {
  return useQuery({
    queryKey: queryKeys.groups,
    queryFn: () => apiClient.getGroups(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useGroup(id: number) {
  return useQuery({
    queryKey: queryKeys.group(id),
    queryFn: () => apiClient.getGroupById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (group: CreateGroupRequest) => apiClient.createGroup(group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

export function useUpdateGroup(id: number) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (group: Partial<CreateGroupRequest>) => apiClient.updateGroup(id, group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.groups })
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

export function useAddMemberToGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      apiClient.addMemberToGroup(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group(groupId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.groups })
    },
  })
}

export function useRemoveMemberFromGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      apiClient.removeMemberFromGroup(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group(groupId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.groups })
    },
  })
}

// Expense Hooks
export function useExpenses(groupId?: number) {
  return useQuery({
    queryKey: queryKeys.expenses(groupId),
    queryFn: () => apiClient.getExpenses(groupId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useExpense(id: number) {
  return useQuery({
    queryKey: queryKeys.expense(id),
    queryFn: () => apiClient.getExpenseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (expense: CreateExpenseRequest) => apiClient.createExpense(expense),
    onSuccess: (newExpense) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.group(newExpense.groupId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.balances() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
      queryClient.invalidateQueries({ queryKey: queryKeys.recentActivity })
    },
  })
}

export function useUpdateExpense(id: number) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (expense: Partial<CreateExpenseRequest>) => apiClient.updateExpense(id, expense),
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(id) })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.group(updatedExpense.groupId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.balances() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.balances() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
      queryClient.invalidateQueries({ queryKey: queryKeys.recentActivity })
    },
  })
}

export function useMarkExpenseSplitAsPaid() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ expenseId, splitId }: { expenseId: number; splitId: number }) =>
      apiClient.markExpenseSplitAsPaid(expenseId, splitId),
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(updatedExpense.id) })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.balances() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

// Balance Hooks
export function useGroupBalance(groupId: number) {
  return useQuery({
    queryKey: queryKeys.balances(groupId),
    queryFn: () => apiClient.getGroupBalance(groupId),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useUserDebts(userId: number) {
  return useQuery({
    queryKey: queryKeys.userBalances(userId),
    queryFn: () => apiClient.getUserDebts(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useSettleBalance() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      fromUserId, 
      toUserId, 
      amount, 
      groupId 
    }: { 
      fromUserId: number
      toUserId: number
      amount: number
      groupId?: number 
    }) => apiClient.settleBalance(fromUserId, toUserId, amount, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.balances() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
      queryClient.invalidateQueries({ queryKey: queryKeys.recentActivity })
    },
  })
}

// Dashboard Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => apiClient.getDashboardStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.recentActivity,
    queryFn: () => apiClient.getRecentActivity(limit),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  })
}