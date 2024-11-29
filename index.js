// 필요한 패키지 및 모듈 호출
require('dotenv').config(); //.env파일 호출
const express = require('express'); //express 서버 호출
const cors = require('cors');
const PORT = '8008';

const app = express(); //express서버를 사용하기 위해 app변수에 할당

app.use(express.json()); //express서버에 json메소드 사용 선언

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
); //다른 도메인의 클라이언트에서 API를 호출할 수 있도록 CORS를 설정

// 서버 정상 작동 브라우저에서 확인
app.get('/', (req, res) => {
  res.send('SERVER CONNECT');
});

// 라우트 연결
app.use(require('./routes/postRoutes'));
app.use(require('./routes/getRoutes'));
app.use(require('./routes/patchRoutes'));
app.use(require('./routes/deleteRoutes'));

// 서버 정상 작동 콘솔로 확인
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost"${PORT}`);
});
