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
import { useGroupBalance, useUserDebts, useGroups } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

export default function Balances() {
  const { user } = useAuth()
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showSettleModal, setShowSettleModal] = useState(false)

  // Fetch data from API
  const { data: groups, isLoading: groupsLoading } = useGroups()
  const { data: groupBalance, isLoading: balanceLoading } = useGroupBalance(selectedGroupId || (groups?.[0]?.id || 1))
  const { data: userDebts, isLoading: debtsLoading } = useUserDebts(user?.id || 0)

  const isLoading = groupsLoading || balanceLoading || debtsLoading

  // Use first group if none selected
  const currentGroupId = selectedGroupId || (groups?.[0]?.id || 1)
  
  // Calculate summary from group balance data
  const currentUserBalance = groupBalance?.userBalances?.find(ub => ub.userId === user?.id)
  const youOweTotal = currentUserBalance?.netBalance < 0 ? Math.abs(currentUserBalance.netBalance) : 0
  const owesYouTotal = currentUserBalance?.netBalance > 0 ? currentUserBalance.netBalance : 0
  const netBalance = owesYouTotal - youOweTotal

  // Generate settlement suggestions from backend settlements data
  const settlementSuggestions = groupBalance?.settlements?.map((settlement, index) => ({
    id: index + 1,
    from: settlement.debtorName,
    to: settlement.creditorName,
    amount: settlement.amount,
    description: `${settlement.debtorName} pays ${settlement.creditorName}`,
    savings: 'Optimal settlement'
  })) || []

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
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`${showHistory ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2`}
          >
            <ClockIcon className="h-5 w-5" />
            <span>History</span>
          </button>
          <button 
            onClick={() => setShowSettleModal(true)}
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
          <span className="text-white font-medium">Select group:</span>
          <select
            value={currentGroupId}
            onChange={(e) => setSelectedGroupId(Number(e.target.value))}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {groups?.map(group => (
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

      {/* User Balances List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Group Balances</h2>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg font-medium">
              {groupBalance?.groupName || 'Loading...'}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-xl bg-gray-600 h-14 w-14"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : groupBalance?.userBalances?.map((userBalance) => (
          <div key={userBalance.userId} className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              {/* Left Side - Person Info */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-600 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                  {userBalance.userName.charAt(0)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{userBalance.userName}</h3>
                    {userBalance.userId === user?.id && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
                        You
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Paid: ${userBalance.totalPaid.toFixed(2)}</span>
                    <span>Owes: ${userBalance.totalOwed.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Net Balance */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-2xl font-black mb-1 ${
                    userBalance.netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {userBalance.netBalance >= 0 ? '+' : ''}${userBalance.netBalance.toFixed(2)}
                  </div>
                  <div className={`text-xs font-medium flex items-center space-x-1 ${
                    userBalance.netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {userBalance.netBalance >= 0 ? (
                      <>
                        <ArrowUpIcon className="h-3 w-3" />
                        <span>Gets back</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon className="h-3 w-3" />
                        <span>Owes</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Settlement History</h2>
          <div className="space-y-3">
            {/* Mock history data */}
            {[
              { id: 1, date: '2025-08-20', from: 'You', to: 'Bob Smith', amount: 25.50, status: 'completed' },
              { id: 2, date: '2025-08-18', from: 'Alice Johnson', to: 'You', amount: 40.00, status: 'completed' },
              { id: 3, date: '2025-08-15', from: 'You', to: 'Diana Prince', amount: 15.75, status: 'completed' },
            ].map(settlement => (
              <div key={settlement.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="text-white font-medium">
                      {settlement.from} → {settlement.to}
                    </p>
                    <p className="text-gray-400 text-sm">{settlement.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${settlement.amount.toFixed(2)}</p>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-md">
                    {settlement.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && groupBalance?.userBalances?.length === 0 && (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <ScaleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No balances found!</h3>
          <p className="text-gray-400 mb-6">This group doesn't have any expenses yet</p>
          <p className="text-gray-400">Start by adding some expenses to see balances here.</p>
        </div>
      )}

      {/* Settlement Modal */}
      {showSettleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Settle All Balances</h3>
              <button
                onClick={() => setShowSettleModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                This will settle all outstanding balances in the current group using the optimal settlement plan.
              </p>
              
              {settlementSuggestions.map(suggestion => (
                <div key={suggestion.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">
                      {suggestion.from} → {suggestion.to}
                    </span>
                    <span className="text-emerald-400 font-medium">
                      ${suggestion.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSettleModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would call the settlement API
                  alert('Settlement functionality would be implemented here!')
                  setShowSettleModal(false)
                }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-medium transition-all"
              >
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}