import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormUsuario from './components/FormUsuario'
import RespuestasRecibidas from './components/RespuestasRecibidas';
import ProteccionAdmin from './components/ProteccionAdmin';


function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/* Ruta principal pública: El usuario ve el formulario de adivinanza */}
        <Route path="/" element={<FormUsuario />} />

        {/* Ruta privada: Tú ingresas a /admin y te pide el código 2525 */}
        <Route 
          path="/admin" 
          element={
            <ProteccionAdmin>
              <RespuestasRecibidas />
            </ProteccionAdmin>
          } 
        />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
