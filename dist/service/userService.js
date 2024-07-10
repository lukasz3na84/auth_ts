import { passport } from "../utility/auth.js";
class UserService {
    constructor() { }
    userGetRegister(req, res) {
        console.log("/register");
        res.render("pages/register.ejs", {
            //@ts-ignore
            user: req.user
        });
    }
    userPostRegister(req, res) {
        passport.authenticate("local-signup", {
            successRedirect: "/login?reg=success",
            failureRedirect: "/register?reg=failure"
        });
    }
    userGetLogin(req, res) {
        console.log("/login");
        res.render("pages/login.ejs", {
            // @ts-ignore
            user: req.user
        });
    }
    userPostLogin(req, res) {
        passport.authenticate("local-login", {
            successRedirect: "/dashboard",
            failureRedirect: "/login?log=failure"
        });
    }
}
const userService = new UserService();
export default userService;
