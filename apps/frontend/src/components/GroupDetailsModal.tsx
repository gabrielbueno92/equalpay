import { useState, Fragment } from 'react'
import * as React from 'react'
import { Dialog, Transition, Tab } from '@headlessui/react'
import { 
  XMarkIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UserMinusIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  InformationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useGroup, useAddMemberToGroup, useRemoveMemberFromGroup, useUsers, useGroupExpenses, useGroupBalance } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import AddExpenseModal from './AddExpenseModal'

interface GroupDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  groupId: number | null
}

export default function GroupDetailsModal({ isOpen, onClose, groupId }: GroupDetailsModalProps) {
  const { user } = useAuth()
  const { data: group, isLoading: groupLoading } = useGroup(groupId || 0)
  const { data: users } = useUsers()
  const { data: groupExpenses, isLoading: expensesLoading } = useGroupExpenses(groupId || 0)
  const { data: groupBalance, isLoading: balanceLoading } = useGroupBalance(groupId || 0)
  const addMemberMutation = useAddMemberToGroup()
  const removeMemberMutation = useRemoveMemberFromGroup()
  
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [groupDetailsVisible, setGroupDetailsVisible] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  // Reset states when modal is closed or groupId changes
  React.useEffect(() => {
    if (!isOpen) {
      setShowAddExpense(false)
      setShowAddMember(false)
      setGroupDetailsVisible(true)
    }
  }, [isOpen])

  React.useEffect(() => {
    setShowAddExpense(false)
    setShowAddMember(false)
    setGroupDetailsVisible(true)
  }, [groupId])

  // Hide group details when expense modal is open
  React.useEffect(() => {
    setGroupDetailsVisible(!showAddExpense)
  }, [showAddExpense])

  // Available users to add (not already in group)
  const availableUsers = users?.filter(u => {
    const isAlreadyMember = group?.members.some(member => member.id === u.id)
    return !isAlreadyMember
  }) || []

  const handleAddMember = async (userId: number) => {
    if (!groupId) return
    
    try {
      await addMemberMutation.mutateAsync({ groupId, userId })
      setShowAddMember(false)
    } catch (error: any) {
      console.error('Error adding member:', error)
      
      // Use backend error message if available
      const errorMessage = error?.response?.message || error?.message || 'Error adding member. Please try again.'
      
      // Handle specific error cases
      if (error?.response?.status === 400) {
        if (errorMessage.includes('ya es miembro') || errorMessage.includes('already')) {
          alert('This user is already a member of the group.')
        } else {
          alert(errorMessage)
        }
      } else if (error?.response?.status === 404) {
        alert('Group or user not found.')
      } else {
        alert(errorMessage)
      }
    }
  }

  const handleRemoveMember = async (userId: number) => {
    if (!groupId || !group) return
    
    const memberToRemove = group.members.find(m => m.id === userId)
    if (!memberToRemove) return

    // Check if member has expenses in this group
    const memberExpenses = groupExpenses?.filter(expense => 
      expense.payerId === userId || 
      expense.participants.some(p => p.id === userId)
    ) || []

    let confirmMessage = `Are you sure you want to remove ${memberToRemove.name} from ${group.name}?`
    
    if (memberExpenses.length > 0) {
      confirmMessage += `\n\nThis member is involved in ${memberExpenses.length} expense(s). Removing them may affect group balances and expense history.`
    }

    if (confirm(confirmMessage)) {
      try {
        await removeMemberMutation.mutateAsync({ groupId, userId })
        
        // Refresh expenses after member removal
        if (memberExpenses.length > 0) {
          // Note: In a real app, you might want to handle this more gracefully
          // For now, we'll just invalidate the queries to refresh the data
        }
      } catch (error: any) {
        console.error('Error removing member:', error)
        
        const errorMessage = error?.response?.message || error?.message || 'Error removing member. Please try again.'
        alert(errorMessage)
      }
    }
  }

  const isCreator = group?.createdBy === user?.id
  const memberCount = group?.members.length || 0
  
  // Calculate real group statistics
  const totalExpenses = groupExpenses?.length || 0
  const totalSpent = groupExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  if (!groupId) return null

  return (
    <>
      <Transition appear show={isOpen && groupDetailsVisible} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {group && (
                        <>
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                            👥
                          </div>
                          <div>
                            <Dialog.Title className="text-2xl font-bold text-white">
                              {group.name}
                            </Dialog.Title>
                            <p className="text-gray-400">{group.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {groupLoading ? (
                    <div className="space-y-6">
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-600/50 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-12 bg-gray-600/50 rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : group ? (
                    <div className="space-y-6">
                      {/* Quick Stats Overview */}
                      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-3xl font-bold text-white">{memberCount}</div>
                            <div className="text-blue-300 text-sm font-medium">Members</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-white">
                              {expensesLoading ? '...' : totalExpenses}
                            </div>
                            <div className="text-purple-300 text-sm font-medium">Expenses</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-white">
                              {expensesLoading ? '...' : `$${totalSpent.toFixed(2)}`}
                            </div>
                            <div className="text-emerald-300 text-sm font-medium">Total Spent</div>
                          </div>
                        </div>
                      </div>
                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setShowAddExpense(true)}
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                        >
                          <CreditCardIcon className="h-5 w-5" />
                          <span>Add Expense</span>
                        </button>
                        {isCreator && (
                          <button
                            onClick={() => setShowAddMember(true)}
                            className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                          >
                            <UserPlusIcon className="h-5 w-5" />
                            <span>Add Member</span>
                          </button>
                        )}
                        {!isCreator && (
                          <div 
                            className="flex items-center justify-center space-x-2 bg-blue-600/10 border border-blue-500/20 text-blue-300 px-4 py-3 rounded-xl font-medium relative group"
                            title="You're a member of this group. Only the group creator can add new members."
                          >
                            <UserGroupIcon className="h-5 w-5" />
                            <span>You're a Member</span>
                            <InformationCircleIcon className="h-4 w-4 text-blue-400" />
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              Only the group creator can add new members
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tabbed Content */}
                      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                        <Tab.List className="flex space-x-1 rounded-xl bg-white/5 p-1">
                          <Tab className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all ${
                              selected
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`
                          }>
                            <div className="flex items-center justify-center space-x-2">
                              <UserGroupIcon className="h-4 w-4" />
                              <span>Members</span>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all ${
                              selected
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`
                          }>
                            <div className="flex items-center justify-center space-x-2">
                              <CurrencyDollarIcon className="h-4 w-4" />
                              <span>Expenses</span>
                            </div>
                          </Tab>
                          <Tab className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all ${
                              selected
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`
                          }>
                            <div className="flex items-center justify-center space-x-2">
                              <ScaleIcon className="h-4 w-4" />
                              <span>Balances</span>
                            </div>
                          </Tab>
                        </Tab.List>
                        <Tab.Panels className="mt-6">
                          {/* Members Tab */}
                          <Tab.Panel>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-bold text-white">Members ({memberCount})</h3>
                              {isCreator && (
                                <button
                                  onClick={() => setShowAddMember(true)}
                                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                >
                                  <UserPlusIcon className="h-4 w-4" />
                                  <span>Add Member</span>
                                </button>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              {group.members.map(member => {
                                const memberBalance = groupBalance?.userBalances?.find(ub => ub.userId === member.id)
                                return (
                                  <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                        {member.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">
                                          {member.name}
                                          {member.id === user?.id && (
                                            <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">You</span>
                                          )}
                                          {group.createdBy === member.id && (
                                            <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">Creator</span>
                                          )}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-1">
                                          <p className="text-gray-400 text-sm">{member.email}</p>
                                          {memberBalance && (
                                            <div className={`text-xs px-2 py-1 rounded-full ${
                                              memberBalance.netBalance >= 0 
                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                              {memberBalance.netBalance >= 0 ? '+' : ''}${memberBalance.netBalance.toFixed(2)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      {isCreator && member.id !== user?.id && (
                                        <button
                                          onClick={() => handleRemoveMember(member.id)}
                                          disabled={removeMemberMutation.isPending}
                                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all opacity-60 hover:opacity-100"
                                          title="Remove member from group"
                                        >
                                          <UserMinusIcon className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Add Member Form */}
                            {showAddMember && availableUsers.length > 0 && (
                              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-white font-medium">Add New Member</h4>
                                  <button
                                    onClick={() => setShowAddMember(false)}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {availableUsers.map(availableUser => (
                                    <button
                                      key={availableUser.id}
                                      onClick={() => handleAddMember(availableUser.id)}
                                      disabled={addMemberMutation.isPending}
                                      className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 text-left transition-all disabled:opacity-50"
                                    >
                                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {availableUser.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">{availableUser.name}</p>
                                        <p className="text-gray-400 text-sm">{availableUser.email}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {showAddMember && availableUsers.length === 0 && (
                              <div className="mt-4 p-4 bg-white/5 rounded-lg text-center">
                                <p className="text-gray-400">No more users available to add</p>
                              </div>
                            )}
                          </Tab.Panel>

                          {/* Expenses Tab */}
                          <Tab.Panel>
                            {groupExpenses && groupExpenses.length > 0 ? (
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-bold text-white">Expenses ({groupExpenses.length})</h3>
                                  <button
                                    onClick={() => setShowAddExpense(true)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all"
                                  >
                                    Add New
                                  </button>
                                </div>
                                
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                  {groupExpenses.map(expense => {
                                    const userPaidThis = expense.payer?.id === user?.id
                                    const userSplit = expense.splits?.find(split => split.userId === user?.id)
                                    const userShare = userSplit?.amountOwed || 0
                                    
                                    return (
                                      <div key={expense.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border-l-4 border-blue-500/50">
                                        <div className="flex items-center space-x-3 flex-1">
                                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                                            <BanknotesIcon className="h-6 w-6" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-white font-semibold text-base">{expense.description}</p>
                                            <div className="flex items-center space-x-4 mt-1">
                                              <p className="text-gray-400 text-sm">
                                                Paid by {userPaidThis ? 'You' : expense.payer?.name || 'Unknown'}
                                              </p>
                                              <p className="text-gray-400 text-sm">
                                                {new Date(expense.expenseDate).toLocaleDateString()}
                                              </p>
                                              <div className="text-xs bg-gray-600/50 text-gray-300 px-2 py-1 rounded">
                                                Split {expense.participantCount} ways
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="text-right">
                                          <div className="text-xl font-bold text-white">${expense.amount.toFixed(2)}</div>
                                          {userPaidThis ? (
                                            <div className="text-sm">
                                              <div className="text-gray-400">Your share: ${userShare.toFixed(2)}</div>
                                              <div className="text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-1 rounded mt-1">
                                                Net +${(expense.amount - userShare).toFixed(2)}
                                              </div>
                                            </div>
                                          ) : userShare > 0 ? (
                                            <div className="text-sm">
                                              <div className="text-orange-400 font-semibold bg-orange-500/20 px-2 py-1 rounded">
                                                You owe: ${userShare.toFixed(2)}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="text-sm text-gray-400">Not involved</div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <BanknotesIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg font-medium mb-2">No expenses yet</p>
                                <p className="text-gray-500 text-sm mb-6">Start tracking group expenses by adding your first one</p>
                                <button
                                  onClick={() => setShowAddExpense(true)}
                                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                                >
                                  Add First Expense
                                </button>
                              </div>
                            )}
                          </Tab.Panel>

                          {/* Balances Tab */}
                          <Tab.Panel>
                            {groupBalance && groupBalance.userBalances && groupBalance.userBalances.length > 0 ? (
                              <div>
                                {/* Check if everyone is settled up */}
                                {groupBalance.userBalances.every(ub => Math.abs(ub.netBalance) < 0.01) ? (
                                  <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/30 rounded-xl text-center">
                                    <CheckCircleIcon className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                                    <p className="text-emerald-400 font-bold text-xl mb-2">All settled up! 🎉</p>
                                    <p className="text-gray-400">Everyone is squared away in this group</p>
                                  </div>
                                ) : (
                                  <>
                                    {/* Settlement Actions Priority */}
                                    {groupBalance.settlements && groupBalance.settlements.length > 0 && (
                                      <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                          <h4 className="text-lg font-bold text-white">💰 Settlement Actions</h4>
                                          <div className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                                            {groupBalance.settlements.filter(s => s.debtorId === user?.id || s.creditorId === user?.id).length} for you
                                          </div>
                                        </div>
                                        <div className="space-y-3">
                                          {groupBalance.settlements.map((settlement, index) => {
                                            const isInvolvedInSettlement = settlement.debtorId === user?.id || settlement.creditorId === user?.id
                                            return (
                                              <div 
                                                key={index} 
                                                className={`p-4 rounded-xl border transition-all ${
                                                  isInvolvedInSettlement 
                                                    ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30 shadow-lg' 
                                                    : 'bg-white/5 border-gray-600/30'
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-2">
                                                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                        {settlement.debtorName.charAt(0)}
                                                      </div>
                                                      <div className="text-white font-medium">
                                                        {settlement.debtorId === user?.id ? 'You' : settlement.debtorName}
                                                      </div>
                                                    </div>
                                                    <ArrowRightIcon className="h-5 w-5 text-orange-400" />
                                                    <div className="flex items-center space-x-2">
                                                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                        {settlement.creditorName.charAt(0)}
                                                      </div>
                                                      <div className="text-white font-medium">
                                                        {settlement.creditorId === user?.id ? 'you' : settlement.creditorName}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  
                                                  <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                      <div className="text-xl font-bold text-orange-400">
                                                        ${settlement.amount.toFixed(2)}
                                                      </div>
                                                      {isInvolvedInSettlement && (
                                                        <div className="text-xs text-gray-400">
                                                          {settlement.debtorId === user?.id ? 'You need to pay' : 'You will receive'}
                                                        </div>
                                                      )}
                                                    </div>
                                                    
                                                    {isInvolvedInSettlement && (
                                                      <button
                                                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
                                                        onClick={() => {
                                                          alert(`Settlement feature coming soon!\n\n${settlement.debtorName} → ${settlement.creditorName}: $${settlement.amount.toFixed(2)}\n\nThis will allow you to mark payments as completed and update group balances automatically.`)
                                                        }}
                                                      >
                                                        {settlement.debtorId === user?.id ? '✓ Mark as Paid' : '✓ Confirm Receipt'}
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    {/* Detailed User Balances */}
                                    <div>
                                      <h4 className="text-lg font-bold text-white mb-4">📊 Member Balances</h4>
                                      <div className="space-y-3">
                                        {groupBalance.userBalances.map(userBalance => (
                                          <div key={userBalance.userId} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                                            <div className="flex items-center space-x-4">
                                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                                userBalance.netBalance >= 0 
                                                  ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                                                  : 'bg-gradient-to-r from-red-500 to-orange-600'
                                              }`}>
                                                {userBalance.userName.charAt(0)}
                                              </div>
                                              <div>
                                                <p className="text-white font-semibold text-base">
                                                  {userBalance.userName}
                                                  {userBalance.userId === user?.id && (
                                                    <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">You</span>
                                                  )}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-1">
                                                  <p className="text-gray-400 text-sm">
                                                    💳 Paid: <span className="text-emerald-400 font-medium">${userBalance.totalPaid.toFixed(2)}</span>
                                                  </p>
                                                  <p className="text-gray-400 text-sm">
                                                    🧾 Share: <span className="text-orange-400 font-medium">${userBalance.totalOwed.toFixed(2)}</span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            <div className="text-right">
                                              <div className={`text-2xl font-bold mb-1 ${
                                                userBalance.netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                                              }`}>
                                                {userBalance.netBalance >= 0 ? '+' : ''}${userBalance.netBalance.toFixed(2)}
                                              </div>
                                              <div className={`text-sm font-medium flex items-center justify-end space-x-1 px-2 py-1 rounded ${
                                                userBalance.netBalance >= 0 
                                                  ? 'text-emerald-400 bg-emerald-500/20' 
                                                  : 'text-red-400 bg-red-500/20'
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
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <ScaleIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg font-medium mb-2">No balances to show</p>
                                <p className="text-gray-500 text-sm">Add some expenses to see balance calculations</p>
                              </div>
                            )}
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>

                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Group not found</p>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
          preselectedGroupId={groupId || undefined}
          onSuccess={() => {
            setShowAddExpense(false)
            // Could add a toast notification here
          }}
        />
      )}
    </>
  )
}