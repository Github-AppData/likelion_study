let numbers = [1, 2, 3, 4, 5];

// 배열 요소를 반복 처리: forEach()
numbers.forEach(function(number) {
    console.log(number * 2); // 2, 4, 6, 8, 10
});

// 배열에서 특정 조건을 만족하는 첫 번째 요소 찾기: find()
let foundNumber = numbers.find(function(number) {
    return number > 3;
});

console.log(foundNumber); // 4

let letters = ["b", "c", "a"];
let numbers2 = [3, 1, 2];

// 배열 정렬: sort()
letters.sort();
console.log(letters); // ["a", "b", "c"]