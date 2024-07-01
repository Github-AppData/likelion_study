const router = require('express').Router();

// signup
router.post('/signup', async(req,res) => { 

    console.log(req.body.userpw);
  
    // 비밀번호 해쉬화
    const hashedPassword = await bcrypt.hash(req.body.userpw, saltRounds);
    
    mydb.collection('account')
    .insertOne({
      userid: req.body.userid,
      userpw: hashedPassword,
      usergroup: req.body.usergroup,
      useremail: req.body.useremail
    }).then((result) => {
      console.log("회원가입 성공입니다.")
      // res.redirect("/"); -> redirect면 데이터를 못 가지고 간다.
      res.render("index.ejs", {user : req.body}); // 
    });
   
  }) 

  // login
  router.get('/login', (req,res) => {

    // 세션에 유저가 있는가
    if(req.session.user) {
      console.log("이미 로그인 되어 있습니다.");
      res.render("index.ejs", {user : req.session.user}); // 전달 해 준다.
    } else {
      res.render("login.ejs"); // 다시 로그인 해라
    }
  })

  router.get("/logout", (req, res) => {
    console.log("로그아웃");
  
    // 세션 파괴 후 콜백에서 리디렉션
    req.session.destroy((err) => {
      if (err) {
        console.error("세션 파괴 중 오류 발생:", err);
        res.status(500).send("서버 오류로 로그아웃 실패");
      } else {
        res.redirect("/login");
      }
    });
  });

  router.get("/signup", (req, res) => {
    res.render("signup.ejs");
  })
  
// 배출해야 한다. 
module.exports = router;