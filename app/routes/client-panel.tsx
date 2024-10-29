import { useEffect, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { getLocales } from "../Service/serviceLocal";
import type Local from "../interfaces/local";
import LocalList from "../components/LocalList";
import ReservationList from "../components/ReservationList";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import Usuario from "../interfaces/usuario";

export default function Reservations() {
  const [locales, setLocales] = useState<Local[]>([]);
  const [activeComponent, setActiveComponent] = useState("localList");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado y tiene rol de cliente
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const usuario = JSON.parse(storedUser) as Usuario;
      if (usuario.rol === "cliente") {
        setUser(usuario); // Guardar el usuario en el estado si es cliente
      } else {
        navigate("/"); // Redirige al login si el rol no es "cliente"
      }
    } else {
      navigate("/"); // Redirige al login si no hay datos en localStorage
    }
  }, [navigate]);

  // Cargar locales al montar el componente
  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const localesData = await getLocales();
        setLocales(localesData);
      } catch (error) {
        console.error("Error al obtener locales:", error);
      }
    };
    fetchLocales();
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Eliminar datos del usuario
    navigate("/"); // Redirigir a la página de login
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-indigo-600">ReservaApp</span>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-indigo-600 focus:outline-none"
                aria-label="Abrir menú"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
            <div className={`hidden md:flex items-center space-x-4`}>
              <button
                onClick={() => setActiveComponent("localList")}
                className={`flex items-center justify-center px-4 py-2 rounded-full font-bold transition duration-300 ease-in-out transform ${
                  activeComponent === "localList" ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-label="Ver locales disponibles"
              >
                <span className="mr-2">🏠</span>
                Locales
              </button>
              <button
                onClick={() => setActiveComponent("reservationList")}
                className={`flex items-center justify-center px-4 py-2 rounded-full font-bold transition duration-300 ease-in-out transform ${
                  activeComponent === "reservationList" ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-label="Ver mis reservas"
              >
                <span className="mr-2">📅</span>
                Reservas
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                <FaSignOutAlt className="mr-2" /> {/* Icono de Cerrar Sesión */}
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
        {/* Menú hamburguesa en pantallas móviles */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
            <div className="flex flex-col items-center space-y-2 py-4">
              <button
                onClick={() => {
                  setActiveComponent("localList");
                  setIsMenuOpen(false); // Cerrar el menú al seleccionar
                }}
                className={`flex items-center justify-center w-full px-4 py-2 font-bold transition duration-300 ease-in-out ${
                  activeComponent === "localList" ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-label="Ver locales disponibles"
              >
                <span className="mr-2">🏠</span>
                Locales
              </button>
              <button
                onClick={() => {
                  setActiveComponent("reservationList");
                  setIsMenuOpen(false); // Cerrar el menú al seleccionar
                }}
                className={`flex items-center justify-center w-full px-4 py-2 font-bold transition duration-300 ease-in-out ${
                  activeComponent === "reservationList" ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-label="Ver mis reservas"
              >
                <span className="mr-2">📅</span>
                Reservas
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false); // Cerrar el menú al hacer logout
                }}
                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 shadow-md transition duration-300 transform hover:scale-105"
              >
                <FaSignOutAlt className="mr-2" /> {/* Icono de Cerrar Sesión */}
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {activeComponent === "localList" && <LocalList locales={locales} />}
        {activeComponent === "reservationList" && <ReservationList />}
      </main>
    </div>
  );
}
