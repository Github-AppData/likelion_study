const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Secret Key 생성
var secret = speakeasy.generateSecret({
    name: "onestone-test"
});
console.log(secret);

// 생성한 Secret Key를 기반으로 QR 코드 생성(URL)
qrcode.toDataURL(secret.otpauth_url, function(err, data) {
    console.log(data);
});