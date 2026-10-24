import { useForm } from 'react-hook-form';
import { Form, Button, Container, Card } from 'react-bootstrap';
import imagenJuego from '../assets/icono2.png'


export default function FormIntento({ mensaje, onSubmitData }) {
  const { register, handleSubmit } = useForm();

  return (
    <Container className=" d-flex justify-content-center align-items-center vh-100 bg-dark" fluid>
      <Card bg="dark" text="white" className="p-4 shadow d-flex justify-content-center align-items-center" style={{ width: '400px' }}>
        <Card.Img 
                  variant="top" 
                  src={imagenJuego} 
                  alt="Imagen ilustrativa del juego" 
                  style={{  height: '12rem', width:'12rem', borderRadius: '50%' }}
                  className=''
                />
        <Card.Body>
          {/* Aquí mostramos el mensaje personalizado que escribiste en el Admin */}
          <Card.Title as="p" className="text-center mb-4 text-light opacity-75">
            {mensaje}
          </Card.Title>

          <Form onSubmit={handleSubmit(onSubmitData)}>
            <Form.Group className="mb-4 d-flex">
              <button type='button' className='text-ligh bg-dark border-secondary border-1'>G-</button>
              <Form.Control 
                type="text" 
                placeholder="" 
                className="bg-dark text-white border-secondary"
                {...register("adivinar", { required: true })} 
              />
              
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 fw-bold">
              Siguiente
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}