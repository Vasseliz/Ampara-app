# Configuração de segredos

Este projeto **não versiona nenhum segredo**. O `appsettings.json` versionado
contém apenas placeholders vazios. Os valores reais vêm de:

- **Local (dev):** `backend/Ampara.Api/appsettings.Development.json` — **ignorado pelo git**.
  É o arquivo que você preenche **uma vez** e fica salvo na sua máquina (não precisa
  redigitar a cada execução).
- **Produção:** variáveis de ambiente no servidor (nunca commitadas).

> O **CI (GitHub Actions) não usa segredos**: roda apenas build + testes a cada push/PR.

## Como rodar localmente (cada dev faz uma vez)

```bash
# a partir da raiz do repositório
cp backend/Ampara.Api/appsettings.Development.example.json \
   backend/Ampara.Api/appsettings.Development.json
# depois edite o appsettings.Development.json com os valores reais
```

Pronto — o arquivo fica salvo localmente e é ignorado pelo git para sempre.

## Como compartilhar com os outros devs (3 pessoas)

- **Arquivo a compartilhar:** o `backend/Ampara.Api/appsettings.Development.json`
  já preenchido.
- **NÃO** compartilhe por git, Slack, e-mail ou WhatsApp.
- **Use um gerenciador de senhas com cofre compartilhado** (1Password, Bitwarden,
  Keeper). Anexe o arquivo `appsettings.Development.json` (ou cole o conteúdo) num
  item do cofre acessível só às 3 pessoas.
- O `appsettings.Development.example.json` (versionado) serve apenas de **modelo**
  com placeholders — pode ficar no repositório público sem risco.

## Mapa das chaves (produção via variáveis de ambiente)

O .NET mapeia `Secao:Chave` para a variável de ambiente `Secao__Chave`
(duplo underscore). O mesmo nome é usado em todos os ambientes.

| Config (.NET)                          | Variável de ambiente                    | Segredo? |
| -------------------------------------- | --------------------------------------- | -------- |
| `ConnectionStrings:DefaultConnection`  | `ConnectionStrings__DefaultConnection`  | 🔴 sim   |
| `Supabase:SegredoJwt`                  | `Supabase__SegredoJwt`                  | 🔴 sim   |
| `Supabase:ChaveAnonima`                | `Supabase__ChaveAnonima`                | 🟡 sim   |
| `Supabase:Url`                         | `Supabase__Url`                         | não      |
| `Cors:AllowedOrigin`                   | `Cors__AllowedOrigin`                   | não      |
| `App:UrlFrontend`                      | `App__UrlFrontend`                      | não      |

Em produção, defina essas variáveis no ambiente do servidor. Os segredos nunca
ficam no repositório.

## ⚠️ Rotação obrigatória

Os segredos anteriores estiveram no histórico do git e devem ser considerados
comprometidos. **Antes de tornar o repositório público**, rotacione no Supabase:
1. Senha do banco (gera nova connection string).
2. JWT Secret do projeto.
Depois atualize o `appsettings.Development.json` local de cada dev e as variáveis
de ambiente de produção.
