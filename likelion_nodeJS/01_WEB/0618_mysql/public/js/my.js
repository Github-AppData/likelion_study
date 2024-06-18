testBtn.addEventListener('click', async function () {
    // 서버로부터 데이터 fetch
    let resObj = await fetch('/list'); // response 객체가 올 때까지 기다림
    let data = await resObj.json(); // 모든 정보를 JSON으로 변환된 정보만 추출

    try{
    // 테이블 데이터 표시를 위한 HTML 문자열 생성
    let displayData = 
    `<thead>
        <tr>
            <th>id</th>
            <th>title</th>
            <th>writer</th>
            <th>created</th>
        </tr>
    </thead>
    <tbody>`;

    data.forEach((item, index) => {
        displayData += 
        `<tr>
            <td>${item.id}</td>
            <td><a href='/boardDetail/${item.id}'>${item.title}</a></td>
            <td>${item.writer}</td>
            <td>${item.created}</td>
        </tr>`;
    });

    displayData += `</tbody>`;
    document.getElementById("datatablesSimple").innerHTML = displayData;

    } catch(err){
        alert('게시물 조회 실패');
    }   
    // 링크가 작동하도록 해야 합니다.
});
