import { useState } from 'react'
import { 
  ScaleIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserGroupIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

export default function Balances() {
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [showSettlement, setShowSettlement] = useState(false)

  const balances = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      avatar: 'M',
      amount: 45.20,
      type: 'owes_you',
      group: 'Weekend Trip',
      lastExpense: 'Hotel Room - 2 days ago',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Alex Johnson',
      avatar: 'A',
      amount: 23.80,
      type: 'owes_you',
      group: 'Weekend Trip',
      lastExpense: 'Uber to Airport - 3 days ago',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      avatar: 'S',
      amount: 67.50,
      type: 'you_owe',
      group: 'Roommates',
      lastExpense: 'Groceries - 1 week ago',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Emma Davis',
      avatar: 'E',
      amount: 12.30,
      type: 'you_owe',
      group: 'Work Team',
      lastExpense: 'Coffee - 2 days ago',
      status: 'pending'
    },
    {
      id: 5,
      name: 'John Smith',
      avatar: 'J',
      amount: 89.40,
      type: 'owes_you',
      group: 'Weekend Trip',
      lastExpense: 'Movie tickets - 5 days ago',
      status: 'settled'
    }
  ]

  const groups = [
    { id: 'all', name: 'All Groups' },
    { id: 'weekend-trip', name: 'Weekend Trip' },
    { id: 'roommates', name: 'Roommates' },
    { id: 'work-team', name: 'Work Team' }
  ]

  const filteredBalances = balances.filter(balance => {
    const matchesGroup = selectedGroup === 'all' || balance.group.toLowerCase().replace(' ', '-') === selectedGroup
    return matchesGroup
  })

  const pendingBalances = filteredBalances.filter(b => b.status === 'pending')
  const youOweTotal = pendingBalances.filter(b => b.type === 'you_owe').reduce((sum, b) => sum + b.amount, 0)
  const owesYouTotal = pendingBalances.filter(b => b.type === 'owes_you').reduce((sum, b) => sum + b.amount, 0)
  const netBalance = owesYouTotal - youOweTotal

  const settlementSuggestions = [
    {
      id: 1,
      from: 'You',
      to: 'Sarah Wilson',
      amount: 67.50,
      description: 'Simplify: Pay Sarah directly',
      savings: 'Saves 2 transactions'
    },
    {
      id: 2,
      from: 'Maria Rodriguez',
      to: 'You',
      amount: 45.20,
      description: 'Request payment from Maria',
      savings: 'Outstanding since 2 days'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Balances ⚖️
          </h1>
          <p className="text-gray-400 text-lg">
            Settle up and track who owes what
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2">
            <ClockIcon className="h-5 w-5" />
            <span>History</span>
          </button>
          <button 
            onClick={() => setShowSettlement(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2"
          >
            <BanknotesIcon className="h-5 w-5" />
            <span>Settle All</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-75 rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <ArrowUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                you get
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Others Owe You</p>
              <p className="text-3xl font-black text-white">${owesYouTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-75 rounded-2xl blur group-hover:blur-md transition-all"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <ArrowDownIcon className="h-6 w-6 text-white" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                you owe
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">You Owe Others</p>
              <p className="text-3xl font-black text-white">${youOweTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'} opacity-75 rounded-2xl blur group-hover:blur-md transition-all`}></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                <ScaleIcon className="h-6 w-6 text-white" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${netBalance >= 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                net balance
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Net Balance</p>
              <p className={`text-3xl font-black ${netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Filter */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <UserGroupIcon className="h-5 w-5 text-gray-400" />
          <span className="text-white font-medium">Filter by group:</span>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {groups.map(group => (
              <option key={group.id} value={group.id} className="bg-gray-800">
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Settlement Suggestions */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Smart Settlement Suggestions</h2>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full font-medium">
            Optimize payments
          </span>
        </div>
        <div className="space-y-4">
          {settlementSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                      {suggestion.from === 'You' ? '👤' : suggestion.from.charAt(0)}
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                      {suggestion.to === 'You' ? '👤' : suggestion.to.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium">${suggestion.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{suggestion.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md">
                    {suggestion.savings}
                  </span>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1">
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Execute</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Balances List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">All Balances</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg font-medium">
              Pending ({pendingBalances.length})
            </button>
            <button className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm rounded-lg font-medium hover:bg-gray-500/30">
              All ({filteredBalances.length})
            </button>
          </div>
        </div>

        {filteredBalances.map((balance) => (
          <div key={balance.id} className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              {/* Left Side - Person Info */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-600 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                  {balance.avatar}
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{balance.name}</h3>
                    {balance.status === 'settled' ? (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md font-medium">
                        <CheckCircleIcon className="h-3 w-3" />
                        <span>Settled</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-md font-medium">
                        <ClockIcon className="h-3 w-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{balance.group}</span>
                    </span>
                    <span>{balance.lastExpense}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Amount & Actions */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-2xl font-black mb-1 ${
                    balance.type === 'owes_you' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {balance.type === 'owes_you' ? '+' : '-'}${balance.amount.toFixed(2)}
                  </div>
                  <div className={`text-xs font-medium flex items-center space-x-1 ${
                    balance.type === 'owes_you' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {balance.type === 'owes_you' ? (
                      <>
                        <ArrowUpIcon className="h-3 w-3" />
                        <span>They owe you</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon className="h-3 w-3" />
                        <span>You owe them</span>
                      </>
                    )}
                  </div>
                </div>

                {balance.status === 'pending' && (
                  <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all">
                    {balance.type === 'owes_you' ? (
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1">
                        <PaperAirplaneIcon className="h-4 w-4" />
                        <span>Remind</span>
                      </button>
                    ) : (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1">
                        <CreditCardIcon className="h-4 w-4" />
                        <span>Pay Now</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBalances.length === 0 && (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <ScaleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">All settled up!</h3>
          <p className="text-gray-400 mb-6">You don't have any outstanding balances</p>
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-400">Great job keeping your finances balanced!</p>
        </div>
      )}
    </div>
  )
}