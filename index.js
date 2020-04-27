const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('hello from server...');
})

app.get('/appointments', (req, res) => {
    
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
    
        collection.find().toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents);
            }
            
        });
        
    });  
})

app.get('/views/:id', (req, res) => {
    
    const id = req.params.id;

    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
    
        collection.find(id).toArray((err, documents) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(documents[0]);
            }
            
        });
        
    });  
})


app.post('/allAppointments', (req, res) => {
    const appointment = req.body;
    
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointments");
        
        collection.insertOne(appointment, (err, result) => {
            if(err) {
                console.log(err);
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
        
    });  
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listening to port 4200...'));