const express = require('express');
const router = express.Router();

const { deleteBoardContentById } = require('../controllers/boardController');

router.delete('/boards/:boardId', deleteBoardContentById);

module.exports = router;
