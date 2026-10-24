import { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

export default function ProteccionAdmin({ children }) {
    const [codigo, setCodigo] = useState('');
    const [autorizado, setAutorizado] = useState(false);
    const [error, setError] = useState(false);

    const verificarCodigo = (e) => {
        e.preventDefault();
        if (codigo === '2525') {
            setAutorizado(true);
            setError(false);
        } else {
            setError(true);
            setCodigo('');
        }
    };

    // Si el código es correcto, mostramos el panel de admin (children)
    if (autorizado) {
        return children;
    }

    // Si no está autorizado, mostramos el formulario de validación
    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-dark" fluid>
            <Card bg="dark" text="white" className="p-4 shadow border-secondary" style={{ width: '350px' }}>
                <Card.Body>
                    <Card.Title as="h4" className="text-center mb-4">
                        Acceso Restringido
                    </Card.Title>
                    <Form onSubmit={verificarCodigo}>
                        <Form.Group className="mb-4" controlId="formCodigo">
                            <Form.Control
                                type="password"
                                placeholder="Ingrese el código PIN"
                                className="bg-secondary text-white border-secondary text-center"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                required
                            />
                        </Form.Group>
                        
                        {error && (
                            <p className="text-danger text-center mb-3">
                                Código incorrecto, intente nuevamente.
                            </p>
                        )}
                        
                        <Button variant="primary" type="submit" className="w-100 fw-bold">
                            Ingresar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}