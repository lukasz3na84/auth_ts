// funkcja sprawdzająca czy zalogowany użytkownik, jeśli tak i chce 
import { NextFunction, Request, Response } from "express";

// wejść na login czy register to trafi do dashboard
export const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
      // zwróci true jeśli zautoryzowany user czyli są dane w req.session.passport.user
      return res.redirect("/dashboard");
  }

  next();
}