import React from 'react'

interface FooterProps {
  companyName?: string
  showYear?: boolean
  links?: Array<{ label: string; href: string }>
  className?: string
}

export function Footer({ 
  companyName = 'New World Software', 
  showYear = true,
  links = [],
  className = ''
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className={`bg-surface border-t border-default mt-auto ${className}`}>
      <div className="container-app py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-secondary">
              © {showYear ? currentYear : ''} {companyName}. All rights reserved.
            </p>
          </div>
          
          {links.length > 0 && (
            <div className="flex items-center space-x-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-secondary hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}