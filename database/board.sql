CREATE TABLE board (
    board_id SERIAL PRIMARY KEY,                  -- 게시판 아이디 (자동 증가)
    board_title VARCHAR(255) NOT NULL,           -- 게시판 제목
    board_content TEXT NOT NULL,                 -- 게시판 내용
    board_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 등록 날짜 (현재 시간 기본값)
    board_change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정 날짜
    board_deleted_date TIMESTAMP,                      -- 삭제 날짜 (NULL 가능)
    board_status BOOLEAN DEFAULT TRUE            -- 게시판 상태 (TRUE: 활성, FALSE: 비활성)
);