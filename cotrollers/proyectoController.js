const Proyecto = require('../models/Proyectos');
const Tarea = require('../models/Tareas');

exports.inicio = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyecto.findAll({
        where: { usuarioId }
    });
    res.render('index', { 
        nombrePagina: 'Inicio',
        proyectos
    });
}

exports.creaProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = Proyecto.findAll({
        where: { usuarioId }
    });
    res.render('nuevoProyecto', { nombrePagina: 'Nuevo proyecto', proyectos });
}

exports.editaProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosP = Proyecto.findAll({
        where: { usuarioId }
    });
    const proyectoP = Proyecto.findOne({ 
        where: {
            id: req.params.id
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosP, proyectoP]);

    res.render('nuevoProyecto', { nombrePagina: 'Editar proyecto', 
        proyectos,
        proyecto
    });
}

exports.nuevoProyecto = async (req, res) => {
    const { nombre } = req.body;
    const usuarioId = res.locals.usuario.id;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agregar un nombre al proyecto'});
    }

    if (errores.length > 0) {
        const proyectos = await Proyecto.findAll();

        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        });
    } else {
        await Proyecto.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.abreProyecto = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosP = Proyecto.findAll({
        where: { usuarioId }
    });
    const proyectoP = Proyecto.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosP, proyectoP]);
    const tareas = await Tarea.findAll({
        where: {
            proyectoId: proyecto.id
        }
    });

    if (!proyecto) return next();
    res.render('tareas', {
        nombrePagina: `Tareas del proyecto ${proyecto.nombre}`,
        proyecto,
        proyectos,
        tareas
    });
}

exports.actualizaProyecto = async (req, res) => {
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agregar un nombre al proyecto'});
    }

    if (errores.length > 0) {
        const proyectos = await Proyecto.findAll();

        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        });
    } else {
        await Proyecto.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        );
        res.redirect('/');
    }
}

exports.borraProyecto = async (req, res, next) => {
    const { urlProyecto } = req.query;
    const resultado = await Proyecto.destroy({
        where: {
            url: urlProyecto
        }
    });

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto eliminado correctamente');
}