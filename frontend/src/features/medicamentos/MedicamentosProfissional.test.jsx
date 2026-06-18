import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { MedicamentosProfissional } from "./MedicamentosProfissional";

vi.mock("./hooks/useMedicamentosProfissional", () => ({
  useMedicamentosProfissional: () => ({
    medications: [
      { id: "m1", name: "Fluoxetina", dosage: "20mg", time: "08:00", observation: null, active: true },
      { id: "m2", name: "Sertralina", dosage: "50mg", time: "07:00", observation: null, active: false },
    ],
    loading: false,
    submitting: false,
    removingId: "",
    error: "",
    reload: vi.fn(),
    criar: vi.fn(),
    atualizar: vi.fn(),
    remover: vi.fn(),
  }),
}));

vi.mock("../pacientes/usePacientes", () => ({
  usePacientes: () => ({
    patients: [{ id: "p1", firstName: "Maria", lastName: "Silva", email: "maria@test.com" }],
    invites: [],
    loading: false,
  }),
}));

function renderPage(route = "/profissional/medicamentos/p1") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/profissional/medicamentos/:pacienteId?" element={<MedicamentosProfissional />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("MedicamentosProfissional", () => {
  it("renderiza lista de medicamentos ativos e inativos com badge correto", () => {
    renderPage();
    expect(screen.getByText("Fluoxetina")).toBeInTheDocument();
    expect(screen.getByText("Sertralina")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });

  it("exibe botão de editar apenas em medicamentos ativos", () => {
    renderPage();
    const editButtons = screen.getAllByLabelText("Editar");
    expect(editButtons).toHaveLength(1);
  });

  it("abre modal de criação ao clicar em Novo medicamento", () => {
    renderPage();
    fireEvent.click(screen.getByText("Novo medicamento"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome do medicamento")).toBeInTheDocument();
  });

  it("abre uma confirmacao visual antes de desativar um medicamento", () => {
    renderPage();
    fireEvent.click(screen.getByLabelText("Desativar"));

    const dialog = screen.getByRole("dialog", { name: "Desativar medicamento?" });
    expect(dialog).toHaveAccessibleDescription(/Fluoxetina/);
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  it("valida campos obrigatórios antes de submeter", async () => {
    const { container } = renderPage();
    fireEvent.click(screen.getByText("Novo medicamento"));
    const form = container.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Informe o nome.")).toBeInTheDocument();
      expect(screen.getByText("Informe a dosagem.")).toBeInTheDocument();
      expect(screen.getByText("Informe o horário.")).toBeInTheDocument();
    });
  });

  it("mostra contador de medicamentos ativos no cabeçalho", () => {
    renderPage();
    expect(screen.getByText("1 ativo(s)")).toBeInTheDocument();
  });

  it("mostra Selecione um paciente quando rota sem pacienteId", () => {
    renderPage("/profissional/medicamentos");
    expect(screen.getByText("Selecione um paciente")).toBeInTheDocument();
    expect(screen.queryByText("Lista de medicamentos")).not.toBeInTheDocument();
  });
});
