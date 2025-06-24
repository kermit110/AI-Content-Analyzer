import React, { useState, useCallback, useRef } from 'react'
import { Header } from './components/Header'
import { FileUpload } from './components/FileUpload'
import { AnalysisResult } from './components/AnalysisResult'
import { AnalysisHistory } from './components/AnalysisHistory'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Footer } from './components/Footer'
import { analyzeContent } from './utils/analyzer'
import type { AnalysisResult as AnalysisResultType, HistoryItem } from './types'

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentResult, setCurrentResult] = useState<AnalysisResultType | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  // Ref for the results section to enable smooth scrolling
  const resultsRef = useRef<HTMLDivElement>(null)

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return

    const file = files[0]
    setCurrentFile(file)
    setIsAnalyzing(true)
    setCurrentResult(null)

    // Scroll to results section after a brief delay to allow state updates
    setTimeout(() => {
      scrollToResults()
    }, 100)

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = await analyzeContent(file)
      setCurrentResult(result)
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        result,
        timestamp: new Date()
      }
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]) // Keep last 10 items
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NWS - AI Content Detector
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Upload images or videos to analyze what percentage is AI-generated with detailed insights and confidence scores.
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
            </div>

            {/* Results Section - This is where we scroll to */}
            <div ref={resultsRef}>
              {/* Loading State */}
              {isAnalyzing && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
                  <LoadingSpinner />
                </div>
              )}

              {/* Results Section */}
              {currentResult && currentFile && !isAnalyzing && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
                  <AnalysisResult result={currentResult} file={currentFile} />
                </div>
              )}
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <AnalysisHistory history={history} />
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App