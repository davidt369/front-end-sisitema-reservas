// serviceReservas.js
import axios from 'axios';
import Reserva from '../interfaces/reserva';
const BASE_URL = 'https://m6v9xvx7-3000.brs.devtunnels.ms/servicio';

export const getReservas = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/reservas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        throw error;
    }
};


export const createReserva = async (data: Reserva) => {
    try {
        const response = await axios.post(`${BASE_URL}/reservas`, data);
        return response.data;
    } catch (error) {
        console.error('Error al crear reserva:', error);
        throw error;
    }
};

export const updateReserva = async (id: number, data: Partial<Reserva>) => {
    try {
        const response = await axios.patch(`${BASE_URL}/reservas/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        throw error;
    }
};

export const deleteReserva = async (id: number) => {
    try {
        await axios.delete(`${BASE_URL}/reservas/${id}`);
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        throw error;
    }
};

export const getReservationsByUserId = async (userId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/reservas/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas por usuario:', error);
        throw error;
    }
};
