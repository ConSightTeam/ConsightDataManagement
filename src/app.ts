import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as exphbs from "express-handlebars";
import * as session from "express-session";
import flash = require("connect-flash");

import * as passport from 'passport';

import * as indexRouter from "./routes/index";
import * as apiRouter from "./routes/api";
import * as nodeRouter from "./routes/node";
import * as dataPointRouter from "./routes/datapoint";
import * as loginRouter from "./routes/login";
import * as logoutRouter from "./routes/logout";
import * as registerRouter from "./routes/register";
import * as profileRouter from "./routes/profile";

import { checkToken } from "./middleware/manageToken";
import { setup_authentication } from "./helper/authentication";


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
setup_authentication(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(flash());
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
app.use('/profile', profileRouter as express.Router);

app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.error(err.stack);
    res.status(500).render('error', {error: err, message: err.message});
});

module.exports = app;
