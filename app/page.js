"use client";
import { useEffect, useState } from "react";
import { database } from "./firebase";
import { onValue, ref, push, remove, set } from "firebase/database";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({
    Name: "",
    Email: "",
    Number: "",
    Message: "",
  });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const useRef = ref(database, "UserData");
    onValue(useRef, async (snapshot) => {
      const data = await snapshot.val();

      if (data) {
        const all = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key,
        }));

        setData(all);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const useRef = ref(database, "UserData");
    try {
      await push(useRef, user);
      setUser({
        Name: "",
        Email: "",
        Number: "",
        Message: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (id) => {
    const useRef = ref(database, `UserData/${id}`);
    await remove(useRef);
  };

  const handleEdit = (item) => {
    setEdit(item.id);
    setUser({
      Name: item.Name,
      Email: item.Email,
      Number: item.Number,
      Message: item.Message,
    });
    console.log(item);
  };

  const handleUpdate = async (id) => {
    const useRef = ref(database, `UserData/${id}`);
    await set(useRef, {
      Name: user.Name,
      Email: user.Email,
      Number: user.Number,
      Message: user.Message,
    });
    setUser({
      Name: "",
      Email: "",
      Number: "",
      Message: "",
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        name:{user.Email}
        <br />
        <input
          type="text"
          name="Name"
          value={user.Name}
          onChange={handleChange}
        />
        email:
        <br />
        <input
          type="text"
          name="Email"
          value={user.Email}
          onChange={handleChange}
        />
        number:
        <br />
        <input
          type="text"
          name="Number"
          value={user.Number}
          onChange={handleChange}
        />
        message:
        <br />
        <input
          type="text"
          name="Message"
          value={user.Message}
          onChange={handleChange}
        />
        <button type="submit">submit</button>
      </form>
      <br />
      {edit && (
        <button type="update" onClick={() => handleUpdate(edit)}>
          update
        </button>
      )}
      {data.map((items) => (
        <li key={items.id}>
          <Link href={`/${items.id}`}>{items.Name}</Link>
          <br />
          <button onClick={() => handleRemove(items.id)}>remove</button>
          <button onClick={() => handleEdit(items)}>edit</button>
        </li>
      ))}
    </div>
  );
}
