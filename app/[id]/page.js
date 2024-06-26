"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase";
export default function Page({ params }) {
  const { id } = params;
  const [data, setData] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const useRef = ref(database, `UserData/${id}`);
    onValue(useRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.Name);
      }
      //   const nd = Object.entries(data).map(([key, value]) => ({
      //     ...value,
      //     id: value,
      //   }));
      //setData(nd);
    });
  }, []);
  return (
    <>
      <h1>{id}</h1>

      <h2>{name && name}</h2>
      <div>
        {data.map((items) => (
          <div>{items.Name}</div>
        ))}
      </div>
    </>
  );
}
