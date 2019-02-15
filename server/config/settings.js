const path = require('path');

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost:27017/quizar',
        port: 3000
    },
    staging: {},
    production: {
        port: process.env.PORT,
        db: 'mongodb://Svetloslav:Be4Mg12Ca20Sr38@ds127624.mlab.com:27624/quizardb'
    }
};
