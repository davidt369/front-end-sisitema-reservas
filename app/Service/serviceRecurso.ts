import axios from 'axios';
import Recurso from '~/interfaces/recurso';

export const BASE_URL_RECURSO = 'https://m6v9xvx7-3000.brs.devtunnels.ms/servicio/recursos';

export const getResourcesByLocal = async (localId: number): Promise<Recurso[]> => {
  try {
    const response = await axios.get<Recurso[]>(`${BASE_URL_RECURSO}?local_id=${localId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    throw error;
  }
};

export const createResource = async (data: Recurso): Promise<Recurso> => {
  try {
    const response = await axios.post<Recurso>(BASE_URL_RECURSO, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear recurso:', error);
    throw error;
  }
};

export const updateResource = async (id: number, data: Partial<Recurso>): Promise<Recurso> => {
  try {
    const response = await axios.put<Recurso>(`${BASE_URL_RECURSO}?id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar recurso:', error);
    throw error;
  }
};

export const deleteResource = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL_RECURSO}?id=${id}`);
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    throw error;
  }
};

//obtener todos los recursos
export const getAllResources = async (): Promise<Recurso[]> => {
  try {
    const response = await axios.get<Recurso[]>(BASE_URL_RECURSO);
    return response.data;
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    throw error;
  }
};

//getResourceById
export const getResourceById = async (id: number): Promise<Recurso> => {
  try {
    const response = await axios.get<Recurso>(`${BASE_URL_RECURSO}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener recurso:', error);
    throw error;
  }
};
