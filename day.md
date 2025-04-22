# 자바스크립트 달력 일자 계산 방법 정리

## 1. 1일과 마지막 날짜 객체 준비
- `firstDay = new Date(year, month, 1)` : 해당 월의 1일 객체
- `lastDay = new Date(year, month + 1, 0)` : 해당 월의 마지막 날짜 객체

## 2. 1일의 요일 확인
- `firstDay.getDay()` : 1일이 무슨 요일인지(0=일요일 ~ 6=토요일)

## 3. 첫 줄 앞부분 빈칸 채우기
- 1일이 수요일(3)이면, 앞에 3칸은 빈칸(`<td></td>`)으로 채움
- 예시: `for (let i = 0; i < firstDayOfWeek; i++) { ... }`

## 4. 이번 달 날짜를 for문으로 채우기
- `for (let d = 1; d <= lastDay.getDate(); d++) { ... }` 형태로 1일부터 마지막 날짜까지 반복
- 각 날짜별로 `<td>`를 만들어 달력에 추가
- 휴일, 오늘, 과거/미래 등 클래스 추가
- 토요일마다 줄바꿈(`if (date.getDay() === 6) ...`)

### 실제 코드 예시
```javascript
for (let d = 1; d <= lastDay.getDate(); d++) {
  let date = new Date(year, month, d); // 날짜 객체 생성
  let dateStr = date.toISOString().slice(0,10); // YYYY-MM-DD 형식 문자열
  let classes = [];
  let holidayName = '';
  // 휴일인지 확인
  if (holidayDates.includes(dateStr)) {
    classes.push('holiday');
    holidayName = holidays[dateStr].join(', ');
  }
  // 오늘, 과거, 미래 구분
  if (dateStr === today.toISOString().slice(0,10)) {
    classes.push('today');
  } else if (date < today) {
    classes.push('past');
  } else {
    classes.push('future');
  }
  // HTML에 날짜 추가
  html += `<td class="${classes.join(' ')}">${d}`;
  if (holidayName) html += `<span class="holiday-name">${holidayName}</span>`;
  html += '</td>';
  // 토요일이면 줄바꿈
  if (date.getDay() === 6 && d !== lastDay.getDate()) html += '</tr><tr>';
}
```

- d는 1일부터 마지막 날짜까지 1씩 증가하며 반복
- 각 날짜별로 필요한 정보를 계산해서 달력에 표시
- for문 덕분에 달마다 일수(28~31일)가 달라도 자동으로 처리됨

## 5. 마지막 줄 뒷부분 빈칸 채우기
- 이번 달 마지막 날짜 뒤에 남는 칸을 빈칸으로 채움
- 예시: `for (let i = lastDayOfWeek + 1; i <= 6; i++) { ... }`

---

---

## for문 사용 요약
- 1일부터 마지막 날짜까지 반복하며 각 날짜를 처리
- 날짜별로 휴일/오늘/과거/미래 등 클래스를 동적으로 결정
- 달마다 다른 일수도 자동 처리
- 토요일마다 줄바꿈으로 달력 행을 완성

### 전체 순서 요약
1. 1일, 마지막 날짜 객체 생성
2. 1일의 요일만큼 앞에 빈칸 채움
3. for문으로 1일부터 마지막 날짜까지 `<td>` 생성
4. 각 날짜별로 정보(휴일, 오늘 등) 및 스타일 적용
5. 토요일마다 줄바꿈, 마지막 줄 뒷부분 빈칸 채움

이렇게 JS로 동적으로 달력 날짜를 계산하여 달력을 만듭니다.

---

## 요일별 표기 및 스타일 적용 방법

### 1. 요일 헤더(일~토) 생성
- `['일','월','화','수','목','금','토'].forEach((d, i) => { ... })`
- 각 요일을 `<th>`로 반복 생성
- 일요일(i===0)에는 'sun', 토요일(i===6)에는 'sat' 클래스를 부여하여 색상 등 스타일 차별화

```javascript
['일','월','화','수','목','금','토'].forEach((d, i) => {
  let cls = '';
  if (i === 0) cls = 'sun'; // 일요일
  if (i === 6) cls = 'sat'; // 토요일
  html += `<th class="${cls}">${d}</th>`;
});
```

### 2. 각 날짜의 요일별 스타일 지정
- 날짜를 for문으로 채울 때, 해당 날짜의 요일을 계산하여 클래스 추가
- `if (date.getDay() === 0) classes.push('sun'); // 일요일`
- `if (date.getDay() === 6) classes.push('sat'); // 토요일`
- 휴일, 오늘, 과거/미래 등 다른 클래스도 함께 추가 가능

```javascript
for (let d = 1; d <= lastDay.getDate(); d++) {
  let date = new Date(year, month, d);
  let classes = [];
  if (date.getDay() === 0) classes.push('sun');
  if (date.getDay() === 6) classes.push('sat');
  // ... (휴일, 오늘, 과거/미래 등)
  html += `<td class="${classes.join(' ')}">${d}</td>`;
}
```

### 3. 요약
- 요일별로 다른 클래스를 부여하여, 일요일/토요일/평일을 시각적으로 구분
- 휴일, 오늘 등도 별도 스타일로 강조 가능
- 이렇게 하면 달력에서 요일별 색상이나 스타일을 쉽게 조절할 수 있음

---

## 지금 시각(오늘 날짜) 계산 방법

### 1. Date 객체로 현재 시각 구하기
- 자바스크립트에서 `new Date()`를 사용하면 실행 시점의 현재 날짜와 시간을 가져옴

```javascript
const today = new Date();
```
- today 변수에는 현재 컴퓨터(브라우저)의 시스템 시각 정보가 모두 들어있음

### 2. 오늘 날짜(연, 월, 일) 추출
- 연도: `today.getFullYear()` → 예) 2025
- 월: `today.getMonth()` → 예) 3 (4월, 0부터 시작)
- 일: `today.getDate()` → 예) 22

### 3. 날짜 비교 및 표시
- 달력에서 오늘 날짜와 비교할 때는,
  `today.toISOString().slice(0,10)`
  이렇게 해서 'YYYY-MM-DD' 형식의 문자열로 만듦
- 각 날짜가 오늘과 같은지 비교해서, 오늘이면 특별한 클래스(`today`)를 추가하여 스타일을 다르게 표시

### 요약
- `const today = new Date();` 한 줄로 지금 시각을 구함
- 필요에 따라 연, 월, 일, 혹은 ISO 문자열 등으로 변환해서 사용
- 달력에서 오늘 날짜와 비교하거나, 오늘 이후/이전 날짜를 구분할 때 활용
