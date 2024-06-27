const router = require('express').Router();

// 
router.get("/list", function (req, res) {
    listen(req, res);
});
  
  
function listen(req, res){
    mydb.collection('post').find().toArray().then(result => {
      console.log(result);
      res.render('list.ejs', { data : result });
    })
}

// enter 요청에 대한 처리 루틴
router.get('/enter', function(req, res){
    res.render('enter.ejs');
  });
  
  // save 요청에 대한 post 방식의 처리 루틴
router.post('/save', function(req, res){
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

router.post("/delete", function (req, res) {
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

  // revise Page - CSR (라우팅은 하지만, DB는 가지 않는...)
router.post("/revise", (req, res) => {
    console.log(req.body);
    res.render('revise.ejs', {data:req.body});

  });

// 배출해야 한다. 
module.exports = router;