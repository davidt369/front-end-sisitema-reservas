import { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import AvailabilityModal from '../components/AvailabilityModal';
import type Local from '../interfaces/local';
import type Disponibilidad from '../interfaces/disponiblilidad';
import type Recurso from '../interfaces/recurso';
import { fetchAvailabilities, createAvailability, updateAvailability, deleteAvailability } from '../Service/serviceDisponibilidad';
import { getLocales } from '../Service/serviceLocal';
import { getAllResources } from '../Service/serviceRecurso';

export default function AvailabilityManagement() {
  const [availabilities, setAvailabilities] = useState<Disponibilidad[]>([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [selectedLocal, setSelectedLocal] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAvailability, setCurrentAvailability] = useState<Disponibilidad | null>(null);

  useEffect(() => {
    const loadLocalesRecursosAndAvailabilities = async () => {
      try {
        const [localData, recursoData, availabilityData] = await Promise.all([getLocales(), getAllResources(), fetchAvailabilities()]);
        setLocales(localData);
        setRecursos(recursoData);
        setAvailabilities(availabilityData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    loadLocalesRecursosAndAvailabilities();
  }, []);

  // Filtrar disponibilidades por local seleccionado
  const filteredAvailabilities = availabilities.filter((availability) =>
    !selectedLocal || recursos.find((recurso) => recurso.id === availability.recurso_id)?.local_id === selectedLocal
  );

  const openModal = (availability?: Disponibilidad) => {
    setCurrentAvailability(availability || null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveAvailability = async (data: Partial<Disponibilidad>[]) => {
    try {
      if (currentAvailability) {
        await updateAvailability(currentAvailability.id, data[0]);
      } else {
        await createAvailability(data[0]);
      }
      const updatedAvailabilities = await fetchAvailabilities();
      setAvailabilities(updatedAvailabilities);
      closeModal();
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      await deleteAvailability(id);
      const updatedAvailabilities = await fetchAvailabilities();
      setAvailabilities(updatedAvailabilities);
    } catch (error) {
      console.error("Error al eliminar disponibilidad:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 sm:p-6 lg:p-8">
      <nav className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin-panel" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center">
              ← Volver al Panel de Administrador
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-800">Gestión de Disponibilidad</h1>
          </div>
        </div>
      </nav>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <select 
          onChange={(e) => setSelectedLocal(Number(e.target.value) || null)}
          className="border rounded-lg p-2 w-full sm:w-64 mb-4 sm:mb-0"
        >
          <option value="">Todos los locales</option>
          {locales.map(local => (
            <option key={local.id} value={local.id}>{local.nombre}</option>
          ))}
        </select>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out w-full sm:w-auto"
        >
          🕒+ Agregar Disponibilidad
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAvailabilities.map((availability) => {
          const recurso = recursos.find((recurso) => recurso.id === availability.recurso_id);
          const local = locales.find((local) => local.id === recurso?.local_id);

          return (
            <div key={availability.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-4 flex items-center justify-between bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-base sm:text-lg font-semibold text-indigo-800">Recurso: {recurso?.tipo_recurso}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${availability.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {availability.disponible ? 'Disponible' : 'No disponible'}
                </span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <p className="text-sm text-gray-600">Local: {local?.nombre}</p>
                  <p className="text-sm text-gray-600">Fecha: {availability.fecha}</p>
                  <p className="text-sm text-gray-600">Horario: {availability.hora_inicio} - {availability.hora_fin}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openModal(availability)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full shadow transition duration-300 ease-in-out">
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDeleteAvailability(availability.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full shadow transition duration-300 ease-in-out">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <AvailabilityModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveAvailability}
          availability={currentAvailability}
          locales={locales}
          recursos={recursos}
        />
      )}
    </div>
  );
}
