import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css";
import Cofre from "./features/cofre/Cofre";
import { Prontuario } from "./features/prontuario/Prontuario";
import Home from "./pages/Home";
import { PacienteRoute } from "./routes/PacienteRoute";
import { ProfissionalRoute } from "./routes/ProfissionalRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route element={<PacienteRoute />}>
          <Route path="/cofre" element={<Cofre />} />   
        </Route>

        <Route path="/profissional" element={<ProfissionalRoute />}>
          <Route path="prontuario" element={<Prontuario />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
