const HOLIDAY_JSON = '2025.json';
const calendarEl = document.getElementById('calendar');
const holidaysLeftEl = document.getElementById('holidays-left');
const modeBtns = document.querySelectorAll('.work-mode button');
const darkmodeToggle = document.getElementById('darkmode-toggle');

// 다크모드 토글 기능
function setDarkMode(on) {
    if (on) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', '1');
        darkmodeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', '0');
        darkmodeToggle.textContent = '🌙';
    }
}
if (darkmodeToggle) {
    darkmodeToggle.addEventListener('click', () => {
        setDarkMode(!document.body.classList.contains('dark-mode'));
    });
    // 페이지 로드시 저장된 모드 적용
    if (localStorage.getItem('dark-mode') === '1') {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }
}


let holidays = {};
let holidayDates = [];
let workMode = '5'; // '5', '6', 'free'

// 오늘 날짜
const today = new Date();

// fetch holiday data
fetch(HOLIDAY_JSON)
  .then(res => res.json())
  .then(data => {
    holidays = data;
    holidayDates = Object.keys(holidays);
    // 항상 오늘의 월을 렌더링
targetYear = today.getFullYear();
targetMonth = today.getMonth();
renderCalendar(targetYear, targetMonth);
    updateHolidaysLeft();
  });

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    workMode = btn.dataset.mode;
    updateHolidaysLeft();
  });
});

let targetYear = today.getFullYear();
let targetMonth = today.getMonth();


function renderCalendar(year = targetYear, month = targetMonth) {
  targetYear = year;
  targetMonth = month;

  let firstDay = new Date(year, month, 1);
  let lastDay = new Date(year, month + 1, 0);

  let html = '<table class="calendar-table">';
  // 월 이동 버튼과 연월 표기 행 추가
  html += `<tr class="calendar-nav-row">
    <th colspan="7" style="padding:0; background:none; border:none;">
      <div class="calendar-nav-center">
        <button id="prev-month" class="month-nav" title="이전 달">◀</button>
        <span id="current-year-month" class="year-month">${year}.${month+1}월</span>
        <button id="next-month" class="month-nav" title="다음 달">▶</button>
      </div>
    </th>
  </tr>`;
  html += '<tr>';
  ['일','월','화','수','목','금','토'].forEach((d, i) => {
    let cls = '';
    if (i === 0) cls = 'sun';
    if (i === 6) cls = 'sat';
    html += `<th class="${cls}">${d}</th>`;
  });
  html += '</tr><tr>';

  for (let i = 0; i < firstDay.getDay(); i++) {
    html += '<td></td>';
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    let date = new Date(year, month, d);
    let dateStr = date.toISOString().slice(0,10);
    let classes = [];
    // 요일별 클래스 추가
    if (date.getDay() === 0) classes.push('sun');
    if (date.getDay() === 6) classes.push('sat');
    let holidayName = '';
    if (holidayDates.includes(dateStr)) {
      classes.push('holiday');
      holidayName = holidays[dateStr].join(', ');
    }
    if (dateStr === today.toISOString().slice(0,10)) {
      classes.push('today');
    } else if (date < today) {
      classes.push('past');
    } else {
      classes.push('future');
    }
    html += `<td class="${classes.join(' ')}">${d}`;
    if (holidayName) html += `<span class="holiday-name">${holidayName}</span>`;
    html += '</td>';
    if (date.getDay() === 6 && d !== lastDay.getDate()) html += '</tr><tr>';
  }

  let lastDayOfWeek = lastDay.getDay();
  for (let i = lastDayOfWeek + 1; i <= 6; i++) {
    html += '<td></td>';
  }
  html += '</tr></table>';
  calendarEl.innerHTML = html;

  // 동적으로 버튼 이벤트 연결
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const yearMonthEl = document.getElementById('current-year-month');
  if (prevBtn && nextBtn && yearMonthEl) {
    prevBtn.onclick = () => {
      let newMonth = targetMonth - 1;
      let newYear = targetYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
      renderCalendar(newYear, newMonth);
    };
    nextBtn.onclick = () => {
      let newMonth = targetMonth + 1;
      let newYear = targetYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      renderCalendar(newYear, newMonth);
    };
  }
}

function updateHolidaysLeft() {
  // 오늘 이후 남은 휴일 계산
  let holidayCount = 0;
  let now = today.toISOString().slice(0,10);
  holidayDates.forEach(dateStr => {
    if (dateStr >= now) {
      if (workMode === '5') {
        // 주5일제: 주말(토,일)은 휴일에서 제외
        let day = new Date(dateStr).getDay();
        if (day !== 0 && day !== 6) holidayCount++;
      } else if (workMode === '6') {
        // 주6일제: 일요일만 제외
        let day = new Date(dateStr).getDay();
        if (day !== 0) holidayCount++;
      } else {
        // 평일 쉼: 모든 휴일 카운트
        holidayCount++;
      }
    }
  });
  // 오늘이 속한 주 ~ 2025년 마지막 주까지의 주 개수 계산
  const lastDay = new Date(2025, 11, 31); // 2025-12-31
  // 이미 today 변수가 있으므로 재사용
  // 이번 주의 월요일 구하기
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // 월요일(한국 기준)
  // 마지막 주의 월요일 구하기
  const endOfWeek = new Date(lastDay);
  endOfWeek.setDate(lastDay.getDate() - lastDay.getDay() + 1);
  // 남은 주차 수 계산
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  let weeksLeft = Math.floor((endOfWeek - startOfWeek) / msPerWeek) + 1;
  // 주5일제: 2 곱함, 주6일제/평일쉼: 1 곱함
  let weekendCount = 0;
  if (workMode === '5') {
    weekendCount = weeksLeft * 2;
  } else {
    weekendCount = weeksLeft * 1;
  }
  let total = holidayCount + weekendCount;
  holidaysLeftEl.textContent = `${total} (${holidayCount}+${weekendCount})`;
}
