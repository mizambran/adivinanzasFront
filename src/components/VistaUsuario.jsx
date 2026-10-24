import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Loader2 } from 'lucide-react';

const socket = io('http://localhost:4000');

export default function VistaUsuario() {
    // ... (mantienes todos los estados y el useEffect igual) ...

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensajeServidor('');

        const datos = intentoNum === 1 ? [input1, input2] : [input3];

        try {
            const response = await fetch('http://localhost:4000/api/intentos/enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    datos,
                    socketId,
                    intentoNumero: intentoNum
                })
            });

            if (!response.ok) {
                throw new Error('Error en la petición');
            }

            // Si necesitas leer la respuesta del servidor:
            // const data = await response.json();

        } catch (error) {
            console.error("Error al enviar", error);
            setCargando(false);
        }
    };
return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            {mensajeServidor && <div className="mb-4 p-2 bg-yellow-100 text-yellow-800">{mensajeServidor}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {intentoNum === 1 ? (
                    <>
                        <input 
                            type="text" placeholder="Dato 1" className="border p-2" required
                            value={input1} onChange={e => setInput1(e.target.value)} 
                        />
                        <input 
                            type="text" placeholder="Dato 2" className="border p-2" required
                            value={input2} onChange={e => setInput2(e.target.value)} 
                        />
                    </>
                ) : (
                    <input 
                        type="text" placeholder="Nuevo intento..." className="border p-2" required
                        value={input3} onChange={e => setInput3(e.target.value)} 
                    />
                )}
                
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Enviar
                </button>
            </form>
        </div>
    );
}
