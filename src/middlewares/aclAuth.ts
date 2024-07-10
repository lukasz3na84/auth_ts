import { NextFunction, Request, Response } from "express";
import { permissions } from "../utility/permissions.js";
import { IUserPassport } from "../interfaces/user-interface.js";

function getGuestDefaultUser(): Partial<IUserPassport> {
  return {
    role: "guest"
  };
}

function authRole(req: Request, res: Response, next: NextFunction) {
  console.log("authRole() - middleware");
  const resource = req.route.path; // /dashboard
  const method = req.method.toLowerCase();
  console.log("resource: ", resource, " method: ", method);

  const user = req.user as IUserPassport | undefined; // Rzutowanie req.user na IUserPassport lub undefined

  if (!user) {
    req.user = getGuestDefaultUser() as IUserPassport; // jeśli jest nie zalogowany to passport nie wstawił danych usera i nie ma role, tworzymy guest
    return res.redirect("/?msg=forbidden-access");
  }

  if (permissions.isResourceAllowedForUser(user.role, resource, method)) {
    // ma dostęp
    return next();
  } else {
    res.status(401);
    return res.send("Access forbidden");
  }
}

export {
  authRole
}
