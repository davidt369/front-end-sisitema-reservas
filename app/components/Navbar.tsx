// Navbar.tsx
import { Link, useNavigate } from "@remix-run/react";
import { FaSignOutAlt } from "react-icons/fa";

interface NavbarProps {
  showMyReservations: boolean;
  onNavigateToReservations: () => void;
  onNavigateToLocales: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  showMyReservations,
  onNavigateToReservations,
  onNavigateToLocales,
  onLogout,
}) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">ReservaApp</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateToLocales}
              className={`${!showMyReservations ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"
                } hover:bg-indigo-600 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center`}
            >
              <span className="mr-2">🏠</span>
              Inicio
            </button>
            <button
              onClick={onNavigateToReservations}
              className={`${showMyReservations ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"
                } hover:bg-indigo-600 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center`}
            >
              <span className="mr-2">📅</span>
              Mis Reservas
            </button>
            <button
              onClick={onLogout}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              <FaSignOutAlt className="mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
