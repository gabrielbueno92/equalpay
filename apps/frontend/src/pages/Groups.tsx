import { 
  UserGroupIcon,
  PlusIcon,
  CogIcon,
  HomeIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'

export default function Groups() {
  const groups = [
    { 
      id: 1, 
      name: 'Weekend Trip', 
      description: 'Paris vacation expenses', 
      memberCount: 4, 
      totalExpenses: 847.30, 
      yourBalance: -45.20,
      lastActivity: '2h ago',
      avatar: () => <span className="text-xl">✈️</span>,
      color: 'from-blue-500 to-cyan-500',
      members: ['You', 'Maria', 'Alex', 'John'],
      recentExpense: 'Hotel Room - $127.80'
    },
    { 
      id: 2, 
      name: 'Roommates', 
      description: 'Shared apartment costs', 
      memberCount: 3, 
      totalExpenses: 1247.80, 
      yourBalance: 23.50,
      lastActivity: '1d ago',
      avatar: HomeIcon,
      color: 'from-purple-500 to-pink-500',
      members: ['You', 'Sarah', 'Mike'],
      recentExpense: 'Groceries - $89.50'
    },
    { 
      id: 3, 
      name: 'Work Lunch', 
      description: 'Team lunch expenses', 
      memberCount: 8, 
      totalExpenses: 324.60, 
      yourBalance: -8.40,
      lastActivity: '3d ago',
      avatar: () => <span className="text-xl">🍽️</span>,
      color: 'from-emerald-500 to-teal-500',
      members: ['You', 'Emma', 'David', 'Lisa', '+4 more'],
      recentExpense: 'Thai Restaurant - $95.20'
    },
    { 
      id: 4, 
      name: 'Gym Buddies', 
      description: 'Fitness and supplements', 
      memberCount: 5, 
      totalExpenses: 156.40, 
      yourBalance: 12.80,
      lastActivity: '5d ago',
      avatar: () => <span className="text-xl">🏃‍♂️</span>,
      color: 'from-orange-500 to-red-500',
      members: ['You', 'Jake', 'Anna', 'Tom', 'Mia'],
      recentExpense: 'Protein Powder - $67.99'
    },
  ]

  const groupCategories = [
    { name: 'Travel', count: 2, icon: () => <span className="text-xl">✈️</span>, color: 'from-blue-500 to-cyan-500' },
    { name: 'Living', count: 1, icon: HomeIcon, color: 'from-purple-500 to-pink-500' },
    { name: 'Food', count: 1, icon: () => <span className="text-xl">🍽️</span>, color: 'from-emerald-500 to-teal-500' },
    { name: 'Entertainment', count: 1, icon: MusicalNoteIcon, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Your Groups 👥
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and track expenses across all your groups
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2">
            <CogIcon className="h-5 w-5" />
            <span>Group Settings</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {groupCategories.map((category) => (
          <div key={category.name} className="relative group cursor-pointer">
            <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-75 rounded-xl blur-sm group-hover:blur-none transition-all`}></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all text-center">
              <div className="mx-auto mb-2 flex justify-center">
                {typeof category.icon === 'function' ? (
                  <category.icon />
                ) : (
                  <category.icon className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="text-white font-bold text-lg">{category.count}</div>
              <div className="text-gray-400 text-sm">{category.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="group relative cursor-pointer">
            <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-20 rounded-2xl blur group-hover:blur-lg transition-all`}></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-14 h-14 bg-gradient-to-r ${group.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    {typeof group.avatar === 'function' ? (
                      <group.avatar />
                    ) : (
                      <group.avatar className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{group.name}</h3>
                    <p className="text-gray-400 text-sm">{group.description}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  group.yourBalance >= 0 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {group.yourBalance >= 0 ? '+' : ''}${Math.abs(group.yourBalance).toFixed(2)}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{group.memberCount}</div>
                  <div className="text-gray-400 text-xs">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">${group.totalExpenses.toFixed(0)}</div>
                  <div className="text-gray-400 text-xs">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{group.lastActivity}</div>
                  <div className="text-gray-400 text-xs">Last Activity</div>
                </div>
              </div>

              {/* Members */}
              <div className="mb-4">
                <div className="text-gray-400 text-xs font-medium mb-2">MEMBERS</div>
                <div className="flex items-center space-x-2">
                  {group.members.slice(0, 4).map((member, index) => (
                    <div key={member} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      member === 'You' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {member === 'You' ? '👤' : member.charAt(0)}
                    </div>
                  ))}
                  {group.memberCount > 4 && (
                    <div className="text-gray-400 text-xs">+{group.memberCount - 4}</div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-gray-400 text-xs font-medium mb-1">RECENT</div>
                <div className="text-white text-sm">{group.recentExpense}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all">
                  View Details
                </button>
                <button className={`flex-1 bg-gradient-to-r ${group.color} hover:opacity-80 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all`}>
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group CTA */}
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 opacity-50 rounded-2xl blur group-hover:blur-lg transition-all"></div>
        <div className="relative bg-black/20 backdrop-blur-xl border border-white/10 border-dashed rounded-2xl p-12 hover:border-white/20 transition-all text-center">
          <PlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Create a New Group</h3>
          <p className="text-gray-400 mb-6">Start splitting expenses with friends, family, or colleagues</p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2 mx-auto">
            <PlusIcon className="h-5 w-5" />
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </div>
  )
}