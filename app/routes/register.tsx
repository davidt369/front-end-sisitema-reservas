import { useState, useEffect } from 'react';
import { Link, useNavigate } from "@remix-run/react";
import { registrarUsuario } from '../controller/controllerUsuarios';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      // Redirigir según el rol del usuario
      navigate(usuario.rol === "admin" ? "/admin-panel" : "/client-panel");
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const newUser = await registrarUsuario({ nombre, correo, contrasena });
      console.log('Usuario registrado:', newUser);
      
      // Mostrar mensaje de éxito
      setSuccess('Usuario registrado con éxito');
      
      // Limpiar campos
      setNombre('');
      setCorreo('');
      setContrasena('');
      
      // Redirigir al inicio de sesión después de un breve tiempo
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-lg transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Registrarse
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Juan Perez"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="email">
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="juan.perez@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="password123"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <div className="flex items-center justify-between mt-6">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              type="submit"
            >
              Registrarse
            </button>
          </div>
          <div className="text-center mt-4">
            <Link
              to="/"
              className="inline-block font-semibold text-sm text-blue-600 hover:text-blue-800 transition duration-300"
            >
              Volver al Inicio de Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
