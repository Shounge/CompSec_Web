const mongoose = require('mongoose');

const dbConfig = {
    url: 'mongodb://localhost:27017/vulnerable-web-app',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};

mongoose.connect(dbConfig.url, dbConfig.options)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

module.exports = dbConfig;