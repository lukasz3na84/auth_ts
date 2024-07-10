import { Express, NextFunction, Request, Response } from "express";
import passport from "passport";
import { checkLoggedIn } from "./middlewares/checkLoggedIn.js";
import { checkAuthenticated } from "./middlewares/checkAuthenticated.js";
import { UsersControllers } from "./controllers/usersControllers.js";
import { authRole } from "./middlewares/aclAuth.js";
import { IUserInsert } from "./interfaces/user-interface.js";

const usersControllers = new UsersControllers();

function routes(app: Express) {
  // rejestracja usera, checkLoggedIn() sprawdza czy zalogowany to wtedy redirect na dashboard
  app.get("/register", checkLoggedIn, (req: Request<{}, {}, { user: IUserInsert }>, res: Response) => {
    console.log("/register");
    res.render("pages/register.ejs", {
      //@ts-ignore
      user: req.user
    })
  });

  app.post("/register",
    passport.authenticate("local-signup", {
      successRedirect: "/login?reg=success",
      failureRedirect: "/register?reg=failure"
    })
  );

  app.get("/login", checkLoggedIn, (req: Request, res: Response) => {
    console.log("/login");
    res.render("pages/login.ejs", {
      // @ts-ignore
      user: req.user
    })
  });

  app.post("/login",
    passport.authenticate("local-login", {
      successRedirect: "/dashboard",
      failureRedirect: "/login?log=failure"
    })
  );

  app.get("/dashboard", checkAuthenticated, (req: Request, res: Response) => {
    console.log("/dashboard");
    res.render("pages/dashboard.ejs", {
      // @ts-ignore
      user: req.user
    })
  });

  app.get("/admin/users", authRole, async (req: Request, res: Response) => {
    console.log('/admin/users');
    const users = await usersControllers.getAll();
    console.log("users\n", users);
    res.render("pages/admin/users.ejs", {
      // @ts-ignore
      user: req.user,
      users: users
    });
  });


  app.get("/admin/users/add", authRole, async (req: Request, res: Response) => {
    console.log('/admin/users/add');
    res.render("pages/admin/usersAdd.ejs", {
      // @ts-ignore
      user: req.user,
    });
  });

  app.post("/admin/users/add", authRole, async (req: Request, res: Response) => {
    console.log('/admin/users/add');
    console.log("req.body: ", req.body);
    const userDb = await usersControllers.createUser(req.body);
    res.redirect("/admin/users");
  });

  app.get("/admin/users/edit/:id", authRole, async (req: Request, res: Response) => {
    console.log('/admin/users/edit/:id');
    const { id } = req.params;
    if (!id) {
      return res.redirect("/admin/users");
    }
    const userToEdit = await usersControllers.getById(id);
    res.render("pages/admin/usersEdit.ejs", {
      // @ts-ignore
      user: req.user,
      userToEdit: userToEdit
    });
  });

  app.post("/admin/users/edit/:id", authRole, async (req: Request, res: Response) => {
    console.log('POST /admin/users/edit/:id');
    const { id } = req.params;
    if (!id) {
      return res.redirect("/admin/users");
    }
    const updatedUser = await usersControllers.updateById(id, req.body);
    res.redirect("/admin/users");
  });

  app.get("/logout", (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.logout(function (err) {
      console.log("User logged out");
      if (err) return next(err);
      res.redirect("/");
    });
  });

  app.post("/logout", (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.logout(function (err) {
      console.log("User logged out");
      if (err) return next(err);
      res.redirect("/");
    });
  });


  app.get("/", (req: Request, res: Response) => {
    res.render("pages/index.ejs", {
      // @ts-ignore
      user: req.user
    });
  });
}

export default routes;