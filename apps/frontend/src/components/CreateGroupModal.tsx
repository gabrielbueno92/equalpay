import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { useCreateGroup, useUsers, useAddMemberToGroup } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateGroupModal({ isOpen, onClose, onSuccess }: CreateGroupModalProps) {
  const { user } = useAuth()
  const { data: users, isLoading: usersLoading } = useUsers()
  const createGroupMutation = useCreateGroup()
  const addMemberMutation = useAddMemberToGroup()
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  
  // Available users (excluding current user as they'll be added automatically as creator)
  const availableUsers = users?.filter(u => u.id !== user?.id) || []

  const toggleMember = (userId: number) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a group name')
      return
    }

    if (!user?.id) {
      alert('User not found')
      return
    }

    try {
      // Create the group first
      const newGroup = await createGroupMutation.mutateAsync({
        group: {
          name: formData.name.trim(),
          description: formData.description.trim()
        },
        creatorId: user.id
      })
      
      // Add selected members to the group
      if (selectedMembers.length > 0) {
        await Promise.all(
          selectedMembers.map(userId => 
            addMemberMutation.mutateAsync({ groupId: newGroup.id, userId })
          )
        )
      }
      
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData({
        name: '',
        description: ''
      })
      setSelectedMembers([])
    } catch (error) {
      console.error('Error creating group:', error)
      alert('Error creating group. Please try again.')
    }
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
                    Create New Group
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Group Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Group Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter group name"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                      placeholder="Enter group description (optional)"
                      rows={3}
                    />
                  </div>

                  {/* Add Members */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <UserPlusIcon className="h-4 w-4 inline mr-1" />
                      Add Members ({selectedMembers.length} selected)
                    </label>
                    
                    {usersLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-8 h-8 bg-gray-600/50 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                              <div className="bg-gray-600/50 rounded h-4 w-32 animate-pulse"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : availableUsers.length > 0 ? (
                      <div className="max-h-48 overflow-y-auto space-y-2 bg-white/5 rounded-lg p-3">
                        {availableUsers.map(member => (
                          <label key={member.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-all">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => toggleMember(member.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{member.name}</p>
                              <p className="text-gray-400 text-sm">{member.email}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-sm">No other users available to add</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      You will be automatically added as the group creator
                    </p>
                  </div>

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
                      disabled={createGroupMutation.isPending || addMemberMutation.isPending}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      {(createGroupMutation.isPending || addMemberMutation.isPending) 
                        ? 'Creating...' 
                        : `Create Group${selectedMembers.length > 0 ? ` (${selectedMembers.length + 1} members)` : ''}`}
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