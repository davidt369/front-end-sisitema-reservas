import { useEffect, useState } from 'react';
import type Reserva from '../interfaces/reserva';
import type Local from '../interfaces/local';
import type Recurso from '../interfaces/recurso';
import type Usuario from '../interfaces/usuario';
import { getLocales } from '../Service/serviceLocal';
import { getAllResources, updateResource } from '../Service/serviceRecurso';
import { getUsuarios } from '../Service/serviceUsuarios';

interface UseReservationLogicProps {
  isOpen: boolean;
  reservation?: Reserva | null;
}

export default function useReservationLogic({ isOpen, reservation }: UseReservationLogicProps) {
  const [formData, setFormData] = useState<Partial<Reserva>>({
    usuario_id: 0,
    local_id: 0,
    recurso_id: 0,
    fecha: '',
    hora: '',
    num_personas: 1,
    estado: 'confirmada'
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [filteredRecursos, setFilteredRecursos] = useState<Recurso[]>([]);
  const [selectedRecursoCapacidad, setSelectedRecursoCapacidad] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [localesData, recursosData, usuariosData] = await Promise.all([
            getLocales(),
            getAllResources(),
            getUsuarios(),
          ]);

          const recursosDisponibles = recursosData.filter((recurso) => recurso.estado !== 'reservado');
          setLocales(localesData);
          setRecursos(recursosDisponibles);
          setUsuarios(usuariosData);

          if (reservation) {
            const recursosDelLocal = recursosDisponibles.filter(
              (recurso) => recurso.local_id === reservation.local_id
            );
            setFilteredRecursos(recursosDelLocal);

            const recursoSeleccionado = recursosDelLocal.find(r => r.id === reservation.recurso_id);
            setSelectedRecursoCapacidad(recursoSeleccionado ? recursoSeleccionado.capacidad : 0);
          }
        } catch (error) {
          console.error('Error al cargar datos para la reserva:', error);
        }
      };

      fetchData();
      setFormData(reservation || {
        usuario_id: 0,
        local_id: 0,
        recurso_id: 0,
        fecha: '',
        hora: '',
        num_personas: 1,
        estado: 'confirmada'
      });
    }
  }, [isOpen, reservation]);

  const handleUsuarioSelect = (usuario: Usuario) => {
    setFormData(prev => ({ ...prev, usuario_id: usuario.id }));
  };

  const handleLocalSelect = (local: Local) => {
    setFormData(prev => ({ ...prev, local_id: local.id }));
    const recursosDelLocal = recursos.filter(recurso => recurso.local_id === local.id);
    setFilteredRecursos(recursosDelLocal);
    setFormData(prev => ({ ...prev, recurso_id: 0 }));
  };

  const handleRecursoSelect = (recurso: Recurso) => {
    setFormData(prev => ({ ...prev, recurso_id: recurso.id }));
    setSelectedRecursoCapacidad(recurso.capacidad);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "num_personas") {
      const numPersonas = Math.min(Number(value), selectedRecursoCapacidad);
      setFormData(prev => ({ ...prev, [name]: numPersonas }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (onSave: (reservation: Partial<Reserva>) => void, onClose: () => void) => {
    onSave(formData);

    // Cambiar el estado del recurso en función del estado de la reserva
    if (formData.recurso_id) {
      try {
        const recursoSeleccionado = recursos.find(r => r.id === formData.recurso_id);
        if (recursoSeleccionado) {
          // Si la reserva es confirmada, el recurso se actualiza a "reservado"; si es cancelada, se vuelve "disponible"
          const nuevoEstado = formData.estado === 'confirmada' ? 'reservado' : 'disponible';
          const recursoActualizado = { ...recursoSeleccionado, estado: nuevoEstado };
          await updateResource(formData.recurso_id, recursoActualizado);
          console.log(`Recurso ${formData.recurso_id} actualizado a "${nuevoEstado}"`);
        }
      } catch (error) {
        console.error('Error al actualizar el estado del recurso:', error);
      }
    }

    onClose();
  };

  const handleDelete = async (onDelete?: (id: number) => void) => {
    if (reservation && reservation.id && onDelete) {
      onDelete(reservation.id);

      if (reservation.recurso_id) {
        try {
          const recursoSeleccionado = recursos.find(r => r.id === reservation.recurso_id);
          if (recursoSeleccionado) {
            const recursoActualizado = { ...recursoSeleccionado, estado: 'disponible' };
            await updateResource(reservation.recurso_id, recursoActualizado);
            console.log(`Recurso ${reservation.recurso_id} actualizado a "disponible"`);
          }
        } catch (error) {
          console.error('Error al actualizar el estado del recurso:', error);
        }
      }
    }
  };

  return {
    formData,
    usuarios,
    locales,
    filteredRecursos,
    selectedRecursoCapacidad,
    handleUsuarioSelect,
    handleLocalSelect,
    handleRecursoSelect,
    handleInputChange,
    handleSubmit,
    handleDelete,
  };
}
