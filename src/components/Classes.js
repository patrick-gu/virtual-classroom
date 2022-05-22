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
  return (
    <div className="container">
      <h1>Your classes</h1>
      <div>
        {classrooms ? (
          classrooms.map(({ id, role, name }) => (
            <Link to={`/classes/${id}`} className="d-block" key={id}>
              <h2>{name}</h2>
              <p></p>
            </Link>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <button onClick={createClass}>Create a new class</button>
    </div>
  );
}
