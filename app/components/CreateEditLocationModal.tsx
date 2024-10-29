import { useState, useEffect } from 'react';
import Local from '~/interfaces/local';

interface CreateEditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (local: Local) => void;
  location?: Local | null;
}

export default function CreateEditLocationModal({
  isOpen,
  onClose,
  onSave,
  location,
}: CreateEditLocationModalProps) {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('bar');
  const [customTipo, setCustomTipo] = useState(''); // Estado para tipo personalizado

  useEffect(() => {
    if (location) {
      setNombre(location.nombre);
      setDireccion(location.direccion);
      setTelefono(location.telefono);
      setTipo(location.tipo);
      setCustomTipo(location.tipo === 'otro' ? location.tipo : ''); // Configurar customTipo si es 'otro'
    } else {
      setNombre('');
      setDireccion('');
      setTelefono('');
      setTipo('bar');
      setCustomTipo('');
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation: Local = {
      id: location?.id || Date.now(),
      nombre,
      direccion,
      telefono,
      tipo: tipo === 'otro' ? customTipo : tipo, // Asignar customTipo si tipo es 'otro'
      fecha_creacion: location?.fecha_creacion || new Date().toISOString(),
    };
    onSave(newLocation);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">{location ? 'Editar Local' : 'Agregar Local'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Tipo de Local</label>
            {tipo === 'otro' ? (
              <input
                type="text"
                placeholder="Especifica el tipo de local"
                value={customTipo}
                onChange={(e) => setCustomTipo(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            ) : (
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="bar">Bar</option>
                <option value="restaurante">Restaurante</option>
                <option value="hotel">Hotel</option>
                <option value="otro">Otro</option>
              </select>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {location ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
