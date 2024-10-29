// src/components/CreateEditUserModal.tsx
import { useState, useEffect } from 'react';
import Usuario from '../interfaces/usuario';

interface CreateEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Usuario) => void;
  user?: Usuario | null;
}

export default function CreateEditUserModal({ isOpen, onClose, onSave, user }: CreateEditUserModalProps) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('cliente');
  const [activo, setActivo] = useState(false);

  // Limpiar y actualizar el estado del formulario al abrir el modal
  useEffect(() => {
    if (user) {
      // Si hay un usuario para editar, cargar sus datos
      setNombre(user.nombre);
      setCorreo(user.correo);
      setRol(user.rol);
      setActivo(user.activo);
    } else {
      // Si no hay usuario, limpiar los campos (para creación)
      setNombre('');
      setCorreo('');
      setContrasena('');
      setRol('cliente');
      setActivo(false);
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: Usuario = {
      id: user?.id || 0,
      nombre,
      correo,
      contrasena,
      rol,
      activo,
      fecha_creacion: user?.fecha_creacion || new Date().toISOString(),
    };
    onSave(newUser);
    onClose(); // Cierra el modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{user ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type="text"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Correo</label>
            <input
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              type="email"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              type="password"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="cliente">Cliente</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              type="checkbox"
              className="mr-2"
            />
            <label className="text-sm font-medium">Activo</label>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
