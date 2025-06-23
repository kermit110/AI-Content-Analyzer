import React from 'react'
import { Sun, Moon, ScanSearch } from 'lucide-react'

interface HeaderProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function Header({ isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <ScanSearch className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold">AI Content Detector</h1>
        </div>
        
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  )
}