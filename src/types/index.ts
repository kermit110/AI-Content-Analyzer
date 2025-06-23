export interface AnalysisResult {
  aiProbability: number
  confidence: number
  processingTime: number
  modelVersion: string
  indicators: Indicator[]
  explanation?: string
}

export interface Indicator {
  name: string
  score: number
  description?: string
}

export interface HistoryItem {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  result: AnalysisResult
  timestamp: Date
}