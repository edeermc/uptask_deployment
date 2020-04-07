const Tareas = require('../models/Tareas');
const Proyectos = require('../models/Proyectos');

exports.creaTarea = async (req, res, next) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    const { tarea } = req.body;
    const estado = 0;
    const proyectoId = proyecto.id;
    const resultado = await Tareas.create({
        tarea,
        estado,
        proyectoId
    });

    if (!resultado) {
        return next();
    } else {
        res.redirect(`/proyecto/${req.params.url}`);
    }
}

exports.cambiaEstadoTarea = async (req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id: id
        }
    });

    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();

    if (!resultado) return next();
    res.status(200).send('Tarea actualizada');
}

exports.borraTarea = async (req, res, next) => {
    const { id } = req.params;
    const resultado = await Tareas.destroy({
        where: { id }
    });

    if (!resultado) return next();
    res.status(200).send('Tarea eliminada exitosamente!');
}