import { useEffect, useState } from "react";
import { useAuthenticated } from "../utils/auth";

export default function Classes() {
  const [token, setToken] = useAuthenticated();
  const [classrooms, setClassrooms] = useState(null);
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/v1/classrooms", {
        headers: {
          Authorization: token,
        },
      });
      const { success, error, classrooms, username } = await response.json();
      if (success) {
        setClassrooms(classrooms);
        console.log(classrooms);
      } else if (response.status === 401) {
        setToken(null);
      } else {
        alert(error);
      }
    })();
  }, [setToken, token]);
  return (
    <div className="container">
      <h1>Your classes</h1>
      <div>
        {classrooms ? (
          classrooms.map(({ id, role }) => (
            <a href={`/classes/${id}`} className="d-block" key={id}>
              <h2>{id}</h2>
              <p></p>
            </a>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
