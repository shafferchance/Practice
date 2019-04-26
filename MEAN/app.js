const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRouter = require('./index');

const cb = bodyParser.json();

mongoose.connect('mongodb://localhost:27017/test',{useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.use(cb);
app.use('/', indexRouter);

console.log("Listening on Port 3000...");
app.listen(3000);