let numbers = [1, 2, 3, 4, 5];

// 배열 길이 확인
console.log(numbers.length); // 5

// 배열 끝에 요소 추가: push()
numbers.push(6);
console.log(numbers); // [1, 2, 3, 4, 5, 6]

// 배열 끝 요소 제거: pop()
let lastNumber = numbers.pop();
console.log(lastNumber); // 6
console.log(numbers); // [1, 2, 3, 4, 5]

// 배열의 처음에 요소 추가: unshift()
numbers.unshift(0);
console.log(numbers); // [0, 1, 2, 3, 4, 5]

// 배열의 첫 요소 제거: shift()
let firstNumber = numbers.shift();
console.log(firstNumber); // 0
console.log(numbers); // [1, 2, 3, 4, 5]
