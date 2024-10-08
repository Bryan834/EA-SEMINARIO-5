import cors from 'cors';
import { Router, Request, Response } from 'express';
import {
  crearProfesor,
  listarProfesores,
  verProfesorPorNombre,
  asignarAsignaturasAProfesor,
  eliminarProfesorPorNombre,
  actualizarAsignaturasProfesorPorNombre,
} from '../services/profesorService';

const router = Router();

// Middleware para habilitar CORS
router.use(cors());

// Crear un nuevo profesor
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nombre, edad } = req.query; 
    const profesor = await crearProfesor(String(nombre), Number(edad)); 
    res.status(201).json(profesor);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});


// Listar todos los profesores
router.get('/', async (req: Request, res: Response) => {
  try {
    const profesores = await listarProfesores();
    res.status(200).json(profesores);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// Ver un profesor por nombre
router.get('/:nombre', async (req: Request, res: Response) => {
  try {
    const { nombre } = req.params;
    const profesor = await verProfesorPorNombre(nombre);
    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.status(200).json(profesor);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// Asignar asignaturas a un profesor
router.put('/:nombre/asignaturas', async (req: Request, res: Response) => {
  try {
    const { nombre } = req.params;
    const { nombresAsignaturas } = req.body;
    const profesor = await asignarAsignaturasAProfesor(nombre, nombresAsignaturas);
    res.status(200).json(profesor);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un profesor por nombre
router.delete('/:nombre', async (req: Request, res: Response) => {
  try {
    const { nombre } = req.params;
    const resultado = await eliminarProfesorPorNombre(nombre);
    if (!resultado) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    // Devuelve 204 No Content ya que el profesor fue eliminado
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// Actualizar asignaturas de un profesor por nombre
router.put('/:nombre/asignaturas/actualizar', async (req: Request, res: Response) => {
  try {
    const { nombre } = req.params;
    const { nuevasAsignaturas } = req.body;
    const profesor = await actualizarAsignaturasProfesorPorNombre(nombre, nuevasAsignaturas);
    res.status(200).json(profesor);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});


export default router;
