import { createContext, useContext, useEffect, useState } from "react"
import { loginRequest } from "../utils/auth";


const AuthContext = createContext(null);
const STORAGE_KEY = 'anika_admin_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        const account = await loginRequest({ email, password });
        setUser(account);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
        return account;
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        // Hard navigation (not React Router) so the app re-boots from scratch on
        // next sign-in — access.js/nav.js compute their role-access matrix once
        // per page load, so a plain state clear would leave saved Roles & Access
        // changes invisible until an unrelated manual refresh.
        window.location.href = '/admin/login';
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
  );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
