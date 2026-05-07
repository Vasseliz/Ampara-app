import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  CircleCheckBig,
  HeartHandshake,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "../../shared/atoms/button/Button";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { AuthShell } from "../../shared/molecules/auth/AuthShell";
import "../auth/Auth.css";
import "./aceitarConvitePaciente.css";

const API = import.meta.env.VITE_API_URL ?? "";

async function jsonOuErro(res) {
  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const err = new Error(
      data?.message || res.statusText || "Não foi possível validar o convite.",
    );
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export function AceitarConvitePaciente() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const token = useMemo(
    () => searchParams.get("token")?.trim() ?? "",
    [searchParams],
  );

  async function handleAccept() {
    if (!token) {
      setError(
        "Link de convite inválido. Abra novamente o convite recebido pelo seu e-mail.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/patients/invite/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const data = await jsonOuErro(res);
      setResult({
        professionalName: data?.professionalName || "Profissional",
        redirectTo: data?.redirectTo || "/login",
      });
    } catch (e) {
      setError(e.message || "Não foi possível aceitar o convite.");
    } finally {
      setLoading(false);
    }
  }

  const invalidLink = !token;

  return (
    <div className="auth aceitar-convite">
      <AuthShell
        className="aceitar-convite__sheet"
        title="Aceitar convite"
        subtitle="Confirme o vínculo com o profissional responsável pelo seu acompanhamento"
      >
        <div className="aceitar-convite__content">
          <InfoBanner
            icon={HeartHandshake}
            iconColor="#3f7c55"
            text="Use o mesmo e-mail que recebeu o convite para concluir o vínculo corretamente."
          />

          {result ? (
            <section
              className="aceitar-convite__state aceitar-convite__state--success"
              aria-live="polite"
            >
              <CircleCheckBig
                size={32}
                className="aceitar-convite__icon aceitar-convite__icon--success"
              />
              <h2 className="aceitar-convite__title">
                Convite aceito com sucesso
              </h2>
              <p className="aceitar-convite__text">
                Seu vínculo com {result.professionalName} foi criado. Agora você
                pode entrar na sua conta para continuar.
              </p>
              <Button fullWidth onClick={() => navigate(result.redirectTo)}>
                Ir para login
              </Button>
            </section>
          ) : (
            <section className="aceitar-convite__state" aria-live="polite">
              <div className="aceitar-convite__token-block">
                <span className="aceitar-convite__token-label">
                  Status do link
                </span>
                <p className="aceitar-convite__token-value">
                  {invalidLink
                    ? "Token ausente"
                    : "Convite pronto para confirmação"}
                </p>
              </div>

              {error ? (
                <div
                  className="aceitar-convite__feedback aceitar-convite__feedback--error"
                  role="alert"
                >
                  <TriangleAlert
                    size={18}
                    className="aceitar-convite__icon aceitar-convite__icon--error"
                  />
                  <p className="aceitar-convite__feedback-text">{error}</p>
                </div>
              ) : null}

              <div className="aceitar-convite__actions">
                <Button
                  fullWidth
                  onClick={handleAccept}
                  disabled={loading || invalidLink}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="aceitar-convite__spinner" />
                      Validando convite...
                    </>
                  ) : (
                    "Aceitar convite"
                  )}
                </Button>

                <div className="aceitar-convite__links">
                  <Link to="/login" className="aceitar-convite__link">
                    Já tenho conta
                  </Link>
                  <Link to="/cadastro" className="aceitar-convite__link">
                    Criar conta
                  </Link>
                </div>
              </div>

              <p className="aceitar-convite__hint">
                Se você ainda não tiver conta com o e-mail convidado, faça o
                cadastro e depois volte para este link para concluir o aceite.
              </p>
            </section>
          )}
        </div>
      </AuthShell>
    </div>
  );
}
