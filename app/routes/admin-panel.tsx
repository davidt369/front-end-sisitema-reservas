import { useNavigate, Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import Usuario from "../interfaces/usuario";
import { FaSignOutAlt } from "react-icons/fa"; // Importar icono de Font Awesome

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Usuario | null>(null);

  // Verificar si el usuario está autenticado y es admin al cargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setUser(usuario); // Guardar el usuario en el estado
      if (usuario.rol !== "administrador") {
        navigate("/"); // Redirige a la página de inicio si el rol no es "administrador"
      }
    } else {
      navigate("/"); // Redirige si no hay datos en localStorage
    }
  }, [navigate]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Eliminar datos del usuario de localStorage
    navigate("/"); // Redirigir a la página de inicio
  };

  return (
<div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex flex-col items-center">
      <header className="bg-white shadow-lg w-full">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          {/* Título */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 text-center sm:text-left">
            Panel de Administrador
          </h1>

          {/* Información de Usuario y Botón de Cerrar Sesión */}
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            {user && (
              <div className="text-gray-700 text-center sm:text-right">
                <p className="font-semibold text-gray-800">
                  Bienvenido, <span className="font-bold">{user.nombre}</span>
                </p>
                <p className="text-sm text-gray-500">{user.correo}</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              <FaSignOutAlt className="mr-2" /> {/* Icono de Cerrar Sesión */}
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main className="w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <section className="px-4 py-6 sm:px-0">
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/gestion-users"
              className="block w-56 sm:w-64 h-64 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="text-5xl flex justify-center mb-4">👥</div>
              <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-blue-800">
                Gestión de Usuarios
              </h2>
              <p className="text-center font-normal text-gray-700">
                Ver y administrar usuarios del sistema.
              </p>
            </Link>
            <Link
              to="/gestion-locals"
              className="block w-56 sm:w-64 h-64 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="text-5xl flex justify-center mb-4">🏢</div>
              <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-blue-800">
                Gestión de Locales
              </h2>
              <p className="text-center font-normal text-gray-700">
                Administrar locales y sus detalles.
              </p>
            </Link>
            <Link
              to="/gestion-recursos"
              className="block w-56 sm:w-64 h-64 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="text-5xl flex justify-center mb-4">🛠️</div>
              <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-blue-800">
                Gestión de Recursos
              </h2>
              <p className="text-center font-normal text-gray-700">
                Administrar recursos disponibles en los locales.
              </p>
            </Link>
            <Link
              to="/gestion-reserva"
              className="block w-56 sm:w-64 h-64 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="text-5xl flex justify-center mb-4">📅</div>
              <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-blue-800">
                Gestión de Reservas
              </h2>
              <p className="text-center font-normal text-gray-700">
                Ver y administrar las reservas realizadas.
              </p>
            </Link>
            <Link
              to="/gestion-disponibilidad"
              className="block w-56 sm:w-64 h-64 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="text-5xl flex justify-center mb-4">🕒</div>
              <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-blue-800">
                Gestión de Disponibilidad
              </h2>
              <p className="text-center font-normal text-gray-700">
                Administrar la disponibilidad de recursos.
              </p>
            </Link>
            <Link
              to="/admin/reports"
              className="block w-56 sm:w-64 h-64 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="text-5xl flex justify-center mb-4">📊</div>
              <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-blue-800">
                Reportes
              </h2>
              <p className="text-center font-normal text-gray-700">
                Generar y exportar reportes del sistema.
              </p>
            </Link>
            <Link
              to="/admin/notifications"
              className="block w-56 sm:w-64 h-64 p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="text-5xl flex justify-center mb-4">🔔</div>
              <h2 className="text-center mb-2 text-2xl font-bold tracking-tight text-blue-800">
                Gestión de Notificaciones
              </h2>
              <p className="text-center font-normal text-gray-700">
                Administrar notificaciones del sistema.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
