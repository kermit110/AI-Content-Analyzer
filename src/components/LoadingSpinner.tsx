import React from 'react'
import { Loader2, Brain } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <Loader2 className="w-20 h-20 text-blue-500 animate-spin absolute -top-2 -left-2" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Analyzing Content...</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Our AI is examining your file for artificial generation patterns
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Processing</span>
          <span>Please wait...</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}