// friend8_cryptoDemo.js
// Author: Meera Iyer
// Demo: Hashing a password using Node.js crypto module.

const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

const rawPass = 'supersecret';
console.log('Raw password:', rawPass);
console.log('SHA256 hashed:', hashPassword(rawPass));

