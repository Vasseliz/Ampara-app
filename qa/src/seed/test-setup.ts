// Setup global do Vitest: carrega .env/.env.local antes de qualquer teste, para
// que os guards `temBackend` (process.env.E2E_*) sejam consistentes em TODOS os
// arquivos — não só nos que importam config.ts transitivamente.
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });
