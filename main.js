const starsContainer = document.getElementById("stars");
const toggleContainer = document.getElementById("toggleContainer");
const body = document.body;
const stormContainer = document.getElementById("stormContainer");
const cloudsContainer = document.getElementById("clouds");
const rainContainer = document.getElementById("rain");
const lightningEl = document.getElementById("lightning");
const titleEl = document.querySelector("h1");
const subtitleEl = document.querySelector(".subtitle");

function createStars() {
  starsContainer.innerHTML = "";
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";
    starsContainer.appendChild(star);
  }
}

function createClouds() {
  cloudsContainer.innerHTML = "";
  const cloudTypes = ["small", "medium", "large"];
  const cloudCount = 8;
  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.className = `cloud ${
      cloudTypes[Math.floor(Math.random() * cloudTypes.length)]
    }`;
    cloud.style.left = Math.random() * 120 - 20 + "%";
    cloud.style.animationDelay = Math.random() * 10 + "s";
    cloudsContainer.appendChild(cloud);
  }
}

function createRain() {
  rainContainer.innerHTML = "";
  for (let i = 0; i < 150; i++) {
    const raindrop = document.createElement("div");
    raindrop.className = "raindrop";
    raindrop.style.left = Math.random() * 100 + "%";
    raindrop.style.animationDuration = Math.random() * 1.5 + 1.8 + "s";
    raindrop.style.animationDelay = Math.random() * 2 + "s";
    raindrop.style.opacity = Math.random() * 0.5 + 0.3;
    rainContainer.appendChild(raindrop);
  }
}
let lightningTimeout = null; // Store the timeout ID so we can cancel it

function startLightning() {
  console.log("Lightning strike!");
  
  // Flash effect
  lightningEl.classList.add("flash");
  
  // Create lightning bolt
  const bolt = createLightningBolt();
  lightningEl.appendChild(bolt);
  
  // Force a reflow to ensure the element is in the DOM
  bolt.offsetHeight;
  
  // Use requestAnimationFrame to ensure rendering happens
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bolt.classList.add("strike");
    });
  });
  
  // Remove flash and bolt after animation (increased to 1 second)
  setTimeout(() => {
    lightningEl.classList.remove("flash");
    bolt.remove();
  }, 4000); // Changed from 600ms to 1000ms (1 second)
}

function createLightningBolt() {
  const boltContainer = document.createElement("div");
  boltContainer.className = "lightning-bolt";
  
  // Random horizontal position (20% to 80%)
  const startX = Math.random() * 60 + 20;
  boltContainer.style.left = startX + "%";
  
  // Create multiple segments for jagged effect
  const segments = 10 + Math.floor(Math.random() * 5);
  let currentOffset = 0;
  
  for (let i = 0; i < segments; i++) {
    const segment = document.createElement("div");
    segment.className = "bolt-segment";
    
    const angle = (Math.random() - 0.5) * 40;
    const height = 100 / segments;
    
    segment.style.top = (i * (100 / segments)) + "%";
    segment.style.height = height + "%";
    segment.style.transform = `translateX(${currentOffset}px) rotate(${angle}deg)`;
    
    currentOffset += (Math.random() - 0.5) * 30;
    
    const glowIntensity = 0.7 + Math.random() * 0.3;
    segment.style.opacity = glowIntensity;
    
    boltContainer.appendChild(segment);
    
    if (Math.random() > 0.75 && i < segments - 2) {
      const branch = document.createElement("div");
      branch.className = "bolt-branch";
      branch.style.top = ((i + 0.5) * (100 / segments)) + "%";
      branch.style.transform = `translateX(${currentOffset}px) rotate(${(Math.random() - 0.5) * 60}deg)`;
      boltContainer.appendChild(branch);
    }
  }
  
  return boltContainer;
}

// Schedule random lightning strikes
function scheduleLightning() {
  // Random interval between 1-5 seconds
  const nextStrike = Math.random() * 4000 + 1000;
  
  lightningTimeout = setTimeout(() => {
    startLightning();
    // Schedule the next strike
    scheduleLightning();
  }, nextStrike);
}

// Stop all lightning
function stopLightning() {
  console.log("Stopping lightning");
  
  // Cancel the scheduled next strike
  if (lightningTimeout) {
    clearTimeout(lightningTimeout);
    lightningTimeout = null;
  }
  
  // Remove any existing flash effect
  lightningEl.classList.remove("flash");
  
  // Remove any existing bolts
  const existingBolts = lightningEl.querySelectorAll(".lightning-bolt");
  existingBolts.forEach(bolt => bolt.remove());
}

