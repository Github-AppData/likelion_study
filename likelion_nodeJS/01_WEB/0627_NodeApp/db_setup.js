const dotenv = require("dotenv").config();
// 라우터 분리 - 디비
const { MongoClient, ObjectId } = require('mongodb');
const mysql = require("mysql2");

let mongodb;
let mysqldb;

// 비동기적 처리
const setup = async () => {
    // 만약 디비가 있다면, 바로 리턴한다. 
    if(mongodb && mysqldb){
        return {mongodb, mysqldb};
    }

    try {
        const mongodbUrl = process.env.MONGODB_URL;
        const mongoConn = await MongoClient.connect(mongodbUrl, {
            useNewUrlParser : true,
            useUnifiedTopology: true
        });

        mongodb = await mongoConn.db(process.env.MONGODB_DB)
        console.log("MongoDB Connected!");

        mysqldb = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "2a1s4d3f#",
            database: "likeLionDB"
        })

        mysqldb.connect();
        console.log("MySQL2 Connected!");

        return {mongodb, mysqldb};
    } catch (err) {
        console.error("DB 접속 실패", err);
        throw err; // server 가동을 아예 중지하는 throw 
    }
};

module.exports = setup;
