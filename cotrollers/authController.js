const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarCorreo = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Campos vacios, verifica tu información'
});

exports.estaAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/iniciar-sesion');
    }
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: { email: req.body.email }
    });

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    } 
    
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    await usuario.save();
    
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    await enviarCorreo.enviarCorreo({
        usuario,
        subject: 'Reestablecer contraseña',
        resetUrl,
        archivo: 'reestablecer-contrasena'
    });

    req.flash('correcto', 'Se ha enviado un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validaToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuarios.findOne({
        where: { token }
    });

    if (!usuario) {
        req.flash('error', 'Petición no válida');
        res.redirect('/reestablecer');
    } else {
        res.render('reseteaContrasena', {
            nombrePagina: 'Restablecer contraseña'
        });
    }
}

exports.reseteaContrasena = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    if (!usuario) {
        req.flash('error', 'El token ha expirado, solicite uno nuevo');
        res.redirect('/reestablecer');
    } else {
        usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        usuario.token = null;
        usuario.expiracion = null;
        await usuario.save();

        req.flash('correcto', 'Se ha cambiado la contraseña exitosamente');
        res.redirect('/iniciar-sesion');
    }
}