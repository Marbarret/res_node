const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../../model/userModel'); 

passport.use( new LocalStrategy(
    { usernameField: 'email' },
    async(email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if(!user){
                return done(null, false, { message: 'Email não registrado' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return done(null, false, { message: 'Senha Incorreta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

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