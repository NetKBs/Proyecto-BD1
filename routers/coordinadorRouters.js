const express = require ('express')
const router = express.Router()
const coordinadorControllers = require('../controllers/coordinadorControllers')

router.get('/', coordinadorControllers.coordinador);

// Rutas para manejar representantes
router.get('/representante', coordinadorControllers.representante);
router.get('/representante/crear', coordinadorControllers.crearRepresentanteView);
router.post('/representante/crear', coordinadorControllers.crearRepresentante);
router.get('/representante/buscar', coordinadorControllers.representanteByCedula);
router.get('/representante/editar/:id', coordinadorControllers.editarRepresentanteView);
router.post('/representante/editar/:id', coordinadorControllers.editarRepresentante);



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