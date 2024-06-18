// express 서버를 직접 만들어서 서버를 실행시키는 것.
// 우리가 흔히 IDE에서 쓰는 서버를 하드코딩 한 것이다. 

// node.js의 장 단점

// 장점은 비동기이다. - 빠르다. 
// 단점은 단일 쓰레드이다. - 너무 많은 양의 것을 한 번에 처리할 수 없다.

const express = require('express');
const app = express();

app.listen(8081, function() {
    console.log("포트 8080으로 서버 대기 중"); // 서버가 돌아가는 것을 내가 가시적으로 확인하기 위함이다.
    
})

app.get('/book', function(req,res) { // 요청에 맞는 
    res.send("도서 목록 관련 페이지입니다.");
    
})

app.get('/', function(req,res) { // 요청에 맞는 
    res.send("<h1>홈입니다.</h1>");
})

/* 위의 방법처럼 html를 하드코딩할 수 없다. 그래서 sendFile을 보낸다. */

app.get('/complete', function(req, res) {
    res.sendFile(__dirname + '/complete.html');

    
});

app.get('/navbar', function(req, res) {
    res.sendFile(__dirname + '/navbar.html');

    
});


// const http = require("http");

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/html");
//     res.end("<h1>hello world</h1>");
// });

// server.listen(3000, "127.0.0.1", () => {
//     console.log("server ready....");
// });

