// serviceDisponibilidad.ts
import axios from 'axios';
import Disponibilidad from '../interfaces/disponiblilidad';

const BASE_URL = 'https://m6v9xvx7-3000.brs.devtunnels.ms/servicio/disponibilidad';

// Obtener todas las disponibilidades
export const fetchAvailabilities = async (): Promise<Disponibilidad[]> => {
  try {
    const response = await axios.get<Disponibilidad[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las disponibilidades:', error);
    throw error;
  }
};

// Crear nueva disponibilidad
export const createAvailability = async (availability: Partial<Disponibilidad>): Promise<Disponibilidad> => {
  try {
    const response = await axios.post<Disponibilidad>(BASE_URL, availability);
    return response.data;
  } catch (error) {
    console.error('Error al crear disponibilidad:', error);
    throw error;
  }
};

// Actualizar disponibilidad
export const updateAvailability = async (id: number, updates: Partial<Disponibilidad>): Promise<void> => {
  try {
    await axios.patch(`${BASE_URL}/${id}`, updates);
  } catch (error) {
    console.error('Error al actualizar disponibilidad:', error);
    throw error;
  }
};

// Eliminar disponibilidad
export const deleteAvailability = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error al eliminar disponibilidad:', error);
    throw error;
  }
};
