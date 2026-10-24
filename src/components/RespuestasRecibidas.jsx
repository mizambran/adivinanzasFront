import { useState, useEffect } from 'react';
import { Container, Table, Form, Button } from 'react-bootstrap';
import { io } from 'socket.io-client';

 
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(backendUrl);

export default function RespuestasRecibidas() {
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    // Escuchamos cuando un usuario envía un formulario
    socket.on('alerta_admin', (data) => {
      setRespuestas((prev) => [...prev, data]);
    });
    return () => socket.off('alerta_admin');
  }, []);

  useEffect(() => {
    // 1. Cargar las respuestas que ya estaban pendientes en la base de datos
    const cargarPendientes = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/intentos/pendientes`);
        if (response.ok) {
          const data = await response.json();
          setRespuestas(data);
        }
      } catch (error) {
        console.error("Error al cargar pendientes:", error);
      }
    };

    cargarPendientes();

    // 2. Mantener la escucha del socket para las respuestas NUEVAS en tiempo real
    socket.on('alerta_admin', (data) => {
      setRespuestas((prev) => [...prev, data]);
    });

    return () => socket.off('alerta_admin');
  }, []);

  // Función para quitar la fila de la tabla una vez que la respondiste
  const removerFila = (id) => {
    setRespuestas((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <Container fluid className="bg-dark text-white vh-100 p-4">
      <h2 className="mb-4">Panel de Administración</h2>
      <Table striped bordered hover variant="dark" className="align-middle">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Adivinar (Intento)</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {respuestas.length === 0 ? (
            <tr><td colSpan="3" className="text-center">No hay respuestas pendientes</td></tr>
          ) : (
            respuestas.map((resp) => (
              <FilaTabla key={resp._id} data={resp} onResponder={removerFila} />
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

// Sub-componente para aislar el Select y el Input de cada fila individualmente
function FilaTabla({ data, onResponder }) {
  const [esCorrecto, setEsCorrecto] = useState('Si');
  const [mensaje, setMensaje] = useState('');

  const enviarRespuestaAdmin = async () => {
    // Transformamos el "Si" o "No" del select a un booleano para el backend
    const acertoBool = esCorrecto === 'Si';

    await fetch(`${backendUrl}/api/intentos/responder/${data._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        acerto: acertoBool, 
        mensaje: mensaje 
      })
    });

    onResponder(data._id); // Quitamos la fila de la vista
  };

  return (
    <tr>
      <td>{data.correo}</td>
      <td>
        <span className="fw-bold text-info">{data.adivinar}</span> 
        <small className="ms-2 text-muted">(Intento #{data.intento})</small>
      </td>
      <td>
        <div className="d-flex gap-2">
          <Form.Select 
            value={esCorrecto} 
            onChange={(e) => setEsCorrecto(e.target.value)} 
            style={{ width: '100px' }}
            className="bg-secondary text-white border-secondary"
          >
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </Form.Select>
          
          <Form.Control 
            type="text" 
            placeholder="Escribe el mensaje..." 
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="bg-secondary text-white border-secondary"
          />
          
          <Button variant="success" onClick={enviarRespuestaAdmin}>
            Enviar
          </Button>
        </div>
      </td>
    </tr>
  );
}