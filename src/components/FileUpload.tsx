import React, { useCallback, useState } from 'react'
import { Upload, FileImage, FileVideo, Link } from 'lucide-react'

interface FileUploadProps {
  onFileUpload: (files: FileList) => void
  isAnalyzing: boolean
}

export function FileUpload({ onFileUpload, isAnalyzing }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileUpload(files)
    }
  }, [onFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files)
    }
  }, [onFileUpload])

  const handleUrlSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const file = new File([blob], 'url-content', { type: blob.type })
      const fileList = new DataTransfer()
      fileList.items.add(file)
      onFileUpload(fileList.files)
      setUrl('')
      setShowUrlInput(false)
    } catch (error) {
      console.error('Failed to fetch URL:', error)
    }
  }, [url, onFileUpload])

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={isAnalyzing}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload File
        </button>
        
        <button
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={isAnalyzing}
          className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
        >
          <Link className="w-5 h-5 mr-2" />
          Enter URL
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter image or video URL..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isAnalyzing || !url.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
            >
              Analyze
            </button>
          </div>
        </form>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onClick={() => !isAnalyzing && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isAnalyzing}
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isDragOver ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse files
            </p>
          </div>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FileImage className="w-4 h-4 mr-1" />
              Images
            </div>
            <div className="flex items-center">
              <FileVideo className="w-4 h-4 mr-1" />
              Videos
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}