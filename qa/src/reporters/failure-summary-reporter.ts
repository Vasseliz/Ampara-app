import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import * as fs from "node:fs";
import * as path from "node:path";

interface FalhaEntry {
  titulo: string;
  arquivo: string;
  projeto: string | null;
  linhaDeclaracao: number;
  linhaErro: number;
  resumo: string;
  primeiroFrameStack: string;
  flaky: boolean;
}

interface InboxFile {
  versao: 1;
  ambiente: string;
  idExecucao: string;
  geradoEm: string;
  falhas: FalhaEntry[];
}

const ANSI_REGEX = /\x1b\[[0-9;]*m/g;
const RESUMO_MAX = 200;
const STACK_LINE_REGEX = /\(?([^()\s]+):(\d+):(\d+)\)?$/;

export default class FailureSummaryReporter implements Reporter {
  private rootDir = process.cwd();
  private readonly ambiente = process.env.PW_HOMOLOG ?? "dev";
  private readonly idExecucao = new Date().toISOString();
  private readonly buffer = new Map<string, FalhaEntry>();
  private rootSuite: Suite | undefined;

  onBegin(config: FullConfig, suite: Suite): void {
    this.rootDir = config.rootDir ?? process.cwd();
    this.rootSuite = suite;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const isFailed = result.status === "failed";
    const isFlaky = test.outcome() === "flaky";
    if (!isFailed && !isFlaky) return;

    const entry = this.buildEntry(test, result, isFlaky);
    const key = `${entry.arquivo}::${entry.titulo}`;
    this.buffer.set(key, entry);
  }

  async onEnd(_result: FullResult): Promise<void> {
    try {
      // Saídas ancoradas na raiz do processo (onde `npx playwright test` roda),
      // não no rootDir do Playwright — que, com um único testDir, vira `testes/`.
      const repoRoot = process.cwd();
      const outDir = path.join(repoRoot, "test-results", "failure-summary");
      fs.mkdirSync(outDir, { recursive: true });
      const sanitizedId = this.idExecucao.replace(/:/g, "-");
      const filepath = path.join(
        outDir,
        `${this.ambiente}__${sanitizedId}.json`,
      );
      const inbox: InboxFile = {
        versao: 1,
        ambiente: this.ambiente,
        idExecucao: this.idExecucao,
        geradoEm: new Date().toISOString(),
        falhas: Array.from(this.buffer.values()),
      };
      fs.writeFileSync(filepath, JSON.stringify(inbox, null, 2) + "\n", "utf8");

      const allTests = this.rootSuite?.allTests() ?? [];
      const totais = { total: allTests.length, passou: 0, falhou: 0, skipped: 0, flaky: 0 };
      for (const t of allTests) {
        const outcome = t.outcome();
        if (outcome === "expected") totais.passou += 1;
        else if (outcome === "unexpected") totais.falhou += 1;
        else if (outcome === "flaky") totais.flaky += 1;
        else if (outcome === "skipped") totais.skipped += 1;
      }

      const snapshotPath = process.env.PW_AUTOMATION_SNAPSHOT
        ? path.resolve(repoRoot, process.env.PW_AUTOMATION_SNAPSHOT)
        : path.resolve(repoRoot, "test-results", "last-run.json");
      const snapshot = {
        versao: 1,
        idExecucao: this.idExecucao,
        ambiente: this.ambiente,
        geradoEm: new Date().toISOString(),
        totais,
        falhas: Array.from(this.buffer.values()).map((f) => ({
          testeId: `${f.arquivo}::${f.titulo}`,
          titulo: f.titulo,
          arquivo: f.arquivo,
          projeto: f.projeto,
          ambiente: this.ambiente,
          erro: f.resumo,
          frame: f.primeiroFrameStack,
          linhaErro: f.linhaErro,
          flaky: f.flaky,
        })),
      };
      fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
      fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
    } catch (err) {
      console.error("[failure-summary-reporter] erro ao escrever arquivo:", err);
    }
  }

  private buildEntry(
    test: TestCase,
    result: TestResult,
    isFlaky: boolean,
  ): FalhaEntry {
    const titulo = test.title;
    const arquivoAbs = test.location.file;
    const arquivo = path
      .relative(this.rootDir, arquivoAbs)
      .split(path.sep)
      .join("/");
    const projeto = test.parent.project()?.name ?? null;
    const linhaDeclaracao = test.location.line;

    const erro = result.errors[0];
    const stack = erro?.stack ?? "";
    const { linhaErro, primeiroFrameStack } = this.extractFrame(
      stack,
      linhaDeclaracao,
    );

    const mensagem = erro?.message ?? "<erro sem mensagem>";
    const resumo = this.formatResumo(mensagem);

    return {
      titulo,
      arquivo,
      projeto,
      linhaDeclaracao,
      linhaErro,
      resumo,
      primeiroFrameStack,
      flaky: isFlaky,
    };
  }

  private extractFrame(
    stack: string,
    fallbackLine: number,
  ): { linhaErro: number; primeiroFrameStack: string } {
    if (!stack) return { linhaErro: fallbackLine, primeiroFrameStack: "" };
    const lines = stack.split("\n");
    for (const raw of lines) {
      const trimmed = raw.trim();
      if (!trimmed.startsWith("at ")) continue;
      if (trimmed.includes("node_modules")) continue;
      if (trimmed.includes("node:internal")) continue;
      const match = trimmed.match(STACK_LINE_REGEX);
      if (!match) continue;
      const lineNum = Number.parseInt(match[2], 10);
      if (Number.isNaN(lineNum)) continue;
      return { linhaErro: lineNum, primeiroFrameStack: trimmed };
    }
    return { linhaErro: fallbackLine, primeiroFrameStack: "" };
  }

  private formatResumo(message: string): string {
    const stripped = message.replace(ANSI_REGEX, "");
    const firstLine = stripped.split("\n")[0].replace(/\s+/g, " ").trim();
    const prefixed = `[${this.ambiente}] ${firstLine}`;
    return prefixed.length > RESUMO_MAX
      ? prefixed.slice(0, RESUMO_MAX)
      : prefixed;
  }
}
