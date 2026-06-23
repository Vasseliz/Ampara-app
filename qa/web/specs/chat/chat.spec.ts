import { test } from "@playwright/test";
import { type RunContext } from "../../../foundation";
import { getWebRunContext } from "../../src/fixtures/run-context";
import { ChatPage } from "../../src/pages/chat.page";
import { LoginPage } from "../../src/pages/login.page";

test.describe.serial("Chat", () => {
  let ctx: RunContext;

  test.beforeAll(async () => {
    ctx = await getWebRunContext();
  });
  test.beforeEach(async ({ page }) => new LoginPage(page).authenticate(ctx.profissional));

  test("Listar conversas", async ({ page }) => {
    const chat = new ChatPage(page);
    await chat.open();
    await chat.expectConversationList();
  });

  test("Enviar mensagem", async ({ page }) => {
    const chat = new ChatPage(page);
    await chat.open();
    await chat.send(`Mensagem E2E ${Date.now()}`);
  });
});
