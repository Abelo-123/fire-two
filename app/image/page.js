"use client";
// src/components/ImageUploader.jsx
import React, { useState } from "react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as databaseRef, set } from "firebase/database";
import { storage, database } from "../firebase";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const imageRef = storageRef(storage, `images/${image.name}`);
      uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setUrl(url);
          saveImageUrlToDatabase(url);
        });
      });
    }
  };

  const saveImageUrlToDatabase = (url) => {
    const sanitizedImageName = image.name.replace(/[.#$/[\]]/g, "_");

    const imageUrlRef = databaseRef(database, `images/${sanitizedImageName}`);
    set(imageUrlRef, {
      url: url,
      name: image.name,
    });
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {url && <img src={url} alt="Uploaded" />}
    </div>
  );
};

export default ImageUploader;
