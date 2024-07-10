// funkcja sprawdzająca czy zalogowany użytkownik, jeśli tak i chce 
// wejść na login czy register to trafi do dashboard
export const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // zwróci true jeśli zautoryzowany user czyli są dane w req.session.passport.user
        return res.redirect("/dashboard");
    }
    next();
};
