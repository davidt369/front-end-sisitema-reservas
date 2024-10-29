// Reserva.ts
export default interface Reserva {
    id?: number;
    usuario_id: number;
    local_id: number;
    recurso_id: number;
    fecha: string;
    hora: string;
    num_personas: number;
    estado: string;
}
