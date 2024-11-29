// 데이터베이스 연결
const {Pool} = require ('pg');

// .env 파일로 사용자 설정
require ('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
})

module.exports = pool;  //모듈 내보내기