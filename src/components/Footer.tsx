import React from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} New World Software. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}