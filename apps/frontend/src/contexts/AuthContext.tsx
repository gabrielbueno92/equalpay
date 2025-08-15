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
  
  const { 
    data: user, 
    isLoading, 
    error 
  } = useCurrentUser()

  const isAuthenticated = !!user && !error
  
  // Show auth modal if user is not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [isLoading, isAuthenticated])

  const value: AuthContextType = {
    user: user || null,
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