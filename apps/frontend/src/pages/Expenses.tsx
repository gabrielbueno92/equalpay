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

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [showAddExpense, setShowAddExpense] = useState(false)

  const expenses = [
    {
      id: 1,
      description: 'Dinner at La Pasta',
      amount: 85.50,
      category: 'Food',
      group: 'Weekend Trip',
      paidBy: 'You',
      date: '2024-01-15',
      time: '8:30 PM',
      participants: ['You', 'Maria', 'Alex', 'John'],
      yourShare: 21.38,
      receipt: true,
      status: 'settled'
    },
    {
      id: 2,
      description: 'Uber to Airport',
      amount: 34.20,
      category: 'Transport',
      group: 'Weekend Trip',
      paidBy: 'Maria',
      date: '2024-01-15',
      time: '6:00 AM',
      participants: ['You', 'Maria'],
      yourShare: 17.10,
      receipt: false,
      status: 'pending'
    },
    {
      id: 3,
      description: 'Hotel Room - 2 nights',
      amount: 127.80,
      category: 'Accommodation',
      group: 'Weekend Trip',
      paidBy: 'Alex',
      date: '2024-01-14',
      time: '3:00 PM',
      participants: ['You', 'Maria', 'Alex', 'John'],
      yourShare: 31.95,
      receipt: true,
      status: 'pending'
    },
    {
      id: 4,
      description: 'Morning Coffee',
      amount: 12.50,
      category: 'Food',
      group: 'Work Team',
      paidBy: 'You',
      date: '2024-01-14',
      time: '9:15 AM',
      participants: ['You', 'Emma', 'David'],
      yourShare: 4.17,
      receipt: false,
      status: 'settled'
    },
    {
      id: 5,
      description: 'Netflix Subscription',
      amount: 15.99,
      category: 'Entertainment',
      group: 'Roommates',
      paidBy: 'Sarah',
      date: '2024-01-13',
      time: '12:00 PM',
      participants: ['You', 'Sarah', 'Mike'],
      yourShare: 5.33,
      receipt: true,
      status: 'pending'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: CreditCardIcon, color: 'from-gray-500 to-gray-700' },
    { id: 'food', name: 'Food', icon: CreditCardIcon, color: 'from-orange-500 to-red-500' },
    { id: 'transport', name: 'Transport', icon: CreditCardIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'accommodation', name: 'Accommodation', icon: CreditCardIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'entertainment', name: 'Entertainment', icon: CreditCardIcon, color: 'from-emerald-500 to-teal-500' }
  ]

  const groups = [
    { id: 'all', name: 'All Groups' },
    { id: 'weekend-trip', name: 'Weekend Trip' },
    { id: 'roommates', name: 'Roommates' },
    { id: 'work-team', name: 'Work Team' }
  ]

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.group.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || expense.category.toLowerCase() === selectedCategory
    const matchesGroup = selectedGroup === 'all' || expense.group.toLowerCase().replace(' ', '-') === selectedGroup
    
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
  const yourTotal = filteredExpenses.reduce((sum, expense) => sum + expense.yourShare, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Your Expenses 💳
          </h1>
          <p className="text-gray-400 text-lg">
            Track and manage all your shared expenses
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <button 
            onClick={() => setShowAddExpense(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-gray-400 text-sm font-medium mb-1">Your Total</p>
              <p className="text-3xl font-black text-white">${yourTotal.toFixed(2)}</p>
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
              <p className="text-3xl font-black text-white">4</p>
            </div>
          </div>
        </div>
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
            {groups.map(group => (
              <option key={group.id} value={group.id} className="bg-gray-800">
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
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
                  <div className="text-sm text-gray-400 mb-2">Your share: ${expense.yourShare.toFixed(2)}</div>
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
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-all">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No expenses found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
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
  )
}