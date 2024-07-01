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
        
        // 데이터 조회
        // 데이터베이스에서 특정 ID의 게시물 조회
        // console.log("adsds : ", req.params._id);
        console.log(req.body);
        const query = { _id: new ObjectId(req.params.id) }; // MongoDB의 _id는 그냥 String이 아님. ObjectId로 변환
        const result = await myDB.collection('post').find(query, { projection: { _id: 1, title: 1, content: 1 } }).toArray();

        if (!result) {
            res.status(404).send('Post not found');
            return;
        }

        // 조회된 데이터를 사용하여 board.ejs 렌더링
        res.render('boardDetail.ejs', { data: result });
    } catch(error){
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
})

function dateNow(){
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '-' + month  + '-' + day;

    return dateString;
}


// 데이터 삽입 및 조회 후 렌더링
// asyce - await : 방식은 비 동기이지만, 동기처럼 동작할 수 있게 만드는 코드이다. (Promise 내에서만 사용 O)
// await - 작업을 다 마칠 때까지 기다려라.

app.get("/board", function (req, res) {
    myDB
      .collection("post")
      .find()
      .toArray()
      .then((result) => {
        console.log(result);
        //res.send(result);
        // res.sendFile(__dirname + "/list.html");
        res.render("board.ejs", { data: result });
      });
  });
  

app.post("/save", (req, res) => {
    console.log(req.body);
    myDB
      .collection("post")
      .insertOne({
        title: req.body.title,
        content: req.body.content,
        created: dateNow()
      })
      .then((result) => {
        console.log("저장 완료", result);

        // 저장을 완료한 다음에, /board get으로 redirect
        res.redirect("/board");
        // res.send("데이터 추가 성공");
      });
  });




app.get('/enter', function(req,res) { // 요청에 맞는 
    res.render('enter.ejs');
});

app.get('/edit/:id', function(req,res) { // 요청에 맞는 
    console.log("asd",req.params.id);
    const query = { _id: new ObjectId(req.params.id) };
    myDB.collection('post').findOne(query)
        .then(result => {
            res.render('edit.ejs', {data:result});
            // res.status(200).send('Success');
        })
});

app.post('/edit', (req,res) => { // 요청에 맞는 
    
    const query = { _id: new ObjectId(req.body._id) };
    console.log(req.body._id);
    myDB.collection('post')
        // 조건, 변경항목
        .updateOne(query, {
            $set : {title : req.body.title, content: req.body.content, created:dateNow()}
        })
        .then(result => {
            res.redirect('/board');
            // res.status(200).send('Success');
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error');
        });
    
});

app.post('/delete', (req,res) => { // 요청에 맞는 
    

    try {
        const query = { _id: new ObjectId(req.body._id) }; // ObjectId로 변환
        myDB.collection('post').deleteOne(query)
            .then(result => {
                console.log(query, "삭제완료!");
                // reload
                res.status(200).send();
            })
        
    } catch (error) {
        console.log(error);
    }
});



