const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;
const url =
  "mongodb+srv://admin:1234@cluster0.v0csnvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let mydb;


// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// express
const express = require('express');
const app = express();

app.use(express.static('public')); // static 미들웨어 설정

///////////// session
const session = require('express-session');

// session 미들웨어 설정
app.use(session({
  secret: '암호화 키', // 세션 ID 즉, 쿠키를 암호화 하겠다.
  resave: false, // 매번 새로운 세션 식별자의 발급여부를 결정 (일반적으로 false를 설정 - 새로운 세션을 발급하기 때문에 이전의 것이 다 무용지물이 된다.)
  saveUninitialized: false // 세션에 아무 값이 없을 때도, 발급을 받을 것이냐?
}))


app.use(passport.initialize());
app.use(passport.session());


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
  

app.get("/", (req, res) => {
  console.log("/ 요청");
  try {
    console.log("1", req.session.passport);
    if (typeof req.session.passport != undefined && req.session.passport.user) {
      res.render("index.ejs", { data: req.session.passport });
    } else {
      res.render("index.ejs", { data: null });
    }
  } catch (err) {
    console.log('1-1');
    res.render("index.ejs", { data: null });
  }
});

///////// login
app.get("/login", (req, res) => {
  console.log("/login", req.session.passport);
  res.render("login.ejs");
});

// bcrypt도 단방향 암호화이지만, 해싱은 물론 솔트까지 생성을 해준다.
const bcrypt = require('bcrypt');
const saltRounds = 10; // 솔트 라운드 수

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

// 미들웨어 설정 - 
app.use("/", require("./routes/post"));
app.use("/", require("./routes/account"));

function dateNow(){
  var today = new Date();

  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);

  var dateString = year + '-' + month  + '-' + day;

  return dateString;
}

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

// id 체크
// async function idCheck(reqUserId) {
  
// }

// app.post("/idCheck", async(req, res) => {

//   mydb.collection('account').findOne({userid : req.body.userid})
//   .then((result) => {
//     res.redirect("signup.ejs");
    
//   }).catch((err) => {
//     console.error(err);
//     res.status(401).send("Invalid userId");
//   })
// })

// 솔트 생성 함수
async function generateSalt() {
  return await bcrypt.genSalt(saltRounds);
}

// 비밀번호 검증 함수
async function verifyPassword(plainPassword, hash) {
  try {
    const match = await bcrypt.compare(plainPassword, hash);
    console.log("Password match:", match);
    return match;
  } catch (error) {
    console.error(error);
  }
}



// index.ejs
app.get("/", function (req, res) {

  // 세션에 유저가 있는가
  if(req.session.user) {
    console.log("이미 로그인 되어 있습니다.");
    res.render("index.ejs", {user : req.session.user}); // 전달 해 준다.
  } else {
    res.render("login.ejs"); // 다시 로그인 해라
  }
});




///////// 내 DB에 있는 사용자 정보로 인증
// app.post('/login', (req,res) => {
//   console.log(req.body);

//   mydb.collection('account')
//   .findOne({userid: req.body.userid}) // id 비교
//   .then(async result => {

//     // 만약에 .findOne 결과가 존재한 다면, 
//     if(result != null){
//       const isMatch = await verifyPassword(req.body.userpw, result.userpw);

//       console.log("result.userpw : " + result.userpw);
//       console.log("req.body.userpw : " + req.body.userpw);

//       // 비밀번호 맞는 지 아닌 지 확인
//       if(isMatch){
//         req.session.user = req.body; // 세션 등록     

//         console.log("새로운 로그인 입니다.");
//         res.render("index.ejs", {user : req.session.user});
//       } else {
//         res.status(401).send("Invalid username or password");
//       }
//     } else{
//       // result 결과가 없을 때
//       res.render("login.ejs");
//     }
//   })
//   .catch(err => {
//       console.log(err);
//       res.status(401).send("Invalid username or password");
//   } )
// })


app.get("/bank", (req, res) => {
  if (typeof req.session.user != 'undefined') {
    res.send(`${req.session.user.userid}님 자산 현황`);
  } else {
    res.send("로그인부터 해주세요");
  }
});

////// cookie test
const cookieparser = require('cookie-parser');
const { log } = require("console");

// 암호화 ->  hash 값으로 넘겨주면 된다. - 아무 문자열이나 되기 때문이다.
app.use(cookieparser('암호화키'));

/** 
 * 쿠키 암호화
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



// app.get('/session', (req,res) => {
//   if(isNaN(req.session.milk)){
//     req.session.milk = 0;
//   }

//   req.session.milk += 1000;
//   res.send(`session : ${req.session.milk}원`);
// })




