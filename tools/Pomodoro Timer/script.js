let worktime = 25;
let breaktime = 5;
let longbreaktime = 15;
let currenttime = worktime * 60;
let totaltime = currenttime;
let isRunning = false;
let isWorkSession = true;
let seasoncount = 0;
let completedseasons = 0;
let totalminutes = 0;
let currentstreak = 0;
let timer = null;

const timerDisplay = document.getElementById("timeDisplay");
const sessionType = document.getElementById("sessionType");
const progress = document.getElementById("progress");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const skipBtn = document.getElementById("skipBtn");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");

const workTimeDisplay = document.getElementById("workTime");
const breakTimeDisplay = document.getElementById("breakTime");
const longBreakTimeDisplay = document.getElementById("longBreakTime");

const completedDisplay = document.getElementById("completedSessions");
const totaltimeDisplay = document.getElementById("totalTime");
const streakDisplay = document.getElementById("currentStreak");

function updateDisplay() {
  const minutes = Math.floor(currenttime / 60);
  const seconds = currenttime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateProgress() {
  const progressVlaue = 1 - currenttime / totaltime;
  const circumference = 2 * Math.PI * 145;
  const offset = circumference * (1 - progressVlaue);
  progress.style.strokeDashoffset = offset;
}

function updateStats() {
  completedDisplay.textContent = completedseasons;
  const hours = Math.floor(totalminutes / 60);
  const minutes = totalminutes % 60;
  totaltimeString = `${hours}h ${minutes}m`;

  totaltimeDisplay.textContent = totaltimeString;
  streakDisplay.textContent = currentstreak;
}

function showNotification(text) {
  notificationText.textContent = text;
  notification?.classList.add("show");
  setTimeout(() => {
    notification?.classList.remove("show");
  }, 4000);
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startBtn.textContent = "Running...";
    startBtn?.classList.add("pulsing");
    timer = setInterval(() => {
      currenttime--;
      updateDisplay();
      updateProgress();
      if (currenttime <= 0) {
        sessionComplete();
      }
    }, 1000);
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timer);
    startBtn.textContent = "Start";
    startBtn.classList.remove("pulsing");
  }
}

function resetTimer() {
  pauseTimer();
  if (isWorkSession) {
    currenttime = worktime * 60;
  } else {
    const isLongBreak = seasoncount % 4 === 0;
    currenttime = isLongBreak ? longbreaktime * 60 : breaktime * 60;
  }
  totaltime = currenttime;
  updateDisplay();
  updateProgress();
}

function skipSession() {
  pauseTimer();
  sessionComplete();
}

function sessionComplete() {
  if (isWorkSession) {
    completedseasons++;
    seasoncount++;
    currentstreak++;
    totalminutes += worktime;

    showNotification("Work session complete! Time for a break.");
  } else {
    showNotification("Break session complete! Time to get back to work.");
  }

  isWorkSession = !isWorkSession;

  if (isWorkSession) {
    currenttime = worktime * 60;
    progress.classList.remove("break");
    sessionType.textContent = "Work Session";
  } else {
    const isLongBreak = seasoncount % 4 === 0;
    currenttime = isLongBreak ? longbreaktime * 60 : breaktime * 60;
    progress.classList.remove("work");
    progress.classList.add("break");
    sessionType.textContent = isLongBreak ? "Long Break" : "Break Session";
  }

  totaltime = currenttime;
  updateDisplay();
  updateProgress();
  updateStats();
}

function adjustTime(type, delta) {
  if (isRunning) return;

  if (type === "work") {
    worktime = Math.min(Math.max(1, worktime + delta), 60);
    workTimeDisplay.textContent = worktime;
    if (isWorkSession) {
      currenttime = worktime * 60;
      totaltime = currenttime;
    }
  }

  if (type === "break") {
    breaktime = Math.min(Math.max(1, breaktime + delta), 30);
    breakTimeDisplay.textContent = breaktime;
    if (!isWorkSession && seasoncount % 4 !== 0) {
      currenttime = breaktime * 60;
      totaltime = currenttime;
    }
  }

  if (type === "longBreak") {
    longbreaktime = Math.min(Math.max(5, longbreaktime + delta), 60);
    longBreakTimeDisplay.textContent = longbreaktime;
    if (!isWorkSession && seasoncount % 4 === 0) {
      currenttime = longbreaktime * 60;
      totaltime = currenttime;
    }
  }

  updateDisplay();
  updateProgress();
}

document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();
  updateProgress();
  updateStats();

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
  skipBtn.addEventListener("click", skipSession);

  document
    .getElementById("workPlus")
    .addEventListener("click", () => adjustTime("work", 1));
  document
    .getElementById("workMinus")
    .addEventListener("click", () => adjustTime("work", -1));
  document
    .getElementById("breakPlus")
    .addEventListener("click", () => adjustTime("break", 1));
  document
    .getElementById("breakMinus")
    .addEventListener("click", () => adjustTime("break", -1));
  document
    .getElementById("longBreakPlus")
    .addEventListener("click", () => adjustTime("longBreak", 1));
  document
    .getElementById("longBreakMinus")
    .addEventListener("click", () => adjustTime("longBreak", -1));
});
