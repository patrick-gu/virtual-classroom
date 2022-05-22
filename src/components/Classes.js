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
  
  return (
    <div className="container text-center">
      <h1 className="mt-3 mb-4">Your classes</h1>
      <div>
        {classrooms ? (
          classrooms.map(({ id, role, name }) => (
            <Link  to={`/classrooms/${id}`} className="card d-block" key={id}>
              <h4 className="card-body">{name}</h4>
              <p>ID: {id}</p>
            </Link>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      
    </div>
  );
}
