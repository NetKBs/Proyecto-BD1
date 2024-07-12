const express = require ('express')
const router = express.Router()
const coordinadorControllers = require('../controllers/coordinadorControllers')
const representanteControllers = require('../controllers/representanteControllers')
const estudianteControllers = require('../controllers/estudianteControllers')
const periodoControllers = require('../controllers/periodoControllers')

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

// Ruta para coordinador por ID
//router.get('/:id', coordinadorControllers.coordinador);

// Ruta para listar docentes de la institución
/*router.get('/docentes', coordinadorControllers.docentes);

// Rutas para crear y editar docentes
router.get('/docente/crear', coordinadorControllers.crearDocente);
router.post('/docente/crear', coordinadorControllers.crearDocente);
router.get('/docente/editar/:id', coordinadorControllers.editarDocente);
router.put('/docente/editar/:id', coordinadorControllers.editarDocente);

// Rutas para eliminar docentes
router.get('/docente/eliminar/:id', coordinadorControllers.eliminarDocente);
router.delete('/docente/eliminar/:id', coordinadorControllers.eliminarDocente);*/


module.exports = router