const speakeasy = require('speakeasy');

var verified = speakeasy.totp.verify({
    secret: 'T0ZuNC^0ef#D.8{Cd:IDPBkuZ<6(k>X&',
    encoding: 'ascii',
    token: '636939'
});

console.log(verified);