import { useEffect, useState } from 'react';
import Recurso from '~/interfaces/recurso';
import Local from '~/interfaces/local';
import { getLocales } from '../Service/serviceLocal';

interface CreateEditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: Partial<Recurso>, quantity: number) => void; // Modificamos para incluir cantidad
  resource?: Recurso | null;
}

export default function CreateEditResourceModal({ isOpen, onClose, onSave, resource }: CreateEditResourceModalProps) {
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [localId, setLocalId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1); // Campo para la cantidad de recursos
  const [estado, setEstado] = useState<boolean>(true); // Campo para el estado del recurso
  const [locales, setLocales] = useState<Local[]>([]);

  // Configurar el estado inicial cuando se abre el modal para editar
  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const data = await getLocales();
        setLocales(data);
      } catch (error) {
        console.error('Error al cargar locales:', error);
      }
    };

    if (isOpen) {
      fetchLocales();
      if (resource) {
        setTipo(resource.tipo_recurso || '');
        setCapacidad(resource.capacidad || '');
        setLocalId(resource.local_id || '');
        setEstado(resource.estado === 'disponible'); // establecer el estado
        setQuantity(1); // Reiniciar a 1 en caso de edición
      } else {
        setTipo('');
        setCapacidad('');
        setLocalId('');
        setEstado(true); // Valor inicial "disponible"
        setQuantity(1); // Valor inicial de cantidad en creación
      }
    }
  }, [isOpen, resource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      { tipo_recurso: tipo, capacidad: capacidad as number, local_id: localId as number, estado: estado ? 'disponible' : 'reservado' },
      quantity // Pasar la cantidad
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{resource ? 'Editar Recurso' : 'Agregar Recurso'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1">Selecciona un Local</label>
          <select
            value={localId}
            onChange={(e) => setLocalId(Number(e.target.value))}
            className="border px-3 py-2 rounded w-full mb-4"
            required
          >
            <option value="">Seleccione un local</option>
            {locales.map((local) => (
              <option key={local.id} value={local.id}>{local.nombre}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tipo de Recurso"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-4"
            required
          />
          <input
            type="number"
            placeholder="Capacidad"
            value={capacidad}
            onChange={(e) => setCapacidad(+e.target.value)}
            className="border px-3 py-2 rounded w-full mb-4"
            required
          />
          <input
            type="number"
            placeholder="Cantidad de recursos"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
            className="border px-3 py-2 rounded w-full mb-4"
            required
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={estado}
              onChange={() => setEstado(!estado)}
              className="mr-2"
            />
            <label className="text-sm">Disponible</label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Guardar</button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
        </form>
      </div>
    </div>
  );
}
