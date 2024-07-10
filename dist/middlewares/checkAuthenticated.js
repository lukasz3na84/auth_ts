// sprawdza czy zalogowany user, wtedy pozwala odwiedzić dany url
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // czy zalogowany
        return next(); // jeśli tak to może zobaczyć adres np dashboard
    }
    res.redirect("/"); // nie zalogowany, nie może zobaczyć dashboard, wraca na główną stronę
};
export { checkAuthenticated };
