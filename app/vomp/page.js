"use client";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, set } from "firebase/database";
import Homes from "../Homes/page";

const Vomp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (provider) => {
    const result = await signInWithPopup(auth, provider);
    if (result) {
      const useRef = ref(database, `NextUser/${result.user.uid}`);
      const res = await set(useRef, {
        uid: result.user.uid,
        name: result.user.displayName,
      });
      if (res) {
        console.log("inserted");
      }
    }
    setUser(result.user);
  };

  const ignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return <h1>...loadi</h1>;
  }
  return (
    <div>
      {user ? (
        <>
          <button onClick={ignOut}>signout</button>
          <Homes data={user} />
        </>
      ) : (
        <button onClick={() => handleLogin(new GoogleAuthProvider())}>
          Googles
        </button>
      )}
    </div>
  );
};

export default Vomp;
