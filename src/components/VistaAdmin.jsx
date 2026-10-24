import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function VistaAdmin() {
    // ... (mantienes los estados y el useEffect igual) ...

    const enviarRespuesta = async (id, acerto, intentoNum) => {
        let mensajeDefecto = '';
        if (acerto) {
            mensajeDefecto = intentoNum === 1 ? 'ok felicidades!' : 'Felicidades!';
        } else {
            mensajeDefecto = intentoNum === 1 ? 'intenta de nuevo' : 'Intenta mas tarde...';
        }

        const mensajeFinal = mensajeTexto || mensajeDefecto;

        try {
            const response = await fetch(`http://localhost:4000/api/intentos/responder/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    acerto,
                    mensaje: mensajeFinal
                })
            });

            if (!response.ok) {
                throw new Error('Error al enviar la respuesta');
            }
            
            // Remover de la lista una vez contestado
            setSolicitudes(prev => prev.filter(s => s._id !== id));
            setMensajeTexto('');
        } catch (error) {
            console.error("Error al procesar la validación:", error);
        }
    };

return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Panel de Validación</h2>
            {solicitudes.length === 0 ? <p>No hay solicitudes pendientes.</p> : null}
            
            {solicitudes.map(solicitud => (
                <div key={solicitud._id} className="border p-4 mb-4 shadow rounded bg-gray-50">
                    <p className="font-semibold">Intento #{solicitud.intentoNumero}</p>
                    <p className="mb-2">Datos ingresados: {solicitud.datosRecibidos.join(' - ')}</p>
                    
                    <input 
                        type="text"
                        placeholder="Texto tipeado a mano (opcional)"
                        className="border p-2 w-full mb-3"
                        value={mensajeTexto}
                        onChange={e => setMensajeTexto(e.target.value)}
                    />
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => enviarRespuesta(solicitud._id, true, solicitud.intentoNumero)}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Es Correcto
                        </button>
                        <button 
                            onClick={() => enviarRespuesta(solicitud._id, false, solicitud.intentoNumero)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Es Incorrecto
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

