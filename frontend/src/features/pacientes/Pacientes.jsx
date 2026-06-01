import { useMemo, useState } from "react";
import { Mail, Trash2, TriangleAlert, UsersRound, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/atoms/button/Button";
import { Card } from "../../shared/atoms/Card/Card";
import { TextField } from "../../shared/atoms/form/TextField";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { usePacientes } from "./usePacientes";
import "./pacientes.css";

const PAGE_SIZE = 8;

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

function usePaginacao(items, page, pageSize) {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const paginatedItems = items.slice(start, start + pageSize);

    return {
      currentPage,
      totalPages,
      paginatedItems,
    };
  }, [items, page, pageSize]);
}

function TabelaPacientes({
  title,
  subtitle,
  rows,
  emptyMessage,
  page,
  setPage,
  dateLabel,
  actionLabel,
  renderAction,
}) {
  const { currentPage, totalPages, paginatedItems } = usePaginacao(
    rows,
    page,
    PAGE_SIZE,
  );

  return (
    <Card className="pacientes-section-card">
      <div className="pacientes-section-card__header">
        <div>
          <h2 className="pacientes-section-card__title">{title}</h2>
          <p className="pacientes-section-card__subtitle">{subtitle}</p>
        </div>
        <span className="pacientes-section-card__count">{rows.length}</span>
      </div>

      {rows.length === 0 ? (
        <div className="pacientes-table__empty">
          <p className="pacientes-state__title">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="pacientes-table__scroll">
            <table className="pacientes-table">
              <thead>
                <tr>
                  <th>E-mail do paciente</th>
                  <th>{dateLabel}</th>
                  {renderAction ? (
                    <th className="pacientes-table__actions-head">
                      {actionLabel || "Ações"}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((row) => (
                  <tr key={row.id}>
                    <td data-label="E-mail do paciente">
                      {row.email || "Não informado"}
                    </td>
                    <td data-label={dateLabel}>{formatarData(row.date)}</td>
                    {renderAction ? (
                      <td
                        data-label={actionLabel || "Ações"}
                        className="pacientes-table__actions-cell"
                      >
                        {renderAction(row)}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length > PAGE_SIZE ? (
            <div className="pacientes-pagination">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="pacientes-pagination__text">
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
    </Card>
  );
}

export function Pacientes() {
  const navigate = useNavigate();
  const {
    patients,
    invites,
    loading,
    submitting,
    cancelingId,
    error,
    reload,
    invitePatient,
    cancelInvite,
  } = usePacientes();
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [patientsPage, setPatientsPage] = useState(1);
  const [invitesPage, setInvitesPage] = useState(1);

  const patientRows = useMemo(
    () =>
      patients.map((patient) => ({
        id: patient.id,
        email: patient.email,
        date: patient.linkedAt,
      })),
    [patients],
  );

  const inviteRows = useMemo(
    () =>
      invites.map((invite) => ({
        id: invite.id,
        email: invite.email,
        date: invite.sentAt,
      })),
    [invites],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFormError("Informe o e-mail do paciente.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      setFormError("Informe um e-mail válido.");
      return;
    }

    setFormError("");

    try {
      await invitePatient(normalizedEmail);
      setEmail("");
      setInvitesPage(1);
    } catch {
      /* toast no hook */
    }
  }

  async function handleCancelInvite(inviteId) {
    if (!inviteId) {
      return;
    }

    if (!window.confirm("Excluir este convite pendente?")) {
      return;
    }

    try {
      await cancelInvite(inviteId);
      setInvitesPage(1);
    } catch {
      /* toast no hook */
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Pacientes"
        iconTitle={UsersRound}
        icon={UsersRound}
        subtitle="Pacientes vinculados ao seu perfil profissional"
        comment={
          !loading ? `${patients.length} paciente(s) vinculados` : undefined
        }
      />

      <section className="pacientes-page">
        <InfoBanner text="Adicione pacientes por e-mail. Os convites aparecem imediatamente na tabela de pendências e os vínculos aceitos aparecem na tabela de pacientes vinculados." />

        <Card className="pacientes-section-card">
          <div className="pacientes-section-card__header pacientes-section-card__header--form">
            <div>
              <h2 className="pacientes-section-card__title">
                Adicionar paciente por e-mail
              </h2>
              <p className="pacientes-section-card__subtitle">
                Informe o e-mail do paciente para criar o vínculo via convite.
              </p>
            </div>
          </div>

          <form className="pacientes-form" onSubmit={handleSubmit}>
            <TextField
              id="patient-email"
              label="E-mail do paciente"
              icon={Mail}
              type="email"
              placeholder="paciente@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={formError}
              wrapperClassName="pacientes-form__field"
              required
            />
            <Button
              type="submit"
              size="md"
              disabled={submitting}
              fullWidth
              className="pacientes-form__button"
            >
              {submitting ? "Adicionando..." : "Adicionar paciente"}
            </Button>
          </form>
        </Card>

        {loading ? (
          <div
            className="pacientes-state pacientes-state--loading"
            aria-live="polite"
          >
            <p className="pacientes-state__title">Carregando pacientes...</p>
            <p className="pacientes-state__description">
              Aguarde enquanto buscamos os vínculos do seu perfil.
            </p>
          </div>
        ) : error ? (
          <div className="pacientes-state pacientes-state--error" role="alert">
            <TriangleAlert size={28} className="pacientes-state__icon" />
            <p className="pacientes-state__title">
              Não foi possível carregar a lista.
            </p>
            <p className="pacientes-state__description">{error}</p>
            <Button variant="ghost" size="sm" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="pacientes-sections">
            <TabelaPacientes
              title="E-mails adicionados"
              subtitle="Convites pendentes enviados pelo profissional"
              rows={inviteRows}
              emptyMessage="Nenhum e-mail adicionado até o momento."
              page={invitesPage}
              setPage={setInvitesPage}
              dateLabel="Data de envio"
              actionLabel="Ações"
              renderAction={(row) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="pacientes-table__action-button"
                  onClick={() => handleCancelInvite(row.id)}
                  disabled={cancelingId === row.id}
                >
                  <Trash2 size={14} />
                  {cancelingId === row.id ? "Excluindo..." : "Excluir"}
                </Button>
              )}
            />

            <TabelaPacientes
              title="Pacientes vinculados"
              subtitle="Pacientes que já aceitaram o vínculo com o seu perfil"
              rows={patientRows}
              emptyMessage="Nenhum paciente vinculado no momento."
              page={patientsPage}
              setPage={setPatientsPage}
              dateLabel="Data de vínculo"
              actionLabel="Ações"
              renderAction={(row) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="pacientes-table__action-button"
                  onClick={() => navigate(`/profissional/pacientes/${row.id}`)}
                >
                  <Eye size={14} />
                  Ver
                </Button>
              )}
            />
          </div>
        )}
      </section>
    </div>
  );
}
