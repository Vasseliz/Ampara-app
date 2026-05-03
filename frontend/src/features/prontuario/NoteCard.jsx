import { useState } from "react";
import { ChevronDown, Clock, Pencil, Trash2 } from "lucide-react";
import { Tag } from "../../shared/atoms/tag/Tag";
import { PrivateBadge } from "../../shared/atoms/privateBadge/PrivateBadge";
import Button from "../../shared/atoms/button/Button";
import "./NoteCard.css";

const SESSION_TYPE_LABELS = {
  individual: "Individual",
  grupo: "Grupo",
  familia: "Família",
  casal: "Casal",
  avaliacao: "Avaliação",
};

export function NoteCard({ note, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const typeLabel = SESSION_TYPE_LABELS[note.sessionType] || note.sessionType || "Sessão";
  const tagVariant = note.sessionType || "default";

  return (
    <article className={`note-card${expanded ? " note-card--expanded" : ""}`}>
      <div className="note-card__header" onClick={() => setExpanded((v) => !v)}>
        <div className="note-card__header-left">
          <div className="note-card__meta">
            <span className="note-card__date">{note.sessionDate}</span>
            <div className="note-card__badges">
              <Tag label={typeLabel} variant={tagVariant} />
              <PrivateBadge />
            </div>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`note-card__chevron${expanded ? " note-card__chevron--open" : ""}`}
        />
      </div>

      {!expanded && (
        <p className="note-card__preview">{note.content}</p>
      )}

      {expanded && (
        <div className="note-card__body">
          <p className="note-card__content">{note.content}</p>

          {note.nextSessionDate && (
            <div className="note-card__next-session">
              <Clock size={14} />
              <span>Próxima sessão: {note.nextSessionDate}</span>
            </div>
          )}

          <div className="note-card__actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEdit?.(note); }}
            >
              <Pencil size={14} />
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete?.(note.id); }}
            >
              <Trash2 size={14} />
              Excluir
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}