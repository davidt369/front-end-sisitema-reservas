// src/interfaces/usuario.ts
export default interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
  activo: boolean;
  fecha_creacion: string;
}
