import { useState, Fragment } from 'react'
import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UserMinusIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import { useGroup, useAddMemberToGroup, useRemoveMemberFromGroup, useUsers, useGroupExpenses } from '../hooks/useApi'
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
  const addMemberMutation = useAddMemberToGroup()
  const removeMemberMutation = useRemoveMemberFromGroup()
  
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [groupDetailsVisible, setGroupDetailsVisible] = useState(true)

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
                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setShowAddExpense(true)}
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all"
                        >
                          <CreditCardIcon className="h-5 w-5" />
                          <span>Add Expense</span>
                        </button>
                        <button
                          onClick={() => setShowAddMember(true)}
                          className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium transition-all"
                        >
                          <UserPlusIcon className="h-5 w-5" />
                          <span>Add Member</span>
                        </button>
                      </div>

                      {/* Group Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-white">{memberCount}</div>
                          <div className="text-gray-400 text-sm">Members</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-white">
                            {expensesLoading ? '...' : totalExpenses}
                          </div>
                          <div className="text-gray-400 text-sm">Total Expenses</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-white">
                            {expensesLoading ? '...' : `$${totalSpent.toFixed(2)}`}
                          </div>
                          <div className="text-gray-400 text-sm">Total Spent</div>
                        </div>
                      </div>

                      {/* Members Section */}
                      <div>
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
                          {group.members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
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
                                  <p className="text-gray-400 text-sm">{member.email}</p>
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
                                {member.id === user?.id && (
                                  <span className="text-xs text-gray-500 px-2 py-1">Current user</span>
                                )}
                                {isCreator && member.id === user?.id && (
                                  <span className="text-xs text-gray-500 px-2 py-1">You (Creator)</span>
                                )}
                              </div>
                            </div>
                          ))}
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
                      </div>
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