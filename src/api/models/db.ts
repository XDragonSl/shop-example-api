import mongoose = require('mongoose');

const URI = process.env.DB_URI;

mongoose.connect(URI, {useNewUrlParser: true});

function shutdown(callback: Function) {
    mongoose.connection.close(() => {
        callback();
    });
}

process.once('SIGUSR2', () => {
    shutdown(() => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', () => {
    shutdown(() => {
        process.exit();
    });
});

process.on('SIGTERM', () => {
    shutdown(() => {
        process.exit();
    });
});

require('./products');
require('./orders');
require('./users');
