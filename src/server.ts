import express from "express";
import { passport } from "./utility/auth.js";
import expressSession from "express-session";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
// const usersControllers = new UsersControllers();

const app = express();
app.use(express.urlencoded({ extended: false })); // sparsuje dane przesłane z POST

app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const viewsPath = path.join(__dirname, "views");
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.static("./public"));

app.listen(3010, () => {
    routes(app);
    console.log("Server started at port 3010");
});


// npm init -y
// npm i express express-session ejs passport passport-local mongodb mongoose
// w package.json type jako module
