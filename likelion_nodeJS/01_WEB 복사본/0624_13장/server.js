const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;
const url =
  "mongodb+srv://admin:1234@cluster0.v0csnvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let mydb;

mongoclient
  .connect(url)
  .then((client) => {

    mydb = client.db('myboard');
    // mydb.collection('post').find().toArray().then(result =>{
    //     console.log(result);
    // })
    console.log("MongoDB Okay!");

    app.listen(8080, function () {
      console.log("포트 8080으로 서버 대기중 ... ");
    });
  })
  .catch((err) => {
    console.log(err);
  });
  


// conn.connect();

// express
const express = require("express");
const app = express();

app.use(express.static('public')); // static 미들웨어 설정

// body-parser 라이브러리 추가
const bodyParser = require('body-parser');
const { title } = require("process");
app.use(bodyParser.urlencoded({extended:true}));

// ejs 
app.set('view engine', 'ejs');

// url request
app.get("/book", function (req, res) {
  res.send("도서 목록 관련 페이지입니다.");
});
app.get("/", function (req, res) {
  res.render('index.ejs');
});




app.get("/list", function (req, res) {
  // conn.query("select * from post", function (err, rows, fields) {
  //   if (err) throw err;
  //   console.log(rows);
  // });

  listen(req, res);
});

function listen(req, res){
  mydb.collection('post').find().toArray().then(result => {
    console.log(result);
    res.render('list.ejs', { data : result });
  })
}

// enter 요청에 대한 처리 루틴
app.get('/enter', (req, res) => {
  res.render('enter.ejs');
});

function dateNow(){
  var today = new Date();

  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);

  var dateString = year + '-' + month  + '-' + day;

  return dateString;
}

// save 요청에 대한 post 방식의 처리 루틴
app.post('/save', function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  mydb.collection('post').insertOne(
    {title : req.body.title, content : req.body.content, created : dateNow()})
    .then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
        listen(req,res); 
    });
});

  // revise Page - CSR (라우팅은 하지만, DB는 가지 않는...)
  app.post("/revise", (req, res) => {
    console.log(req.body);
    res.render('revise.ejs', {data:req.body});

  });

    // revise Page - CSR (라우팅은 하지만, DB는 가지 않는...)
    app.post("/update", (req, res) => {
      console.log(req.body);
      const objid = {_id:new ObjId(req.body._id)}

      mydb.collection('post')
      .updateOne(objid,{
        $set: {
          title: req.body.title,
          content: req.body.content,
          created: dateNow()
        }
      }).then((res) => {
        // res.redirect('/list');
        listen(req, res); // forward랑 똑같다. - 단지 방식이 틀렸다.
      }).catch((err) => {
        console.log(err);
        res.status(500).send();
      })
    });

app.post("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = new ObjId(req.body._id);
  mydb.collection('post').deleteOne(req.body)
  .then(result=>{
    console.log('삭제완료');
    res.status(200).send();
  })
  .catch(err =>{
    console.log(err);
    res.status(500).send();
  });
});

app.get('/content/:id', (req,res) => {
  console.log(req.params.id);
  const objid = {_id:new ObjId(req.params.id)}

  mydb.collection('post')
  .findOne(objid)
  .then(result => {
    console.log(result);
    res.render('content.ejs', {data:result});
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send();
  })
})

////// cookie test
const cookieparser = require('cookie-parser');

// 보안은 철통이 아니다. - 한번 더 어렵게 만드는 것이다.
// 암호화 ->  hash 값으로 넘겨주면 된다. - 아무 문자열이나 되기 때문이다.
app.use(cookieparser('암호화키'));

/** 
 * 쿠키 암호화
 * signedCookies - 암호화 된 쿠키들을 복호화해서 볼 수 있다.
 * let milk = parseInt(req.signedCookies.milk) + 1000;
 * res.send("product : " + req.signedCookies.milk + " " + "name : " + req.signedCookies.name + " " + "age : " + req.signedCookies.age); 
 * res.cookie('name', '김태욱', {signed : true}); 
 * */ 

// app.get('/cookie', (req, res) => {
//   let milk = parseInt(req.signedCookies.milk) + 1000;

//   // Not a Number
//   if(isNaN(milk)){
//     milk = 0;
//   }

//   // maxAge = 쿠키 보관 시간 설정 => ms 단위이다.
//   // maxAge 0으로 설정하면 브라우저 쿠키가 없어진다.
//   res.cookie('milk', milk, {signed : true}); 
//   res.cookie('name', '김태욱', {signed : true});
//   res.cookie('age', '23', {signed : true});

//   // 브라우저의 캐시를 서버에서 가지고 올 수 있다. -> cookie-parser 덕분에
//   res.send("product : " + req.signedCookies.milk + " " + "name : " + req.signedCookies.name + " " + "age : " + req.signedCookies.age); 
  
// });




