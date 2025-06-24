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

  const generateFilenameFromUrl = (url: string, extension?: string): string => {
    const timestamp = Date.now()
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace(/^www\./, '')
    
    if (extension) {
      return `${hostname}-${timestamp}.${extension}`
    }
    
    return `url-content-${timestamp}`
  }

  const detectContentTypeFromUrl = (url: string): { type: string; extension: string } | null => {
    const extension = getFileExtensionFromUrl(url)
    
    // Image extensions
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'tiff', 'ico']
    if (imageExts.includes(extension)) {
      const mimeType = extension === 'jpg' ? 'image/jpeg' : 
                     extension === 'svg' ? 'image/svg+xml' : 
                     `image/${extension}`
      return { type: mimeType, extension }
    }
    
    // Video extensions
    const videoExts = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'm4v', 'mkv']
    if (videoExts.includes(extension)) {
      const mimeType = extension === 'mov' ? 'video/quicktime' : 
                     extension === 'avi' ? 'video/x-msvideo' : 
                     `video/${extension}`
      return { type: mimeType, extension }
    }
    
    return null
  }

  const fetchWithCorsProxy = async (url: string): Promise<{ blob: Blob; contentType: string }> => {
    // List of CORS proxy services (free tiers)
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://thingproxy.freeboard.io/fetch/',
    ]

    // First, try direct fetch (might work for some URLs)
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'image/*,video/*',
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const contentType = response.headers.get('content-type') || 'application/octet-stream'
        return { blob, contentType }
      }
    } catch (error) {
      console.log('Direct fetch failed, trying CORS proxies...')
    }

    // Try CORS proxies
    for (const proxy of corsProxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url)
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'image/*,video/*',
          },
        })

        if (response.ok) {
          const blob = await response.blob()
          
          // Try to determine content type from blob or URL
          let contentType = response.headers.get('content-type') || blob.type
          
          if (!contentType || contentType === 'application/octet-stream') {
            const detected = detectContentTypeFromUrl(url)
            contentType = detected?.type || 'application/octet-stream'
          }
          
          return { blob, contentType }
        }
      } catch (error) {
        console.log(`Proxy ${proxy} failed:`, error)
        continue
      }
    }

    throw new Error('Unable to fetch content. The URL may not be accessible or may not point to a valid image/video file.')
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

      // Pre-validate URL extension
      const detected = detectContentTypeFromUrl(url)
      if (!detected) {
        throw new Error('URL must point to an image or video file (jpg, png, gif, webp, mp4, webm, etc.)')
      }

      // Fetch the content with CORS handling
      const { blob, contentType } = await fetchWithCorsProxy(url)
      
      // Validate content type
      if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
        throw new Error('The fetched content is not a valid image or video file')
      }

      // Check file size (limit to 100MB)
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (blob.size > maxSize) {
        throw new Error('File is too large. Maximum size is 100MB')
      }

      // Check minimum file size (avoid empty files)
      if (blob.size < 100) {
        throw new Error('File is too small or empty. Please check the URL.')
      }

      // Create a file from the blob
      const filename = generateFilenameFromUrl(url, detected.extension)
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
      let errorMessage = 'Failed to load content from URL'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Provide helpful suggestions based on common issues
      if (errorMessage.includes('fetch')) {
        errorMessage += '. Try using a direct link to the image/video file, or the server may not allow external access.'
      }
      
      setUrlError(errorMessage)
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
              <div className="flex items-start space-x-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{urlError}</span>
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Enter a direct link to an image or video file.</p>
              <p><strong>Supported formats:</strong> JPG, PNG, GIF, WebP, MP4, WebM, MOV</p>
              <p><strong>Examples:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li>https://example.com/photo.jpg</li>
                <li>https://cdn.example.com/video.mp4</li>
                <li>Direct links from image hosting sites</li>
              </ul>
            </div>
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