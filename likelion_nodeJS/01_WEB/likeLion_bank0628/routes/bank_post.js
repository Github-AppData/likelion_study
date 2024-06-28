const router = require("express").Router();
const setup = require("../db_setup");
const mongoose = require("mongoose");

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

router.post("/list/update", async(req, res) => {
    try {
        const { mongodb, ObjectId } = await setup();
        // 관리자만 수정 가능하게 만들어야 한다. - 차라리 관리자만 display할까
        // session에 있는 정보와 
        mongodb.collection("user").findOne({userid: req.session.userid})
        .then(async(result) => {
            console.log("req.session.userpw : ", req.session.userid);
            console.log("req.session.userpw : ", req.session.userpw);
                
        }).catch((err) => {
            return res.status(401).send("Unauthorized: User not found");
        })

       

        
    } catch (error) {
        res.status(500).send(error);
        console.log("error:",error);
        
    }
})

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