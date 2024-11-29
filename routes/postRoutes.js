const express = require('express');
const router = express.Router();

//연결 원하는 컨트롤러 호출
const {postBoard} = require('../controllers/boardController');

// 응답 반응할 url와 컨트롤러 연결
router.post('/boards', postBoard);          //게시글 생성

module.exports = router;   //모듈 내보내기