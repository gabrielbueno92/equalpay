export default function Dashboard() {
  const stats = [
    { 
      name: 'Total Spent', 
      value: '$2,847.30', 
      change: '+12.5%',
      trend: 'up',
      color: 'from-blue-500 to-cyan-500',
      icon: '💳'
    },
    { 
      name: 'Active Groups', 
      value: '4', 
      change: '+1',
      trend: 'up',
      color: 'from-purple-500 to-pink-500',
      icon: '👥'
    },
    { 
      name: 'Net Balance', 
      value: '-$156.80', 
      change: '-$23.40',
      trend: 'down',
      color: 'from-emerald-500 to-teal-500',
      icon: '⚖️'
    },
  ]

  const recentExpenses = [
    { 
      description: 'Dinner at La Pasta', 
      amount: 85.50, 
      group: 'Weekend Trip', 
      date: '2h ago',
      paidBy: 'You',
      avatar: '🍝',
      category: 'Food'
    },
    { 
      description: 'Uber to Airport', 
      amount: 34.20, 
      group: 'Weekend Trip', 
      date: '4h ago',
      paidBy: 'Maria',
      avatar: '🚗',
      category: 'Transport'
    },
    { 
      description: 'Hotel Room', 
      amount: 127.80, 
      group: 'Weekend Trip', 
      date: '6h ago',
      paidBy: 'Alex',
      avatar: '🏨',
      category: 'Accommodation'
    },
    { 
      description: 'Morning Coffee', 
      amount: 12.50, 
      group: 'Work Team', 
      date: '1d ago',
      paidBy: 'You',
      avatar: '☕',
      category: 'Food'
    },
  ]

  const quickActions = [
    { name: 'Add Expense', icon: '➕', color: 'from-blue-500 to-purple-600' },
    { name: 'Create Group', icon: '👥', color: 'from-purple-500 to-pink-500' },
    { name: 'Settle Up', icon: '💰', color: 'from-emerald-500 to-cyan-500' },
    { name: 'Analytics', icon: '📊', color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Good evening, Gabriel! 🌙
          </h1>
          <p className="text-gray-400 text-lg">
            Here's your financial overview for today
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all">
            Export Data
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg">
            + Add Expense
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r opacity-75 rounded-2xl blur group-hover:blur-md transition-all"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-xl">{stat.icon}</span>
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
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button key={action.name} className="group relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-75 rounded-xl blur-sm group-hover:blur-none transition-all`}></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all text-center">
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-white font-medium text-sm">{action.name}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button className="text-sm text-gray-400 hover:text-white">View all</button>
            </div>
            <div className="space-y-4">
              {recentExpenses.map((expense, index) => (
                <div key={index} className="group flex items-center space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
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
                    <p className="text-xs text-gray-400">per person</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* This Month Summary */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">You paid</span>
                <span className="text-white font-semibold">$1,247.30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your share</span>
                <span className="text-white font-semibold">$1,090.50</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">You are owed</span>
                  <span className="text-emerald-400 font-bold">+$156.80</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Groups */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Most Active</h3>
            <div className="space-y-3">
              {['Weekend Trip', 'Roommates', 'Work Team'].map((group, index) => (
                <div key={group} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                    index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}>
                    <span className="text-sm">👥</span>
                  </div>
                  <span className="text-white font-medium">{group}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}