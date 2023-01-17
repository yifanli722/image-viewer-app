import React, { useState } from 'react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import './Banner.css';
require('dotenv').config();

const Banner = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadBtnActive, setUploadBtnActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setImagePreviewUrl] = useState(null);
  const [retrieveUrl, setRetrieveUrl] = useState(null);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

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

  const handleUpload = () => {
    const config = {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    };
    setLoading(true);

    axios.post(`${process.env.REACT_APP_BASE_URL}/api/UploadImage`, file, config)
    .then(response => {
      console.log(response.data);
      let sha256 = response.data.insertedSha256;
      setRetrieveUrl(`${process.env.REACT_APP_BASE_URL}/api/RetrieveImage/${sha256}`);
      setUploadBtnActive(false)
      setLoading(false);
    })
    .catch(error => {
      console.error(error);
      setError(error);
    });
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Select Image to Upload</h1>
      </div>
      <div className="banner-actions">
        <input type="file" onChange={handleFileSelect} />
        <button disabled={!uploadBtnActive} className="upload-button" onClick={handleUpload}>
          {loading ? <ClipLoader
          color={"#ffffff"}
          loading={loading}
          cssOverride={override}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        /> : 'Upload Image'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }} className="error">{error.message}</div>}
      {file &&
      <div>
        <h3> Preview Thumbnail </h3>
        <img style={{ width: "500px", height: "750px", maxWidth: "1000px", maxHeight: "1500px" }} id="ItemPreview" src={previewUrl} alt="Selected file"></img>
      </div>
      }
      {
        retrieveUrl &&
        <a href={retrieveUrl}> Image Share Link </a>
      }
    </div>
  );
};

export default Banner;
