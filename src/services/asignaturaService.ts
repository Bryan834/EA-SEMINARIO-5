import Asignatura from '../models/asignatura';
import Profesor from '../models/profesor';

// Crear una nueva asignatura
export const crearAsignatura = async (nombre: string, descripcion: string) => {
  const asignatura = new Asignatura({ nombre, descripcion });
  return await asignatura.save();
};

// Listar todas las asignaturas
export const listarAsignaturas = async () => {
  return await Asignatura.find().populate('profesores');
};

// Ver una asignatura por nombre
export const verAsignaturaPorNombre = async (nombre: string) => {
  return await Asignatura.findOne({ nombre }).populate('profesores');
};

// Asignar profesores a una asignatura
export const asignarProfesoresAAsignatura = async (nombreAsignatura: string, nombresProfesores: string[]) => {
  const asignatura = await Asignatura.findOne({ nombre: nombreAsignatura });

  if (!asignatura) {
    throw new Error('Asignatura no encontrada');
  }

  const profesores = await Profesor.find({ nombre: { $in: nombresProfesores } });

  if (profesores.length === 0) {
    throw new Error('Profesores no encontrados');
  }

  profesores.forEach(profesor => asignatura.profesores.push(profesor._id));
  await asignatura.save();
  return asignatura;
};

// Eliminar una asignatura por nombre
export const eliminarAsignaturaPorNombre = async (nombre: string) => {
  const resultado = await Asignatura.findOneAndDelete({ nombre });
  return resultado;
};

// Actualizar profesores de una asignatura por nombre
export const actualizarProfesoresAsignaturaPorNombre = async (nombreAsignatura: string, nuevosProfesores: string[]) => {
  const asignatura = await Asignatura.findOne({ nombre: nombreAsignatura });

  if (!asignatura) {
    throw new Error('Asignatura no encontrada');
  }

  const profesores = await Profesor.find({ nombre: { $in: nuevosProfesores } });

  if (profesores.length === 0) {
    throw new Error('Profesores no encontrados');
  }

  asignatura.profesores = profesores.map(profesor => profesor._id);
  await asignatura.save();
  return asignatura;
};
