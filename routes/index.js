const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const proyectoController = require('../cotrollers/proyectoController');
const tareaController = require('../cotrollers/tareaController');
const usuarioController = require('../cotrollers/usuarioController');
const authController = require('../cotrollers/authController');

module.exports = function() {
    router.get('/', authController.estaAutenticado, proyectoController.inicio);
    router.get('/nuevo-proyecto', authController.estaAutenticado, proyectoController.creaProyecto);
    router.post('/nuevo-proyecto',
        authController.estaAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.nuevoProyecto
    );
    router.get('/proyecto/:url', authController.estaAutenticado, proyectoController.abreProyecto);
    router.delete('/proyecto/:url', authController.estaAutenticado, proyectoController.borraProyecto);
    router.get('/proyecto/editar/:id', authController.estaAutenticado, proyectoController.editaProyecto);
    router.post('/nuevo-proyecto/:id',
        authController.estaAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.actualizaProyecto
    );
    router.post('/proyecto/:url', authController.estaAutenticado, tareaController.creaTarea);
    router.patch('/tarea/:id', authController.estaAutenticado, tareaController.cambiaEstadoTarea);
    router.delete('/tarea/:id', authController.estaAutenticado, tareaController.borraTarea);
    router.get('/crear-cuenta', usuarioController.creaCuenta);
    router.post('/crear-cuenta', usuarioController.nuevaCuenta);
    router.get('/confirmar/:correo', usuarioController.confirmarCuenta);
    router.get('/iniciar-sesion', usuarioController.iniciaSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    router.get('/cerrar-sesion', authController.cerrarSesion);
    router.get('/reestablecer', usuarioController.reestableceContrasena);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validaToken);
    router.post('/reestablecer/:token', authController.reseteaContrasena);

    return router;
}