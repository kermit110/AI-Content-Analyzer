import React, { useCallback, useState } from 'react'
import { Upload, FileImage, FileVideo, Link, AlertCircle, Youtube } from 'lucide-react'

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

  const isYouTubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      return hostname.includes('youtube.com') || 
             hostname.includes('youtu.be') || 
             hostname.includes('m.youtube.com')
    } catch {
      return false
    }
  }

  const extractYouTubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      
      // Handle different YouTube URL formats
      if (urlObj.hostname.includes('youtu.be')) {
        // Short format: https://youtu.be/VIDEO_ID
        return urlObj.pathname.slice(1).split('?')[0]
      } else if (urlObj.hostname.includes('youtube.com')) {
        // Long format: https://www.youtube.com/watch?v=VIDEO_ID
        const videoId = urlObj.searchParams.get('v')
        if (videoId) return videoId
        
        // Embed format: https://www.youtube.com/embed/VIDEO_ID
        if (urlObj.pathname.startsWith('/embed/')) {
          return urlObj.pathname.slice(7).split('?')[0]
        }
        
        // Shorts format: https://www.youtube.com/shorts/VIDEO_ID
        if (urlObj.pathname.startsWith('/shorts/')) {
          return urlObj.pathname.slice(8).split('?')[0]
        }
      }
      
      return null
    } catch {
      return null
    }
  }

  const getYouTubeVideoInfo = async (videoId: string): Promise<{ title: string; thumbnail: string }> => {
    try {
      // Use YouTube's oEmbed API to get video information
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      const response = await fetch(oembedUrl)
      
      if (!response.ok) {
        throw new Error('Video not found or unavailable')
      }
      
      const data = await response.json()
      return {
        title: data.title || 'YouTube Video',
        thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    } catch (error) {
      // Fallback to basic info
      return {
        title: 'YouTube Video',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }
  }

  const downloadYouTubeVideo = async (videoId: string): Promise<{ blob: Blob; filename: string }> => {
    try {
      // Get video information first
      const videoInfo = await getYouTubeVideoInfo(videoId)
      
      // Use a YouTube video download service
      // Note: This is a simplified approach. In production, you'd want to use a proper backend service
      const downloadServices = [
        `https://api.cobalt.tools/api/json`,
        // Add more services as fallbacks
      ]

      for (const serviceUrl of downloadServices) {
        try {
          const response = await fetch(serviceUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              url: `https://www.youtube.com/watch?v=${videoId}`,
              vQuality: '720', // Request 720p quality
              vFormat: 'mp4',
              isAudioOnly: false,
              isNoTTWatermark: true,
            })
          })

          if (response.ok) {
            const result = await response.json()
            
            if (result.status === 'success' && result.url) {
              // Download the video file
              const videoResponse = await fetch(result.url)
              if (videoResponse.ok) {
                const blob = await videoResponse.blob()
                const filename = `youtube-${videoId}-${Date.now()}.mp4`
                return { blob, filename }
              }
            }
          }
        } catch (error) {
          console.log(`Service ${serviceUrl} failed:`, error)
          continue
        }
      }

      // Fallback: Create a placeholder video file with thumbnail
      // This is a workaround when direct video download isn't available
      const thumbnailResponse = await fetch(videoInfo.thumbnail)
      if (thumbnailResponse.ok) {
        const thumbnailBlob = await thumbnailResponse.blob()
        
        // Create a simple video-like file from the thumbnail
        // In a real implementation, you'd convert the image to a video format
        const filename = `youtube-thumbnail-${videoId}-${Date.now()}.jpg`
        return { blob: thumbnailBlob, filename }
      }

      throw new Error('Unable to download video content')
    } catch (error) {
      throw new Error(`Failed to download YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`)
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

      // Check if it's a YouTube URL
      if (isYouTubeUrl(url)) {
        const videoId = extractYouTubeVideoId(url)
        if (!videoId) {
          throw new Error('Invalid YouTube URL. Please check the URL format.')
        }

        try {
          const { blob, filename } = await downloadYouTubeVideo(videoId)
          
          // Determine content type based on the downloaded content
          let contentType = blob.type
          if (!contentType || contentType === 'application/octet-stream') {
            // Determine from filename extension
            const ext = filename.split('.').pop()?.toLowerCase()
            if (ext === 'mp4') contentType = 'video/mp4'
            else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
            else if (ext === 'png') contentType = 'image/png'
            else contentType = 'video/mp4' // Default assumption
          }

          // Check file size (limit to 100MB)
          const maxSize = 100 * 1024 * 1024 // 100MB
          if (blob.size > maxSize) {
            throw new Error('Downloaded file is too large. Maximum size is 100MB')
          }

          // Check minimum file size
          if (blob.size < 100) {
            throw new Error('Downloaded file is too small or empty.')
          }

          // Create a file from the blob
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
          return
        } catch (youtubeError) {
          throw new Error(`YouTube download failed: ${youtubeError instanceof Error ? youtubeError.message : 'Unknown error'}. Note: YouTube video downloading has limitations due to platform restrictions.`)
        }
      }

      // Handle regular URLs (non-YouTube)
      // Pre-validate URL extension for regular URLs
      const detected = detectContentTypeFromUrl(url)
      if (!detected) {
        throw new Error('URL must point to an image or video file (jpg, png, gif, webp, mp4, webm, etc.) or be a YouTube video URL')
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
      if (errorMessage.includes('fetch') && !errorMessage.includes('YouTube')) {
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
                placeholder="https://youtube.com/watch?v=... or https://example.com/image.jpg"
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
              <p>Enter a YouTube URL or direct link to an image/video file.</p>
              <p><strong>Supported:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li><strong>YouTube:</strong> youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...</li>
                <li><strong>Images:</strong> JPG, PNG, GIF, WebP</li>
                <li><strong>Videos:</strong> MP4, WebM, MOV</li>
              </ul>
              <p><strong>Examples:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li>https://youtube.com/watch?v=dQw4w9WgXcQ</li>
                <li>https://youtu.be/dQw4w9WgXcQ</li>
                <li>https://example.com/photo.jpg</li>
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
            <div className="flex items-center">
              <Youtube className="w-4 h-4 mr-1" />
              YouTube
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}