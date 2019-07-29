require('../models/db');

import mongoose = require('mongoose');

const users = require('./users');

import { Request, Response, NextFunction } from 'express';
import { OrderDocument } from './../../types/order';
import { UserDocument } from './../../types/user';
import { ServerError } from './../../types/error';

const model = mongoose.model('Order');

export = {
        get: (req: Request, res: Response, next: NextFunction) => {
            model.findById(req.params.id).exec((err: ServerError, ord: OrderDocument) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    if (ord) {
                        users.getUser(req, res, next, (user: UserDocument) => {
                            if (user.email === ord.user) {
                                res.status(200).json(ord);
                            } else {
                                res.status(403).json({
                                    message: 'Forbidden'
                                });
                            }
                        });
                    } else {
                        res.status(404).json({
                            message: 'Id not found'
                        });
                    }
                }
            });
        },
        getAll: (req: Request, res: Response, next: NextFunction) => {
            users.getUser(req, res, next, (user: UserDocument) => {
                if (user.role === 'admin') {
                    model.find().exec((err, ords) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.status(200).json(ords);
                        }
                    });
                } else {
                    res.status(403).json({
                        message: 'Forbidden'
                    });
                }
            });
        },
        create: (req: Request, res: Response, next: NextFunction) => {
            users.getUser(req, res, next, (user: UserDocument) => {
                model.create({
                    user: user.email,
                    products: req.body.products.split(','),
                    numbers: req.body.numbers.split(',')
                }, (err: ServerError, ord: OrderDocument) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(201).json(ord);
                    }
                });
            });
        },
        update: (req: Request, res: Response, next: NextFunction) => {
            model.findById(req.params.id).exec((err: ServerError, ord: OrderDocument) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    if (ord) {
                        users.getUser(req, res, next, (user: UserDocument) => {
                            if (user.email === ord.user) {
                                ord.user = user.email;
                                ord.products = req.body.products.split(',');
                                ord.numbers = req.body.numbers.split(',');
                                ord.save((error: ServerError, nord: OrderDocument) => {
                                    if (error) {
                                        res.status(409).json(error);
                                    } else {
                                        res.status(200).json(nord);
                                    }
                                });
                            } else {
                                res.status(403).json({
                                    message: 'Forbidden'
                                });
                            }
                        });
                    } else {
                        res.status(404).json({
                            message: 'Id not found'
                        });
                    }
                }
            });
        },
        remove: (req: Request, res: Response, next: NextFunction) => {
            users.getUser(req, res, next, (user: UserDocument) => {
                if (user.role === 'admin') {
                    model.findOneAndDelete({_id: req.params.id}).exec((err: ServerError, ord: OrderDocument) => {
                        if (err) {
                            res.status(404).json(err);
                        } else {
                            if (ord) {
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
