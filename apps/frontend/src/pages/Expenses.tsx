import { useState } from 'react'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  CreditCardIcon,
  UserGroupIcon,
  TrashIcon,
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import { useExpenses, useUserGroups, useDeleteExpense } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import AddExpenseModal from '../components/AddExpenseModal'
import EditExpenseModal from '../components/EditExpenseModal'

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showEditExpense, setShowEditExpense] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const { user } = useAuth()
  const { data: expensesData, isLoading: expensesLoading } = useExpenses()
  const { data: groups } = useUserGroups(user?.id || 0)
  const deleteExpenseMutation = useDeleteExpense()
  
  const processedExpenses = expensesData?.map(expense => {
    const userSplit = expense.splits.find(split => split.userId === user?.id)
    const date = new Date(expense.expenseDate)
    const userPaidThisExpense = expense.payer?.id === user?.id
    const userShare = userSplit?.amountOwed || 0
    
    // Calculate net balance for this expense  
    // If user paid: amount paid - user's share = net contribution
    // If user didn't pay: just the amount they owe
    const yourNetBalance = userPaidThisExpense ? 
      (expense.amount - userShare) : 
      (-userShare)
    
    return {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      category: expense.splitType.toLowerCase() === 'equal' ? 'Split Equal' : 
                expense.splitType.toLowerCase() === 'percentage' ? 'Split %' : 
                expense.splitType.toLowerCase() === 'exact_amount' ? 'Split Custom' : 'Split',
      group: expense.group?.name || 'Unknown Group',
      paidBy: expense.payer?.name === user?.name ? 'You' : expense.payer?.name || 'Unknown',
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      participants: expense.participants?.map(participant => 
        participant.id === user?.id ? 'You' : participant.name
      ) || [],
      yourShare: userShare,
      yourNetBalance: yourNetBalance,
      userPaidThis: userPaidThisExpense,
      receipt: false, // This would need to be added to the backend model if needed
      status: 'pending' // Backend doesn't track payment status yet
    }
  }) || []

  const categories = [
    { id: 'all', name: 'All Categories', icon: CreditCardIcon, color: 'from-gray-500 to-gray-700' },
    { id: 'food', name: 'Food', icon: CreditCardIcon, color: 'from-orange-500 to-red-500' },
    { id: 'transport', name: 'Transport', icon: CreditCardIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'accommodation', name: 'Accommodation', icon: CreditCardIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'entertainment', name: 'Entertainment', icon: CreditCardIcon, color: 'from-emerald-500 to-teal-500' }
  ]

  const groupOptions = [
    { id: 'all', name: 'All Groups' },
    ...(groups?.map(group => ({ 
      id: group.id.toString(), 
      name: group.name 
    })) || [])
  ]

  const filteredExpenses = processedExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.group.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || expense.category.toLowerCase() === selectedCategory
    const matchesGroup = selectedGroup === 'all' || expense.group === groups?.find(g => g.id.toString() === selectedGroup)?.name
    
    return matchesSearch && matchesCategory && matchesGroup
  })

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return '🍽️'
      case 'transport': return '🚗'
      case 'accommodation': return '🏨'
      case 'entertainment': return '🎬'
      default: return '💰'
    }
  }

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const yourTotal = filteredExpenses.reduce((sum, expense) => sum + expense.yourNetBalance, 0)

  const handleEditExpense = (expense: any) => {
    // Find the original expense data from the backend response
    const originalExpense = expensesData?.find(e => e.id === expense.id)
    if (originalExpense) {
      setEditingExpense(originalExpense)
      setShowEditExpense(true)
    }
  }

  const handleDeleteExpense = async (expenseId: number) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpenseMutation.mutateAsync(expenseId)
        // Success message or toast could be added here
      } catch (error) {
        console.error('Error deleting expense:', error)
        alert('Error deleting expense. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Your Expenses 💳
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Track and manage all your shared expenses
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`${showFilters ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-md border border-white/20 text-white px-4 md:px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2`}
          >
            <FunnelIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button 
            onClick={() => setShowAddExpense(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {expensesLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 opacity-75 rounded-2xl blur"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-600/50 rounded-xl animate-pulse"></div>
                  <div className="px-2 py-1 rounded-full bg-gray-600/50 animate-pulse h-6 w-20"></div>
                </div>
                <div>
                  <div className="bg-gray-600/50 rounded h-4 w-20 mb-1 animate-pulse"></div>
                  <div className="bg-gray-600/50 rounded h-8 w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-75 rounded-2xl blur group-hover:blur-md transition-all"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCardIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    {filteredExpenses.length} expenses
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-white">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-75 rounded-2xl blur group-hover:blur-md transition-all"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BanknotesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                    your share
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Your Net Balance</p>
                  <p className={`text-3xl font-black ${
                    yourTotal >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {yourTotal >= 0 ? '+' : ''}${yourTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-75 rounded-2xl blur group-hover:blur-md transition-all"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                    active groups
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Groups</p>
                  <p className="text-3xl font-black text-white">{groups?.length || 0}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id} className="bg-gray-800">
                {category.name}
              </option>
            ))}
          </select>

          {/* Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {groupOptions.map(group => (
              <option key={group.id} value={group.id} className="bg-gray-800">
                {group.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-white font-medium mb-3">Advanced Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Paid By</label>
                <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="all" className="bg-gray-800">All Members</option>
                  <option value="you" className="bg-gray-800">You</option>
                  <option value="others" className="bg-gray-800">Others</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {expensesLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 bg-gray-600/50 rounded-xl animate-pulse"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gray-600/50 rounded h-5 w-32 animate-pulse"></div>
                      <div className="bg-gray-600/50 rounded h-4 w-16 animate-pulse"></div>
                      <div className="bg-gray-600/50 rounded h-4 w-16 animate-pulse"></div>
                      <div className="bg-gray-600/50 rounded h-4 w-16 animate-pulse"></div>
                    </div>
                    <div className="bg-gray-600/50 rounded h-4 w-48 mb-3 animate-pulse"></div>
                    <div className="flex items-center space-x-2 mb-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-gray-600/50 rounded-full animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-right">
                    <div className="bg-gray-600/50 rounded h-6 w-20 mb-1 animate-pulse"></div>
                    <div className="bg-gray-600/50 rounded h-4 w-24 mb-2 animate-pulse"></div>
                    <div className="bg-gray-600/50 rounded h-4 w-16 animate-pulse"></div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="w-8 h-8 bg-gray-600/50 rounded-lg animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-600/50 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
          <div key={expense.id} className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between">
              {/* Left Side - Main Info */}
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center text-2xl">
                  {getCategoryIcon(expense.category)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{expense.description}</h3>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
                      {expense.category}
                    </span>
                    {expense.receipt && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-md font-medium">
                        Receipt
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                      expense.status === 'settled' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {expense.status === 'settled' ? 'Settled' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{expense.group}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(expense.date).toLocaleDateString()} at {expense.time}</span>
                    </span>
                    <span>Paid by {expense.paidBy}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-gray-400">Participants:</span>
                    {expense.participants.slice(0, 3).map((participant, index) => (
                      <div key={participant} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        participant === 'You' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}>
                        {participant === 'You' ? '👤' : participant.charAt(0)}
                      </div>
                    ))}
                    {expense.participants.length > 3 && (
                      <span className="text-xs text-gray-400">+{expense.participants.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Amount & Actions */}
              <div className="flex items-start space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-black text-white mb-1">${expense.amount.toFixed(2)}</div>
                  {expense.userPaidThis ? (
                    <div className="text-sm mb-2">
                      <div className="text-gray-400">Your share: ${expense.yourShare.toFixed(2)}</div>
                      <div className="text-emerald-400 font-medium">Net +${expense.yourNetBalance.toFixed(2)}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 mb-2">You owe: ${expense.yourShare.toFixed(2)}</div>
                  )}
                  <div className={`text-xs font-medium ${
                    expense.paidBy === 'You' 
                      ? 'text-emerald-400 flex items-center space-x-1' 
                      : 'text-orange-400 flex items-center space-x-1'
                  }`}>
                    {expense.paidBy === 'You' ? (
                      <>
                        <ArrowUpIcon className="h-3 w-3" />
                        <span>You paid</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon className="h-3 w-3" />
                        <span>You owe</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleEditExpense(expense)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-all"
                    title="Edit expense"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all"
                    title="Delete expense"
                    disabled={deleteExpenseMutation.isPending}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))
        ) : (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No expenses found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters, or add your first expense</p>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2 mx-auto"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Your First Expense</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSuccess={() => {
          setShowAddExpense(false)
          // Could add a toast notification here
        }}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        isOpen={showEditExpense}
        onClose={() => {
          setShowEditExpense(false)
          setEditingExpense(null)
        }}
        expense={editingExpense}
        onSuccess={() => {
          setShowEditExpense(false)
          setEditingExpense(null)
          // Could add a toast notification here
        }}
      />
    </div>
  )
}