import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { Card } from "../../shared/atoms/Card/Card";
import Button from "../../shared/atoms/button/Button";
import TextArea from "../../shared/atoms/textArea/TextArea";
import { toast } from "../../shared/atoms/toast/Toast";
import { useConversas, useMensagens, enviarMensagem } from "./hooks/useChat";
import "./Chat.css";

export default function Chat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversaAtual, setConversaAtual] = useState(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { data: conversas, loading: loadingConversas } = useConversas();
  const {
    data: mensagens,
    loading: loadingMensagens,
    setData: setMensagens,
  } = useMensagens(conversaAtual?.pacienteId, conversaAtual?.profissionalId);

  const handleEnviar = async () => {
    if (!conversaAtual || !texto.trim() || enviando) return;
    setEnviando(true);
    try {
      const response = await enviarMensagem(
        conversaAtual.pacienteId,
        conversaAtual.profissionalId,
        texto.trim(),
      );
      if (!response.ok) return toast.error("Não foi possível enviar a mensagem.");
      const criada = await response.json();
      setMensagens((atual) => [...atual, criada]);
      setTexto("");
    } catch {
      toast.error("Não foi possível enviar a mensagem.");
    } finally {
      setEnviando(false);
    }
  };

  function eMinhaMsg(msg) {
    if (user?.role === "patient") return msg.enviadoPeloPaciente === true;
    return msg.enviadoPeloPaciente === false;
  }

  function renderizarMensagens() {
    if (loadingMensagens) return <p className="chat__state">Carregando mensagens...</p>;
    if (!conversaAtual) return <p className="chat__state">Selecione uma conversa para começar.</p>;
    if (!mensagens.length) return <p className="chat__state">Ainda não há mensagens nesta conversa.</p>;

    return mensagens.map((msg) => (
      <article
        key={msg.id}
        className={`chat__message ${eMinhaMsg(msg) ? "chat__message--mine" : "chat__message--other"}`}
      >
        <p className="chat__message-text">{msg.content}</p>
        <span className="chat__message-time">
          {new Date(msg.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </article>
    ));
  }

  return (
    <div className="chat">
      <div className="page-container chat__container">
        <PageHeader
          title="Chat"
          iconTitle={MessageSquareText}
          icon={ArrowLeft}
          comment={`${mensagens.length} mensagens`}
          handleIcon={() => navigate("/")}
        />

        <InfoBanner text="Conversa compartilhada entre paciente e profissional." />

        <Card className="chat__conversation-picker">
          <label className="chat__conversation-label" htmlFor="chat-conversa">
            Conversa
          </label>
          {loadingConversas ? (
            <p className="chat__state">Carregando conversas...</p>
          ) : conversas.length ? (
            <select
              id="chat-conversa"
              className="chat__conversation-select"
              value={conversaAtual ? `${conversaAtual.pacienteId}|${conversaAtual.profissionalId}` : ""}
              onChange={(e) => {
                const [pId, prId] = e.target.value.split("|");
                const selecionada = conversas.find(
                  (c) => String(c.pacienteId) === pId && String(c.profissionalId) === prId,
                );
                setConversaAtual(selecionada ?? null);
              }}
            >
              {conversas.map((c) => (
                <option key={`${c.pacienteId}|${c.profissionalId}`} value={`${c.pacienteId}|${c.profissionalId}`}>
                  {c.contactName || c.contactEmail}
                </option>
              ))}
            </select>
          ) : (
            <p className="chat__state">Nenhuma conversa disponível para seu perfil.</p>
          )}
        </Card>

        <Card className="chat__thread">
          <div className="chat__messages">{renderizarMensagens()}</div>
        </Card>

        <Card className="chat__composer">
          <TextArea
            value={texto}
            onChange={setTexto}
            placeholder="Escreva uma mensagem..."
            maxLength={500}
          />
          <div className="chat__composer-footer">
            <Button
              variant="primary"
              size="md"
              onClick={handleEnviar}
              disabled={!texto.trim() || !conversaAtual || enviando}
            >
              Enviar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
