const Usuarios = require('../models/Usuarios');
const enviarCorreo = require('../handlers/email');

exports.creaCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    });
}

exports.nuevaCuenta = async (req, res) => {
    const { email, password } = req.body;

    try {
        await Usuarios.create({
            email,
            password
        })

        const confirmUrl = `http://${req.headers.host}/confirmar/${email}`;
        const usuario = { email };
        await enviarCorreo.enviarCorreo({
            usuario,
            subject: 'Confirma tu cuenta en UpTask',
            confirmUrl,
            archivo: 'confirmar-cuenta'
        });

        req.flash('correcto', 'Hemos enviado un mensaje a tu correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch(error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            nombrePagina: 'Crear cuenta en UpTask',
            mensajes: req.flash(),
            email,
            password
        });
    }
}

exports.iniciaSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciaSesion', {
        nombrePagina: 'Inicia sesión en UpTask',
        error
    });
}

exports.reestableceContrasena = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer contraseña'
    });
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo,
            activo: 0
        }
    });

    if (!usuario) {
        req.flash('error', 'La cuenta no existe o ya esta activa, cree una nueva');
    } else {
        usuario.activo = 1;
        await usuario.save();

        req.flash('correcto', 'La cuenta ha sido confirmada correctamente');
    }
    res.redirect('/iniciar-sesion');
}