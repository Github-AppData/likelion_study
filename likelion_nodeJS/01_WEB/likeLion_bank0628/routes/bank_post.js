const router = require("express").Router();
const setup = require("../db_setup");
const mongoose = require("mongoose");
const path = require('path');


// 
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { title } = require("process");


function dateNow(){
    var today = new Date();
  
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
  
    var dateString = year + '-' + month  + '-' + day;
  
    return dateString;
  }

  async function verifyPassword(plainPassword, hash) {
    try {
      const match = await bcrypt.compare(plainPassword, hash);
      console.log("Password match:", match);
      return match;
    } catch (error) {
      console.error(error);
    }
  }




// 관리자 계정 생성 및 Secret Key 생성
// router.get("/qrcode", async (req,res) => {

//   // 여기서 google Authorizer를 쓴다.       
//    auth_secret = speakeasy.generateSecret({
//     name: "Authorizer-authReal"
//   });
//   console.log("auth_secret : ", auth_secret);

//   // 생성한 Secret Key를 기반으로 QR 코드 생성(URL) - 2
//   console.log("auth_secret.otpauth_url : ", auth_secret.otpauth_url);
//   qrcode.toDataURL(auth_secret.otpauth_url, function(err, data) {
//     if(err){
//       console.error('Error generating QR code:', err);
//       return res.status(500).send('Error generating QR code');
//     }
//       console.log("data : ", data);

//       const filePath = path.join(__dirname, '..', 'test-qrcode.html');
//       // res.sendFile(filePath);
//       res.render("test-qrcode.ejs", {qrcode_data: data});
//       // res.render("test-qrcode.ejs");
//   });

// })

/** 관리자 2차 인증 url */
router.get("/verify-auth", async (req,res) => {
  res.render("test-qrcode.ejs");
})

router.post("/verify-auth", (req, res) => {

  const code = req.body.code;
  console.log("code : ", code);
  // ajax를 통해 전달받은 데이터를 token에다가 넣어야 한다.
  var verified = speakeasy.totp.verify({
    secret: ".1z2BJKTIws1sgsUxwzaRu[3@?>tmo$@", // qrcode ascii를 요기다가 넣어주면 된다.
    encoding: 'ascii',
    token: code
  });

  console.log("verified : ",verified);

  if(verified){
    res.json({ msg: 'Verification successful' });
  } else {
    res.status(400).json({ msg: 'Verification failed' });
  }
})


router.post("/list/update", async(req, res) => {
    // 이미 인증이 다 된 상태이다 - 관리자 인증까지 다
    // 그래서 updateOne만 해주면 된다.
    const { mongodb, ObjectId } = await setup();
    const objId = {_id: new ObjectId(req.body._id)};

    mongodb.collection("bank_post").updateOne(objId, {
        $set: {
          title:req.body.title,
          expiration:req.body.expiration,
          interest:req.body.interest,
          content:req.body.content,
          c_date:dateNow(),
        }
      }).then((result) => {
        // redirect는 모두 forward로 바꿔야 한다.
        /**
         * function listen(req, res){
            mydb.collection('post').find().toArray().then(result => {
              console.log(result);
              res.render('list.ejs', { data : result });
            })
          }
         */
        res.redirect("/list");
      }).catch((err) => {
        console.log("err : ", err);
      })
});

router.post("/list/delete", async(req, res) => {
    console.log("req.session.userpw : ", req.session.userpw);
    console.log("1");
    const { mongodb, ObjectId } = await setup();
    console.log("req.session.userid : ", req.session.userid);

    // 관리자인지
    mongodb.collection("user").findOne({userid: req.session.userid})
    .then((result) => {
        console.log("/list/delete Success !");
        
        console.log("req.session.userpw : ", req.session.userid);
        console.log("req.session.userpw : ", req.session.userpw);
        
    }).catch((err) => {
        return res.status(401).send("Unauthorized: User not found");
    })
    
    
})

router.get("/list", async (req, res) => {
// DB
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
    const { mongodb } = await setup();

    try {
        const result = await mongodb
        .collection("bank_post")
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
        const collection = mongodb.collection("bank_post");
        const total = await collection.countDocuments(); // 총 문서 개수

        if (!result) {
            res.status(404).send("Post");
          }
          console.log("result : ", result);
      
          res.render("list.ejs", {
            totalPages: Math.ceil(total / limit), // 총 페이지 수 계산
            currentPage: page, // 현재 페이지 번호
            data: result, // 페이지네이션된 데이터
            limit: limit, // 페이지 당 문서 수
          });
        
    } catch (error) {
        console.log("error:", error);
        return res.status(401).send("Unauthorized: User not found");
    }
})



// 반드시 있어야 한다. - 방출
module.exports = router;