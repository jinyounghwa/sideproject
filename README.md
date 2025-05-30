# sideproject

## 구현 내용 요약

### 주요 기능
- 2025년 기준 휴일 달력 제공 (공휴일 JSON 파일 기반)
- 주5일제, 주6일제, 평일 자유 쉼 모드별로 남은 휴일(공휴일+주말) 계산
- 월별 이동(◀, ▶) 및 연/월 표기
- 다크모드 지원 (로컬스토리지로 사용자 모드 기억)
- 반응형 디자인, 중앙정렬, 직관적인 UI

### 폴더/파일 구조
- `index.html` : 메인 페이지, UI 구조
- `style.css` : 전체 스타일, 다크모드/라이트모드, 달력 크기 등
- `calendar.js` : 달력 렌더링, 휴일 계산, 월 이동, 다크모드 토글 등 주요 로직
- `2025.json` : 2025년 공휴일 데이터

### 사용법
1. 프로젝트 폴더를 웹서버(root)에 두고 index.html을 브라우저로 엽니다.
2. 상단에서 다크모드 토글, 월 이동(◀, ▶) 가능
3. 하단에서 남은 휴일(공휴일+주말) 실시간 확인
4. 주5일/주6일/평일자유 모드 선택 가능

### 주요 구현/디자인 포인트
- Flexbox, CSS 변수로 테마 전환과 중앙정렬 구현
- 달력 셀/공휴일명/날짜 크기 및 색상 일관성
- 다크모드 시 숫자/공휴일 모두 흰색 처리로 가독성 강화
- 월 이동 시 연/월 표기 자동 변경
- 모바일/PC 모두 보기 좋은 반응형

---
문의/개선 요청은 언제든 환영합니다!