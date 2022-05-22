import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "VIRTUAL_CLASSROOM_TOKEN";

export function useTokenState() {
  const [state, setState] = useState(() => localStorage.getItem(TOKEN_KEY));
  return [
    state,
    (token) => {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      setState(token);
    },
  ];
}

export const AuthContext = createContext();

export function useUnauthenticated() {
  const [token, setToken] = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/classrooms");
    }
  }, [token, navigate]);
  return setToken;
}

export function useAuthenticated() {
  const [token, setToken] = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return [token, setToken];
}
