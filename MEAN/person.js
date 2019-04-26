const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    firstName: String,
    lastName: String,
});

PersonSchema
.virtual('url')
.get(() => {
    return '/people/'+this._id;
});

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;