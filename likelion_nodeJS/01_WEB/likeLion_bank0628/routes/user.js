const router =require("express").Router();
const sha=require('sha256');
const setup=require('../db_setup');
const bcrypt=require('bcrypt');

// 회원가입 처리
router.post('/user/save',async(req,res)=>{
    const{mongodb}=await setup();
    req.body.role = 'user';
    req.body.account = 0;
    mongodb.collection('user')
        .findOne({userid:req.body.userid})
        .then(result=>{
            if (result){
                res.status(400).json({ msg: '중복된 아이디가 있습니다.' });
            }else{
                // 비밀번호 암호화
                const salt = bcrypt.genSaltSync(10);
                req.body.userpw = bcrypt.hashSync(req.body.userpw, salt);
                mongodb.collection('user')
                    .insertOne(req.body)
                    .then(result=>{
                        if(result){
                            console.log('회원가입 성공');
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

// 로그인 처리
router.post('/user/login',async(req,res)=>{
    const{mongodb}=await setup();
    // 세션에 패스워드를 저장하는 거는 안 좋은 습관이다.
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    console.log("userid : ", userid);
    console.log("userpw : ", userpw);
    mongodb.collection('user')
        .findOne({userid:req.body.userid})
        .then(result=>{
            if(result){
                // 암호화된 비밀번호 비교
                bcrypt.compare(req.body.userpw,result.userpw,(err,isMatch)=>{
                    if (err) {
                        console.log(err);
                        res.status(500).json({ msg: '로그인 실패' });
                    } else if (isMatch) {
                        req.session.userid = userid; 
                        req.session.userpw = userpw; 
                        console.log("req.session.userid : ", req.session.userid);
                        console.log("req.session.userpw : ", req.session.userpw);
                        // 세션에 사용자 ID 저장
                        // session에 저장할 정보
                        // req.session.user = req.body.userid;
                        res.cookie('uid', req.body.userid);
                        // console.log("req.session.user : ", req.session.user);    // 삭제
                        //로그인 완료 시 /로 이동
                        res.redirect('/');
                    } else {
                        res.status(400).json({ msg: '로그인 실패' });
                    }
                });
            } else{
                res.status(400).json({ msg: '로그인 실패' });
            }
        })
        .catch(err=>{
            res.status(500).json({ msg: '로그인 실패' });
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
        //   res.render("index.ejs");
            res.send("/user/logout");
        }
      });
});

module.exports=router;
