import axios from 'axios';
import Local from '~/interfaces/local';

export const BASE_URL_LOCAL = 'https://m6v9xvx7-3000.brs.devtunnels.ms/servicio/locales';

export const getLocales = async (): Promise<Local[]> => {
  try {
    const response = await axios.get<Local[]>(BASE_URL_LOCAL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener locales:', error);
    throw error;
  }
};

export const createLocal = async (data: Local): Promise<Local> => {
  try {
    const response = await axios.post<Local>(BASE_URL_LOCAL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear local:', error);
    throw error;
  }
};

export const updateLocal = async (id: number, data: Partial<Local>): Promise<Local> => {
  try {
    const response = await axios.put<Local>(`${BASE_URL_LOCAL}?id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar local:', error);
    throw error;
  }
};

export const deleteLocal = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL_LOCAL}?id=${id}`);
  } catch (error) {
    console.error('Error al eliminar local:', error);
    throw error;
  }
};
