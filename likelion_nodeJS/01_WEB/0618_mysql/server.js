const mysql = require("mysql");
const conn = mysql.createConnection({
    host: "localhost", // ip를 주어야 한다. - 클라우드 ip면 그거
    user: "root",
    password: "2a1s4d3f#",
    database: "likeLionDB",
});

conn.connect();
// console.log(conn);

const express = require('express');
const app = express(); // 얘가 다 막는다. http 서버를...

app.use(express.static("public")); // 미들웨어 설정 - 다이렉트로 찾도록

app.listen(8080, function(){
    console.log("8080 server ready..");
}); // httpserver이다. - listen() 있는 거 보면


// 콜백 메서드가 두개여서 빙빙 돈다. -> 응답이 오지 않는다. ()
app.get('/list', (req,res) => {
    const rows = conn.query("select * from post", function(err, rows,  field){ // query는 비 동기 메서드
        // 이 내에서 코딩 해야한다.
    
        if(err) {
            console.log(err);
        } else { 
            console.log(rows); // - 이걸 브라우저에 보내고 싶다.  
            res.send(rows); // 응답 처리결과 제공 - 하지만, 이것은 동기 방식의 코드이다. 
        }
        
    });

})



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// id 전역변수 설정
let id = 0;

app.get('/boardDetail/:id', (req, res) => {
    id = req.params.id;
    console.log(`Received ID: ${id}`); // 콘솔에 ID 출력

    res.sendFile(__dirname + "/public/boardDetail.html");
});

app.get('/boardDetailList', (req, res) => {
    const rows = conn.query("SELECT * FROM post WHERE id = ?", [id], (err, rows,  field) => { // query는 비 동기 메서드
        // 이 내에서 코딩 해야한다.

        console.log(`Received ID: ${id}`); // 콘솔에 ID 출력
    
        if (err) {
            console.error(err);
            res.status(500).send('Database query error');
            return;
        } else { 
            console.log(rows); // - 이걸 브라우저에 보내고 싶다.  
            res.send(rows); // 응답 처리결과 제공 - 하지만, 이것은 동기 방식의 코드이다. 
        }
        
    });
});



