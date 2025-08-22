import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '../services/api'
import { useCurrentUser } from '../hooks/useApi'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // Demo mode - use a fake user for now since backend auth is not implemented
  const demoUser: User = {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@email.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // For demo purposes, always authenticated
  const isAuthenticated = true
  const isLoading = false

  const value: AuthContextType = {
    user: demoUser,
    isAuthenticated,
    isLoading,
    showAuthModal,
    setShowAuthModal,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}