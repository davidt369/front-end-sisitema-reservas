import { useEffect, useState } from "react";
import { getReservationsByUserId, updateReserva, deleteReserva } from "../Service/serviceReserva";
import { updateResource } from "../Service/serviceRecurso";
import { updateAvailability, fetchAvailabilities } from "../Service/serviceDisponibilidad";
import type Reserva from "~/interfaces/reserva";
import type Disponibilidad from "~/interfaces/disponiblilidad";

export default function Reservations() {
  const [myReservations, setMyReservations] = useState<Reserva[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reserva | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser?.id || null);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchReservations(userId);
    }
  }, [userId]);

  const fetchReservations = async (userId: number) => {
    try {
      const reservations = await getReservationsByUserId(userId);
      setMyReservations(reservations);
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
    }
  };

  const handleModifyClick = (reservation: Reserva) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.estado);
    setShowModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedReservation || !selectedReservation.id) return;

    try {
      await updateReserva(selectedReservation.id, {
        usuario_id: selectedReservation.usuario_id,
        local_id: selectedReservation.local_id,
        recurso_id: selectedReservation.recurso_id,
        fecha: selectedReservation.fecha,
        hora: selectedReservation.hora,
        num_personas: selectedReservation.num_personas,
        estado: newStatus,
      });

      if (newStatus === "cancelada") {
        await updateResource(selectedReservation.recurso_id, {
          id: selectedReservation.recurso_id,
          local_id: selectedReservation.local_id,
          tipo_recurso: "EspecificaTipo",
          capacidad: 1,
          estado: "disponible",
        });

        const availabilities = await fetchAvailabilities();
        const disponibilidad = availabilities.find(
          (availability: Disponibilidad) => availability.recurso_id === selectedReservation.recurso_id
        );

        if (disponibilidad) {
          await updateAvailability(disponibilidad.id, {
            id: disponibilidad.id,
            recurso_id: disponibilidad.recurso_id,
            fecha: disponibilidad.fecha,
            hora_inicio: disponibilidad.hora_inicio,
            hora_fin: disponibilidad.hora_fin,
            disponible: true,
          });
        }
      }

      setMyReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.id === selectedReservation.id ? { ...res, estado: newStatus } : res
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error al actualizar el estado de la reserva:", error);
    }
  };

  const deleteReservation = async (reservation: Reserva) => {
    if (!reservation.id) return;

    try {
      await deleteReserva(reservation.id);

      await updateResource(reservation.recurso_id, {
        id: reservation.recurso_id,
        local_id: reservation.local_id,
        tipo_recurso: "EspecificaTipo",
        capacidad: 1,
        estado: "disponible",
      });

      const availabilities = await fetchAvailabilities();
      const disponibilidad = availabilities.find(
        (availability: Disponibilidad) => availability.recurso_id === reservation.recurso_id
      );

      if (disponibilidad) {
        await updateAvailability(disponibilidad.id, {
          id: disponibilidad.id,
          recurso_id: disponibilidad.recurso_id,
          fecha: disponibilidad.fecha,
          hora_inicio: disponibilidad.hora_inicio,
          hora_fin: disponibilidad.hora_fin,
          disponible: true,
        });
      }

      setMyReservations((prevReservations) =>
        prevReservations.filter((res) => res.id !== reservation.id)
      );
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Mis Reservas</h2>
        {myReservations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-indigo-600">
                      Reserva #{reservation.id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        reservation.estado === "confirmada"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reservation.estado}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">🏢 Local:</span> {reservation.local_id}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">🛋️ Recurso:</span> {reservation.recurso_id}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">📅 Fecha:</span> {reservation.fecha}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">🕒 Hora:</span> {reservation.hora}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">👥 Personas:</span> {reservation.num_personas}
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => handleModifyClick(reservation)}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                  >
                    ✏️ Modificar
                  </button>
                  <button
                    onClick={() => deleteReservation(reservation)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tienes reservas realizadas.</p>
        )}
      </main>

      {/* Modal para modificar el estado */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Modificar Estado de la Reserva</h2>
            <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Estado:</label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="block w-full p-2 border rounded-lg mb-6"
            >
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
