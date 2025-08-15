import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Groups', path: '/groups', icon: '👥' },
    { name: 'Expenses', path: '/expenses', icon: '💰' },
    { name: 'Balances', path: '/balances', icon: '⚖️' },
  ]

  return (
    <nav className="relative">
      {/* Blur background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl"></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">💎</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              EqualPay
            </h1>
          </div>
          
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-lg"></div>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg"></div>
                )}
              </Link>
            )
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-xs text-gray-400 mb-2">Premium</div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-3">
            <div className="text-sm font-medium text-yellow-300 mb-1">⭐ Upgrade to Pro</div>
            <div className="text-xs text-gray-400">Unlock advanced features</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 min-h-screen p-6">
              <Navigation />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-h-screen">
              <main className="p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/expenses" element={<div className="text-white">Expenses coming soon...</div>} />
                  <Route path="/balances" element={<div className="text-white">Balances coming soon...</div>} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App