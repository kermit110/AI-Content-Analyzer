import React from 'react'
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react'
import type { AnalysisResult } from '../types'

interface AnalysisResultProps {
  result: AnalysisResult
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const getStatusIcon = () => {
    if (result.aiProbability >= 80) return <XCircle className="w-6 h-6 text-red-500" />
    if (result.aiProbability >= 50) return <AlertTriangle className="w-6 h-6 text-yellow-500" />
    return <CheckCircle className="w-6 h-6 text-green-500" />
  }

  const getStatusText = () => {
    if (result.aiProbability >= 80) return 'Likely AI Generated'
    if (result.aiProbability >= 50) return 'Possibly AI Generated'
    return 'Likely Human Created'
  }

  const getStatusColor = () => {
    if (result.aiProbability >= 80) return 'text-red-600 dark:text-red-400'
    if (result.aiProbability >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getProgressColor = () => {
    if (result.aiProbability >= 80) return 'bg-red-500'
    if (result.aiProbability >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          {getStatusIcon()}
          <span className={`text-xl font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>AI Probability</span>
            <span>{result.aiProbability}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
              style={{ width: `${result.aiProbability}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Detection Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Confidence Score:</span>
              <span className="font-medium">{result.confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Processing Time:</span>
              <span className="font-medium">{result.processingTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Model Version:</span>
              <span className="font-medium">{result.modelVersion}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Indicators</h3>
          
          <div className="space-y-2">
            {result.indicators.map((indicator, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm">{indicator.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        indicator.score >= 70 ? 'bg-red-500' :
                        indicator.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${indicator.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{indicator.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result.explanation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Analysis Explanation</h4>
          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
            {result.explanation}
          </p>
        </div>
      )}
    </div>
  )
}