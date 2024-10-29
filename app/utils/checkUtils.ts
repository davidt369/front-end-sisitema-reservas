import { parseCookies } from "nookies";
import Usuario from "../interfaces/usuario";

export function checkAuth(request: Request, requiredRole: "administrador" | "cliente" | null): Usuario | null {
  const cookies = parseCookies({ req: request });
  const usuarioData = cookies["usuario"];

  if (!usuarioData) return null;

  const usuario: Usuario = JSON.parse(usuarioData);

  // Si no se requiere un rol específico, solo verificar autenticación
  if (requiredRole === null) {
    return usuario;
  }

  // Verificar si el rol coincide con el requerido
  return usuario.rol === requiredRole ? usuario : null;
}