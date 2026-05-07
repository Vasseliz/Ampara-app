import { useMemo, useState } from "react";
import {
  CalendarClock,
  HeartHandshake,
  Mail,
  TriangleAlert,
} from "lucide-react";
import Button from "../../shared/atoms/button/Button";
import { Card } from "../../shared/atoms/Card/Card";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { useConvitesPaciente } from "./useConvitesPaciente";
import "./convitesPaciente.css";

const PAGE_SIZE = 6;

function formatarData(value) {
  if (!value) {
    return "Data não informada";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(date);
}

function conviteExpirado(expiresAt) {
  if (!expiresAt) {
    return false;
  }

  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() <= Date.now();
}

export function ConvitesPaciente() {
  const { invites, loading, error, acceptingId, reload, acceptInvite } =
    useConvitesPaciente();
  const [page, setPage] = useState(1);

  const { currentPage, totalPages, visibleInvites } = useMemo(() => {
    const total = Math.max(1, Math.ceil(invites.length / PAGE_SIZE));
    const safePage = Math.min(page, total);
    const start = (safePage - 1) * PAGE_SIZE;

    return {
      currentPage: safePage,
      totalPages: total,
      visibleInvites: invites.slice(start, start + PAGE_SIZE),
    };
  }, [invites, page]);

  async function handleAccept(inviteId) {
    try {
      await acceptInvite(inviteId);
      setPage(1);
    } catch {
      /* toast no hook */
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Convites"
        iconTitle={HeartHandshake}
        icon={HeartHandshake}
        subtitle="Convites pendentes para vincular profissionais ao seu perfil"
        comment={!loading ? `${invites.length} convite(s)` : undefined}
      />

      <section className="convites-paciente">
        <InfoBanner text="Aceite apenas convites de profissionais que realmente acompanham o seu cuidado. Após o aceite, o vínculo fica ativo automaticamente." />

        {loading ? (
          <div
            className="convites-paciente__state convites-paciente__state--loading"
            aria-live="polite"
          >
            <p className="convites-paciente__state-title">
              Carregando convites...
            </p>
            <p className="convites-paciente__state-text">
              Aguarde enquanto verificamos convites pendentes para a sua conta.
            </p>
          </div>
        ) : error ? (
          <div
            className="convites-paciente__state convites-paciente__state--error"
            role="alert"
          >
            <TriangleAlert
              size={24}
              className="convites-paciente__state-icon"
            />
            <p className="convites-paciente__state-title">
              Não foi possível carregar os convites.
            </p>
            <p className="convites-paciente__state-text">{error}</p>
            <Button variant="ghost" size="sm" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        ) : invites.length === 0 ? (
          <div className="convites-paciente__state" aria-live="polite">
            <p className="convites-paciente__state-title">
              Você não possui convites pendentes.
            </p>
            <p className="convites-paciente__state-text">
              Quando um profissional enviar um convite para o seu e-mail, ele
              aparecerá aqui.
            </p>
          </div>
        ) : (
          <>
            <div className="convites-paciente__grid">
              {visibleInvites.map((invite) => {
                const expired = conviteExpirado(invite.expiresAt);

                return (
                  <Card key={invite.id} className="convites-paciente__card">
                    <div className="convites-paciente__card-head">
                      <div>
                        <p className="convites-paciente__eyebrow">
                          Profissional
                        </p>
                        <h2 className="convites-paciente__name">
                          {invite.professionalName || "Profissional"}
                        </h2>
                      </div>
                      <span
                        className={`convites-paciente__badge${expired ? " convites-paciente__badge--expired" : ""}`}
                      >
                        {expired ? "Expirado" : "Pendente"}
                      </span>
                    </div>

                    <div className="convites-paciente__meta-list">
                      <div className="convites-paciente__meta-item">
                        <Mail size={16} />
                        <div>
                          <span className="convites-paciente__meta-label">
                            E-mail
                          </span>
                          <p className="convites-paciente__meta-value">
                            {invite.professionalEmail || "Não informado"}
                          </p>
                        </div>
                      </div>

                      <div className="convites-paciente__meta-item">
                        <CalendarClock size={16} />
                        <div>
                          <span className="convites-paciente__meta-label">
                            Enviado em
                          </span>
                          <p className="convites-paciente__meta-value">
                            {formatarData(invite.sentAt)}
                          </p>
                        </div>
                      </div>

                      <div className="convites-paciente__meta-item">
                        <CalendarClock size={16} />
                        <div>
                          <span className="convites-paciente__meta-label">
                            Expira em
                          </span>
                          <p className="convites-paciente__meta-value">
                            {formatarData(invite.expiresAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      fullWidth
                      onClick={() => handleAccept(invite.id)}
                      disabled={expired || acceptingId === invite.id}
                    >
                      {acceptingId === invite.id
                        ? "Aceitando..."
                        : expired
                          ? "Convite expirado"
                          : "Aceitar convite"}
                    </Button>
                  </Card>
                );
              })}
            </div>

            {invites.length > PAGE_SIZE ? (
              <div className="convites-paciente__pagination">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="convites-paciente__pagination-text">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
