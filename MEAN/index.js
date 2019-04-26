const Person = require('./person');

const express = require('express');
const router = express.Router(); 

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
    Person.find({lastName: req.params.lastName}).then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

router.post("/people", (req, res, next) => {
    const person = new Person({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    person.save().then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

router.delete("/people/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(data => {
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
    };
    Person.findByIdAndUpdate(req.params.id, updatedPerson).then(data => {
        res.send(data+'\n');
        res.end();
    }).catch(err => {
        return next(err);
    });
});

module.exports = router;