import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ChevronDown, BookText } from "lucide-react";
import "./Cofre.css";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import Button from "../../shared/atoms/button/Button";
import { getTodayFormatted } from "./utils/datas";
import { useNotas, salvarNota, deletarNota } from "./hooks/useCofre";
import { toast } from "../../shared/atoms/toast/Toast";

const Cofre = () => {
  const navigate = useNavigate();
  const [texto, setTexto] = useState("");
  const [expandidaNotaId, setexpandidaNotaId] = useState(null);
  const { data: notas, loading, setData: setNotas } = useNotas();

  function handleChevron(noteId) {
    setexpandidaNotaId((current) => (current === noteId ? null : noteId));
  }

  async function handleDeleteNotas(noteId) {
    const response = await deletarNota(noteId);
    if (!response.ok) return toast.error("Erro ao apagar nota.");
    setNotas((current) => current.filter((note) => note.id !== noteId));
    setexpandidaNotaId((current) => (current === noteId ? null : current));
  }

  async function handleSaveNote() {
    if (texto.trim() === "") return;
    const response = await salvarNota(texto.trim());
    if (!response.ok) return toast.error("Erro ao salvar nota.");
    const criada = await response.json();
    setNotas((current) => [criada, ...current]);
    setTexto("");
    toast.success("Nota salva no Cofre!");
  }

  const hoje = getTodayFormatted();

  return (
    <div className="cofre">
      <div className="page-container cofre__container">
        <PageHeader
          title="O Cofre"
          iconTitle={BookText}
          icon={Lock}
          comment={`${notas.length} notas salvas`}
          handleIcon={() => navigate("/")}
        />

        <div className="cofre__privacy-banner">
          <Lock size={16} color="gold" className="icon-shrink" />
          <p className="cofre__privacy-text">
            Somente você lê isso. Nem seu terapeuta tem acesso.
          </p>
        </div>

        <div className="cofre__note-card">
          <div className="cofre__note-card__date-row">
            <span className="cofre__note-card__today-tag">Hoje</span>
            <span className="cofre__note-card__date-text">{hoje}</span>
          </div>

          <textarea
            className="cofre__note-card__textarea"
            placeholder="Como você está se sentindo hoje? Este espaço é só seu..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          <div className="cofre__note-card__footer">
            <span className="cofre__note-card__counter">
              {texto.length} caracteres
            </span>
            <Button variant="primary" size="md" onClick={handleSaveNote}>
              Guardar no Cofre
            </Button>
          </div>
        </div>

        <div className="cofre__annotations">
          <div className="cofre__annotations__header">
            <div className="cofre__annotations__border"></div>
            <h2 className="cofre__annotations__title">Anotações Anteriores</h2>
          </div>

          <div className="cofre__annotations__list">
            {loading && <p>Carregando...</p>}
            {notas.map((note) => (
              <div key={note.id} className="cofre__annotations__item">
                <div className="cofre__annotations__item-header">
                  <h3 className="cofre__annotations__item-title">
                    {new Date(note.createdAt).toLocaleDateString("pt-BR")}
                  </h3>
                  <ChevronDown
                    size={18}
                    color="#4b5563"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleChevron(note.id)}
                  />
                </div>
                {expandidaNotaId === note.id && (
                  <div className="cofre__annotations__item-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteNotas(note.id)}
                      style={{ backgroundColor: "firebrick", color: "#fff" }}
                    >
                      Apagar
                    </Button>
                  </div>
                )}
                <p className="cofre__annotations__item-text">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cofre;
