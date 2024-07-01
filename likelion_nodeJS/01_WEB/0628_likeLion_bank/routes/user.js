const router =require("express").Router();
const sha=require('sha256');
const setup=require('../db_setup');
const bcrypt=require('bcrypt');
const saltRounds = 10; // 솔트 갯수 지정

// 회원가입 처리
router.post('/user/save',async(req,res)=>{
    const{mongodb}=await setup();
    
    // req.body.role = 'user';
    // req.body.account = 0;
    mongodb.collection('user')
        .findOne({userid:req.body.userid})
        .then(async result=>{
            if (result){
                res.status(400).json({ msg: '중복된 아이디가 있습니다.' });
            }else{
                // 비밀번호 암호화
                // 비동기 험수는 반드시 await을 해야한다. 아니면 작업이 마치기도 전에 흐름이 넘어가기 때문이다.
                const hashedPassword = await bcrypt.hash(req.body.userpw, saltRounds);
                console.log(" req.body.userpw : ",  req.body.userpw);
                mongodb.collection('user')
                    .insertOne({
                        userpw:hashedPassword,
                        userid:req.body.userid,
                        email: req.body.email,
                        birthday: req.body.birthday,
                        name: req.body.name
                    })
                    .then(result=>{
                        if(result){
                            console.log('result : ', result);
                            res.redirect('/');
                        } else {
                            console.log('회원가입 실패')
                            res.status(500).json({ msg: '회원가입 실패' });
                        }
                    })
            }
        })
        .catch(err=>{
            res.status(500).json({ msg: '회원가입 실패' });
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
    }
  }

// 로그인 처리
router.post('/user/login',async(req,res)=>{
    const{mongodb}=await setup();
    // 세션에 패스워드를 저장하는 거는 안 좋은 습관이다.

    // 아이디 확인
    mongodb.collection('user')
        .findOne({userid:req.body.userid})
        .then(async result=>{
            // 아이디가 있으면, 비밀번호를 비교 -> verifypassword
           // 세션에 아이디만 저장하자
           const isMatch = await verifyPassword(req.body.userpw, result.userpw);
        
           if(isMatch){
               req.session.userid = req.body.userid;
               console.log("req.session.userid : ", req.session.userid);

               res.cookie("uid", req.session.userid); // 브라우저에 표시될 userid 세션
               res.render("mainPage.ejs", {data:req.session.userid});
           }else {
            res.status(403).send("Unthorized");
           }
        })
        .catch(err=>{
            res.status(500).json({ msg: '로그인을 실패 했습니다.' });
        });
});

//로그아웃 처리
router.get('/user/logout',(req,res)=>{
    console.log("adsad");
    req.session.destroy((err) => {
        if (err) {
          console.error("세션 파괴 중 오류 발생:", err);
          return res.status(500).send("서버 오류로 로그아웃 실패");
        } else {
          res.render("mainPage.ejs");
            // res.send("/user/logout");
        }
      });
});

module.exports=router;
