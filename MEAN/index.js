const express = require('express');
const router = express.Router();
const querystring = require('querystring');

const Person = require('./person');

router.get("/people", (req, res, next) => {
    Person.find().then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

router.get("/people/:id",(req, res, next) => {
    Person.findById(req.params.id).then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

router.get("/people/search/:lastName", (req, res, next) => {
    Person.find({lastName: new RegExp(req.params.lastName, 'i')}).then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

router.post("/people", (req, res, next) => {
    console.log(req.body.firstName);
    const person = new Person({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    person.save().then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    })
});

router.delete("/people/:id", (req, res, next) => {
    Person.findOneAndDelete(req.params.id).then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

router.patch("/people/:id", (req, res, next) => {
    const updatedPerson = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        _id: req.params.id,
    };
    console.log(updatedPerson);
    Person.findByIdAndUpdate(req.params.id,
                            updatedPerson
                            ).then(data => {
        res.send(data+'\n'+req.url+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

module.exports = router;