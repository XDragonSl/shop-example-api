require('../models/db');

import mongoose = require('mongoose');

const users = require('./users');

import { Request, Response, NextFunction } from 'express';
import { ProductDocument } from './../../types/product';
import { UserDocument } from './../../types/user';
import { ServerError } from './../../types/error';

const model = mongoose.model('Product');

export = {
        get: (req: Request, res: Response, next: NextFunction) => {
            model.findById(req.params.id).exec((err: ServerError, prod: ProductDocument) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    if (prod) {
                        res.status(200).json(prod);
                    } else {
                        res.status(404).json({
                            message: 'Id not found'
                        });
                    }
                }
            });
        },
        getAll: (req: Request, res: Response, next: NextFunction) => {
            model.find().exec((err, prods) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(prods);
                }
            });
        },
        create: (req: Request, res: Response, next: NextFunction) => {
            users.getUser(req, res, next, (user: UserDocument) => {
                if (user.role === 'admin') {
                    model.create({
                        name: req.body.name,
                        cost: req.body.cost
                    }, (err: ServerError, prod: ProductDocument) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.status(201).json(prod);
                        }
                    });
                } else {
                    res.status(403).json({
                        message: 'Forbidden'
                    });
                }
            });
        },
        update: (req: Request, res: Response, next: NextFunction) => {
            users.getUser(req, res, next, (user: UserDocument) => {
                if (user.role === 'admin') {
                    model.findById(req.params.id).exec((err: ServerError, prod: ProductDocument) => {
                        if (err) {
                            res.status(404).json(err);
                        } else {
                            if (prod) {
                                prod.name = req.body.name;
                                prod.cost = req.body.cost;
                                prod.save((error: ServerError, nprod: ProductDocument) => {
                                    if (error) {
                                        res.status(409).json(error);
                                    } else {
                                        res.status(200).json(nprod);
                                    }
                                });
                            } else {
                                res.status(404).json({
                                    message: 'Id not found'
                                });
                            }
                        }
                    });
                } else {
                    res.status(403).json({
                        message: 'Forbidden'
                    });
                }
            });
        },
        remove: (req: Request, res: Response, next: NextFunction) => {
            users.getUser(req, res, next, (user: UserDocument) => {
                if (user.role === 'admin') {
                    model.findOneAndDelete({_id: req.params.id}).exec((err: ServerError, prod: ProductDocument) => {
                        if (err) {
                            res.status(404).json(err);
                        } else {
                            if (prod) {
                                res.status(204).json(null);
                            } else {
                                res.status(404).json({
                                    message: 'Id not found'
                                });
                            }
                        }
                    });
                } else {
                    res.status(403).json({
                        message: 'Forbidden'
                    });
                }
            });
        }
};
