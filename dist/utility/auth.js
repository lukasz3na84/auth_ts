import passport from "passport";
import LocalStrategy from "passport-local";
import { User, makeUser } from "../models/user.model.js";
// import { IUserDb, IUserPassport } from "../schema/userSchema.js"
passport.serializeUser((user, done) => {
    // funkcja otrzymuje zautoryzowanego usera z authUser()
    // wywołujemy done i passport zapisze id usera do
    // req.session.passport.user
    // w ten sposób dane użytkownika zapisane są w sesji czyli np { id: 5, name: "user#001", surname: "Kowalski" }
    // To id będzie użyte przez deserializeUser() do pobrania pełnych danych użytkownika
    console.log("serializeUser(), user.id:", user.id);
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    // funkcja na podstawie przekazanego id pobiera pełne dane
    // użytkownika np z bazy i zwraca je do done(), dzięki temu
    // trafia on do req.user i może być użyty gdziekolwiek w apce
    try {
        const userDb = await User.findById(id);
        if (!userDb) {
            done(null, false);
        }
        const { password, ...otherUserData } = userDb;
        console.log("deserializeUser(), userDb: ", otherUserData);
        done(null, otherUserData);
    }
    catch (error) {
        done(error);
    }
});
// rejestracja uzytkownika na stronie
passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    try {
        const userExists = await User.findOne({ "email": email });
        if (userExists) {
            return done(null, false);
        }
        const user = makeUser(email, password);
        const userDb = await user.save();
        return done(null, userDb);
    }
    catch (error) {
        done(error);
    }
}));
const authUser = async (req, email, password, done) => {
    // authuser to funkcja pozwalająca na autoryzację użytkownika, zwraca zautoryzowanego 
    // użytkownika np z bazy, authUser używana jest przez strategię do autoryzacji usera
    try {
        const authenticateUser = await User.findOne({ "email": email });
        if (!authenticateUser) {
            return done(null, false);
        }
        if (!await authenticateUser.validPassword(password)) { //złe hasło
            return done(null, false);
        }
        return done(null, authenticateUser); // zwracamy zalogowanego usera
    }
    catch (error) {
        return done(error);
    }
};
// logowanie użytkownika
passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, authUser));
export { passport };
