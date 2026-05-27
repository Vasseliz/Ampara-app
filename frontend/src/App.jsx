import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AceitarConvitePaciente } from "./features/pacientes/AceitarConvitePaciente";
import { ConvitesPaciente } from "./features/pacientes/ConvitesPaciente";
import Cofre from "./features/cofre/Cofre";
import { Pacientes } from "./features/pacientes/Pacientes";
import Chat from "./features/chat/Chat";
import { Prontuario } from "./features/prontuario/Prontuario";
import Home from "./pages/Home";
import { MedicamentosScreen as Medicamentos } from "./features/medicamentos/Medicamentos";
import { Humor } from "./features/humor/Humor";
import { PacienteRoute } from "./routes/PacienteRoute";
import { ProfissionalRoute } from "./routes/ProfissionalRoute";
import { RequireAuth } from "./routes/RequireAuth";
import { DashboardLayout } from "./shared/layout/DashboardLayout/DashboardLayout";
import { Toaster } from "./shared/atoms/toast/Toast";
import Login from "./features/auth/Login";
import Signup from "./features/auth/SignUp";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/convite/aceitar" element={<AceitarConvitePaciente />} />

          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />

              <Route element={<PacienteRoute />}>
                <Route path="/cofre" element={<Cofre />} />
                <Route path="/convites" element={<ConvitesPaciente />} />
                <Route path="/medicamentos" element={<Medicamentos />} />
                <Route path="/humor" element={<Humor />} />
              </Route>

              <Route path="/profissional" element={<ProfissionalRoute />}>
                <Route index element={<Navigate to="prontuario" replace />} />
                <Route path="pacientes" element={<Pacientes />} />
                <Route
                  path="prontuario/:pacienteId?"
                  element={<Prontuario />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
