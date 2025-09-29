import { useState } from 'react'
import { 
  UserGroupIcon,
  PlusIcon,
  CogIcon,
  HomeIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'
import { useUserGroups, useExpenses } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import CreateGroupModal from '../components/CreateGroupModal'
import GroupDetailsModal from '../components/GroupDetailsModal'

export default function Groups() {
  const { user } = useAuth()
  const { data: groupsData, isLoading: groupsLoading } = useUserGroups(user?.id || 0)
  const { data: allExpenses, isLoading: expensesLoading } = useExpenses()
  
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showGroupDetails, setShowGroupDetails] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

  const handleGroupClick = (groupId: number) => {
    setSelectedGroupId(groupId)
    setShowGroupDetails(true)
  }

  const getGroupIcon = (groupName: string) => {
    const name = groupName.toLowerCase()
    
    // Travel / Viajes / 旅游 / यात्रा / Voyage / Viagem / Viaggio / Reise
    if (name.includes('trip') || name.includes('travel') || name.includes('vacation') || 
        name.includes('viaje') || name.includes('vacaciones') || name.includes('turismo') ||
        name.includes('excursion') || name.includes('excursión') || name.includes('aventura') ||
        name.includes('旅游') || name.includes('旅行') || name.includes('度假') ||
        name.includes('यात्रा') || name.includes('छुट्टी') || name.includes('पर्यटन') ||
        name.includes('voyage') || name.includes('vacances') || name.includes('tourisme') ||
        name.includes('viagem') || name.includes('férias') || name.includes('passeio') ||
        name.includes('viaggio') || name.includes('vacanza') || name.includes('gita') ||
        name.includes('reise') || name.includes('urlaub') || name.includes('ausflug')) return '✈️'
    
    // Living / Hogar / 家庭 / घर / Maison / Casa / Casa / Haus
    if (name.includes('room') || name.includes('house') || name.includes('home') ||
        name.includes('casa') || name.includes('hogar') || name.includes('cuarto') ||
        name.includes('departamento') || name.includes('piso') || name.includes('roommate') ||
        name.includes('家') || name.includes('家庭') || name.includes('房间') ||
        name.includes('घर') || name.includes('कमरा') || name.includes('निवास') ||
        name.includes('maison') || name.includes('chambre') || name.includes('logement') ||
        name.includes('quarto') || name.includes('apartamento') || name.includes('moradia') ||
        name.includes('camera') || name.includes('appartamento') || name.includes('abitazione') ||
        name.includes('haus') || name.includes('zimmer') || name.includes('wohnung')) return '🏠'
    
    // Food / Comida / 食物 / भोजन / Nourriture / Comida / Cibo / Essen
    if (name.includes('food') || name.includes('restaurant') || name.includes('lunch') ||
        name.includes('comida') || name.includes('restaurante') || name.includes('almuerzo') ||
        name.includes('cena') || name.includes('desayuno') || name.includes('bar') ||
        name.includes('café') || name.includes('pizza') || name.includes('asado') ||
        name.includes('食物') || name.includes('餐厅') || name.includes('午餐') ||
        name.includes('भोजन') || name.includes('खाना') || name.includes('रेस्टोरेंट') ||
        name.includes('nourriture') || name.includes('restaurant') || name.includes('déjeuner') ||
        name.includes('almoço') || name.includes('jantar') || name.includes('lanche') ||
        name.includes('cibo') || name.includes('ristorante') || name.includes('pranzo') ||
        name.includes('essen') || name.includes('restaurant') || name.includes('mittagessen')) return '🍽️'
    
    // Work / Trabajo / 工作 / काम / Travail / Trabalho / Lavoro / Arbeit
    if (name.includes('work') || name.includes('office') || name.includes('team') ||
        name.includes('trabajo') || name.includes('oficina') || name.includes('equipo') ||
        name.includes('empresa') || name.includes('proyecto') || name.includes('meeting') ||
        name.includes('工作') || name.includes('办公室') || name.includes('团队') ||
        name.includes('काम') || name.includes('कार्यालय') || name.includes('टीम') ||
        name.includes('travail') || name.includes('bureau') || name.includes('équipe') ||
        name.includes('trabalho') || name.includes('escritório') || name.includes('equipe') ||
        name.includes('lavoro') || name.includes('ufficio') || name.includes('squadra') ||
        name.includes('arbeit') || name.includes('büro') || name.includes('team')) return '💼'
    
    // Sports / Deportes / 运动 / खेल / Sport / Esporte / Sport / Sport
    if (name.includes('gym') || name.includes('fitness') || name.includes('sport') ||
        name.includes('futbol') || name.includes('fútbol') || name.includes('deportes') ||
        name.includes('gimnasio') || name.includes('entrenamiento') || name.includes('paddle') ||
        name.includes('tenis') || name.includes('basquet') || name.includes('voley') ||
        name.includes('运动') || name.includes('健身') || name.includes('足球') ||
        name.includes('खेल') || name.includes('फुटबॉल') || name.includes('जिम') ||
        name.includes('sport') || name.includes('football') || name.includes('gymnastique') ||
        name.includes('futebol') || name.includes('academia') || name.includes('treino') ||
        name.includes('calcio') || name.includes('palestra') || name.includes('allenamento') ||
        name.includes('fußball') || name.includes('fitnessstudio') || name.includes('training')) return '⚽'
    
    // Entertainment / Entretenimiento / 娱乐 / मनोरंजन / Divertissement / Diversão / Divertimento / Unterhaltung
    if (name.includes('party') || name.includes('birthday') || name.includes('celebration') ||
        name.includes('fiesta') || name.includes('cumpleaños') || name.includes('celebración') ||
        name.includes('evento') || name.includes('juntada') || name.includes('salida') ||
        name.includes('娱乐') || name.includes('派对') || name.includes('生日') ||
        name.includes('मनोरंजन') || name.includes('पार्टी') || name.includes('जन्मदिन') ||
        name.includes('fête') || name.includes('anniversaire') || name.includes('célébration') ||
        name.includes('festa') || name.includes('aniversário') || name.includes('celebração') ||
        name.includes('festa') || name.includes('compleanno') || name.includes('celebrazione') ||
        name.includes('party') || name.includes('geburtstag') || name.includes('feier')) return '🎉'
    
    // Default
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
    // Filter expenses for this specific group
    const groupExpenses = allExpenses?.filter(expense => expense.groupId === group.id) || []
    
    // Calculate real statistics
    const totalExpenses = groupExpenses.length
    const totalSpent = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    // Calculate user's balance (simplified - shows net amount user owes/is owed)
    const yourBalance = 0 // This would be calculated from user's actual balances in the group
    
    // Get most recent expense for activity
    const mostRecentExpense = groupExpenses.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    
    const lastActivity = mostRecentExpense 
      ? getTimeAgo(mostRecentExpense.createdAt)
      : getTimeAgo(group.createdAt)
    
    const recentExpense = mostRecentExpense
      ? `${mostRecentExpense.description} - $${mostRecentExpense.amount.toFixed(2)}`
      : `Recent activity in ${group.name}`
    
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      memberCount: group.members.length,
      totalExpenses,
      totalSpent,
      yourBalance,
      lastActivity,
      avatar: getGroupIcon(group.name),
      color: getGroupColor(index),
      members: group.members.map(member => 
        member.id === user?.id ? 'You' : member.name
      ).slice(0, 4),
      recentExpense,
      currency: '$' // Default currency
    }
  }) || []

  // Helper function to categorize groups (8 languages: EN/ES/ZH/HI/FR/PT/IT/DE)
  const categorizeGroup = (groupName: string): string => {
    const name = groupName.toLowerCase()
    
    // Travel / Viajes / 旅游 / यात्रा / Voyage / Viagem / Viaggio / Reise
    if (name.includes('trip') || name.includes('travel') || name.includes('vacation') || 
        name.includes('viaje') || name.includes('vacaciones') || name.includes('turismo') ||
        name.includes('excursion') || name.includes('excursión') || name.includes('aventura') ||
        name.includes('旅游') || name.includes('旅行') || name.includes('度假') ||
        name.includes('यात्रा') || name.includes('छुट्टी') || name.includes('पर्यटन') ||
        name.includes('voyage') || name.includes('vacances') || name.includes('tourisme') ||
        name.includes('viagem') || name.includes('férias') || name.includes('passeio') ||
        name.includes('viaggio') || name.includes('vacanza') || name.includes('gita') ||
        name.includes('reise') || name.includes('urlaub') || name.includes('ausflug')) return 'travel'
    
    // Living / Hogar / 家庭 / घर / Maison / Casa / Casa / Haus
    if (name.includes('room') || name.includes('house') || name.includes('home') ||
        name.includes('casa') || name.includes('hogar') || name.includes('cuarto') ||
        name.includes('departamento') || name.includes('piso') || name.includes('roommate') ||
        name.includes('家') || name.includes('家庭') || name.includes('房间') ||
        name.includes('घर') || name.includes('कमरा') || name.includes('निवास') ||
        name.includes('maison') || name.includes('chambre') || name.includes('logement') ||
        name.includes('quarto') || name.includes('apartamento') || name.includes('moradia') ||
        name.includes('camera') || name.includes('appartamento') || name.includes('abitazione') ||
        name.includes('haus') || name.includes('zimmer') || name.includes('wohnung')) return 'living'
    
    // Food / Comida / 食物 / भोजन / Nourriture / Comida / Cibo / Essen
    if (name.includes('food') || name.includes('restaurant') || name.includes('lunch') ||
        name.includes('comida') || name.includes('restaurante') || name.includes('almuerzo') ||
        name.includes('cena') || name.includes('desayuno') || name.includes('bar') ||
        name.includes('café') || name.includes('pizza') || name.includes('asado') ||
        name.includes('食物') || name.includes('餐厅') || name.includes('午餐') ||
        name.includes('भोजन') || name.includes('खाना') || name.includes('रेस्टोरेंट') ||
        name.includes('nourriture') || name.includes('restaurant') || name.includes('déjeuner') ||
        name.includes('almoço') || name.includes('jantar') || name.includes('lanche') ||
        name.includes('cibo') || name.includes('ristorante') || name.includes('pranzo') ||
        name.includes('essen') || name.includes('restaurant') || name.includes('mittagessen')) return 'food'
    
    // Work / Trabajo / 工作 / काम / Travail / Trabalho / Lavoro / Arbeit
    if (name.includes('work') || name.includes('office') || name.includes('team') ||
        name.includes('trabajo') || name.includes('oficina') || name.includes('equipo') ||
        name.includes('empresa') || name.includes('proyecto') || name.includes('meeting') ||
        name.includes('工作') || name.includes('办公室') || name.includes('团队') ||
        name.includes('काम') || name.includes('कार्यालय') || name.includes('टीम') ||
        name.includes('travail') || name.includes('bureau') || name.includes('équipe') ||
        name.includes('trabalho') || name.includes('escritório') || name.includes('equipe') ||
        name.includes('lavoro') || name.includes('ufficio') || name.includes('squadra') ||
        name.includes('arbeit') || name.includes('büro') || name.includes('team')) return 'work'
    
    // Sports / Deportes / 运动 / खेल / Sport / Esporte / Sport / Sport
    if (name.includes('gym') || name.includes('fitness') || name.includes('sport') ||
        name.includes('futbol') || name.includes('fútbol') || name.includes('deportes') ||
        name.includes('gimnasio') || name.includes('entrenamiento') || name.includes('paddle') ||
        name.includes('tenis') || name.includes('basquet') || name.includes('voley') ||
        name.includes('运动') || name.includes('健身') || name.includes('足球') ||
        name.includes('खेल') || name.includes('फुटबॉल') || name.includes('जिम') ||
        name.includes('sport') || name.includes('football') || name.includes('gymnastique') ||
        name.includes('futebol') || name.includes('academia') || name.includes('treino') ||
        name.includes('calcio') || name.includes('palestra') || name.includes('allenamento') ||
        name.includes('fußball') || name.includes('fitnessstudio') || name.includes('training')) return 'sports'
    
    // Entertainment / Entretenimiento / 娱乐 / मनोरंजन / Divertissement / Diversão / Divertimento / Unterhaltung
    if (name.includes('party') || name.includes('birthday') || name.includes('celebration') ||
        name.includes('fiesta') || name.includes('cumpleaños') || name.includes('celebración') ||
        name.includes('evento') || name.includes('juntada') || name.includes('salida') ||
        name.includes('娱乐') || name.includes('派对') || name.includes('生日') ||
        name.includes('मनोरंजन') || name.includes('पार्टी') || name.includes('जन्मदिन') ||
        name.includes('fête') || name.includes('anniversaire') || name.includes('célébration') ||
        name.includes('festa') || name.includes('aniversário') || name.includes('celebração') ||
        name.includes('festa') || name.includes('compleanno') || name.includes('celebrazione') ||
        name.includes('party') || name.includes('geburtstag') || name.includes('feier')) return 'entertainment'
    
    return 'other'
  }

  const groupCategories = [
    { 
      name: 'All Groups', 
      count: processedGroups.length, 
      icon: () => <span className="text-xl">👥</span>, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      name: 'Travel', 
      count: processedGroups.filter(g => categorizeGroup(g.name) === 'travel').length, 
      icon: () => <span className="text-xl">✈️</span>, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      name: 'Living', 
      count: processedGroups.filter(g => categorizeGroup(g.name) === 'living').length, 
      icon: () => <span className="text-xl">🏠</span>, 
      color: 'from-emerald-500 to-teal-500' 
    },
    { 
      name: 'Food', 
      count: processedGroups.filter(g => categorizeGroup(g.name) === 'food').length, 
      icon: () => <span className="text-xl">🍽️</span>, 
      color: 'from-orange-500 to-red-500' 
    },
    { 
      name: 'Sports', 
      count: processedGroups.filter(g => categorizeGroup(g.name) === 'sports').length, 
      icon: () => <span className="text-xl">⚽</span>, 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      name: 'Work', 
      count: processedGroups.filter(g => categorizeGroup(g.name) === 'work').length, 
      icon: () => <span className="text-xl">💼</span>, 
      color: 'from-indigo-500 to-blue-500' 
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Your Groups 👥
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Manage and track expenses across all your groups
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Create Group</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(groupsLoading || expensesLoading) ? (
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
          groupCategories.sort((a, b) => b.count - a.count).slice(0, 4).map((category) => (
            <div key={category.name} className="relative group cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-75 rounded-xl blur-sm group-hover:blur-none transition-all`}></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all text-center">
                <div className="mx-auto mb-2 flex justify-center">
                  <category.icon />
                </div>
                <div className="text-white font-bold text-lg">{category.count}</div>
                <div className="text-gray-400 text-sm">{category.name}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(groupsLoading || expensesLoading) ? (
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
            <div key={group.id} className="group relative cursor-pointer h-full" onClick={() => handleGroupClick(group.id)}>
              <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-20 rounded-2xl blur group-hover:blur-lg transition-all`}></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group-hover:scale-[1.02] transform duration-200 h-full flex flex-col min-h-[400px] overflow-hidden">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4 min-w-0">
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                    <div className={`w-14 h-14 bg-gradient-to-r ${group.color} rounded-xl flex items-center justify-center shadow-lg text-2xl flex-shrink-0`}>
                      {group.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white truncate">{group.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 break-words">{group.description}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 whitespace-nowrap ${
                    group.yourBalance >= 0 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {group.yourBalance >= 0 ? '+' : ''}${Math.abs(group.yourBalance).toFixed(2)}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                  <div className="text-center min-w-0">
                    <div className="text-white font-bold text-lg truncate">{group.memberCount}</div>
                    <div className="text-gray-400 text-xs">Members</div>
                  </div>
                  <div className="text-center min-w-0">
                    <div className="text-white font-bold text-lg truncate">{group.currency}{group.totalSpent.toFixed(0)}</div>
                    <div className="text-gray-400 text-xs">Total Spent</div>
                  </div>
                  <div className="text-center min-w-0">
                    <div className="text-white font-bold text-lg truncate">{group.lastActivity || 'Today'}</div>
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
                <div className="bg-white/5 rounded-xl p-3 flex-grow flex flex-col justify-end min-w-0">
                  <div className="text-gray-400 text-xs font-medium mb-1">RECENT</div>
                  <div className="text-white text-sm line-clamp-2 break-words">{group.recentExpense}</div>
                </div>

                {/* Click Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-gray-400 text-xs">Click to view details</div>
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
                Create Group
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

      {/* Group Details Modal */}
      <GroupDetailsModal
        isOpen={showGroupDetails}
        onClose={() => {
          setShowGroupDetails(false)
          // Small delay to ensure state cleanup before resetting groupId
          setTimeout(() => setSelectedGroupId(null), 100)
        }}
        groupId={selectedGroupId}
      />

    </div>
  )
}