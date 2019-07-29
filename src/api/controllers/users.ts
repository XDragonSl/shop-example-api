require('../models/db');

import mongoose = require('mongoose');

import { Response, NextFunction } from 'express';
import { AuthRequest } from './../../types/auth';
import { UserDocument } from './../../types/user';
import { ServerError } from './../../types/error';

const User = mongoose.model('User');

export = {
        getUser: (req: AuthRequest, res: Response, next: NextFunction, callback: any) => {
			User.findOne({email: req.payload.email}).exec((err: ServerError, user: UserDocument) => {
				if (err) {
					res.status(404).json(err);
				} else {
					if (user) {
						callback(user);
					} else {
						res.status(404).json({
							message: 'User not found'
						});
					}
				}
			});
		}
};
