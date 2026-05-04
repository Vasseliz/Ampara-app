import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, Check } from "lucide-react";
import { Button } from "../../shared/atoms/button/Button";
import { TextField } from "../../shared/atoms/form/TextField";
import { PasswordField } from "../../shared/atoms/form/PasswordField";
import { AuthShell } from "../../shared/molecules/auth/AuthShell";
import { useLogin } from "./hooks/useLogin";
import "./Auth.css";
import "./Login.css";

export default function Login() {
    const { login, loading } = useLogin();
    const [remember, setRemember] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
    const isValid = form.email.includes("@") && form.password.length >= 6;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid) return;
        login({ email: form.email.trim(), password: form.password });
    };

    return (
        <div className="auth">
            <AuthShell
                className="login__sheet"
                title="Bem-vindo de volta"
                subtitle="Entre com seu e-mail e senha"
            >
                <form onSubmit={handleSubmit} className="auth__form">
                    <TextField
                        id="email"
                        label="E-mail"
                        icon={Mail}
                        type="email"
                        placeholder="seu@email.com.br"
                        value={form.email}
                        onChange={set("email")}
                        autoComplete="email"
                        required
                    />

                    <PasswordField
                        id="password"
                        label="Senha"
                        placeholder="Sua senha"
                        value={form.password}
                        onChange={set("password")}
                        autoComplete="current-password"
                        required
                    />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <button type="button" className="login__remember" onClick={() => setRemember((v) => !v)}>
                            <div className={`login__remember__box${remember ? " login__remember__box--checked" : ""}`}>
                                {remember && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span className="login__remember__text">Lembrar de mim</span>
                        </button>
                        <Link to="/login" className="login__forgot">Esqueci a senha</Link>
                    </div>

                    <Button type="submit" disabled={!isValid || loading} fullWidth className="auth__submit">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Entrar"}
                    </Button>

                    <p className="auth__footer-link">
                        Não tem uma conta?{" "}
                        <Link to="/cadastro" className="auth__link">Criar conta</Link>
                    </p>
                </form>
            </AuthShell>
        </div>
    );
}