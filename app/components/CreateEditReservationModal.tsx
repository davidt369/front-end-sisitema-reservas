import { useEffect, useState } from 'react';
import type Reserva from '../interfaces/reserva';
import SearchableSelect from './SearchableSelect';
import useReservationLogic from '../hooks/useReservationLogic';

interface CreateEditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservation: Partial<Reserva>) => void;
  onDelete?: (id: number) => void;
  reservation?: Reserva | null;
}

export default function CreateEditReservationModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  reservation 
}: CreateEditReservationModalProps) {
  const {
    formData,
    usuarios,
    locales,
    filteredRecursos,
    selectedRecursoCapacidad,
    handleUsuarioSelect,
    handleLocalSelect,
    handleRecursoSelect,
    handleInputChange,
    handleSubmit,
    handleDelete,
  } = useReservationLogic({ isOpen, reservation });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">{reservation ? 'Editar Reserva' : 'Crear Reserva'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSave, onClose); }} className="space-y-4">
          
          {/* Usuario Selection with SearchableSelect */}
          <SearchableSelect
            label="Usuario"
            placeholder="Seleccione un usuario"
            options={usuarios}
            valueKey="id"
            displayKey="nombre"
            selectedValue={usuarios.find(u => u.id === formData.usuario_id) || null}
            isEditing={!!reservation}
            onSelect={handleUsuarioSelect}
          />

          {/* Local Selection with SearchableSelect */}
          <SearchableSelect
            label="Local"
            placeholder="Seleccione un local"
            options={locales}
            valueKey="id"
            displayKey="nombre"
            selectedValue={locales.find(l => l.id === formData.local_id) || null}
            isEditing={!!reservation}
            onSelect={handleLocalSelect}
          />

          {/* Recurso Selection with SearchableSelect */}
          <SearchableSelect
            label="Recurso"
            placeholder="Seleccione un recurso"
            options={filteredRecursos}
            valueKey="id"
            displayKey="tipo_recurso"
            selectedValue={filteredRecursos.find(r => r.id === formData.recurso_id) || null}
            isEditing={!!reservation}
            onSelect={handleRecursoSelect}
          />

          {/* Otros Campos */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
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
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700">Hora</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="num_personas" className="block text-sm font-medium text-gray-700">Número de Personas</label>
            <input
              type="number"
              name="num_personas"
              value={formData.num_personas}
              onChange={handleInputChange}
              max={selectedRecursoCapacidad}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
              Cancelar
            </button>
            {reservation && onDelete && (
              <button type="button" onClick={() => handleDelete(onDelete)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Eliminar
              </button>
            )}
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {reservation ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
