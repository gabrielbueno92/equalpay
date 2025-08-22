import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useGroups, useCreateExpense } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ExpenseFormData {
  description: string
  amount: number
  groupId: number
  participantIds: number[]
  splitType: 'EQUAL' | 'PERCENTAGE' | 'EXACT_AMOUNT'
  paidById: number
  expenseDate: string
}

export default function AddExpenseModal({ isOpen, onClose, onSuccess }: AddExpenseModalProps) {
  const { user } = useAuth()
  const { data: groups, isLoading: groupsLoading } = useGroups()
  const createExpenseMutation = useCreateExpense()
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: 0,
    groupId: groups?.[0]?.id || 1,
    participantIds: [],
    splitType: 'EQUAL',
    paidById: user?.id || 1,
    expenseDate: new Date().toISOString().substring(0, 16)
  })

  const selectedGroup = groups?.find(g => g.id === formData.groupId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description || formData.amount <= 0) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await createExpenseMutation.mutateAsync({
        ...formData,
        participantIds: formData.participantIds.length > 0 
          ? formData.participantIds 
          : selectedGroup?.members.map(m => m.id) || []
      })
      
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData({
        description: '',
        amount: 0,
        groupId: groups?.[0]?.id || 1,
        participantIds: [],
        splitType: 'EQUAL',
        paidById: user?.id || 1,
        expenseDate: new Date().toISOString().substring(0, 16)
      })
    } catch (error) {
      console.error('Error creating expense:', error)
      alert('Error creating expense. Please try again.')
    }
  }

  const toggleParticipant = (memberId: number) => {
    setFormData(prev => ({
      ...prev,
      participantIds: prev.participantIds.includes(memberId)
        ? prev.participantIds.filter(p => p !== memberId)
        : [...prev.participantIds, memberId]
    }))
  }

  if (groupsLoading) {
    return null
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-white">
                    Add New Expense
                  </Dialog.Title>
                  <button
                    onClick={onClose}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="0.00"
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
                      onChange={(e) => setFormData(prev => ({ ...prev, groupId: parseInt(e.target.value), participantIds: [] }))}
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
                      value={formData.expenseDate.split('T')[0]}
                      onChange={(e) => setFormData(prev => ({ ...prev, expenseDate: e.target.value + 'T12:00:00' }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  {/* Participants */}
                  {selectedGroup && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Participants ({formData.participantIds.length === 0 ? selectedGroup.members.length : formData.participantIds.length} people)
                      </label>
                      <div className="space-y-2">
                        {selectedGroup.members.map(member => (
                          <label key={member.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.participantIds.length === 0 || formData.participantIds.includes(member.id)}
                              onChange={() => toggleParticipant(member.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-white">{member.name}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Leave empty to include all group members
                      </p>
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