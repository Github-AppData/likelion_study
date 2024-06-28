const pageRouter = require("express").Router();
const setup = require("../db_setup");
const ObjId = require("mongodb").ObjectId;

pageRouter.get("/managing/mypage", async(req, res) => {
    // basic setting
    console.log(req.session.user);  // a
    console.log(req.body);      // { }
    const { mongodb } = await setup();

    let account;
    let products;

    //get user's account
    mongodb.collection("user").findOne({userid:req.session.user})
    .then(result =>{
        console.log('userData : ',result);
        account = result;

        //get user's signed up products
        mongodb.collection("product").find({userid:req.session.user})
        .then(result =>{
            console.log('signed up products Data',result);
            let product_id = result.bank_post_id;

            //get products' data
            mongodb.collection("bank_post").find({_id:product_id})
            .then(result=>{
                console.log('products Data', result);
                let products_data = result

                //rendering
                res.render('mypage.ejs',{
                    account:account,
                    data:products_data
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send();
    });
    // // check session
    // if(typeof req.session.user!=='undefined' && req.session.user){
    // }
    // else{
    //     res.send('님 로그인 안함');
    // }
});

pageRouter.get('/managing/getUsers',async(req,res)=>{
    // basic setting
    console.log(req.session.user);
    console.log(req.body);
    const { mongodb } = await setup();

    mongodb.collection("user").find().toArray()
    .then(result =>{
        console.log('users : ',result);
        res.render('userlist.ejs',{data:result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send();
    });

});

// function getCurrentDate() {
//     let now = new Date();
//     let year = now.getFullYear();
//     let month = now.getMonth() + 1; // getMonth() returns month from 0-11, so add 1
//     let day = now.getDate();
//     let dateString = year + '-' + month  + '-' + day;

//     return dateString;
// }
function list(mongodb, req, res){
    mongodb
        .collection("back_post")
        .find()
        .toArray()
        .then((result) => {
            console.log(result);
            res.render("productlist.ejs", { data: result });
        });
}
function dateNow(){
    var today = new Date();
  
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
  
    var dateString = year + '-' + month  + '-' + day;
  
    return dateString;
}
pageRouter.get('/managing/getProducts',async(req,res)=>{
    // basic setting
    console.log(req.session.user);
    console.log(req.body);
    const { mongodb } = await setup();

    list(mongodb, req,res);
});
pageRouter.post('/managing/postProduct', async(req,res)=>{
    // basic setting
    console.log(req.session.user);
    console.log(req.body);
    const { mongodb } = await setup();

    mongodb.collection("back_post")
    .insertOne({title: req.body.title, content:req.body.content, interest:req.body.interest, c_date:dateNow(), expiration:req.body.expiration })
    .then(result =>{
        console.log("데이터 추가 성공");
        list(mongodb,req,res);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send();
    });
});
// pageRouter.post('/managing/deleteProduct', async(req,res)=>{
//     // basic setting
//     console.log(req.session.user);
//     console.log(req.body);
//     const { mongodb } = await setup();

//     mongodb.collection("back_post")
//     .deleteOne({})
//     .then(result =>{
//         console.log("데이터 삭제 성공");
//     })
//     .catch((err) => {
//         console.log(err);
//         res.status(500).send();
//     });
// });
pageRouter.post('/managing/deleteProduct', async(req, res) => {
    const { mongodb } = await setup();
    const ids = req.body.ids
    const objectIds = ids.map(id => new ObjId(id));
    console.log(`Request to delete lands with IDs: ${ids}`);
    console.log(objectIds);

    try {
        mongodb.collection("back_post").deleteMany({ _id: { $in: objectIds } })
        .then(result=>{
            console.log(result);
            console.log('delete success');
        });
    } catch (err) {
        console.error(err);
    }
});
pageRouter.post('/managing/updateProduct', async(req,res)=>{
    // basic setting
    console.log(req.session.user);
    console.log(req.body);
    const { mongodb } = await setup();

    mongodb.collection("back_post")
    .updateOne({})
    .then(result =>{
        console.log("데이터 수정 성공");
        list(mongodb,req,res);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send();
    });
});

module.exports = pageRouter;