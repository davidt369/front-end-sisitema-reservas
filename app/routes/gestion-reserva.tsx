import { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import type Reserva from '../interfaces/reserva';
import type Usuario from '../interfaces/usuario';
import type Local from '../interfaces/local';
import type Recurso from '../interfaces/recurso';
import { getReservas, createReserva, updateReserva, deleteReserva } from '../Service/serviceReserva';
import { getLocales } from '../Service/serviceLocal';
import { getAllResources } from '../Service/serviceRecurso';
import { getUsuarios } from '../Service/serviceUsuarios';
import CreateEditReservationModal from '../components/CreateEditReservationModal';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedLocal, setSelectedLocal] = useState<number | ''>('');
  const [selectedReservation, setSelectedReservation] = useState<Reserva | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservasData, localesData, recursosData, usuariosData] = await Promise.all([
        getReservas(),
        getLocales(),
        getAllResources(),
        getUsuarios(),
      ]);

      setReservations(reservasData);
      setLocales(localesData);
      setRecursos(recursosData);
      setUsuarios(usuariosData);
    } catch (error) {
      setError('Error al cargar los datos');
    }
  };

  const filteredReservations = selectedLocal
    ? reservations.filter(reserva => reserva.local_id === Number(selectedLocal))
    : reservations;

  const getLocalName = (localId: number) => locales.find(local => local.id === localId)?.nombre || 'Desconocido';
  const getRecursoTipo = (recursoId: number) => recursos.find(recurso => recurso.id === recursoId)?.tipo_recurso || 'Desconocido';
  const getUsuarioName = (usuarioId: number) => usuarios.find(usuario => usuario.id === usuarioId)?.nombre || 'Desconocido';

  const openModal = (reservation: Reserva | null = null) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleSaveReservation = async (reservationData: Partial<Reserva>) => {
    try {
      if (selectedReservation && selectedReservation.id) {
        await updateReserva(selectedReservation.id, reservationData);
      } else {
        await createReserva(reservationData as Reserva);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      setError('Error al guardar la reserva');
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      await deleteReserva(id);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      setError('Error al eliminar la reserva');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-200 p-4 sm:p-6">
      <nav className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-16">
            <Link to="/admin-panel" className="text-purple-600 hover:text-purple-800 font-semibold flex items-center mb-2 sm:mb-0">
              ← Volver al Panel de Administrador
            </Link>
            <h1 className="text-2xl font-bold text-purple-800">Gestión de Reservas</h1>
          </div>
        </div>
      </nav>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <select
          value={selectedLocal}
          onChange={(e) => setSelectedLocal(Number(e.target.value))}
          className="border px-3 py-2 rounded mr-4 mb-2 sm:mb-0 w-full sm:w-auto"
        >
          <option value="">Filtrar por local</option>
          {locales.map((local) => (
            <option key={local.id} value={local.id}>
              {local.nombre}
            </option>
          ))}
        </select>

        <button 
          onClick={() => openModal()} 
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg w-full sm:w-auto"
        >
          <span className="mr-2">📅+</span>
          Nueva Reserva
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Reserva #{reservation.id}</h2>
                  <p className="text-sm text-gray-600">Usuario: {getUsuarioName(reservation.usuario_id)}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${reservation.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reservation.estado}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Local: {getLocalName(reservation.local_id)}</p>
              <p className="text-sm text-gray-600 mb-2">Recurso: {getRecursoTipo(reservation.recurso_id)}</p>
              <p className="text-sm text-gray-600 mb-2">Fecha: {reservation.fecha}</p>
              <p className="text-sm text-gray-600 mb-2">Hora: {reservation.hora}</p>
              <p className="text-sm text-gray-600 mb-4">Personas: {reservation.num_personas}</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => openModal(reservation)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow">
                  <span className="mr-2">✏️</span>
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateEditReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservation}
        onDelete={handleDeleteReservation}
        reservation={selectedReservation}
      />
    </div>
  );
}
