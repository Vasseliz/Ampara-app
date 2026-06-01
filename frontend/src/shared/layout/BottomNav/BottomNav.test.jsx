import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BottomNav } from "./BottomNav";

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { role: "professional" } }),
}));

function renderWithRouter(ui, route = "/") {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe("BottomNav", () => {
  it("renderiza links do profissional quando user.role === professional", () => {
    renderWithRouter(<BottomNav />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Pacientes")).toBeInTheDocument();
    expect(screen.getByText("Meds")).toBeInTheDocument();
    expect(screen.getByText("Notas")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it("não renderiza links de paciente quando user é profissional", () => {
    renderWithRouter(<BottomNav />);
    expect(screen.queryByText("Humor")).not.toBeInTheDocument();
    expect(screen.queryByText("Hábitos")).not.toBeInTheDocument();
  });

  it("aplica classe active no link da rota atual", () => {
    renderWithRouter(<BottomNav />, "/profissional/pacientes");
    const link = screen.getByText("Pacientes").closest("a");
    expect(link?.className).toMatch(/active/);
  });
});
