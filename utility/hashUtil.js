const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hashPassword(password){
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password,salt);
    return hash;
}

async function verifyPassword(password, hashedPassword){
    return await bcrypt.compare(password,hashedPassword);
}

module.exports = { hashPassword, verifyPassword }