// Start the lightning loop
scheduleLightning();
// Calendar data
const today = new Date();
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

const happyMessages = [
  "This moment deserves your full attention 🙂",
  "Make these days unforgettable! ✨",
  "Stay here. This feeling matters 💛",
  "Every day is precious! 🌟",
  "Let's make memories! 🎨",
  "Stay a little longer in this feeling. It’s rare.",
  "Laugh without checking the time today.",
  "Hold this moment gently. It loves you back.",
  "Let joy linger. You won’t always find it this close.",
  "These seconds are quietly becoming memories.",
  "Smile like you don’t need to hurry anywhere.",
  "This happiness is asking to be remembered.",
  "Be fully here. This is a gift.",
  "If this is fleeting, make it beautiful.",
];

const sadMessages = [
  "Time slips away like rain...",
  "Every moment matters now...",
  "The storm reminds us nothing lasts forever...",
  "Treasuring these final days...",
  "Soon only memories will remain...",
    "Every drop is a moment you won’t get back.",
    "The rain keeps falling, even as I prepare to leave.",
  "Every drop feels like a goodbye I didn’t say.",
  "The rain is here to remind you: this moment is fragile.",
  "Stand with me in the rain. There won’t be another time.",
  "Let the rain slow you down. This is the last time.",
  "Every falling drop is asking you to remember this.",
  "When the rain ends, so does this chapter.",
];

// Initialize calendars
renderCalendars();
let sadInterval = null;
let heartInterval = null;
// Floating hearts animation
function createFloatingEmojis() {
  const heart = document.createElement("div");
  heart.className = "floaters";
  const happyEmojis = ["💖", "💝", "✨", "😍"];
  const sadEmojis = ["🥹", "🌩️", "😢", "🌧️"];

  const emojis = happyMood ? happyEmojis : sadEmojis;
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  heart.style.left = Math.random() * 100 + "%";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

setInterval(createFloatingEmojis, 1500);

// --- Mood toggle logic ---
let happyMood = true;
function updateMood() {
  console.log(happyMood);
  if (happyMood) {
    starsContainer.style.display = "";
    stormContainer.style.display = "none";
    body.classList.remove("sad-mode");
    // Happy theme text

    titleEl.textContent = "Counting Down Together";
    subtitleEl.textContent = "You Get to See Me For";
    createStars();
    stopLightning();
    if (daysLeft === 0) {
      messageEl.textContent = "Today is the last day! Make it count! 🎉";
    } else {
      messageEl.textContent =
        happyMessages[Math.floor(Math.random() * happyMessages.length)];
    }
  } else {
    starsContainer.style.display = "none";
    stormContainer.style.display = "";
    body.classList.add("sad-mode");

    titleEl.textContent = "You Get To See Me For";
    subtitleEl.textContent = "office days remaining before farewell";
    createClouds();
    createRain();
    scheduleLightning();
    if (daysLeft === 0) {
      messageEl.textContent = "Today is the last day... farewell.";
    } else {
      messageEl.textContent =
        sadMessages[Math.floor(Math.random() * sadMessages.length)];
    }
  }
    startMessageRotation();

}

let messageInterval = null; // Store the interval ID

function startMessageRotation() {
  // Clear any existing interval
  if (messageInterval) {
    clearInterval(messageInterval);
  }
  
  // Change message every 5 seconds (adjust as needed)
  messageInterval = setInterval(() => {
    if (daysLeft === 0) {
      // Don't rotate on the last day
      return;
    }
    
    // Add animation class
    messageEl.classList.add('message-changing');
    
    // Change message halfway through animation
    setTimeout(() => {
      if (happyMood) {
        messageEl.textContent = happyMessages[Math.floor(Math.random() * happyMessages.length)];
      } else {
        messageEl.textContent = sadMessages[Math.floor(Math.random() * sadMessages.length)];
      }
    }, 700); // Halfway through the 600ms animation
    
    // Remove animation class after it completes
    setTimeout(() => {
      messageEl.classList.remove('message-changing');
    }, 1400);
    
  }, 8000);
}

function stopMessageRotation() {
  if (messageInterval) {
    clearInterval(messageInterval);
    messageInterval = null;
  }
}
toggleContainer.addEventListener("click", () => {
  happyMood = !happyMood;
  body.classList.toggle("light-mode");
  updateMood();
});
updateMood();
