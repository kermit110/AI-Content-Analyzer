import React, { useCallback, useState } from 'react'
import { Upload, FileImage, FileVideo, Link, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onFileUpload: (files: FileList) => void
  isAnalyzing: boolean
}

export function FileUpload({ onFileUpload, isAnalyzing }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [urlError, setUrlError] = useState('')

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

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const getFileExtensionFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const extension = pathname.split('.').pop()?.toLowerCase()
      return extension || ''
    } catch {
      return ''
    }
  }

  const generateFilenameFromUrl = (url: string, contentType: string): string => {
    const extension = getFileExtensionFromUrl(url)
    const timestamp = Date.now()
    
    if (extension) {
      return `url-content-${timestamp}.${extension}`
    }
    
    // Fallback based on content type
    if (contentType.startsWith('image/')) {
      const imageExt = contentType.split('/')[1] || 'jpg'
      return `url-image-${timestamp}.${imageExt}`
    } else if (contentType.startsWith('video/')) {
      const videoExt = contentType.split('/')[1] || 'mp4'
      return `url-video-${timestamp}.${videoExt}`
    }
    
    return `url-content-${timestamp}`
  }

  const handleUrlSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setUrlError('')
    setIsLoadingUrl(true)

    try {
      // Validate URL format
      if (!validateUrl(url)) {
        throw new Error('Please enter a valid HTTP or HTTPS URL')
      }

      // Fetch the content
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'image/*,video/*',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || ''
      
      // Check if it's an image or video
      if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
        throw new Error('URL must point to an image or video file')
      }

      const blob = await response.blob()
      
      // Check file size (limit to 100MB)
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (blob.size > maxSize) {
        throw new Error('File is too large. Maximum size is 100MB')
      }

      // Create a file from the blob
      const filename = generateFilenameFromUrl(url, contentType)
      const file = new File([blob], filename, { 
        type: contentType,
        lastModified: Date.now()
      })

      // Create FileList-like object
      const fileList = new DataTransfer()
      fileList.items.add(file)
      
      onFileUpload(fileList.files)
      setUrl('')
      setShowUrlInput(false)
    } catch (error) {
      console.error('Failed to fetch URL:', error)
      setUrlError(error instanceof Error ? error.message : 'Failed to load content from URL')
    } finally {
      setIsLoadingUrl(false)
    }
  }, [url, onFileUpload])

  const handleUrlInputToggle = () => {
    setShowUrlInput(!showUrlInput)
    setUrlError('')
    setUrl('')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={isAnalyzing || isLoadingUrl}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload File
        </button>
        
        <button
          onClick={handleUrlInputToggle}
          disabled={isAnalyzing || isLoadingUrl}
          className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
        >
          <Link className="w-5 h-5 mr-2" />
          Enter URL
        </button>
      </div>

      {showUrlInput && (
        <div className="max-w-md mx-auto space-y-3">
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoadingUrl}
              />
              <button
                type="submit"
                disabled={isAnalyzing || isLoadingUrl || !url.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                {isLoadingUrl ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
            
            {urlError && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{urlError}</span>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter a direct link to an image or video file. Supported formats: JPG, PNG, GIF, WebP, MP4, WebM, MOV
            </p>
          </form>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isAnalyzing || isLoadingUrl ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onClick={() => !isAnalyzing && !isLoadingUrl && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isAnalyzing || isLoadingUrl}
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