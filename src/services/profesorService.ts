import Profesor from '../models/profesor';
import Asignatura from '../models/asignatura';

// Crear un nuevo profesor
export const crearProfesor = async (nombre: string, edad: number) => {
  const profesor = new Profesor({ nombre, edad });
  return await profesor.save();
};

// Listar todos los profesores
export const listarProfesores = async () => {
  return await Profesor.find().populate('asignaturasImparte');
};

// Ver un profesor por nombre
export const verProfesorPorNombre = async (nombre: string) => {
  return await Profesor.findOne({ nombre }).populate('asignaturasImparte');
};

// Asignar asignaturas a un profesor
export const asignarAsignaturasAProfesor = async (nombreProfesor: string, nombresAsignaturas: string[]) => {
  const profesor = await Profesor.findOne({ nombre: nombreProfesor });

  if (!profesor) {
    throw new Error('Profesor no encontrado');
  }

  console.log(`Profesor encontrado: ${JSON.stringify(profesor)}`);

  const asignaturas = await Asignatura.find({ nombre: { $in: nombresAsignaturas } });

  console.log(`Asignaturas encontradas: ${JSON.stringify(asignaturas)}`);

  if (asignaturas.length === 0) {
    throw new Error('Asignaturas no encontradas');
  }

  asignaturas.forEach(asignatura => {
    // Asegurarse de que solo se añade si no está ya en el array
    if (!profesor.asignaturasImparte.includes(asignatura._id)) {
      profesor.asignaturasImparte.push(asignatura._id);
    }
  });

  await profesor.save();
  console.log(`Profesor actualizado: ${JSON.stringify(profesor)}`);
  return profesor;
};

// Actualizar asignaturas de un profesor por nombre
export const actualizarAsignaturasProfesorPorNombre = async (nombreProfesor: string, nuevasAsignaturas: string[]) => {
  const profesor = await Profesor.findOne({ nombre: nombreProfesor });

  if (!profesor) {
    throw new Error('Profesor no encontrado');
  }

  const asignaturas = await Asignatura.find({ nombre: { $in: nuevasAsignaturas } });

  if (asignaturas.length === 0) {
    throw new Error('Asignaturas no encontradas');
  }

  await Profesor.findByIdAndUpdate(profesor._id, {
    asignaturasImparte: asignaturas.map(asignatura => asignatura._id)
  });

  console.log(`Asignaturas actualizadas para ${nombreProfesor}`);
};

// Eliminar un profesor por nombre
export const eliminarProfesorPorNombre = async (nombre: string) => {
  const resultado = await Profesor.findOneAndDelete({ nombre });
  return resultado;
};



