import { createContext, useContext, useEffect, useState } from "react"
import { loginRequest } from "../utils/auth";


const AuthContext = createContext(null);
const STORAGE_KEY = 'anika_admin_session';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const { user: storedUser, token: storedToken } = JSON.parse(stored);
                setUser(storedUser);
                setToken(storedToken);
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);


    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
            setToken(null);
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    })

    const login = async (email, password) => {
        const { user: account, accessToken, refreshToken } = await loginRequest({ email, password });
        setUser(account);
        setToken(accessToken);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: account, token: accessToken, refreshToken }));
        return account;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
  );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
