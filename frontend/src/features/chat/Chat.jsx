import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchComSessao } from "../../shared/api/fetchComSessao";
import { toast } from "../../shared/atoms/toast/Toast";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { Card } from "../../shared/atoms/Card/Card";
import Button from "../../shared/atoms/button/Button";
import TextArea from "../../shared/atoms/textArea/TextArea";
import "./Chat.css";

const API = import.meta.env.VITE_API_URL ?? "";

function formatarHorario(dataIso) {
	const data = new Date(dataIso);
	if (Number.isNaN(data.getTime())) {
		return "--:--";
	}

	return data.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

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
		const err = new Error(data?.message || res.statusText || "Erro na requisição");
		err.status = res.status;
		err.body = data;
		throw err;
	}

	return data;
}

function chaveConversa(conversa) {
	return `${conversa.pacienteId}|${conversa.profissionalId}`;
}

function mapApiMensagem(msg) {
	return {
		id: msg.id,
		enviadoPeloPaciente: msg.enviadoPeloPaciente,
		texto: msg.content,
		horario: formatarHorario(msg.createdAt),
		criadoEm: msg.createdAt,
	};
}

export default function Chat() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [conversas, setConversas] = useState([]);
	const [conversaAtual, setConversaAtual] = useState(null);
	const [loadingConversas, setLoadingConversas] = useState(true);
	const [loadingMensagens, setLoadingMensagens] = useState(false);
	const [enviando, setEnviando] = useState(false);
	const [mensagens, setMensagens] = useState([]);
	const [texto, setTexto] = useState("");

	useEffect(() => {
		let ativo = true;

		(async () => {
			setLoadingConversas(true);
			try {
				const res = await fetchComSessao(`${API}/chat/conversations`);
				const lista = await jsonOuErro(res);
				const conversasApi = Array.isArray(lista) ? lista : [];

				if (!ativo) {
					return;
				}

				setConversas(conversasApi);
				setConversaAtual((anterior) => {
					if (!conversasApi.length) {
						return null;
					}

					if (!anterior) {
						return conversasApi[0];
					}

					const encontrada = conversasApi.find(
						(c) => chaveConversa(c) === chaveConversa(anterior),
					);

					return encontrada ?? conversasApi[0];
				});
			} catch (e) {
				if (!ativo) {
					return;
				}

				setConversas([]);
				setConversaAtual(null);
				toast.error(e.message || "Não foi possível carregar as conversas.");
			} finally {
				if (ativo) {
					setLoadingConversas(false);
				}
			}
		})();

		return () => {
			ativo = false;
		};
	}, []);

	useEffect(() => {
		if (!conversaAtual) {
			setMensagens([]);
			return;
		}

		let ativo = true;

		(async () => {
			setLoadingMensagens(true);
			try {
				const res = await fetchComSessao(
					`${API}/chat/${conversaAtual.pacienteId}/${conversaAtual.profissionalId}`,
				);
				const lista = await jsonOuErro(res);
				if (!ativo) {
					return;
				}

				setMensagens(Array.isArray(lista) ? lista.map(mapApiMensagem) : []);
			} catch (e) {
				if (!ativo) {
					return;
				}

				setMensagens([]);
				toast.error(e.message || "Não foi possível carregar as mensagens.");
			} finally {
				if (ativo) {
					setLoadingMensagens(false);
				}
			}
		})();

		return () => {
			ativo = false;
		};
	}, [conversaAtual]);

	async function handleEnviar() {
		if (!conversaAtual || !texto.trim() || enviando) {
			return;
		}

		setEnviando(true);
		try {
			const res = await fetchComSessao(
				`${API}/chat/${conversaAtual.pacienteId}/${conversaAtual.profissionalId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content: texto.trim() }),
				},
			);

			const criada = await jsonOuErro(res);
			setMensagens((atual) => [...atual, mapApiMensagem(criada)]);
			setTexto("");
		} catch (e) {
			toast.error(e.message || "Não foi possível enviar a mensagem.");
		} finally {
			setEnviando(false);
		}
	}

	const meuPapel = user?.role; // 

	function eMinhaMsg(mensagem) {
		if (meuPapel === "patient") return mensagem.enviadoPeloPaciente === true;
		return mensagem.enviadoPeloPaciente === false;
	}

	function handleSelecionarConversa(valor) {
		const selecionada = conversas.find((c) => chaveConversa(c) === valor);
		setConversaAtual(selecionada ?? null);
	}

	function renderizarMensagens() {
		if (loadingMensagens) {
			return <p className="chat__state">Carregando mensagens...</p>;
		}

		if (!conversaAtual) {
			return <p className="chat__state">Selecione uma conversa para começar.</p>;
		}

		if (!mensagens.length) {
			return <p className="chat__state">Ainda não há mensagens nesta conversa.</p>;
		}

		return mensagens.map((mensagem) => {
			const minhaMensagem = eMinhaMsg(mensagem);

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
		});
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
							value={conversaAtual ? chaveConversa(conversaAtual) : ""}
							onChange={(e) => handleSelecionarConversa(e.target.value)}
						>
							{conversas.map((c) => (
								<option key={chaveConversa(c)} value={chaveConversa(c)}>
									{c.contactName || c.contactEmail}
								</option>
							))}
						</select>
					) : (
						<p className="chat__state">Nenhuma conversa disponível para seu perfil.</p>
					)}
				</Card>

				<Card className="chat__thread">
					<div className="chat__messages">
						{renderizarMensagens()}
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
