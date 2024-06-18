document.addEventListener("DOMContentLoaded", async function() {

    let resObj = await fetch('/boardDetailList');
    let data = await resObj.json();

    let a, b, c, d;
    console.log("board.js : " + data);

    data.forEach(item => {
        a = item.created;
        b = item.title;
        c = item.writer;
        d = item.content;
    });


   
    // 페이지 요소에 window.pageLoad 데이터를 사용하여 업데이트
    document.getElementById('post-title').innerText = b;
    document.getElementById('post-writer').innerText = c;
    document.getElementById('post-date').innerText = a;
    document.getElementById('post-content').innerHTML = d;
});
