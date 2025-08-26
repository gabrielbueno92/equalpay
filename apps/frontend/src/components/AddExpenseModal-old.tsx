import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon,
  CreditCardIcon,
  UserGroupIcon,
  CalendarIcon,
  PhotoIcon,
  TagIcon,
  BanknotesIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { useGroups, useCreateExpense } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

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
    groupId: 0,
    participantIds: [],
    splitType: 'EQUAL',
    paidById: user?.id || 0,
    expenseDate: new Date().toISOString().split('T')[0]
  })

  // Update groupId and participantIds when groups load
  useEffect(() => {
    if (groups && groups.length > 0 && formData.groupId === 0) {
      const firstGroup = groups[0]
      setFormData(prev => ({
        ...prev,
        groupId: firstGroup.id,
        participantIds: firstGroup.members.map(m => m.id)
      }))
    }
  }, [groups, formData.groupId])

  const categories = [
    { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'from-orange-500 to-red-500' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: 'from-blue-500 to-cyan-500' },
    { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: 'from-purple-500 to-pink-500' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'from-emerald-500 to-teal-500' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'from-pink-500 to-rose-500' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: 'from-green-500 to-emerald-500' },
    { id: 'utilities', name: 'Utilities', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { id: 'other', name: 'Other', icon: '💰', color: 'from-gray-500 to-gray-700' }
  ]

  const selectedGroup = groups?.find(g => g.id === formData.groupId)
  const availableMembers = selectedGroup?.members || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createExpenseMutation.mutateAsync(formData)
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData({
        description: '',
        amount: 0,
        groupId: groups?.[0]?.id || 0,
        participantIds: groups?.[0]?.members.map(m => m.id) || [],
        splitType: 'EQUAL',
        paidById: user?.id || 0,
        expenseDate: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error creating expense:', error)
      // TODO: Show error notification
    }
  }

  const toggleParticipant = (memberId: number) => {
    if (memberId === user?.id) return // Can't remove yourself
    
    setFormData(prev => ({
      ...prev,
      participantIds: prev.participantIds.includes(memberId)
        ? prev.participantIds.filter(p => p !== memberId)
        : [...prev.participantIds, memberId]
    }))
  }

  const selectedCategory = categories.find(c => c.id === formData.category)

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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-white flex items-center space-x-2">
                    <BanknotesIcon className="h-8 w-8 text-blue-400" />
                    <span>Add New Expense</span>
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What did you spend on?"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.amount || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date
                      </label>
                      <div className="relative">
                        <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            formData.category === category.id
                              ? 'border-blue-400 bg-blue-500/20'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm text-white font-medium">{category.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Group
                    </label>
                    <div className="relative">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <select
                        value={formData.group}
                        onChange={(e) => {
                          const newGroup = e.target.value
                          const newGroupData = groups.find(g => g.id === newGroup)
                          setFormData(prev => ({ 
                            ...prev, 
                            group: newGroup,
                            participants: ['You'], // Reset participants when group changes
                            paidBy: 'You'
                          }))
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {groups.map(group => (
                          <option key={group.id} value={group.id} className="bg-gray-800">
                            {group.name} ({group.members.length} members)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Who was involved? ({formData.participants.length} people)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableMembers.map((member) => (
                        <button
                          key={member}
                          type="button"
                          onClick={() => toggleParticipant(member)}
                          disabled={member === 'You'}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            formData.participants.includes(member)
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-400'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
                          } ${member === 'You' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {member === 'You' ? '👤 You' : member}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Who Paid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Who paid?
                      </label>
                      <select
                        value={formData.paidBy}
                        onChange={(e) => setFormData(prev => ({ ...prev, paidBy: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {formData.participants.map(member => (
                          <option key={member} value={member} className="bg-gray-800">
                            {member === 'You' ? '👤 You' : member}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Split type
                      </label>
                      <select
                        value={formData.splitType}
                        onChange={(e) => setFormData(prev => ({ ...prev, splitType: e.target.value as 'equal' | 'custom' | 'percentage' }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="equal" className="bg-gray-800">Split equally</option>
                        <option value="custom" className="bg-gray-800">Custom amounts</option>
                        <option value="percentage" className="bg-gray-800">By percentage</option>
                      </select>
                    </div>
                  </div>

                  {/* Split Preview */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Split breakdown</h4>
                    <div className="space-y-2">
                      {formData.participants.map((participant) => {
                        const amountPerPerson = formData.amount / formData.participants.length
                        return (
                          <div key={participant} className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              {participant === 'You' ? '👤 You' : participant}
                            </span>
                            <span className="text-white font-medium">
                              ${amountPerPerson.toFixed(2)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional details..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Receipt Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Receipt (optional)
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-white/30 transition-all">
                      <div className="text-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-400 mb-2">Drop receipt here or click to upload</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setFormData(prev => ({ ...prev, receipt: e.target.files![0] }))
                            }
                          }}
                          className="hidden"
                          id="receipt-upload"
                        />
                        <label 
                          htmlFor="receipt-upload"
                          className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition-all"
                        >
                          Choose file
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg flex items-center space-x-2"
                    >
                      <BanknotesIcon className="h-5 w-5" />
                      <span>Add Expense</span>
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