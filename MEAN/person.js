const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Person = new Schema({
    firstName: String,
    lastName: String,
});

Person
.virtual('url')
.get(()=> {
    return '/people/' + this._id
});

module.exports = mongoose.model('Person', Person);
