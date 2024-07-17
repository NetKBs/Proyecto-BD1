const express = require ('express')
const router = express.Router()
const coordinadorControllers = require('../controllers/coordinadorControllers')
const representanteControllers = require('../controllers/representanteControllers')
const estudianteControllers = require('../controllers/estudianteControllers')
const periodoControllers = require('../controllers/periodoControllers')
const docenteControllers = require('../controllers/docenteControllers')
const asignaturaControllers = require('../controllers/asignaturaControllers')
const inscripcionControllers = require('../controllers/inscripcionControllers')
const cargaAcademicaControllers = require('../controllers/cargaAcademicaControllers')
const calificacionesControllers = require('../controllers/calificacionesControllers')

router.get('/', coordinadorControllers.coordinador);

// Rutas para manejar representantes
router.get('/representante', representanteControllers.representante);
router.get('/representante/crear', representanteControllers.crearRepresentanteView);
router.post('/representante/crear', representanteControllers.crearRepresentante);
router.get('/representante/buscar', representanteControllers.representanteByCedula);
router.get('/representante/editar/:id', representanteControllers.editarRepresentanteView);
router.post('/representante/editar/:id', representanteControllers.editarRepresentante);
router.post('/representante/eliminar/:id', representanteControllers.eliminarRepresentante);
// representados
router.post('/representante/:id/representado/crear', representanteControllers.crearRepresentado);
router.post('/representante/:representante_id/representado/:representado_id/eliminar', representanteControllers.eliminarRepresentado);

// Rutas para manejar estudiantes
router.get('/estudiante', estudianteControllers.estudiante);
router.get('/estudiante/crear', estudianteControllers.crearEstudianteView);
router.post('/estudiante/crear', estudianteControllers.crearEstudiante);
router.get('/estudiante/buscar', estudianteControllers.estudianteByCedula);
router.get('/estudiante/editar/:id', estudianteControllers.editarEstudianteView);
router.post('/estudiante/editar/:id', estudianteControllers.editarEstudiante);

// Rutas para manejar periodos
router.get('/periodo', periodoControllers.periodo);
router.get('/periodo/crear', periodoControllers.crearPeriodoView);
router.post('/periodo/crear', periodoControllers.crearPeriodo);
router.get('/periodo/editar/:id', periodoControllers.editarPeriodoView);
router.post('/periodo/editar/:id', periodoControllers.editarPeriodo);

// Rutas para manejar docentes
router.get('/docente', docenteControllers.docente);
router.get('/docente/crear', docenteControllers.crearDocenteView);
router.post('/docente/crear', docenteControllers.crearDocente);
router.get('/docente/buscar', docenteControllers.docenteByCedula);
router.get('/docente/editar/:id', docenteControllers.editarDocenteView);
router.post('/docente/editar/:id', docenteControllers.editarDocente);

// Rutas para manejar asignaturas
router.get('/asignatura', asignaturaControllers.asignatura);
router.post('/asignatura/crear', asignaturaControllers.crearAsignatura);
router.get('/asignatura/editar/:id', asignaturaControllers.editarAsignaturaView);
router.post('/asignatura/editar/:id', asignaturaControllers.editarAsignatura);

// Rutas para manejar Inscripcion
router.get('/inscripcion', inscripcionControllers.inscripcion);
router.post('/inscripcion', inscripcionControllers.inscripcionCrear);

// Rutas para manejar carga academica
router.get('/carga-academica', cargaAcademicaControllers.cargaAcademica);
router.get('/carga-academica/crear', cargaAcademicaControllers.crearCargaAcademicaView);
router.post('/carga-academica/crear', cargaAcademicaControllers.crearCargaAcademica);
router.get('/carga-academica/buscar', cargaAcademicaControllers.buscarCargaAcademica);
router.get('/carga-academica/editar/:id', cargaAcademicaControllers.editarCargaAcademicaView);
router.post('/carga-academica/editar/:id', cargaAcademicaControllers.editarCargaAcademica);

// Rutas para manejar calificaciones
router.get('/calificaciones', calificacionesControllers.calificaciones);
router.get('/calificaciones/boletin', calificacionesControllers.boletin);


module.exports = router