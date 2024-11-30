import React from "react";
import { Button } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

const ShareButton = ({ title, text, url }) => {


  const handleShare = async () => {
    try {
      await navigator.share({ title, text, url });
      console.log("Content shared successfully");
    } catch (error) {
      console.error("Error sharing content:", error.message);
      alert("Navigator.share err" + error)
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<ShareIcon />}
      onClick={handleShare}
      style={{ backgroundColor: "primary" }}
      backgroundColor="red"
    >
      Share
    </Button>
  );
};

export default ShareButton;
