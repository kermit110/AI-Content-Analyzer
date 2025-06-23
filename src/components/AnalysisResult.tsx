import React from 'react'
import { AlertTriangle, CheckCircle, XCircle, Info, Shield, Eye, FileText, Zap } from 'lucide-react'
import type { AnalysisResult } from '../types'

interface AnalysisResultProps {
  result: AnalysisResult
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const getStatusIcon = () => {
    if (result.aiProbability >= 75) return <XCircle className="w-8 h-8 text-red-500" />
    if (result.aiProbability >= 50) return <AlertTriangle className="w-8 h-8 text-yellow-500" />
    if (result.aiProbability >= 25) return <Shield className="w-8 h-8 text-blue-500" />
    return <CheckCircle className="w-8 h-8 text-green-500" />
  }

  const getStatusText = () => {
    if (result.aiProbability >= 75) return 'Likely AI Generated'
    if (result.aiProbability >= 50) return 'Possibly AI Generated'
    if (result.aiProbability >= 25) return 'Probably Human Created'
    return 'Highly Likely Human Created'
  }

  const getStatusColor = () => {
    if (result.aiProbability >= 75) return 'text-red-600 dark:text-red-400'
    if (result.aiProbability >= 50) return 'text-yellow-600 dark:text-yellow-400'
    if (result.aiProbability >= 25) return 'text-blue-600 dark:text-blue-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getProgressColor = () => {
    if (result.aiProbability >= 75) return 'bg-red-500'
    if (result.aiProbability >= 50) return 'bg-yellow-500'
    if (result.aiProbability >= 25) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getConfidenceColor = () => {
    if (result.confidence >= 90) return 'text-green-600 dark:text-green-400'
    if (result.confidence >= 75) return 'text-blue-600 dark:text-blue-400'
    if (result.confidence >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getRiskLevel = () => {
    if (result.aiProbability >= 75) return { level: 'High Risk', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' }
    if (result.aiProbability >= 50) return { level: 'Medium Risk', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' }
    if (result.aiProbability >= 25) return { level: 'Low Risk', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' }
    return { level: 'Minimal Risk', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' }
  }

  const risk = getRiskLevel()

  return (
    <div className="space-y-8">
      {/* Main Result */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          {getStatusIcon()}
          <div>
            <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
            <span className={`text-2xl font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        
        {/* AI Probability Gauge */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">AI Probability</span>
            <span className="text-2xl font-bold">{result.aiProbability}%</span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-2000 ease-out ${getProgressColor()}`}
                style={{ width: `${result.aiProbability}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Human</span>
              <span>AI Generated</span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="inline-flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${risk.color}`}>
            {risk.level}
          </span>
          <span className={`text-lg font-semibold ${getConfidenceColor()}`}>
            {result.confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Detection Metrics */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Info className="w-6 h-6 mr-3 text-blue-500" />
            Detection Metrics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Processing Time</span>
              </div>
              <span className="text-lg font-semibold">{result.processingTime}ms</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-green-500" />
                <span className="font-medium">Model Version</span>
              </div>
              <span className="text-lg font-semibold">{result.modelVersion}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Confidence Score</span>
              </div>
              <span className={`text-lg font-semibold ${getConfidenceColor()}`}>
                {result.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Indicators */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="w-6 h-6 mr-3 text-orange-500" />
            Analysis Indicators
          </h3>
          
          <div className="space-y-3">
            {result.indicators.map((indicator, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{indicator.name}</span>
                  <span className="text-sm font-semibold">{indicator.score}%</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      indicator.score >= 70 ? 'bg-red-500' :
                      indicator.score >= 50 ? 'bg-yellow-500' :
                      indicator.score >= 30 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${indicator.score}%` }}
                  />
                </div>
                
                {indicator.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {indicator.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Explanation */}
      {result.explanation && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Detailed Analysis
          </h4>
          <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
            {result.explanation}
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-500" />
          Recommendations
        </h4>
        <div className="space-y-2 text-sm">
          {result.aiProbability >= 75 ? (
            <>
              <p>• Exercise caution when using this content</p>
              <p>• Verify authenticity through additional sources</p>
              <p>• Consider the context and source of the content</p>
              <p>• Be aware of potential misinformation risks</p>
            </>
          ) : result.aiProbability >= 50 ? (
            <>
              <p>• Further verification may be beneficial</p>
              <p>• Cross-reference with original sources when possible</p>
              <p>• Consider the content's intended use case</p>
            </>
          ) : (
            <>
              <p>• Content appears authentic based on current analysis</p>
              <p>• Standard verification practices still recommended</p>
              <p>• Monitor for updates in AI detection technology</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}