import React, { useState } from 'react';
import axios from 'axios';
require('dotenv').config();

const Banner = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadBtnActive, setUploadBtnActive] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileSelect = (event) => {
    const temp = event.target.files[0]
    setFile(temp);
    setImageSrc(URL.createObjectURL(temp));
    setUploadBtnActive(true)
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
      {file && <img style={{ maxWidth: "500px", maxHeight: "500px" }} id="ItemPreview" src={imageSrc} alt="Selected file"></img>}
    </div>
  );
};

export default Banner;
