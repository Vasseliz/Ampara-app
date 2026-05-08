/**
use esta função no lugar do fetch para chamadas à API que dependem do usuario estar logado
 
 É o mesmo Fetch API: o segundo argumento é o mesmo objeto que você passaria a `fetch`
 (`method`, `headers`, `body`, …). A única diferença é que:
 envia cookies automaticamente (`credentials: 'include'`);
caso de erro de login/sessao expirada dispara o evento global para a UI reagir à sessão expirada.
Exemplo:
const res = await fetchComSessao(`${API}/patients`);
 const dados = await res.json();
 */
export async function fetchComSessao(url, options = {}) {
    const { headers: inputHeaders, ...rest } = options;
    const headers = new Headers(inputHeaders ?? {});
    const res = await fetch(url, {
        ...rest,
        credentials: rest.credentials ?? "include",
        headers,
    });

    if (res.status === 401) {
        const path = typeof url === "string" ? url : "";
        const isCredencialInvalida =
            path.includes("/auth/login") || path.includes("/auth/register");
        if (!isCredencialInvalida) {
            window.dispatchEvent(new CustomEvent("ampara:session-expired"));
        }
    }

    return res;
}
