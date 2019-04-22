const express = require('express');
const mongodb = require('mongodb');

const app = express();

const mongoClient = require('mongodb').MongoClient;
let db;
let collection;

// Init connection
mongoClient.connect("mongodb://localhost:27017/test", (err, database) => {
    if (err) throw err;
    
    collection = database.collection('person');

    //Ensuring that app starts after database. Maybe use promises instead.
    app.listen(3000);
});

app.get("/people", (req, res) => {
    collection.find((err, docs) => {
        res.setHeader('Content-Type','application/json');
        res.json(docs)
    });
});

app.get("/people/:id",(req, res) => {
    if (err) { console.log(err); }
    collection.find(req.params.id, (err, docs) => {
        res.setHeader('Content-Type','application/json');
        res.json(docs);
    });
});

app.post("/people", (req, res) => {
    collection.insert(req.body, (err, docs) => {
        res.setHeader('Content-Type','application/json');
        res.json(docs);
    });
});

app.delete("/people/:id", (req, res) => {
    collection.remove(req.params.id, (err, docs) => {
        res.setHeader('Content-Type','application/json');
        res.json(docs);
    });
});

app.patch("/people/:id", (req, res) => {
    collection.update(req.params.id, 
                                 req.body, (err, docs) => {
        res.setHeader('Content-Type','application/json');
        res.json(docs);
    });
});