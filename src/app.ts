import { Request, Response } from "express";

var createError = require('http-errors');
import * as express from "express";
import * as path from "path";
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import * as exphbs from "express-handlebars";

import * as indexRouter from "./routes/index";
import * as apiRouter from "./routes/api";
import * as nodeRouter from "./routes/node";
import * as dataPointRouter from "./routes/datapoint";

let app = express();
let hbs = exphbs.create({
    helpers: {
        toJSON: function(obj: any) {
            return JSON.stringify(obj);
        }
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter as express.Router);
app.use('/api/v1/', apiRouter as express.Router);
app.use('/node/', nodeRouter as express.Router);
app.use('/data_point/', dataPointRouter as express.Router);

module.exports = app;
