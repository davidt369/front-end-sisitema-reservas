import { useState, useEffect } from 'react';
import Disponibilidad from '../interfaces/disponiblilidad';
import type Local from '../interfaces/local';
import type Recurso from '../interfaces/recurso';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (availabilities: Partial<Disponibilidad>[]) => void;
  availability?: Disponibilidad | null;
  locales: Local[];
  recursos: Recurso[];
}

export default function AvailabilityModal({ isOpen, onClose, onSave, availability, locales, recursos }: AvailabilityModalProps) {
  const [formData, setFormData] = useState<Partial<Disponibilidad>>({
    fecha: availability ? new Date(availability.fecha).toISOString().split('T')[0] : '', // Formato correcto
    hora_inicio: availability?.hora_inicio || '',
    hora_fin: availability?.hora_fin || '',
    disponible: availability?.disponible || true
  });

  const [selectedLocal, setSelectedLocal] = useState<number | null>(null);
  const [selectedRecursos, setSelectedRecursos] = useState<number[]>([]);

  useEffect(() => {
    if (availability) {
      setFormData({
        fecha: new Date(availability.fecha).toISOString().split('T')[0],
        hora_inicio: availability.hora_inicio,
        hora_fin: availability.hora_fin,
        disponible: availability.disponible
      });
      setSelectedRecursos([availability.recurso_id]);
      setSelectedLocal(recursos.find(recurso => recurso.id === availability.recurso_id)?.local_id || null);
    }
  }, [availability, recursos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Crear múltiples disponibilidades en función de los recursos seleccionados
    const newAvailabilities = selectedRecursos.map((recurso_id) => ({
      recurso_id,
      fecha: formData.fecha,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
      disponible: formData.disponible ?? true,
    }));

    onSave(newAvailabilities); // Enviar array de disponibilidades al backend
    onClose(); // Cerrar el modal
  };

  if (!isOpen) return null;

  const filteredRecursos = recursos.filter((recurso) => recurso.local_id === selectedLocal);

  const handleResourceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setSelectedRecursos(selectedOptions);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">{availability ? 'Editar Disponibilidad' : 'Agregar Disponibilidad'}</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Local</label>
            <select
              value={selectedLocal || ''}
              onChange={(e) => setSelectedLocal(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Selecciona un Local</option>
              {locales.map((local) => (
                <option key={local.id} value={local.id}>{local.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Recursos</label>
            <select
              multiple
              value={selectedRecursos.map(String)}
              onChange={handleResourceSelection}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              {filteredRecursos.map((recurso) => (
                <option key={recurso.id} value={recurso.id}>{recurso.tipo_recurso}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Puedes seleccionar múltiples recursos para hacerlos disponibles.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input 
              type="date" 
              name="fecha" 
              value={formData.fecha} 
              onChange={handleInputChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
            <input 
              type="time" 
              name="hora_inicio" 
              value={formData.hora_inicio} 
              onChange={handleInputChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora de Fin</label>
            <input 
              type="time" 
              name="hora_fin" 
              value={formData.hora_fin} 
              onChange={handleInputChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              required
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="disponible" 
              checked={formData.disponible} 
              onChange={handleInputChange} 
              className="rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Disponible</label>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
              Cancelar
            </button>
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
