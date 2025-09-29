import { useState, Fragment } from 'react'
import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUserGroups, useCreateExpense } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  preselectedGroupId?: number
}

interface ExpenseFormData {
  description: string
  amount: string
  groupId: number
  participantIds: number[]
  splitType: 'EQUAL' | 'PERCENTAGE' | 'EXACT_AMOUNT'
  paidById: number
  expenseDate: string
  selectAllParticipants: boolean
}

export default function AddExpenseModal({ isOpen, onClose, onSuccess, preselectedGroupId }: AddExpenseModalProps) {
  const { user } = useAuth()
  const { data: groups, isLoading: groupsLoading } = useUserGroups(user?.id || 0)
  const createExpenseMutation = useCreateExpense()
  
  // Ref for initial focus
  const descriptionInputRef = React.useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    groupId: preselectedGroupId || groups?.[0]?.id || 1,
    participantIds: [],
    splitType: 'EQUAL',
    paidById: user?.id || 1,
    expenseDate: new Date().toISOString(),
    selectAllParticipants: true
  })

  // Update groupId when preselectedGroupId changes or groups load
  React.useEffect(() => {
    if (preselectedGroupId) {
      setFormData(prev => ({ ...prev, groupId: preselectedGroupId }))
    } else if (groups?.[0]?.id && !preselectedGroupId) {
      setFormData(prev => ({ ...prev, groupId: groups[0].id }))
    }
  }, [preselectedGroupId, groups])

  const selectedGroup = groups?.find(g => g.id === formData.groupId)

  const handleClose = () => {
    onClose()
  }

  // Don't render the modal if we don't have the necessary data
  if (groupsLoading || !selectedGroup) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(formData.amount)
    if (!formData.description || !formData.amount || amount <= 0) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await createExpenseMutation.mutateAsync({
        description: formData.description,
        amount: parseFloat(formData.amount),
        groupId: formData.groupId,
        splitType: formData.splitType,
        paidById: formData.paidById,
        expenseDate: new Date(formData.expenseDate).toISOString(),
        participantIds: formData.selectAllParticipants 
          ? selectedGroup?.members.map(m => m.id) || []
          : formData.participantIds
      })
      
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        groupId: groups?.[0]?.id || 1,
        participantIds: [],
        splitType: 'EQUAL',
        paidById: user?.id || 1,
        expenseDate: new Date().toISOString(),
        selectAllParticipants: true
      })
    } catch (error) {
      console.error('Error creating expense:', error)
      alert('Error creating expense. Please try again.')
    }
  }

  const toggleParticipant = (memberId: number) => {
    setFormData(prev => {
      const newParticipantIds = prev.participantIds.includes(memberId)
        ? prev.participantIds.filter(p => p !== memberId)
        : [...prev.participantIds, memberId]
      
      return {
        ...prev,
        participantIds: newParticipantIds,
        selectAllParticipants: false // Switch to manual selection
      }
    })
  }

  const toggleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      selectAllParticipants: !prev.selectAllParticipants,
      participantIds: [] // Clear manual selections
    }))
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[60]" onClose={handleClose} initialFocus={descriptionInputRef}>
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
              <Dialog.Panel 
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 text-left align-middle shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-white">
                    Add New Expense
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <input
                      ref={descriptionInputRef}
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter expense description"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter amount (e.g., 25.50)"
                      required
                      min="0"
                    />
                  </div>

                  {/* Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Group *
                    </label>
                    <select
                      value={formData.groupId}
                      onChange={(e) => setFormData(prev => ({ ...prev, groupId: parseInt(e.target.value), participantIds: [], selectAllParticipants: true }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    >
                      {groups?.map(group => (
                        <option key={group.id} value={group.id} className="bg-gray-800">
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Split Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Split Type
                    </label>
                    <select
                      value={formData.splitType}
                      onChange={(e) => setFormData(prev => ({ ...prev, splitType: e.target.value as 'EQUAL' | 'PERCENTAGE' | 'EXACT_AMOUNT' }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="EQUAL" className="bg-gray-800">Split Equally</option>
                      <option value="PERCENTAGE" className="bg-gray-800">By Percentage</option>
                      <option value="EXACT_AMOUNT" className="bg-gray-800">Exact Amounts</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.expenseDate.split('T')[0]}
                      onChange={(e) => setFormData(prev => ({ ...prev, expenseDate: new Date(e.target.value + 'T12:00:00').toISOString() }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <p className="text-xs text-gray-400 mt-1">Expenses can only be recorded for past dates or today</p>
                  </div>

                  {/* Participants */}
                  {selectedGroup && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Split with ({formData.selectAllParticipants ? selectedGroup.members.length : formData.participantIds.length} people)
                      </label>
                      
                      {/* Select All Toggle */}
                      <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <label 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectAllParticipants}
                            onChange={(e) => {
                              e.stopPropagation()
                              toggleSelectAll()
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-white font-medium">Split with all group members</span>
                        </label>
                        <p className="text-xs text-gray-400 mt-1 ml-6">
                          Include everyone in {selectedGroup.name}
                        </p>
                      </div>

                      {/* Individual Selection */}
                      {!formData.selectAllParticipants && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400 mb-2">Or select specific people:</p>
                          {selectedGroup.members.map(member => (
                            <label 
                              key={member.id} 
                              className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={formData.participantIds.includes(member.id)}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  toggleParticipant(member.id)
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-white">{member.name}</span>
                              {member.id === user?.id && (
                                <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">You</span>
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createExpenseMutation.isPending}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      {createExpenseMutation.isPending ? 'Creating...' : 'Create Expense'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}