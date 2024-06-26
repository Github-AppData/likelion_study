const fs = require("fs");
const https = require("https");

const express = require('express');
const app = express();

// SSL 인증서와 키 파일 읽기
const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  };
  

const mongoclient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://admin:1234@cluster0.v0csnvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let mydb;

mongoclient
  .connect(url)
  .then(async(client) => {

    // mongoDB connect
    console.log("MongoDB Okay!");
    mydb = await client.db('myboard');

    // HTTPS Server generate
    https.createServer(options, app).listen(443, () => {
        console.log("HTTPS Server running on port 443");
    });

  })
  .catch((err) => {
    console.log(err);
  })

///////////// session
const session = require('express-session');

// session 미들웨어 설정
app.use(session({
    secret: '암호화 키', // 세션 ID 즉, 쿠키를 암호화 하겠다.
    resave: false, // 매번 새로운 세션 식별자의 발급여부를 결정 (일반적으로 false를 설정 - 새로운 세션을 발급하기 때문에 이전의 것이 다 무용지물이 된다.)
    saveUninitialized: false // 세션에 아무 값이 없을 때도, 발급을 받을 것이냐?
}))

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

////// facebook 인증 - B2B
const FacebookStrategy = require("passport-facebook");

app.get("/facebook", passport.authenticate("facebook"));

app.get("/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect : "/fail"
  }),
  (req, res) => {}
);


// 개발자로서 내가 B2B를 하겠다.
passport.use(new FacebookStrategy(
  {
    clientID: "1969202910159451",
      clientSecret: "4b139bd834d072dd9d37616f8d688b2a",
      callbackURL: "/facebook/callback", // 성공하면 이 URL로 들어간다
      // accessToken, refreshToken -> JWT 토큰이다
  }, 
  // profile.id, displayName - facebook이 주는 데이터
  function (accessToken, refreshToken, profile, done) {
    console.log("2", profile);
    var authkey = "facebook" + profile.id; 
    var authName = profile.displayName;

    mydb.collection('account')
    .findOne({ userkey: authkey })
    .then(async (result) => {
      console.log("3", result);
      if (result != null) {
        console.log("페이스북 사용자를 우리 DB에서 찾았음");
        done(null, result); // callback
      } else {
        console.log("3-1 페이스북 사용자를 우리 DB에서 못찾았음");

        mydb
        .collection("account")
        .insertOne({
          userkey: authkey,
          userid: authName,
        })
        .then((insertResult) => {
          if (insertResult != null) {
            console.log("3-2 페이스북 사용자를 우리 DB에 저장 완료");
            mydb
            .collection("account")
            .findOne({ userkey: authkey })
            .then((result2) => {
              if (result2 != null) {
                console.log("3-3 페이스북 사용자를 우리 DB에 저장 후 다시 찾았음");
                done(null, result2); // 다음 흐름으로 넘어가라 
              }
            })
            .catch((err) => {
              console.log(err);
            });
          }
            
        })
        .catch((err) => {
          console.log(err);
        });
        }
      })
      .catch((err) => {
        console.log(err);
        //done(null, false, err);
      });  
    }
  )
);


passport.serializeUser((user, done) => {
  console.log("4 serializeUser");
  console.log(user);
  done(null, user.userid);
})

passport.deserializeUser((user, done) => {
  console.log("5 deserializeUser");
  mydb.collection('account')
  .findOne({userkey:user.userkey})
  .then((result) => {
    console.log(result);
    done(null, result);
  })
  .catch((err) => {
    console.log(err);
  });
})


/// 
app.get("/", (req, res) => {
  console.log("/ 요청");
  try {
    console.log("1", req.session.passport);
    if (typeof req.session.passport != undefined && req.session.passport.user) {
      res.render("index.ejs", { user: req.session.passport });
    } else {
      res.render("index.ejs", { user: null });
    }
  } catch (err) {
    console.log('1-1');
    res.render("index.ejs", { user: null });
  }
});

///////// login
app.get("/login", (req, res) => {
  console.log("/login", req.session.passport);
  res.render("login.ejs");
});
