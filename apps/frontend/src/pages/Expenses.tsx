import { motion } from 'framer-motion'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

export default function Expenses() {
  const expenses = [
    {
      id: 1,
      description: 'Dinner at La Pasta',
      amount: 85.50,
      group: 'Weekend Trip',
      paidBy: 'You',
      date: '2025-01-14',
      participants: 4,
      category: 'Food',
    },
    {
      id: 2,
      description: 'Uber to Airport',
      amount: 34.20,
      group: 'Weekend Trip',
      paidBy: 'Maria',
      date: '2025-01-14',
      participants: 2,
      category: 'Transport',
    },
    {
      id: 3,
      description: 'Groceries',
      amount: 127.80,
      group: 'Roommates',
      paidBy: 'Alex',
      date: '2025-01-13',
      participants: 3,
      category: 'Food',
    },
    {
      id: 4,
      description: 'Movie tickets',
      amount: 45.00,
      group: 'Weekend Trip',
      paidBy: 'John',
      date: '2025-01-12',
      participants: 4,
      category: 'Entertainment',
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      Food: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      Transport: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      Entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      Shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all your shared expenses
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Expense</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="input-modern pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Expenses List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <div className="space-y-4">
          {expenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-gray-800/5 hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </h3>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{expense.group}</span>
                  <span>•</span>
                  <span>Paid by {expense.paidBy}</span>
                  <span>•</span>
                  <span>{expense.participants} participants</span>
                  <span>•</span>
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  ${expense.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${(expense.amount / expense.participants).toFixed(2)} per person
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}