import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";
import { apiRequest } from "../utils/request";
import './Classes.css';

export default function Classes() {
  const [token, setToken] = useAuthenticated();
  const [classrooms, setClassrooms] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { classrooms, username } = await apiRequest({
        method: "GET",
        path: "/classrooms",
        token,
        setToken,
        navigate,
      });
      setClassrooms(classrooms);
    })();
  }, [navigate, setToken, token]);
  const createClass = async () => {
    const { id, name } = await apiRequest({
      method: "POST",
      path: "/classrooms/create",

      token,
      setToken,
      navigate,
    });
    setClassrooms((classrooms) => [
      ...classrooms,
      { id, role: "Teacher", name },
    ]);
  };
  const [classCode, setClassCode] = useState("");
  const joinClass = async (e) => {
    e.preventDefault();
    const { id, name } = await apiRequest({
      method: "POST",
      path: "/classrooms/join",
      token,
      setToken,
      body: {
        code: classCode,
      },
      navigate,
    });
    setClassrooms((classrooms) => [
      ...classrooms,
      { id, name, role: "Student" },
    ]);
  };
  return (
    <div className="container">
      <h1>Your classes</h1>
      <div>
        {classrooms ? (
          classrooms.map(({ id, role, name }) => (
            <div key={id}>
              <Link to={`/classes/${id}`} className="d-block">
                <h2>{name}</h2>
              </Link>
              <p>You are a {role}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <button onClick={createClass}>Create a new classroom</button>
      <div>
        <h2>Join a classroom</h2>
        <form onSubmit={joinClass}>
          <input
            type="text"
            placeholder="Class Code"
            onChange={(e) => setClassCode(e.target.value)}
          />
          <input type="submit" value="Join" />
        </form>
      </div>
    </div>
  );
}
