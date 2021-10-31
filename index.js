const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json());

// pass: gKMsQqXaDYVq0Rqq

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ha2x2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travel_agency");
        const placeCollection = database.collection("destination");
        const serviceCollection = database.collection("resort");
        const bookCollection = database.collection("book");

        // Place Collection API
        app.get('/destination/', async (req, res) => {
            const cursor = await placeCollection.find({}).toArray();
            res.send(cursor);
        })

        // Package Collection API
        app.get('/package/', async (req, res) => {
            const cursor = await serviceCollection.find({}).toArray();
            res.send(cursor);
        })

        // All booking Package get Collection API
        app.get('/allbooking/', async (req, res) => {
            const booking = await bookCollection.find({}).toArray();
            res.send(booking);
        })

        // Single Package get API 
        app.get('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await serviceCollection.findOne(query);
            res.send(package);
        })

        // Single booking Package API Delete 
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const result = await bookCollection.deleteOne(quary);
            console.log(result);
        })

        // Update booking status
        app.put('booking/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id)}
            const result = await  bookCollection.updateOne(quary, {status: 'approved'})
            console.log(id);
            res.json(result);
        })

        // Single Package API Post 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await bookCollection.insertOne(user);
            res.json(result);
        })

        // Add new Package API Post 
        app.post('/package', async (req, res) => {
            const package = req.body;
            const result = await serviceCollection.insertOne(package);
            res.json(result);
        })

        // Get all booking from the database
        app.get('/booking/', async (req, res) => {
            const userEmail = req.query.email;
            console.log(userEmail);
            const quer = ({ Email: userEmail });
            result = await bookCollection.find(quer).toArray();
            console.log(result);
            res.send(result);
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello World")
})



app.listen(port, () => {
    console.log("running " + port)
})