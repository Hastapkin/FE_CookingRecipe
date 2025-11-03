import { useState } from 'react'
import YouTubePlayer from './YouTubePlayer'

interface VideoPreviewProps {
  videoId: string;
  thumbnail?: string;
  duration?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  showDuration?: boolean;
  onPlay?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoId,
  thumbnail,
  duration,
  className = '',
  width = '100%',
  height = '200px',
  showDuration = true,
  onPlay
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`video-preview ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <YouTubePlayer
        videoId={videoId}
        thumbnail={thumbnail}
        width="100%"
        height="100%"
        autoplay={false}
        controls={false}
        onReady={onPlay}
      />
      
      {showDuration && duration && (
        <div className="duration-badge">{duration}</div>
      )}
      
      {isHovered && (
        <div className="hover-overlay">
          <div className="play-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPreview
