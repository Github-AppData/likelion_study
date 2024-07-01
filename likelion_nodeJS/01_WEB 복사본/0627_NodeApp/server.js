const setup = require("./db_setup");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const session = require("express-session");
app.use(session({
    secret: "암호화키",
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({extended:true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser("암호화 키"));


app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// 라우팅이 아니다. 
// "/routes/account"에 / 로 들어오는 모든 요청을 받아들인다. 그런 뜻이다.
app.use("/", require("./routes/account"));

app.listen(8080, async() => {
    await setup(); // 디비 셋업 
    console.log("8080 server ready..!");
});




