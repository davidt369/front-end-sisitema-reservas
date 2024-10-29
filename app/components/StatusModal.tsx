interface StatusModalProps {
    newStatus: string;
    setNewStatus: (status: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
  }
  
  export default function StatusModal({
    newStatus,
    setNewStatus,
    onCancel,
    onConfirm,
  }: StatusModalProps) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Modificar Estado de la Reserva</h2>
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
            Estado:
          </label>
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
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-full hover:bg-indigo-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }
  