import React from 'react'
import { Sun, Moon } from 'lucide-react'

interface HeaderProps {
  title: string
  icon?: React.ReactNode
  isDarkMode: boolean
  onToggleDarkMode: () => void
  actions?: React.ReactNode
}

export function Header({ 
  title, 
  icon, 
  isDarkMode, 
  onToggleDarkMode, 
  actions 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-glass border-b border-gray-200 dark:border-gray-800">
      <div className="container-app py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {icon}
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {actions}
          
          <button
            onClick={onToggleDarkMode}
            className="btn-icon"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}