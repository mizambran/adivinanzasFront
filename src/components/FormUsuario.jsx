import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Card, Spinner } from 'react-bootstrap';
import { io } from 'socket.io-client';
import FormIntento from './FormIntento'; // Lo creamos en el siguiente paso

const socket = io('http://localhost:4000');

export default function FormUsuario() {
  const [estadoVista, setEstadoVista] = useState('formulario1'); // 'formulario1', 'cargando', 'formulario2', 'exito'
  const [mensajeAdmin, setMensajeAdmin] = useState('');
  const [socketId, setSocketId] = useState('');
  const [correoGuardado, setCorreoGuardado] = useState(''); // Para reutilizarlo en el 2do intento

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    socket.on('connect', () => setSocketId(socket.id));

    // Escuchamos la decisión que tomes desde el panel Admin
    socket.on('respuesta_validacion', (data) => {
      setMensajeAdmin(data.mensaje);
      if (data.acerto) {
        setEstadoVista('exito');
      } else {
        setEstadoVista('formulario2');
      }
    });

    return () => {
      socket.off('connect');
      socket.off('respuesta_validacion');
    };
  }, []);

  const onSubmitPrimerIntento = async (data) => {
    setEstadoVista('cargando');
    setCorreoGuardado(data.correo); // Lo guardamos por si hay un segundo intento

    await fetch('http://localhost:4000/api/intentos/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        correo: data.correo, 
        adivinar: data.adivinar, 
        socketId, 
        intento: 1 
      })
    });
  };

  const onSubmitSegundoIntento = async (data) => {
    setEstadoVista('cargando');
    
    await fetch('http://localhost:4000/api/intentos/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        correo: correoGuardado, 
        adivinar: data.adivinar, 
        socketId, 
        intento: 2 
      })
    });
  };

  // --- RENDERIZADOS CONDICIONALES ---

  if (estadoVista === 'cargando') {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white" fluid>
        <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} className="mb-4" />
        <h3>Procesando respuesta...</h3>
      </Container>
    );
  }

  if (estadoVista === 'exito') {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white" fluid>
        <h1 className="text-success mb-3">¡Felicidades!</h1>
        <h3>{mensajeAdmin}</h3>
      </Container>
    );
  }

  if (estadoVista === 'formulario2') {
    // Si falló, mostramos el componente del segundo intento pasándole el mensaje y la función
    return <FormIntento mensaje={mensajeAdmin} onSubmitData={onSubmitSegundoIntento} />;
  }

  // Vista por defecto: Formulario 1
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-dark" fluid>
      <Card bg="dark" text="white" className="p-4 shadow border-secondary" style={{ width: '400px' }}>
        <Card.Body>
          <Card.Title as="h2" className="text-center mb-3">Listo para adivinar</Card.Title>
          <Card.Text className="text-center text-muted mb-4">
            Ingresa tu correo y el dato que crees que es el correcto.
          </Card.Text>

          <Form onSubmit={handleSubmit(onSubmitPrimerIntento)}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="ejemplo@correo.com" 
                className="bg-secondary text-white border-secondary"
                {...register("correo", { required: true })} 
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Adivinar</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingresa tu respuesta..." 
                className="bg-secondary text-white border-secondary"
                {...register("adivinar", { required: true })} 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 fw-bold">Enviar</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}