import { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import { FaPlus, FaEdit, FaTrash, FaHome } from 'react-icons/fa'; // Importación de iconos
import { getAllResources, createResource, updateResource, deleteResource, getResourcesByLocal } from '../Service/serviceRecurso';
import { getLocales } from '../Service/serviceLocal';
import CreateEditResourceModal from '../components/CreateEditResourceModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Recurso from '~/interfaces/recurso';
import Local from '~/interfaces/local';

export default function ResourceManagement() {
  const [resources, setResources] = useState<Recurso[]>([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [selectedResource, setSelectedResource] = useState<Recurso | null>(null);
  const [selectedLocal, setSelectedLocal] = useState<number | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los locales y recursos iniciales
  const loadResources = async (localId?: number) => {
    try {
      const data = localId ? await getResourcesByLocal(localId) : await getAllResources();
      setResources(data);
    } catch (error) {
      setError('Error al obtener recursos');
    }
  };

  const loadLocales = async () => {
    try {
      const data = await getLocales();
      setLocales(data);
    } catch (error) {
      setError('Error al cargar locales');
    }
  };

  useEffect(() => {
    loadLocales();
    loadResources();
  }, []);

  const handleLocalChange = (localId: number) => {
    setSelectedLocal(localId);
    loadResources(localId);
  };

  const openModal = (resource: Recurso | null = null) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleSaveResource = async (resourceData: Partial<Recurso>) => {
    try {
      if (selectedResource) {
        await updateResource(selectedResource.id, resourceData);
      } else {
        await createResource(resourceData as Recurso);
      }
      setIsModalOpen(false);
      loadResources(selectedLocal as number);
    } catch (error) {
      setError('Error al guardar el recurso');
    }
  };

  const openDeleteModal = (resource: Recurso) => {
    setSelectedResource(resource);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteResource = async () => {
    if (selectedResource) {
      try {
        await deleteResource(selectedResource.id);
        setIsDeleteModalOpen(false);
        loadResources(selectedLocal as number);
      } catch (error) {
        setError('Error al eliminar el recurso');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-green-400 p-6">
      <nav className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin-panel" className="text-green-600 hover:text-green-800 font-semibold flex items-center">
              <FaHome className="mr-4" /> Volver al Panel de Administrador
            </Link>
            <h1 className="text-2xl font-bold text-green-800">Gestión de Recursos</h1>
          </div>
        </div>
      </nav>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <select
          value={selectedLocal}
          onChange={(e) => handleLocalChange(Number(e.target.value))}
          className="border border-green-500 text-green-700 px-3 py-2 rounded w-full max-w-xs mb-4 sm:mb-0"
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
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Agregar Recurso
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Recurso #{resource.id}</h2>
                  <p className="text-sm text-gray-600">Local ID: {resource.local_id}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${resource.tipo_recurso === 'mesa' ? 'bg-blue-100 text-blue-800' : 
                    resource.tipo_recurso === 'habitacion' ? 'bg-purple-100 text-purple-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {resource.tipo_recurso}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Capacidad: {resource.capacidad}</p>
              <p className="text-sm text-gray-600 mb-2">Estado: 
                <span className={`ml-2 px-2 inline-flex text-xs font-semibold rounded-full 
                  ${resource.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {resource.estado === 'disponible' ? 'Disponible' : 'Reservado'}
                </span>
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={() => openModal(resource)} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow flex items-center"
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
                <button 
                  onClick={() => openDeleteModal(resource)} 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow flex items-center"
                >
                  <FaTrash className="mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateEditResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveResource}
        resource={selectedResource}
      />
      
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteResource}
      />
    </div>
  );
}
