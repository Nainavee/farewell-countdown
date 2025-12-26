// Create stars
const starsContainer = document.getElementById("stars");
for (let i = 0; i < 100; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 3 + "s";
  starsContainer.appendChild(star);
}

// Calendar data
const today = new Date("2025-12-26");
const holidays = new Set(["2026-01-01", "2026-01-14", "2026-01-26"]);
const wfhDays = new Set([
  "2026-01-22",
  "2026-01-23",
  "2026-01-27",
  "2026-01-28",
  "2026-01-29",
]);
const leaveDays = new Set(["2026-01-02", "2026-01-05", "2026-01-21"]);
const lastDayDate = "2026-01-30";

const months = [
  { year: 2025, month: 11, name: "December 2025", days: 31, startDay: 1 },
  { year: 2026, month: 0, name: "January 2026", days: 31, startDay: 4 },
  { year: 2026, month: 1, name: "February 2026", days: 28, startDay: 0 },
];

let currentMonthIndex = 0;

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function calculateOfficeDays() {
  const lastDay = new Date("2026-01-30");
  let officeDays = 0;
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() + 1);

  while (currentDate <= lastDay) {
    const dateStr = currentDate.toISOString().split("T")[0];

    if (
      !isWeekend(currentDate) &&
      !holidays.has(dateStr) &&
      !wfhDays.has(dateStr) &&
      !leaveDays.has(dateStr)
    ) {
      officeDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return officeDays;
}

function createCalendar(monthData) {
  const slide = document.createElement("div");
  slide.className = "calendar-slide";

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  // Day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayHeaders.forEach((day) => {
    const header = document.createElement("div");
    header.className = "day-header";
    header.textContent = day;
    grid.appendChild(header);
  });

  // Empty cells before month starts
  for (let i = 0; i < monthData.startDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty";
    grid.appendChild(emptyCell);
  }

  // Create day cells
  for (let day = 1; day <= monthData.days; day++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    const dateStr = `${monthData.year}-${String(monthData.month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const currentDate = new Date(dateStr);
    const isPast = currentDate < today;
    const isToday = dateStr === today.toISOString().split("T")[0];

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;

    if (isToday) {
      cell.classList.add("today");
    } else if (isPast) {
      cell.classList.add("past");
    } else if (dateStr === lastDayDate) {
      cell.classList.add("last-day");
    } else if (holidays.has(dateStr)) {
      cell.classList.add("holiday");
    } else if (leaveDays.has(dateStr)) {
      cell.classList.add("leave");
    } else if (wfhDays.has(dateStr)) {
      cell.classList.add("wfh");
    } else if (isWeekend(currentDate)) {
      cell.classList.add("weekend");
    } else {
      cell.classList.add("office");
    }

    cell.appendChild(dayNumber);
    grid.appendChild(cell);
  }

  slide.appendChild(grid);
  return slide;
}

function renderCalendars() {
  const slider = document.getElementById("calendarSlider");
  slider.innerHTML = "";

  months.forEach((month) => {
    const calendar = createCalendar(month);
    slider.appendChild(calendar);
  });

  updateCalendarView();
}

function updateCalendarView() {
  const slider = document.getElementById("calendarSlider");
  const monthName = document.getElementById("monthName");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  slider.style.transform = `translateX(-${currentMonthIndex * 100}%)`;
  monthName.textContent = months[currentMonthIndex].name;

  prevBtn.disabled = currentMonthIndex === 0;
  nextBtn.disabled = currentMonthIndex === months.length - 1;
}

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentMonthIndex > 0) {
    currentMonthIndex--;
    updateCalendarView();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentMonthIndex < months.length - 1) {
    currentMonthIndex++;
    updateCalendarView();
  }
});

// Update countdown
const countdownEl = document.getElementById("countdown");
const messageEl = document.getElementById("message");
const daysLeft = calculateOfficeDays();

countdownEl.textContent = daysLeft;

const messages = [
  "Cherish every single moment! 💝",
  "Make these days unforgettable! ✨",
  "Time flies when you're having fun! 🦋",
  "Every day is precious! 🌟",
  "Let's make memories! 🎨",
];

if (daysLeft === 0) {
  messageEl.textContent = "Today is the last day! Make it count! 🎉";
} else {
  messageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// Initialize calendars
renderCalendars();

// Floating hearts animation
function createHeart() {
  const heart = document.createElement("div");
  heart.className = "hearts";
  heart.textContent = ["💖", "💝", "✨", "⭐", "🌟"][
    Math.floor(Math.random() * 5)
  ];
  heart.style.left = Math.random() * 100 + "%";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

setInterval(createHeart, 2000);
