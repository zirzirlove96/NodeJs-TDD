const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const morgan = require('morgan');
const user = require('./api/user/index.js');


if(process.env.NODE_ENV !== 'test'){
    app.use(morgan('dev'));
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use('/users', user);

module.exports = app;