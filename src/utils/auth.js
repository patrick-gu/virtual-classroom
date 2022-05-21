import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "VIRTUAL_CLASSROOM_TOKEN";

export function useTokenState() {
    return [
        localStorage.getItem(TOKEN_KEY),
        (token) => {
            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
            } else {
                localStorage.removeItem(TOKEN_KEY);
            }
        },
    ];
}

export const AuthContext = createContext();

export function useUnauthenticated() {
    const [token, setToken] = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate("/classes");
        }
    });
    return setToken;
}

export function useAuthenticated() {
    const [token, setToken] = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    });
    return [token, setToken];
}
