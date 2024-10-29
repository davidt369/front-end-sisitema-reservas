// LocalList.tsx
import React from "react";
import { Link } from "@remix-run/react";
import type Local from "../interfaces/local";

interface LocalListProps {
  locales: Local[];
}

const LocalList: React.FC<LocalListProps> = ({ locales }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Locales Disponibles</h2>
  
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {locales.map((local) => (
          <div key={local.id} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-indigo-600">{local.nombre}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${local.tipo === 'bar' ? 'bg-purple-100 text-purple-800' : local.tipo === 'restaurante' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {local.tipo}
                </span>
              </div>
              <p className="text-gray-700"><span className="font-semibold">📍</span> {local.direccion}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <Link
                to={`/${local.id}`}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
              >
                Ver Disponibilidad
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalList;
