

// src/apiService.ts
import axios from 'axios';
import Usuario from '~/interfaces/usuario';

export const BASE_URL = 'https://m6v9xvx7-3000.brs.devtunnels.ms/servicio-usuarios';

export async function fetchUsers(): Promise<Usuario[]> {
  try {
    const response = await axios.get<Usuario[]>(`${BASE_URL}/usuarios`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener usuarios');
  }
}

// Crear un nuevo usuario
export async function createUser(userData: Omit<Usuario, 'id' | 'rol' | 'activo' | 'fecha_creacion'>): Promise<Usuario> {
  try {
    const response = await axios.post<Usuario>(`${BASE_URL}/usuarios`, {
      ...userData,
      rol: "cliente", // Valor predeterminado
      activo: true,   // Valor predeterminado
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear usuario');
  }
}

export async function updateUser(userData: Usuario): Promise<Usuario> {
  try {
    const response = await axios.patch<Usuario>(`${BASE_URL}/usuarios/${userData.id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar usuario');
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/usuarios/${id}`);
  } catch (error) {
    throw new Error('Error al eliminar usuario');
  }
} 

//getUsuarios
export const getUsuarios = async () => {
    const response = await axios.get(`${BASE_URL}/usuarios`);
    return response.data;
    
}
