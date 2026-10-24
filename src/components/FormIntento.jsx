import { useForm } from 'react-hook-form';
import { Form, Button, Container, Card } from 'react-bootstrap';

export default function FormIntento({ mensaje, onSubmitData }) {
  const { register, handleSubmit } = useForm();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-dark" fluid>
      <Card bg="dark" text="white" className="p-4 shadow border-secondary" style={{ width: '400px' }}>
        <Card.Body>
          {/* Aquí mostramos el mensaje personalizado que escribiste en el Admin */}
          <Card.Title as="h3" className="text-center mb-4 text-warning">
            {mensaje}
          </Card.Title>

          <Form onSubmit={handleSubmit(onSubmitData)}>
            <Form.Group className="mb-4">
              <Form.Control 
                type="text" 
                placeholder="Nuevo intento..." 
                className="bg-secondary text-white border-secondary"
                {...register("adivinar", { required: true })} 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 fw-bold">
              Enviar de nuevo
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}