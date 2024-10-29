import { useState, useEffect } from 'react';
import { Link } from "@remix-run/react";
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CreateEditLocationModal from '../components/CreateEditLocationModal';
import { getLocales, createLocal, updateLocal, deleteLocal } from '../Service/serviceLocal';
import Local from '~/interfaces/local';

export default function LocationManagement() {
  const [locations, setLocations] = useState<Local[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Local | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar locales al montar el componente
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocales();
        setLocations(data);
      } catch (err) {
        console.error('Error al obtener locales:', err);
        setError('Error al obtener los locales');
      }
    };
    fetchLocations();
  }, []);

  // Abrir modal de creación/edición
  const openModal = (location: Local | null = null) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  // Guardar o actualizar local
  const handleSaveLocation = async (location: Local) => {
    try {
      if (selectedLocation) {
        // Actualizar local
        const updatedLocation = await updateLocal(selectedLocation.id, location);
        setLocations(locations.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc)));
      } else {
        // Crear nuevo local
        const newLocation = await createLocal(location);
        setLocations([...locations, newLocation]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Error al guardar el local');
    }
  };

  // Abrir modal de confirmación de eliminación
  const openDeleteModal = (location: Local) => {
    setSelectedLocation(location);
    setIsDeleteModalOpen(true);
  };

  // Eliminar local
  const handleDeleteLocation = async () => {
    if (selectedLocation) {
      try {
        await deleteLocal(selectedLocation.id);
        setLocations(locations.filter((loc) => loc.id !== selectedLocation.id));
        setIsDeleteModalOpen(false);
      } catch (err) {
        setError('Error al eliminar el local');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-200 p-6">
      <nav className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin-panel" className="text-yellow-600 hover:text-yellow-800 font-semibold flex items-center">
              ← Volver al Panel de Administrador
            </Link>
            <h1 className="text-2xl font-bold text-yellow-800">Gestión de Locales</h1>
          </div>
        </div>
      </nav>

      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => openModal()} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full">
          🏢+ Agregar Local
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{location.nombre}</h2>
                  <p className="text-sm text-gray-600">{location.direccion}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${location.tipo === 'bar' ? 'bg-red-100 text-red-800' : 
                    location.tipo === 'restaurante' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {location.tipo}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Teléfono: {location.telefono}</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => openModal(location)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                  ✏️ Editar
                </button>
                <button onClick={() => openDeleteModal(location)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateEditLocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLocation} location={selectedLocation} />
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteLocation} 
      />
    </div>
  );
}
