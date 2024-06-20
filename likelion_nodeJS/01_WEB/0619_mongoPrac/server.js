// express server Start
const express = require('express');
const app = express();

// body-parser Configuration
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true})); // extended:true -> 객체안에 또 다른 객체 허용

// EJS Configuration
app.set('view engine', 'ejs');

// 몽고디비 커넥트 한 것입니다. - 
const { MongoClient, ObjectId } = require('mongodb');
const url = `mongodb+srv://admin:1234@cluster0.v0csnvz.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

// 몽고디비 conn 한 것입닏. 
async function connectToMongoDB() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('MongoDB connected');
        myDB = client.db('myboard');

        app.listen(8080, function () {
            console.log("8080 server ready...");
        })
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectToMongoDB();

app.get('/enter', (req,res) => {
    res.sendFile(__dirname + "/enter.html");
})

app.post('/save', async (req,res) => {
    // 몽고디비 인서트
    try{
        // 왔는 지 확인하는 거!
        console.log('complete!' + req.body.content);

        // insert 하는 거임돠
        const insertResult = await myDB.collection('post').insertOne({
            title: req.body.title,
            content: req.body.content
        });

        // 검토
        console.log("저장완료" + insertResult);

        // 데이터 select 임다
        const selectResult = await myDB.collection('post').find().toArray();

        // 이제 select 한 것을 ejs로 전달만 해 주면 끝입니당
        res.render('board.ejs', {data:selectResult});
    } catch(err){
        console.log(err);
    }
})

// app.get('/boardDetail/:id', (req,res) => {
//     try()
// })

