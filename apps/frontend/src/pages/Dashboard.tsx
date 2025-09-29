import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CreditCardIcon, 
  UserGroupIcon, 
  ScaleIcon,
  PlusIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  FireIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useDashboardStats, useRecentActivity, useCurrentUser, useGroups } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import AddExpenseModal from '../components/AddExpenseModal'
import CreateGroupModal from '../components/CreateGroupModal'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  
  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: activity, isLoading: activityLoading } = useRecentActivity(4)
  const { data: groups, isLoading: groupsLoading } = useGroups()

  const statsCards = statsData ? [
    { 
      name: 'Total Spent', 
      value: `$${statsData.totalSpent.toFixed(2)}`, 
      change: `${statsData.monthlyChange.totalSpent >= 0 ? '+' : ''}${statsData.monthlyChange.totalSpent.toFixed(1)}% vs last month`,
      trend: statsData.monthlyChange.totalSpent >= 0 ? 'up' : 'down',
      color: 'from-blue-500 to-cyan-500',
      icon: CreditCardIcon
    },
    { 
      name: 'Active Groups', 
      value: statsData.activeGroups.toString(), 
      change: `${statsData.monthlyChange.activeGroups >= 0 ? '+' : ''}${statsData.monthlyChange.activeGroups} vs last month`,
      trend: statsData.monthlyChange.activeGroups >= 0 ? 'up' : 'down',
      color: 'from-purple-500 to-pink-500',
      icon: UserGroupIcon
    },
    { 
      name: 'Net Balance', 
      value: `${statsData.netBalance >= 0 ? '+' : ''}$${Math.abs(statsData.netBalance).toFixed(2)}`, 
      change: `${statsData.monthlyChange.netBalance >= 0 ? '+' : ''}$${Math.abs(statsData.monthlyChange.netBalance).toFixed(2)} vs last month`,
      trend: statsData.monthlyChange.netBalance >= 0 ? 'up' : 'down',
      color: 'from-emerald-500 to-teal-500',
      icon: ScaleIcon
    },
  ] : []

  const getCategoryIcon = (category: string) => {
    // Handle split types if they exist, otherwise use default
    switch (category.toLowerCase()) {
      case 'food': return '🍽️'
      case 'transport': return '🚗'
      case 'accommodation': return '🏨'
      case 'entertainment': return '🎬'
      case 'utilities': return '⚡'
      case 'shopping': return '🛒'
      case 'general': return '💳'  // Better icon for general expenses
      default: return '💳'  // Better default icon
    }
  }

  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase()
    if (name.includes('trip') || name.includes('travel') || name.includes('vacation')) return '✈️'
    if (name.includes('room') || name.includes('home') || name.includes('house')) return '🏠'
    if (name.includes('work') || name.includes('office') || name.includes('team')) return '💼'
    if (name.includes('food') || name.includes('restaurant') || name.includes('dinner')) return '🍽️'
    if (name.includes('family') || name.includes('friends')) return '👨‍👩‍👧‍👦'
    if (name.includes('party') || name.includes('celebration')) return '🎉'
    return '👥'
  }

  const getGroupColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500', 
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-rose-500'
    ]
    return colors[index % colors.length]
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${diffInDays}d ago`
    }
  }

  const recentExpenses = activity?.expenses?.map(expense => ({
    description: expense.description,
    amount: expense.amount,
    group: expense.groupName,
    date: getTimeAgo(expense.createdAt),
    paidBy: expense.paidByName === user?.name ? 'You' : expense.paidByName,
    avatar: getCategoryIcon(expense.category),
    category: expense.category
  })) || []

  // Handler functions for quick actions
  const handleAddExpense = () => {
    setShowAddExpenseModal(true)
  }
  
  const handleCreateGroup = () => {
    setShowCreateGroupModal(true)
  }
  

  const handleExportData = () => {
    // Create CSV export functionality
    if (!statsData) return
    
    const csvData = [
      ['Metric', 'Value'],
      ['Total Spent', `$${statsData.totalSpent.toFixed(2)}`],
      ['Active Groups', statsData.activeGroups.toString()],
      ['Net Balance', `$${statsData.netBalance.toFixed(2)}`],
      ['Monthly Change - Total Spent', `${statsData.monthlyChange.totalSpent.toFixed(1)}%`],
      ['Monthly Change - Active Groups', statsData.monthlyChange.activeGroups.toString()],
      ['Monthly Change - Net Balance', `$${statsData.monthlyChange.netBalance.toFixed(2)}`]
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `equalpay-dashboard-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            {`Hello, ${user?.name?.split(' ')[0] || 'User'}! 👋`}
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Here's your financial overview for today
          </p>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={handleExportData}
            disabled={!statsData}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 md:px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 opacity-75 rounded-2xl blur"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-600/50 rounded-xl animate-pulse"></div>
                  <div className="px-2 py-1 rounded-full bg-gray-600/50 animate-pulse h-6 w-20"></div>
                </div>
                <div>
                  <div className="bg-gray-600/50 rounded h-4 w-20 mb-2 animate-pulse"></div>
                  <div className="bg-gray-600/50 rounded h-8 w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          statsCards.map((stat) => (
            <div key={stat.name} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-75 rounded-2xl blur group-hover:blur-md transition-all`}></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.name}</p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={handleAddExpense} className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 rounded-xl blur-sm group-hover:blur-none transition-all"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all text-center">
            <PlusIcon className="h-6 w-6 text-white mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Add Expense</div>
          </div>
        </button>
        <button onClick={handleCreateGroup} className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-75 rounded-xl blur-sm group-hover:blur-none transition-all"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all text-center">
            <UserGroupIcon className="h-6 w-6 text-white mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Create Group</div>
          </div>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button 
                onClick={() => navigate('/expenses')}
                className="text-sm text-gray-400 hover:text-white transition-all"
              >
                View all
              </button>
            </div>
            <div className="space-y-4">
              {activityLoading ? (
                // Loading skeleton for recent expenses
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-white/5">
                    <div className="w-12 h-12 bg-gray-600/50 rounded-xl animate-pulse"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="bg-gray-600/50 rounded h-5 w-32 animate-pulse"></div>
                        <div className="bg-gray-600/50 rounded h-4 w-16 animate-pulse"></div>
                      </div>
                      <div className="bg-gray-600/50 rounded h-4 w-48 animate-pulse"></div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gray-600/50 rounded h-5 w-16 mb-1 animate-pulse"></div>
                      <div className="bg-gray-600/50 rounded h-3 w-12 animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : recentExpenses.length > 0 ? (
                recentExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-white/5">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center text-xl">
                      {expense.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-white">{expense.description}</p>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {expense.group} • Paid by {expense.paidBy} • {expense.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white text-lg">${expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">total amount</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent expenses to show</p>
                  <p className="text-sm text-gray-500 mt-1">Start by adding your first expense</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* This Month Summary */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">This Month</h3>
            <div className="space-y-3">
              {statsLoading ? (
                <>
                  <div className="flex justify-between">
                    <div className="bg-gray-600/50 rounded h-4 w-20 animate-pulse"></div>
                    <div className="bg-gray-600/50 rounded h-4 w-24 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="bg-gray-600/50 rounded h-4 w-20 animate-pulse"></div>
                    <div className="bg-gray-600/50 rounded h-4 w-24 animate-pulse"></div>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <div className="bg-gray-600/50 rounded h-4 w-24 animate-pulse"></div>
                      <div className="bg-gray-600/50 rounded h-4 w-20 animate-pulse"></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Spent</span>
                    <span className="text-white font-semibold">${statsData?.totalSpent?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Groups</span>
                    <span className="text-white font-semibold">{statsData?.activeGroups || 0}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{statsData?.netBalance && statsData.netBalance >= 0 ? 'You are owed' : 'You owe'}</span>
                      <span className={`font-bold ${statsData?.netBalance && statsData.netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {statsData?.netBalance && statsData.netBalance >= 0 ? '+' : ''}${Math.abs(statsData?.netBalance || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Your Active Groups */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Active Groups</h3>
            <div className="space-y-3">
              {groupsLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-600/50 animate-pulse"></div>
                      <div>
                        <div className="bg-gray-600/50 rounded h-4 w-20 mb-1 animate-pulse"></div>
                        <div className="bg-gray-600/50 rounded h-3 w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-gray-600/50 rounded-full animate-pulse"></div>
                  </div>
                ))
              ) : groups && groups.length > 0 ? (
                groups.slice(0, 5).map((group, index) => (
                  <div key={group.id} className="flex items-center justify-between rounded-lg p-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r ${getGroupColor(index)}`}>
                        <span className="text-sm">{getGroupIcon(group.name)}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{group.name}</div>
                        <div className="text-gray-400 text-xs">
                          {group.members?.length || 0} members • Created {getTimeAgo(group.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No groups yet</p>
                  <p className="text-gray-500 text-xs mt-1">Create your first group to get started</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        onSuccess={() => {
          setShowAddExpenseModal(false)
          // Could add a toast notification here
        }}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSuccess={() => {
          setShowCreateGroupModal(false)
          // Could add a toast notification here
        }}
      />
    </div>
  )
}