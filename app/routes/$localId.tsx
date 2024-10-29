import { useEffect, useState } from 'react';
import { useParams } from "@remix-run/react";
import { getResourcesByLocal, updateResource } from '../Service/serviceRecurso';
import { createReserva } from '../Service/serviceReserva';
import { updateAvailability } from '../Service/serviceDisponibilidad';

import type Recurso from '../interfaces/recurso';
import type Disponibilidad from '../interfaces/disponiblilidad';
import type Reserva from '../interfaces/reserva';
import { fetchAvailabilities } from '../Service/serviceDisponibilidad';

const AvailableResources: React.FC = () => {
  const { localId } = useParams<{ localId: string }>();
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [availabilities, setAvailabilities] = useState<Disponibilidad[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null); // Almacena el recurso seleccionado

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser?.id || null);
    }
  }, []);

  const fetchData = async () => {
    try {
      if (localId) {
        const recursosData = await getResourcesByLocal(Number(localId));
        const availabilitiesData = await fetchAvailabilities();

        const recursosDisponibles = recursosData.filter(recurso => {
          const recursoAvailability = availabilitiesData.find(
            availability => availability.recurso_id === recurso.id && availability.disponible
          );
          return (
            recurso.estado !== 'reservado' &&
            recursoAvailability && recursoAvailability.disponible
          );
        });

        setRecursos(recursosDisponibles);
        setAvailabilities(availabilitiesData);
      }
    } catch (error) {
      console.error("Error al cargar los recursos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [localId]);

  const confirmReservation = async () => {
    if (!selectedRecurso) return;

    const recursoAvailability = availabilities.find(
      availability => availability.recurso_id === selectedRecurso.id && availability.disponible
    );

    if (recursoAvailability && userId) {
      const reservationData: Reserva = {
        usuario_id: userId,
        local_id: Number(localId),
        recurso_id: selectedRecurso.id,
        fecha: new Date(recursoAvailability.fecha).toISOString().split('T')[0],
        hora: recursoAvailability.hora_inicio,
        num_personas: selectedRecurso.capacidad,
        estado: "confirmada"
      };

      try {
        await createReserva(reservationData);
        
        // Actualizar el recurso enviando todos sus datos
        const updatedResource = {
          ...selectedRecurso,
          estado: "reservado",
          disponible: false
        };
        await updateResource(selectedRecurso.id, updatedResource);

        // Actualizar la disponibilidad
        const updatedAvailability = {
          ...recursoAvailability,
          disponible: false
        };
        await updateAvailability(recursoAvailability.id, updatedAvailability);

        // Recargar los datos y cerrar el modal
        setShowModal(false);
        fetchData();
      } catch (error) {
        console.error('Error al guardar la reserva:', error);
        setError('Error al guardar la reserva');
      }
    } else {
      console.log("No hay disponibilidad para este recurso o usuario no autenticado.");
    }
  };

  const handleReserveClick = (recurso: Recurso) => {
    setSelectedRecurso(recurso);
    setShowModal(true); // Mostrar el modal al seleccionar un recurso
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Recursos Disponibles</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmar Reserva</h2>
            <p className="text-gray-700 mb-6">¿Está seguro de que desea reservar este recurso?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReservation}
                className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recursos.length > 0 ? (
          recursos.map((recurso) => {
            const recursoAvailability = availabilities.find(
              availability => availability.recurso_id === recurso.id && availability.disponible
            );

            return (
              <div
                key={recurso.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-indigo-600">{recurso.tipo_recurso}</h2>
                  <p className="text-gray-700 mt-2">Capacidad: {recurso.capacidad}</p>
                  <p className="text-gray-700 mt-2">Estado: {recurso.estado}</p>
                  {recursoAvailability ? (
                    <>
                      <p className="text-gray-700 mt-2">Fecha: {new Date(recursoAvailability.fecha).toLocaleDateString()}</p>
                      <p className="text-gray-700">Hora de Inicio: {recursoAvailability.hora_inicio}</p>
                      <p className="text-gray-700">Hora de Fin: {recursoAvailability.hora_fin}</p>
                    </>
                  ) : (
                    <p className="text-gray-700 mt-2">No hay disponibilidad</p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 flex justify-end">
                  {recursoAvailability && (
                    <button
                      onClick={() => handleReserveClick(recurso)}
                      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                    >
                      Reservar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">Las reservas se han agotado para este local.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableResources;
