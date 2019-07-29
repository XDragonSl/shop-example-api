require('dotenv').config();

import express = require('express');
import bodyParser = require('body-parser');
import passport = require('passport');

import { Request, Response, NextFunction } from 'express';
import { ServerError } from './types/error';

require('./api/models/db');
require('./api/config/passport');

const routesApi = require('./api/routes/index');

const app = express();

app.use(express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.status(200).json({});
    } else {
        next();
    }
});

app.use(passport.initialize());
app.use('/api', routesApi);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new ServerError('Not found');
    error.status = 404;
    next(error);
});

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json(err);
});

export = app;
