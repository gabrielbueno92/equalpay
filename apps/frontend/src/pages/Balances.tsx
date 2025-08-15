import { motion } from 'framer-motion'
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function Balances() {
  const balances = [
    {
      name: 'Maria',
      amount: 45.20,
      type: 'owes_you' as const,
      group: 'Weekend Trip',
    },
    {
      name: 'Alex',
      amount: 23.50,
      type: 'you_owe' as const,
      group: 'Roommates',
    },
    {
      name: 'John',
      amount: 8.40,
      type: 'you_owe' as const,
      group: 'Work Lunch',
    },
  ]

  const settlements = [
    {
      from: 'You',
      to: 'Maria',
      amount: 50.00,
      optimal: true,
    },
    {
      from: 'Alex',
      to: 'You',
      amount: 23.50,
      optimal: true,
    },
  ]

  const getBalanceColor = (type: string) => {
    return type === 'owes_you' 
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-red-600 dark:text-red-400'
  }

  const getBalanceSign = (type: string) => {
    return type === 'owes_you' ? '+' : '-'
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
            Balances
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            See who owes what and settle your debts
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center space-x-2"
        >
          <CheckCircleIcon className="h-5 w-5" />
          <span>Settle All</span>
        </motion.button>
      </motion.div>

      {/* Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-card text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            You are owed
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +$45.20
          </p>
        </div>
        <div className="glass-card text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            You owe
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            -$31.90
          </p>
        </div>
        <div className="glass-card text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Net balance
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +$13.30
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Individual Balances */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Individual Balances
          </h2>
          <div className="space-y-4">
            {balances.map((balance, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-gray-800/5"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {balance.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {balance.group}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getBalanceColor(balance.type)}`}>
                    {getBalanceSign(balance.type)}${balance.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {balance.type === 'owes_you' ? 'owes you' : 'you owe'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Suggested Settlements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Suggested Settlements
          </h2>
          <div className="space-y-4">
            {settlements.map((settlement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-gray-800/5 hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {settlement.from}
                    </span>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {settlement.to}
                    </span>
                  </div>
                  {settlement.optimal && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-md font-medium">
                      Optimal
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${settlement.amount.toFixed(2)}
                  </p>
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Settle now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}