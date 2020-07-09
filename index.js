'use strict'

var mongoose = require('mongoose');
var app = require('./app')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/twitter2018549', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => {
    console.log('Conexion exitosa a la base de datos');
    app.set('port', process.env.PORT || 3300);
    app.listen(app.get('port'), () =>{
        console.log(`El servidor esta corriendo : ${app.get('port')}`);
    })
}).catch(err => console.error(err));``