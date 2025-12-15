const btnGenerate = document.getElementById("btnGenerate");
const btnClear = document.getElementById("btnClear");
const workoutBox = document.getElementById("workoutBox");

const btnStart = document.getElementById("btnStart");
const btnResetProgress = document.getElementById("btnResetProgress");
const goalNameInput = document.getElementById("goalName");
const goalTargetInput = document.getElementById("goalTarget");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");

const warmups = ["Jumping jacks","High knees","Arm circles","Bodyweight squats","Light jog"];
const strength = ["Push-ups","Goblet squats","Dumbbell rows","Lunges","Plank"];
const cardio = ["Jump rope","Burpees","Mountain climbers","Cycling","Fast walk"];
const finishers = ["Stretching","Foam rolling","Mobility flow","Breathing reset","Cool-down walk"];

function pickRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateWorkout(){
  const plan = [
    {label:"Warm-up", text: `${pickRandom(warmups)} (3–5 min)`},
    {label:"Strength", text: `${pickRandom(strength)} (3 sets)`},
    {label:"Cardio", text: `${pickRandom(cardio)} (5–10 min)`},
    {label:"Finish", text: `${pickRandom(finishers)} (5 min)`}
  ];

  let intensity;
  const roll = Math.floor(Math.random() * 3);
  if(roll === 0) intensity = "Beginner";
  else if(roll === 1) intensity = "Intermediate";
  else intensity = "Advanced";

  let html = `<h3>Your Workout (${intensity})</h3><ol>`;
  for(let i=0;i<plan.length;i++){ html += `<li><strong>${plan[i].label}:</strong> ${plan[i].text}</li>`; }
  html += `</ol><p class="muted">Tip: focus on form + consistency.</p>`;

  workoutBox.innerHTML = html;
  workoutBox.classList.remove("hidden");
}

btnGenerate.addEventListener("click", generateWorkout);
btnClear.addEventListener("click", () => {
  workoutBox.classList.add("hidden");
  workoutBox.innerHTML = "";
});

let timer = null;

function startProgress(){
  const goalName = goalNameInput.value.trim() || "My Goal";
  const target = Number(goalTargetInput.value);

  if(Number.isNaN(target) || target < 1 || target > 100){
    progressLabel.textContent = "Enter a target percent between 1 and 100.";
    return;
  }

  if(timer) clearInterval(timer);
  let current = 0;
  progressBar.style.width = "0%";
  progressLabel.textContent = `${goalName}: 0%`;

  timer = setInterval(() => {
    current++;
    progressBar.style.width = `${current}%`;
    progressLabel.textContent = `${goalName}: ${current}%`;

    if(current >= target){
      clearInterval(timer);
      timer = null;
      progressLabel.textContent = `${goalName}: ${target}% (Completed!)`;
    }
  }, 18);
}

btnStart.addEventListener("click", startProgress);
btnResetProgress.addEventListener("click", () => {
  if(timer) clearInterval(timer);
  timer = null;
  progressBar.style.width = "0%";
  progressLabel.textContent = "No goal started yet.";
  goalNameInput.value = "";
  goalTargetInput.value = "";
});
