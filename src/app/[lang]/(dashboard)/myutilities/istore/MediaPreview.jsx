import React, { useState } from 'react';
import './MediaPreview.css'; // Import CSS file for styling
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import VideoPlayer from './VideoPlayer';
const MediaPreview = ({ mediaUrl,mediaType }) => {
  const [isClicked, setIsClicked] = useState(false);
  const isVideo = mediaType === 'video';
  const isImage = isVideo ? false : true;


  const togglePreview = () => {
    setIsClicked(!isClicked);
  };
{/* <video className="preview-media" controls>
          <source src={mediaUrl} type={`video/${mediaUrl.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video> */}
  return (
    <div className="media-preview-container">
      <div className="media-icon" onClick={togglePreview}><VideoCameraBackOutlinedIcon/></div>
      {isClicked && isImage && <img className="preview-media" onClick={togglePreview} src={mediaUrl} alt="Preview" />}
      {isClicked && isVideo && (        
        <VideoPlayer mediaUrl={mediaUrl}/>
      )}
    </div>
  );
};

export default MediaPreview;
