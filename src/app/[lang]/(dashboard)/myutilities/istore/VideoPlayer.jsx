import React from 'react';
import ReactPlayer from 'react-player';

function VideoPlayer({mediaUrl}) {
  return (
    <ReactPlayer url={mediaUrl} width="640" height="360" controls />
  );
}

export default VideoPlayer;