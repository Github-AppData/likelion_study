const router = require("express").Router();
const setup = require('../db_setup');
const bcrypt = require("bcrypt");

const saltRounds = 10;

// 회원가입 화면
router.get("/account/enter", (req, res) => {
  res.render("enter.ejs");
});

// 회원가입 처리
router.post("/account/save", async (req, res) => {
  const { mongodb, mysqldb } = await setup();

  console.log("req.body.userid:", req.body.userid);
  mongodb.collection('account').findOne({ userid: req.body.userid })
    .then(async (result) => {
      if (result) {
        console.log("aadsasddas");
        res.send("No");
      } else {
        const hashedPassword = await bcrypt.hash(req.body.userpw, saltRounds);
        mongodb.collection('account').insertOne({
          userid: req.body.userid,
          userpw: hashedPassword,
          username: req.body.username
        }).then((result) => {
          console.log("회원가입 성공이다.");
          res.render("index.ejs", { user: req.body });
        }).catch((err) => {
          console.error(err);
          res.status(500).send("회원가입 중 오류가 발생했습니다.");
        });
      }
    }).catch((err) => {
      console.error(err);
      res.status(500).send("아이디 중복 검사 중 오류가 발생했습니다.");
    });
});

// 비밀번호 검증 함수
async function verifyPassword(plainPassword, hash) {
  try {
    const match = await bcrypt.compare(plainPassword, hash);
    console.log("Password match:", match);
    return match;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// 로그인 처리
router.post("/account/login", async (req, res) => {
  console.log(req.body);
  const { mongodb, mysqldb } = await setup();
  try {
    const result = await mongodb.collection("account").findOne({ userid: req.body.userid });
    if (!result) {
      return res.status(401).send("Invalid userid");
    }

    const isMatch = await verifyPassword(req.body.userpw, result.userpw);
    if (isMatch) {
      req.body.userpw = result.userpw;
      req.session.user = req.body;
      console.log(req.session.user);

      res.cookie("uid", req.body.userid);
      return res.render("index.ejs", { user: req.session.user });
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("로그인 중 오류가 발생했습니다.");
  }
});

router.get('/cookie', (req, res) => {
  let milk = parseInt(req.signedCookies.milk) + 1000;

  if (isNaN(milk)) {
    milk = 0;
  }

  res.cookie('milk', milk, { signed: true });
  res.cookie('name', '김태욱', { signed: true });
  res.cookie('age', '23', { signed: true });

  res.send("product: " + req.signedCookies.milk + " " + "name: " + req.signedCookies.name + " " + "age: " + req.signedCookies.age);
});

router.get("/cookie-destroy", (req, res) => {
  req.session.destroy();
  res.send("cookie-destroy");
});

// 로그아웃 처리
router.get("/account/logout", (req, res) => {
  console.log(req.body);

  req.session.destroy((err) => {
    if (err) {
      console.error("세션 파괴 중 오류 발생:", err);
      return res.status(500).send("서버 오류로 로그아웃 실패");
    } else {
      res.render("index.ejs");
    }
  });
});

// 반드시 있어야 한다. - 방출
module.exports = router;
