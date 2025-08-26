import { useState } from 'react'
import { 
  UserGroupIcon,
  PlusIcon,
  CogIcon,
  HomeIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'
import { useGroups, useCurrentUser } from '../hooks/useApi'
import CreateGroupModal from '../components/CreateGroupModal'

export default function Groups() {
  const { data: user } = useCurrentUser()
  const { data: groupsData, isLoading: groupsLoading } = useGroups()
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)

  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase()
    if (name.includes('trip') || name.includes('travel') || name.includes('vacation')) return '✈️'
    if (name.includes('room') || name.includes('house') || name.includes('home')) return '🏠'
    if (name.includes('work') || name.includes('office') || name.includes('team')) return '🍽️'
    if (name.includes('gym') || name.includes('fitness') || name.includes('sport')) return '🏃‍♂️'
    if (name.includes('food') || name.includes('restaurant') || name.includes('lunch')) return '🍽️'
    return '👥'
  }

  const getGroupColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
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

  const processedGroups = groupsData?.map((group, index) => {
    // Calculate your balance (simplified - in real implementation this would come from balances)
    const yourBalance = 0 // This would be calculated from user's actual balances in the group
    
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      memberCount: group.members.length,
      totalExpenses: 0, // Default value since backend doesn't provide this yet
      yourBalance,
      lastActivity: getTimeAgo(group.createdAt),
      avatar: getGroupIcon(group.name),
      color: getGroupColor(index),
      members: group.members.map(member => 
        member.id === user?.id ? 'You' : member.name
      ).slice(0, 4),
      recentExpense: `Recent activity in ${group.name}`,
      currency: '$' // Default currency
    }
  }) || []

  const groupCategories = [
    { 
      name: 'All Groups', 
      count: processedGroups.length, 
      icon: () => <span className="text-xl">👥</span>, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      name: 'Travel', 
      count: processedGroups.filter(g => g.name.toLowerCase().includes('trip') || g.name.toLowerCase().includes('travel')).length, 
      icon: () => <span className="text-xl">✈️</span>, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      name: 'Living', 
      count: processedGroups.filter(g => g.name.toLowerCase().includes('room') || g.name.toLowerCase().includes('house')).length, 
      icon: HomeIcon, 
      color: 'from-emerald-500 to-teal-500' 
    },
    { 
      name: 'Work', 
      count: processedGroups.filter(g => g.name.toLowerCase().includes('work') || g.name.toLowerCase().includes('team')).length, 
      icon: () => <span className="text-xl">🍽️</span>, 
      color: 'from-orange-500 to-red-500' 
    },
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
          <button 
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {groupsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 opacity-75 rounded-xl blur-sm"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                <div className="mx-auto mb-2 w-6 h-6 bg-gray-600/50 rounded animate-pulse"></div>
                <div className="bg-gray-600/50 rounded h-5 w-8 mx-auto mb-1 animate-pulse"></div>
                <div className="bg-gray-600/50 rounded h-4 w-16 mx-auto animate-pulse"></div>
              </div>
            </div>
          ))
        ) : (
          groupCategories.map((category) => (
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
          ))
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groupsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 opacity-20 rounded-2xl blur"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-gray-600/50 rounded-xl animate-pulse"></div>
                    <div>
                      <div className="bg-gray-600/50 rounded h-6 w-32 mb-1 animate-pulse"></div>
                      <div className="bg-gray-600/50 rounded h-4 w-24 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="bg-gray-600/50 rounded-full h-6 w-16 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="bg-gray-600/50 rounded h-5 w-8 mx-auto mb-1 animate-pulse"></div>
                      <div className="bg-gray-600/50 rounded h-3 w-12 mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="bg-gray-600/50 rounded h-3 w-16 mb-2 animate-pulse"></div>
                  <div className="flex space-x-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gray-600/50 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-600/30 rounded-xl p-3 mb-4">
                  <div className="bg-gray-600/50 rounded h-3 w-12 mb-1 animate-pulse"></div>
                  <div className="bg-gray-600/50 rounded h-4 w-24 animate-pulse"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-600/50 rounded-lg h-8 animate-pulse"></div>
                  <div className="flex-1 bg-gray-600/50 rounded-lg h-8 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        ) : processedGroups.length > 0 ? (
          processedGroups.map((group) => (
            <div key={group.id} className="group relative cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-20 rounded-2xl blur group-hover:blur-lg transition-all`}></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-14 h-14 bg-gradient-to-r ${group.color} rounded-xl flex items-center justify-center shadow-lg text-2xl`}>
                      {group.avatar}
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
                    <div className="text-white font-bold text-lg">{group.currency}{(group.totalExpenses || 0).toFixed(0)}</div>
                    <div className="text-gray-400 text-xs">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold text-lg">{group.lastActivity || 'Today'}</div>
                    <div className="text-gray-400 text-xs">Last Activity</div>
                  </div>
                </div>

                {/* Members */}
                <div className="mb-4">
                  <div className="text-gray-400 text-xs font-medium mb-2">MEMBERS</div>
                  <div className="flex items-center space-x-2">
                    {group.members.slice(0, 4).map((member, index) => (
                      <div key={member + index} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
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
          ))
        ) : (
          <div className="col-span-2">
            <div className="text-center py-12">
              <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No groups yet</h3>
              <p className="text-gray-400 mb-6">Create your first group to start splitting expenses</p>
              <button 
                onClick={() => setShowCreateGroupModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                <PlusIcon className="h-5 w-5 inline mr-2" />
                Create Your First Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSuccess={() => {
          setShowCreateGroupModal(false)
          // Could add a toast notification here
        }}
      />

      {/* Create Group CTA */}
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 opacity-50 rounded-2xl blur group-hover:blur-lg transition-all"></div>
        <div className="relative bg-black/20 backdrop-blur-xl border border-white/10 border-dashed rounded-2xl p-12 hover:border-white/20 transition-all text-center">
          <PlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Create a New Group</h3>
          <p className="text-gray-400 mb-6">Start splitting expenses with friends, family, or colleagues</p>
          <button 
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2 mx-auto"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </div>
  )
}