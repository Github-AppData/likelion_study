// express server Start
const express = require('express');
const app = express();

// body-parser Configuration
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true})); // extended:true -> 객체안에 또 다른 객체 허용

// EJS Configuration
app.set('view engine', 'ejs');

// MongoDB Configuration (MongoDB Altas)
const { MongoClient, ObjectId } = require('mongodb');
const url = `mongodb+srv://admin:1234@cluster0.v0csnvz.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

let myDB; // MongoDB 전역변수 선언

async function connectToMongoDB() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('MongoDB connected');
        myDB = client.db('myboard');

        app.listen(8081, function () {
            console.log("8081 server ready...");
        })
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectToMongoDB();


let id = 0;

// 특정 값을 url로 받아서, 그것으로 조회한 다음에 화면 출력
app.get('/boardDetail/:id', async(req, res)=>{
   try {
        id = req.params.id;
        console.log(`Received ID: ${id}`); // 콘솔에 ID 출력

        // 데이터 조회
        // 데이터베이스에서 특정 ID의 게시물 조회
        const query = { _id: new ObjectId(id) }; // ObjectId로 변환
        const result = await myDB.collection('post').find(query, { projection: { _id: 1, title: 1, content: 1 } }).toArray();


        if (!result) {
            res.status(404).send('Post not found');
            return;
        }
        // console.log(result);

        // 조회된 데이터를 사용하여 board.ejs 렌더링
        res.render('boardDetail.ejs', { data: result });
    } catch(error){
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
})


// 데이터 삽입 및 조회 후 렌더링
// asyce - await : 방식은 비 동기이지만, 동기처럼 동작할 수 있게 만드는 코드이다. (Promise 내에서만 사용 O)
// await - 작업을 다 마칠 때까지 기다려라.
app.post('/save', async (req, res) => {
    try {
        
        console.log('전송완료', req.body.content);

        // 데이터 삽입
        const insertResult = await myDB.collection('post').insertOne({
            title: req.body.title,
            content: req.body.content
        });
        console.log("저장 완료!", insertResult);

        // 데이터 조회
        const result = await myDB.collection('post').find().toArray();
        console.log(result);

        // 조회된 데이터를 사용하여 board.ejs 렌더링
        res.render('board.ejs', { data: result });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/enter', function(req,res) { // 요청에 맞는 
    res.sendFile(__dirname + '/enter.html');
});



