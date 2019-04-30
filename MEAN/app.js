const express = require('express');
const mongoose = require('mongoose');

const personRouter = require('./index')
const cb = require('body-parser').json();

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

const app = express();
app.use(cb);

app.use('/', personRouter);

console.log("Listening on Port 3000...");
app.listen(3000);