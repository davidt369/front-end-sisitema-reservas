import axios from 'axios';
import Usuario from '../interfaces/usuario';
import { BASE_URL } from './serviceUsuarios';
import { setCookie } from "nookies"; // Librería para manejar cookies

export async function loginUser(correo: string, contrasena: string): Promise<Usuario | null> {
    try {
      const response = await axios.post<Usuario>(`${BASE_URL}/login`, {
        correo,
        contrasena,
      });
  
      const usuario = response.data;
  
      if (usuario) {
        console.log("Usuario autenticado:", usuario); // Verifica el rol y datos
        setCookie(null, "usuario", JSON.stringify(usuario), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
      }
  
      return usuario;
    } catch (error) {
      console.error('Error al iniciar sesión:', error); // Ayuda a identificar errores
      return null;
    }
  }
  