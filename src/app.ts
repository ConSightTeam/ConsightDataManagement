import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as exphbs from "express-handlebars";
import * as session from "express-session";

import * as passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";

import { UserRepository } from "./repositories/userRepository";
import { User } from "./model/User";

import * as indexRouter from "./routes/index";
import * as apiRouter from "./routes/api";
import * as nodeRouter from "./routes/node";
import * as dataPointRouter from "./routes/datapoint";
import * as loginRouter from "./routes/login"
import * as logoutRouter from "./routes/logout"
import * as registerRouter from "./routes/register"

import { checkToken } from "./middleware/manageToken";


let SECRET: string = process.env['SECRET'];

let app = express();
let hbs = exphbs.create({
    helpers: {
        toJSON: function(obj: any) {
            return JSON.stringify(obj);
        }
    }
});

// passport setup
passport.use(new LocalStrategy(async function(username: string, password: string, done) {
    let dao = new UserRepository();
    let user: User;
    try {
        user = await dao.get(username, password);
        if (!user) {
            return done(null, false, {message: "Username or password does not match"});
        }
    } catch (e) {
        done(e);
    }

    return done(null, user);
}));

passport.serializeUser(function(user: User, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(async function(id: number, done) {
    let dao = new UserRepository();
    try {
        done(null, await dao.getByID(id));
    } catch (e) {
        done(e);
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({secret: SECRET}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter as express.Router);
app.use('/api/v1/', checkToken, apiRouter as express.Router);
app.use('/node/', nodeRouter as express.Router);
app.use('/data_point/', dataPointRouter as express.Router);
app.use('/login', loginRouter as express.Router);
app.use('/logout', logoutRouter as express.Router);
app.use('/register', registerRouter as express.Router);

module.exports = app;
