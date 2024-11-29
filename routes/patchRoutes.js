const express = require('express');
const router = express.Router();

//필요한 컨트롤러 선언
const { patchBoardContentById } = require('../controllers/boardController');

//api url에 정의해서 컨트롤러에 연결
router.patch('/boards/:boardId', patchBoardContentById);

module.exports = router;
