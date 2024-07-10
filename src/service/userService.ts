import { Request, Response } from "express";
import { passport } from "../utility/auth.js";

class UserService {
  constructor() { }

  userGetRegister(req: Request, res: Response) {
    console.log("/register");
    res.render("pages/register.ejs", {
      //@ts-ignore
      user: req.user
    })
  }

  userPostRegister(req: Request, res: Response) {
    passport.authenticate("local-signup", {
      successRedirect: "/login?reg=success",
      failureRedirect: "/register?reg=failure"
    })
  }

  userGetLogin(req: Request, res: Response) {
    console.log("/login");
    res.render("pages/login.ejs", {
      // @ts-ignore
      user: req.user
    })
  }

  userPostLogin(req: Request, res: Response) {
    passport.authenticate("local-login", {
      successRedirect: "/dashboard",
      failureRedirect: "/login?log=failure"
    })
  }
}

const userService = new UserService();

export default userService;