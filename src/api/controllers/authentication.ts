require('../models/db');

import passport = require('passport');
import mongoose = require('mongoose');
import crypto = require('crypto');
import jwt = require('jsonwebtoken');

import { Request, Response, NextFunction } from 'express';
import { User, UserDocument } from './../../types/user';
import { ServerError } from './../../types/error';

const User = mongoose.model('User');

function generateJWT(user: User): string {
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return jwt.sign({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        exp: date.getTime() / 1000
    }, process.env.JWT_SECRET);
}

export = {
        register: (req: Request, res: Response, next: NextFunction) => {
            if (!req.body.name || !req.body.email || !req.body.password) {
                res.status(400).json({
                    message: 'All fields required'
                });
            } else {
                let user: UserDocument = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.role = 'user';
                user.salt = crypto.randomBytes(16).toString('hex');
                user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'RSA-SHA512').toString('hex');
                user.save((err: ServerError) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json({
                            token: generateJWT(user)
                        });
                    }
                });
            }
        },
        login: (req: Request, res: Response, next: NextFunction) => {
            if (!req.body.email || !req.body.password) {
                res.status(400).json({
                    message: 'All fields required'
                });
            } else {
                passport.authenticate('local', (err: ServerError, user: User, info: any) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        if (!user) {
                            res.status(401).json(info);
                        } else {
                            res.status(200).json({
                                token: generateJWT(user)
                            });
                        }
                    }
                })(req, res, next);
            }
        }
};
