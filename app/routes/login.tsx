import { useState, useEffect } from "react";
import { useNavigate, Link } from "@remix-run/react";
import { loginUser } from "../Service/serviceAuth";
import type { LoaderFunction } from "@remix-run/node";
import Usuario from "~/interfaces/usuario";

export const loader: LoaderFunction = async () => {
  return null;
};



export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado al cargar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const usuario = JSON.parse(storedUser) as Usuario;
      if (usuario && usuario.rol) {
        navigate(usuario.rol === "administrador" ? "/admin-panel" : "/client-panel");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const usuario = await loginUser(correo, contrasena);

      // Validar que el usuario tenga las propiedades requeridas
      if (usuario && typeof usuario === "object" && "rol" in usuario && "id" in usuario && "nombre" in usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        navigate(usuario.rol === "administrador" ? "/admin-panel" : "/client-panel");
      } else {
        setError("Credenciales incorrectas. Intente nuevamente.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      setError("Error al iniciar sesión. Intente nuevamente.");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="username">
              Correo
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg text-gray-800 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Ingrese su correo"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg text-gray-800 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="********"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm animate-pulse transition-opacity duration-300">
              {error}
            </p>
          )}
          <div className="flex flex-col items-center space-y-4 mt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50" type="submit">
              Iniciar Sesión
            </button>
            <div className="text-sm text-gray-600">
              ¿No tiene una cuenta aún?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition duration-300">
                Regístrese
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
