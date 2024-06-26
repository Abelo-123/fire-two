"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, push, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth, database, storage } from "../firebase";

const YourComponent = (params) => {
  const [blog, setBlog] = useState("");
  const [data, setData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const user = params.data; // Assuming params.data contains the user information

  useEffect(() => {
    if (user) {
      const userRef = dbRef(database, `NextPosts/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const all = Object.entries(data).map(([key, value]) => ({
            ...value,
            id: key,
          }));
          setData(all);
        } else {
          setData([]);
        }
      });
    }
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && user) {
      const imageRef = storageRef(
        storage,
        `NextPosts/${user.uid}/${file.name}`
      );
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    }
  };

  const submitData = () => {
    if (user && blog && imageUrl) {
      const userRef = dbRef(database, `NextPosts/${user.uid}`);
      push(userRef, { blog, imageUrl });
      setBlog(""); // Clear the blog input after submission
      setImageUrl(""); // Clear the image URL after submission
    }
  };

  return (
    <div>
      <div>{user && user.displayName}</div>
      <div>{imageUrl && <img src={imageUrl} alt="Uploaded" width="100" />}</div>
      <input
        type="text"
        value={blog}
        onChange={(e) => setBlog(e.target.value)}
        placeholder="Enter your blog content"
      />
      <br />
      <input type="file" onChange={handleImageUpload} />
      <br />
      <button onClick={submitData}>Add</button>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.blog}
            <br />
            {item.imageUrl && (
              <img src={item.imageUrl} alt="Blog" width="100" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
