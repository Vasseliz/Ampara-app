import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css";
import Cofre from "./features/cofre/Cofre";
import { Prontuario } from "./features/prontuario/Prontuario";
import Home from "./pages/Home";
import { MedicamentosScreen as Medicamentos } from "./features/medicamentos/Medicamentos";
import { PacienteRoute } from "./routes/PacienteRoute";
import { ProfissionalRoute } from "./routes/ProfissionalRoute";
import { DashboardLayout } from "./shared/layout/DashboardLayout/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<DashboardLayout />}>

          <Route element={<PacienteRoute />}>
            <Route path="/cofre" element={<Cofre />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
          </Route>

          <Route path="/profissional" element={<ProfissionalRoute />}>
            <Route path="prontuario" element={<Prontuario />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
