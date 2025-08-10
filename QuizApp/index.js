const questions = [
  { question: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"], answer: "JavaScript" },
  { question: "What does CSS stand for?", options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"], answer: "Cascading Style Sheets" },
  { question: "What year was JavaScript launched?", options: ["1996", "1995", "1994", "none of the above"], answer: "1995" },
  { question: "HTML stands for?", options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "High Text Markup Language"], answer: "Hyper Text Markup Language" }
];

let currentIndex = 0, score = 0;

// DOM Elements
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const quizBox = document.getElementById("quiz-box");
const scoreText = document.getElementById("score-text");
const restartBtn = document.getElementById("restart-btn");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const clickSound = document.getElementById("click-sound");
const progressRing = document.getElementById("progress-ring");
const progressPercent = document.getElementById("progress-percent");

// Start button click
startBtn.addEventListener("click", () => {
  clickSound.play();
  startScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  shuffleQuestions();
  showQuestion();
});

// Shuffle questions
function shuffleQuestions() {
  return questions.sort(() => Math.random() - 0.5);
}

// Update progress circle
function updateProgress() {
  let percent = Math.round((currentIndex / questions.length) * 100);
  let offset = 339.292 - (339.292 * percent) / 100;
  progressRing.style.strokeDashoffset = offset;
  progressPercent.textContent = `${percent}%`;
}

// Show question
function showQuestion() {
  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = opt;
    div.addEventListener("click", () => selectOption(div));
    optionsEl.appendChild(div);
  });
  updateProgress();
}

// Select option
function selectOption(selected) {
  clickSound.play();
  document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
  selected.classList.add("selected");
}

// Next button click
nextBtn.addEventListener("click", () => {
  const selected = document.querySelector(".option.selected");
  if (!selected) {
    alert("Please select an option!");
    return;
  }
  if (selected.textContent === questions[currentIndex].answer) {
    score++;
    correctSound.play();
  } else {
    wrongSound.play();
  }
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    updateProgress();
    showResult();
  }
});

// Show result
function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = `You scored ${score} out of ${questions.length}`;
  launchConfetti();
}

// Restart button click
restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  resultBox.classList.add("hidden");
  startScreen.classList.remove("hidden");
  updateProgress();
});

// Confetti animation
function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let pieces = [];
  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 360},100%,50%)`,
      speed: Math.random() + 1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    update();
    requestAnimationFrame(draw);
  }
  function update() {
    pieces.forEach(p => {
      p.y += p.speed;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
  }
  draw();
}
