import { useState, ReactNode } from 'react'
import type { User } from '../services/api'
import { AuthContext } from '../hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // Demo mode - use a fake user for now since backend auth is not implemented
  const demoUser: User = {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@email.com',
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