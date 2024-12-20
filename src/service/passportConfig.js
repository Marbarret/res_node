const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../model/userModel'); 

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        console.log('Iniciando autenticação');
      try {
        const user = await User.findOne({ email });
        console.log('Usuário encontrado:', user);
        // Corrigido para findOne
        if (!user) {
            console.log('Usuário não encontrado');
          return done(null, false, { message: 'Usuário não encontrado' });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Senha corresponde:', isMatch);
        if (!isMatch) {
          return done(null, false, { message: 'Credenciais inválidas' });
        }
        console.log('Autenticação bem-sucedida');
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  

passport.serializeUser((user, done) => { done (null, user.id)});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        done(error);
    }
});

module.exports = passport;