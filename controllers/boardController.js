const db = require('../database/database');

//======= 게시글 작성  =======
const postBoard = async (req, res) => {
  const { board_title, board_content } = req.body; //클라이언트로부터 게시글 제목과 내용을 꺼내오기

  //필수 입력 값 검증
  if (!board_title || !board_content) {
    return res.status(400).json({ message: '필수 여건이 충족되지 않았습니다' });
  }

  try {
    const query = `
    INSERT INTO board (board_title, board_content, board_created_at, board_status)
    VALUES ($1, $2, CURRENT_TIMESTAMP, true)
    RETURNING 
        board_id,
        board_title,
        board_content,
        TO_CHAR(board_created_at, 'YYYY.MM.DD (HH24:MI)') AS board_created_at,board_status
      ; 
    `; // 게시글 데이터를 테이블에 삽입하는 쿼리.
    const values = [board_title, board_content]; // SQL 쿼리에 전달할 파라미터 배열
    const result = await db.query(query, values); // 데이터베이스에 쿼리 실행 및 결과 저장

    res.status(201).json({
      message: '게시글 작성 성공했습니다.',
      data: result.rows[0],
    });
  } catch (error) {
    console.log('게시글 생성 오류');
    res.status(500).json({ message: 'Failed to create post.' }); // 서버 오류 상태 코드와 메시지 반환
  }
};

// =======  전체 게시글 조회   =======
const getBoardContent = async (req, res) => {
  try {
    const query = `
            SELECT 
                board_id,
                board_title,
                board_content,
                TO_CHAR (board_created_at, 'YYYY.MM.DD(HH24:MI)') AS board_created_at
            FROM
                board
            WHERE
                board_status = 'true';         
        `;
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '조회된 게시글이 없습니다.',
      });
    }

    res.status(200).json({
      message: '게시판이 정상적으로 조회됐습니다.',
      data: result.rows,
    });
  } catch (error) {
    console.log('서버 오류 발생:', error);

    return res.status(500).json({
      message: '서버 오류 발생',
    });
  }
};

// =======  개별 게시글 조회(boardId 기반)   =======
const getBoardContentById = async (req, res) => {
  try {
    const { boardId } = req.params; //요청 URL에서 게시글 ID를 추출하여 boardId 변수에 할당

    const query = `
            SELECT
                board_id,
                board_title,
                board_content,
                TO_CHAR(board_created_at, 'YYYY.MM.DD(HH24:MI)') AS board_created_at          -- 컬럼 값은 정확하게 작성
            FROM
                board
            WHERE
                board_id = $1                   -- 동적 쿼리 생성, $1에 [boardId] 배열의 첫 번째 값 채움
                AND board_status = 'true';
        `;

    //데이터베이스에 쿼리를 실행하고 결과를 result 변수에 저장
    const result = await db.query(query, [boardId]); // 추출한 게시글 ID를 이용하여 해당 게시글을 조회하는 쿼리를 실행

    if (result.rows.length > 0) {
      // result에서 해당 게시글이 존재하면 다음 코드 실행
      return res.status(200).json({
        message: '해당 ID로 게시글이 성공적으로 조회됐습니다.',
        data: result.rows[0], // [0]은 첫 번째 행, 즉 조회된 게시글의 모든 정보를 의미
      });
    } else {
      return res.status(404).json({
        message: '조회한 ID의 게시글이 없습니다.',
      });
    }
  } catch (error) {
    console.log('서버 오류가 발생했습니다:', error);
    return res.status(500).json({
      message: '서버 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// =======  개별 게시글 수정(boardId 기반)   =======
const patchBoardContentById = async (req, res) => {
  try {
    // 3. 요청 URL에서 게시글 ID 추출
    const { boardId } = req.params;

    // 4. 요청 body에서 수정한 게시글 제목과 내용을 추출
    const { board_title, board_content } = req.body;

    // 5. 유효성 검사
    if (
      !board_title ||
      board_title.length < 5 ||
      board_title.length > 25 ||
      !board_content ||
      board_content.length < 1 ||
      board_content.length > 300
    ) {
      return res
        .status(400)
        .json({ message: '수정한 내용이 규정에 맞지 않습니다.' }); // 유효하지 않을 경우 에러 반환
    }

    // 6. 업데이트 쿼리 설정
    const query = `
            UPDATE board
            SET 
                board_title = $1,
                board_content = $2,
                board_change_at = CURRENT_TIMESTAMP
            WHERE board_id = $3 AND board_status = 'true'
            RETURNING 
            board_id,
            board_title,
            board_content,
            TO_CHAR(board_change_at, 'YYYY.MM.DD (HH24:MI)') AS board_change_at
            ;
        `;

    const values = [board_title, board_content, boardId]; // 쿼리에 전달할 값 설정

    // 데이터베이스에서 업데이트 실행
    const result = await db.query(query, values);

    // 7. 결과 반환
    if (result.rowCount === 0) {
      // 수정할 게시글이 없을 경우
      return res
        .status(404)
        .json({ message: '수정할 게시글을 찾을 수 없습니다.' });
    }

    // 수정 성공 시 성공 메시지 반환
    res.status(200).json({
      message: '해당 id로 게시글이 성공적으로 수정됐습니다.',
      data: result.rows[0],
    });
  } catch (error) {
    // 서버 내부 오류 처리
    console.error('Error updating board content:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// =======  개별 게시글 삭제(boardId 기반)   =======
const deleteBoardContentById = async (req, res) => {
  try {
    const { boardId } = req.params;
    const query = `
        UPDATE board
        SET
            board_status = 'false',
            board_delete_at = CURRENT_TIMESTAMP
        WHERE board_id = $1 AND board_status = true
        RETURNING 
            board_id,
            board_title,
            board_content,
            TO_CHAR(board_delete_at, 'YYYY.MM.DD (HH24:MI)') AS board_delete_at,
            board_status
            ;
      `;

    const values = [boardId];
    const result = await db.query(query, values);

    // 삭제 성공 시 메시지 반환
    res.status(200).json({
      message: `게시글 ID ${boardId}로 게시글이 성공적으로 삭제됐습니다.`,
      data: result.rows[0],
    });

    if (result.rowCount === 0) {
      // 삭제할 게시글이 없을 경우
      return res.status(404).json({
        message: '삭제할 게시글을 찾을 수 없습니다.',
      });
    }
  } catch (error) {
    // 서버 내부 오류 처리
    console.log('서버 오류 발생:', error);
    res.status(500).json({
      message: '서버 오류가 발생했습니다.',
    });
  }
};

module.exports = {
  postBoard,
  getBoardContent,
  getBoardContentById,
  patchBoardContentById,
  deleteBoardContentById,
}; //모듈 내보내기
