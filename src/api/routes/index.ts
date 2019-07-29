import jwt = require('express-jwt');

import { Router } from 'express';

const products = require('../controllers/products');
const orders = require('../controllers/orders');
const authentication = require('../controllers/authentication');

const router = Router();
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

router.get('/products', products.getAll);
router.get('/products/:id', products.get);
router.post('/products', auth, products.create);
router.put('/products/:id', auth, products.update);
router.delete('/products/:id', auth, products.remove);

router.get('/orders', auth, orders.getAll);
router.get('/orders/:id', auth, orders.get);
router.post('/orders', auth, orders.create);
router.put('/orders/:id', auth, orders.update);
router.delete('/orders/:id', auth, orders.remove);

router.post('/register', authentication.register);
router.post('/login', authentication.login);

export = router;
