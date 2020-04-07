const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('../models/Usuarios');

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const usuario = await Usuarios.findOne({
                where: { email, activo: 1 }
            });

            if (!usuario.verificaPassword(password)) {
                return done(null, false, {
                    message: 'Contraseña inválida'
                });
            }

            return done(null, usuario);
        } catch (error) {
            return done(null, false, {
                message: 'La cuenta especificada no existe o no ha sido confirmada'
            });
        }
    })
);

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;