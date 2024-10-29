// src/controller/controllerUsuarios.ts
import { createUser } from '../Service/serviceUsuarios';
import Usuario from '../interfaces/usuario';

interface UserData {
  nombre: string;
  correo: string;
  contrasena: string;
}

export async function registrarUsuario(userData: UserData): Promise<Usuario> {
  try {
    const user = await createUser({
      nombre: userData.nombre,
      correo: userData.correo,
      contrasena: userData.contrasena,
    
    });
    return user;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
}
