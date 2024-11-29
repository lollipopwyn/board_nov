const express = require('express');
const router = express.Router();

//연결 원하는 컨트롤러 호출
const { getBoardContent } = require('../controllers/boardController');
const { getBoardContentById } = require('../controllers/boardController');

// 응답 반응할 url와 컨트롤러 연결
router.get('/boards', getBoardContent);
router.get('/boards/:boardId', getBoardContentById); //파아미터는 "/:id" 이런 형태로 받아와야 함

module.exports = router; //모듈 내보내기
