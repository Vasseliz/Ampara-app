import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Mail, Loader2,
    User, Stethoscope, ChevronRight, IdCard,
} from "lucide-react";
import { toast } from "../../shared/atoms/toast/Toast";
import { Button } from "../../shared/atoms/button/Button";
import { TextField } from "../../shared/atoms/form/TextField";
import { PasswordField } from "../../shared/atoms/form/PasswordField";
import { AuthShell } from "../../shared/molecules/auth/AuthShell";
import "./Auth.css";
import "./SignUp.css";

const ROLES = [
    { id: "patient", label: "Sou paciente", description: "Acompanhe sua saúde mental", Icon: User },
    { id: "professional", label: "Sou profissional", description: "Psicólogo, psiquiatra ou terapeuta", Icon: Stethoscope },
];

function PasswordStrength({ password }) {
    const getScore = (pwd) => {
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        return s;
    };
    const score = password ? getScore(password) : 0;
    const labels = ["", "Fraca", "Razoável", "Boa", "Forte"];
    const colors = ["", "#f87171", "#fbbf24", "#51996d", "#3f7d57"];
    return (
        <div className="signup__strength">
            <div className="signup__strength__bars">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="signup__strength__bar"
                        style={{ background: score >= i ? colors[score] : "#e5e7eb" }} />
                ))}
            </div>
            {password && (
                <span className="signup__strength__label" style={{ color: colors[score] }}>
                    {labels[score]}
                </span>
            )}
        </div>
    );
}

export default function Signup() {
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        registrationId: "", password: "", confirmPassword: "",
    });

    const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;
    const isValid =
        role &&
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.includes("@") &&
        form.password.length >= 8 &&
        passwordsMatch;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);
        try {
            const registrationId =
                role === "professional" && form.registrationId.trim()
                    ? form.registrationId.trim()
                    : null;

            const base = import.meta.env.VITE_API_URL ?? "";
            const res = await fetch(`${base}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    role,
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    registrationId,
                }),
            });
            const text = await res.text();
            let data = {};
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = {};
                }
            }
            if (!res.ok) {
                const err = new Error(data.message || "Falha no cadastro");
                err.body = data;
                throw err;
            }

            toast.success("Conta criada com sucesso!");
            setTimeout(() => navigate("/login"), 600);
        } catch (err) {
            const msg = err.body?.message || err.message || "Erro ao criar conta.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth">
            <AuthShell
                className="signup__sheet"
                title="Criar conta"
                subtitle="Preencha os dados para começar"
            >

                <div className="signup__role-section">
                    <span className="signup__role-label">Você é</span>
                    <div className="signup__role-grid">
                        {ROLES.map(({ id, label, description, Icon }) => {
                            const active = role === id;
                            return (
                                <button key={id} type="button"
                                    className={`signup__role-card${active ? " signup__role-card--active" : ""}`}
                                    onClick={() => setRole(id)}
                                >
                                    <div className="signup__role-card__icon"><Icon size={20} /></div>
                                    <span className="signup__role-card__title">{label}</span>
                                    <span className="signup__role-card__desc">{description}</span>
                                    {active && (
                                        <div className="signup__role-card__check"><ChevronRight size={12} /></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth__form">

                    <div className="auth__form-row">
                        <TextField
                            id="firstName"
                            label="Nome"
                            icon={User}
                            placeholder="Ana"
                            value={form.firstName}
                            onChange={set("firstName")}
                            required
                        />
                        <TextField
                            id="lastName"
                            label="Sobrenome"
                            icon={User}
                            placeholder="Silva"
                            value={form.lastName}
                            onChange={set("lastName")}
                            required
                        />
                    </div>

                    <TextField
                        id="email"
                        label="E-mail"
                        icon={Mail}
                        type="email"
                        placeholder="ana@email.com.br"
                        value={form.email}
                        onChange={set("email")}
                        required
                    />

                    {role === "professional" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.2 }}
                        >
                            <TextField
                                id="registrationId"
                                label="CRP / CRM"
                                optionalLabel="(opcional)"
                                icon={IdCard}
                                placeholder="CRP 06/123456"
                                value={form.registrationId}
                                onChange={set("registrationId")}
                            />
                        </motion.div>
                    )}

                    <div>
                        <PasswordField
                            id="password"
                            label="Senha"
                            placeholder="Mínimo 8 caracteres"
                            value={form.password}
                            onChange={set("password")}
                            required
                        />
                        <PasswordStrength password={form.password} />
                    </div>

                    <PasswordField
                        id="confirmPassword"
                        label="Confirmar senha"
                        placeholder="Repita a senha"
                        value={form.confirmPassword}
                        onChange={set("confirmPassword")}
                        required
                        error={form.confirmPassword && !passwordsMatch ? "As senhas não coincidem" : ""}
                    />

                    <p className="auth__terms">
                        Ao criar sua conta você concorda com os{" "}
                        <Link to="/cadastro" className="auth__link">Termos de uso</Link>{" "}
                        e a{" "}
                        <Link to="/cadastro" className="auth__link">Política de privacidade</Link>
                    </p>

                    <Button type="submit" disabled={!isValid || loading} fullWidth className="auth__submit">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Criar conta"}
                    </Button>

                    <p className="auth__footer-link">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="auth__link">Entrar</Link>
                    </p>
                </form>
            </AuthShell>
        </div>
    );
}
