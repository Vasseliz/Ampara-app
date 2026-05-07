import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { Card } from "../../shared/atoms/Card/Card";
import Button from "../../shared/atoms/button/Button";
import TextArea from "../../shared/atoms/textArea/TextArea";
import "./chat.css";

const mensagensIniciais = [
	{
		id: 1,
		autor: "professional",
		texto: "Olá! Como você está se sentindo hoje?",
		horario: "09:10",
	},
	{
		id: 2,
		autor: "patient",
		texto: "Estou melhor, consegui dormir bem ontem.",
		horario: "09:12",
	},
];

function getHorarioAtual() {
	return new Date().toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function Chat() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [mensagens, setMensagens] = useState(mensagensIniciais);
	const [texto, setTexto] = useState("");

	const isProfissional = user?.role === "professional";
	const meuPapel = isProfissional ? "professional" : "patient";

	function handleEnviar() {
		if (!texto.trim()) return;

		const novaMensagem = {
			id: Date.now(),
			autor: meuPapel,
			texto: texto.trim(),
			horario: getHorarioAtual(),
		};

		setMensagens((atual) => [...atual, novaMensagem]);
		setTexto("");
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

				<Card className="chat__thread">
					<div className="chat__messages">
						{mensagens.map((mensagem) => {
							const minhaMensagem = mensagem.autor === meuPapel;

							return (
								<article
									key={mensagem.id}
									className={`chat__message ${
										minhaMensagem ? "chat__message--mine" : "chat__message--other"
									}`}
								>
									<p className="chat__message-text">{mensagem.texto}</p>
									<span className="chat__message-time">{mensagem.horario}</span>
								</article>
							);
						})}
					</div>
				</Card>

				<Card className="chat__composer">
					<TextArea
						value={texto}
						onChange={setTexto}
						placeholder="Escreva uma mensagem..."
						maxLength={500}
					/>

					<div className="chat__composer-footer">
						<Button variant="primary" size="md" onClick={handleEnviar} disabled={!texto.trim()}>
							Enviar
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
