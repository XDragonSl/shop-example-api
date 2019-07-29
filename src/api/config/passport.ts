require('../models/db');

import passport = require('passport');
import local = require('passport-local');
import mongoose = require('mongoose');
import crypto = require('crypto');

import { UserDocument } from './../../types/user';
import { ServerError } from './../../types/error';

const User = mongoose.model('User');
const LocalStrategy = local.Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (username, password, done) => {
    User.findOne({email: username}, (err: ServerError, user: UserDocument) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'Incorret username'
            });
        }
        if (user.hash !== crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'RSA-SHA512').toString('hex')) {
            return done(null, false, {
                message: 'Incorret password'
            });
        }
        return done(null, user);
    });
}));
