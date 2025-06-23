import React from 'react'
import { Clock, FileImage, FileVideo } from 'lucide-react'
import type { HistoryItem } from '../types'

interface AnalysisHistoryProps {
  history: HistoryItem[]
}

export function AnalysisHistory({ history }: AnalysisHistoryProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getResultColor = (probability: number) => {
    if (probability >= 80) return 'text-red-600 dark:text-red-400'
    if (probability >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center">
        <Clock className="w-5 h-5 mr-2 text-gray-500" />
        Recent Analysis
      </h3>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {item.fileType.startsWith('image/') ? (
                  <FileImage className="w-5 h-5 text-blue-500" />
                ) : (
                  <FileVideo className="w-5 h-5 text-purple-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.fileName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(item.fileSize)} • {formatDate(item.timestamp)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="text-right">
                <p className={`text-sm font-semibold ${getResultColor(item.result.aiProbability)}`}>
                  {item.result.aiProbability}% AI
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.result.confidence}% confidence
                </p>
              </div>
              
              <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.result.aiProbability >= 80 ? 'bg-red-500' :
                    item.result.aiProbability >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${item.result.aiProbability}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}