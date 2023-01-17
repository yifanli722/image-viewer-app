import React, { useState } from 'react';
import axios from 'axios';
require('dotenv').config();

const Banner = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadBtnActive, setUploadBtnActive] = useState(false);
  const [previewUrl, setImagePreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0]
    if(previewUrl !== null) {
      URL.revokeObjectURL(previewUrl);
    }
    if(selectedFile.type === "image/jpeg" || selectedFile.type === "image/png") {
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
      setUploadBtnActive(true)
    }
  };


  //TODO: add loading indicator
  const handleUpload = () => {
    const config = {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    };

    axios.post(`${process.env.REACT_APP_BASE_URL}/api/UploadImage`, file, config)
    .then(response => {
      console.log(response.data);
      setUploadBtnActive(false)
    })
    .catch(error => {
      console.error(error);
      setError(error);
    });
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Upload an Image</h1>
      </div>
      <div className="banner-actions">
        <input type="file" onChange={handleFileSelect} />
        <button disabled={!uploadBtnActive} className="upload-button" onClick={handleUpload}>Upload Image</button>
      </div>
      {error && <div style={{ color: 'red' }} className="error">{error.message}</div>}
      {file &&
      <div>
        <h3> Preview Thumbnail </h3> 
        <img style={{ width: "500px", height: "750px", maxWidth: "1000px", maxHeight: "1500px" }} id="ItemPreview" src={previewUrl} alt="Selected file"></img>
      </div>
      }
    </div>
  );
};

export default Banner;
