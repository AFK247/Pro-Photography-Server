const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const user = process.env.db_user;
const password = process.env.db_password;

//The user and password were taken from env
const uri = `mongodb+srv://${user}:${password}@cluster0.bs7nnrw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Two collection is used
async function run() {
    try {

        const serviceCollection = client.db('photo').collection('services');
        const reviewCollection = client.db('photo').collection('review');

        app.get('/services3', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).sort({ _id: -1 }).limit(3);
            const limited = await cursor.toArray();
            res.send(limited);
        });

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { service: id };
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });

        app.get('/myreview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { customer_id: id };
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/addservice', async (req, res) => {
            const review = req.body;
            const result = await serviceCollection.insertOne(review);
            res.send(result);
        });

        // app.post('/updatereview', async (req, res) => {
        //     const review = req.body;

        
        // });


    }
    finally {
        //Nothing
    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Photo server is running Succesfully')
})

app.listen(port, () => {
    console.log(`Photo server running on ${port}`);
})