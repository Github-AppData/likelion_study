const express = require('express');
const app = express();

// MongoDB Configuration (MongoDB Altas)
const { MongoClient, ObjectId } = require('mongodb');
const url = `mongodb+srv://admin:1234@cluster0.v0csnvz.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

let mydb; // MongoDB 전역변수 선언

async function connectToMongoDB() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('MongoDB connected');
        mydb = client.db('testDust');

        app.listen(8081, function () {
            console.log("8081 server ready...");
        })
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectToMongoDB();


app.get('/list', async (req,res) => {
    // const query = { _id: new ObjectId('6676d40484a7763b098da5c6') };
    const result = await mydb.collection('dust').find().toArray();
    
    if (!result) {
        res.status(404).send('Post not found');
        return;
    }
    console.log(result);

    res.send("완료!");
})

