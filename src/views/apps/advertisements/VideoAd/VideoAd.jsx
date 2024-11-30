/********** Standard imports.*********************/
import React, { useEffect, useState, useRef } from 'react'
/********************************************/

import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import MuteIcon from '@mui/icons-material/VolumeMute'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ReactPlayer from 'react-player'

const VideoAd = ({
  url,
  showPause = false,
  width='100%',
  height = '60px',
  showMute = false,
  muted = false,
  autoPlay = true,
  popup = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev)
  }

  const handleMute = () => {
    setIsMuted(prev => !prev)
  }

  return (
    <div
      className='video-ad'
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: popup ? 'column-reverse' : 'row',
        minWidth: { width },
        minHeight: { height }
      }}
    >
      {showPause ? (
        <IconButton onClick={handlePlayPause} color='info'>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      ) : (
        <></>
      )}
      <ReactPlayer
        playsinline={isPlaying}
        width={' '}
        height={height}
        minwidth={width}
        url={url}
        playing={isPlaying}
        loop={true}
        controls={false}
        muted={isMuted}
        onError={(error, data) => console.log('Video error occurred', error, data)}
      />
      {showMute ? (
        <IconButton onClick={handleMute} color='info'>
          {isMuted ? <VolumeOffIcon /> : <MuteIcon />}
        </IconButton>
      ) : (
        <></>
      )}
    </div>
  )
}

export default VideoAd
