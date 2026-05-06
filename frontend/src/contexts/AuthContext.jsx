import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { fetchComSessao } from "../shared/api/fetchComSessao";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL ?? "";

const REVALIDACAO_MS = 3 * 60 * 1000;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshSeq = useRef(0);

    const refresh = useCallback(async () => {
        const id = ++refreshSeq.current;
        setLoading(true);
        try {
            const res = await fetchComSessao(`${API}/auth/me`);
            if (id !== refreshSeq.current) {
                return;
            }
            if (!res.ok) {
                setUser(null);
                return;
            }
            const data = await res.json();
            if (id !== refreshSeq.current) {
                return;
            }
            const role =
                typeof data.role === "string" ? data.role.trim().toLowerCase() : "";
            setUser({ id: data.id, role });
        } catch {
            if (id !== refreshSeq.current) {
                return;
            }
            setUser(null);
        } finally {
            if (id === refreshSeq.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const onExpired = () => {
            setUser(null);
        };
        window.addEventListener("ampara:session-expired", onExpired);
        return () => window.removeEventListener("ampara:session-expired", onExpired);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        let debounce;
        const onVisibility = () => {
            if (document.visibilityState !== "visible") return;
            clearTimeout(debounce);
            debounce = setTimeout(() => refresh(), 400);
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            clearTimeout(debounce);
        };
    }, [refresh]);

    useEffect(() => {
        const id = setInterval(() => refresh(), REVALIDACAO_MS);
        return () => clearInterval(id);
    }, [refresh]);

    const value = useMemo(
        () => ({
            user,
            loading,
            refresh,
            clearUser: () => setUser(null),
        }),
        [user, loading, refresh],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
    return ctx;
}
