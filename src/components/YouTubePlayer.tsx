import { useState, useRef } from 'react'

interface YouTubePlayerProps {
  videoId: string;
  thumbnail?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  controls?: boolean;
  start?: number;
  end?: number;
  className?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  thumbnail,
  title,
  width = '100%',
  height = '315',
  autoplay = false,
  controls = true,
  start,
  end,
  className = '',
  onReady,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const getEmbedUrl = () => {
    const params = new URLSearchParams()
    
    if (autoplay) params.append('autoplay', '1')
    if (!controls) params.append('controls', '0')
    if (start) params.append('start', start.toString())
    if (end) params.append('end', end.toString())
    params.append('rel', '0')
    params.append('modestbranding', '1')
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  const handlePlay = () => {
    setIsPlaying(true)
    setIsLoading(true)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    onReady?.()
  }

  const handleIframeError = () => {
    setIsLoading(false)
    onError?.(new Error('Failed to load YouTube video'))
  }

  const getThumbnailUrl = () => {
    return thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const getVideoTitle = () => {
    return title || `YouTube video ${videoId}`
  }

  return (
    <div className={`youtube-player-container ${className}`} style={{ width, height }}>
      {!isPlaying ? (
        <div className="youtube-thumbnail" onClick={handlePlay}>
          <img src={getThumbnailUrl()} alt={getVideoTitle()} />
          
          <div className="play-button-overlay">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          
          {title && (
            <div className="video-title-overlay">{title}</div>
          )}
        </div>
      ) : (
        <div className="iframe-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={getEmbedUrl()}
            title={getVideoTitle()}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      )}
    </div>
  )
}

export default YouTubePlayer
