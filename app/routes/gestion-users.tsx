// src/routes/UserManagement.tsx
import { useEffect, useState } from 'react';
import { Link } from "@remix-run/react";
import { fetchUsers, createUser, updateUser, deleteUser } from '../Service/serviceUsuarios';
import Usuario from '../interfaces/usuario';
import CreateEditUserModal from '../components/CreateEditUserModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { FaUserPlus, FaEdit, FaTrash, FaUser, FaArrowLeft } from 'react-icons/fa'; // Importación de iconos

export default function UserManagement() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deletingUser, setDeletingUser] = useState<Usuario | null>(null);

  // Cargar usuarios desde la API al montar el componente
  const loadUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      setError('Error al obtener usuarios');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Función para abrir el modal de edición o creación
  const openModal = (user?: Usuario) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal de edición
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Función para abrir el modal de confirmación de eliminación
  const openDeleteModal = (user: Usuario) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // Función para cerrar el modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  // Función para guardar un usuario (crear o actualizar)
  const saveUser = async (userData: Usuario) => {
    try {
      if (editingUser) {
        await updateUser(userData);
      } else {
        await createUser(userData);
      }
      await loadUsers(); // Recargar la lista de usuarios desde la API
      closeModal();
    } catch (error) {
      setError('Error al guardar el usuario');
    }
  };

  // Función para eliminar un usuario
  const confirmDeleteUser = async () => {
    if (deletingUser) {
      try {
        await deleteUser(deletingUser.id);
        await loadUsers(); // Recargar la lista de usuarios después de eliminar
        closeDeleteModal();
      } catch (error) {
        setError('Error al eliminar el usuario');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <nav className="bg-white shadow-lg rounded-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <Link to="/admin-panel" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
              <FaArrowLeft className="mr-6" /> {/* Icono de flecha hacia la izquierda */}
              Panel de Administrador
          </Link>

            <h1 className="text-2xl font-bold text-blue-800">Gestión de Usuarios</h1>
          </div>
        </div>
      </nav>

      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={() => openModal()} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
        >
          <FaUserPlus className="mr-2" /> {/* Icono de agregar usuario */}
          Agregar Usuario
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <FaUser className="text-blue-800 text-2xl lg:text-4xl mr-2" /> {/* Icono de usuario con tamaño responsivo */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{user.nombre}</h2>
                      <p className="text-sm text-gray-600">{user.correo}</p>
                    </div>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.rol === 'administrador' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.rol}
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={() => openModal(user)} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow flex items-center"
                >
                  <FaEdit className="mr-2" /> {/* Icono de editar */}
                  Editar
                </button>
                <button 
                  onClick={() => openDeleteModal(user)} 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow flex items-center"
                >
                  <FaTrash className="mr-2" /> {/* Icono de eliminar */}
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modales fuera del `map` */}
      <CreateEditUserModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveUser}
        user={editingUser}
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteUser}
        userName={deletingUser?.nombre}
      />
    </div>
  );
}
