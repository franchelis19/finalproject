const form = document.getElementById("membershipForm");
const alertBox = document.getElementById("formAlert");
const successCard = document.getElementById("successCard");
const summaryDiv = document.getElementById("summary");
const resetBtn = document.getElementById("resetBtn");

function byId(id){ return document.getElementById(id); }
function setError(id,msg){ byId(id).textContent = msg; }

function showAlert(msg){
  alertBox.textContent = msg;
  alertBox.classList.remove("hidden");
}
function hideAlert(){
  alertBox.textContent = "";
  alertBox.classList.add("hidden");
}
function clearErrors(){
  const errIds = ["errFullName","errEmail","errPhone","errAge","errMembershipType","errStartDate","errGoals","errEmergencyName","errEmergencyPhone","errAgree"];
  for(let i=0;i<errIds.length;i++){ setError(errIds[i], ""); }
}

function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
function isValidPhone(phone){
  return /^(\(\d{3}\)\s?|\d{3}[-\s]?)\d{3}[-\s]?\d{4}$/.test(phone.trim());
}

function membershipLabel(value){
  switch(value){
    case "basic": return "Basic";
    case "standard": return "Standard";
    case "premium": return "Premium";
    default: return "Unknown";
  }
}

function validate(){
  clearErrors();
  hideAlert();

  const fullName = byId("fullName").value.trim();
  const email = byId("email").value.trim();
  const phone = byId("phone").value.trim();
  const ageRaw = byId("age").value.trim();
  const membershipType = byId("membershipType").value;
  const startDate = byId("startDate").value;
  const goals = byId("goals").value.trim();
  const emergencyName = byId("emergencyName").value.trim();
  const emergencyPhone = byId("emergencyPhone").value.trim();
  const agree = byId("agree").checked;

  const errors = []; // array

  if(fullName.length < 2){ setError("errFullName","Please enter your full name."); errors.push("Full Name is required."); }
  if(!isValidEmail(email)){ setError("errEmail","Enter a valid email."); errors.push("Email must be valid."); }
  if(!isValidPhone(phone)){ setError("errPhone","Use format like 555-123-4567."); errors.push("Phone number must be valid."); }

  const age = Number(ageRaw);
  if(!ageRaw || Number.isNaN(age)){ setError("errAge","Age is required."); errors.push("Age is required."); }
  else if(age < 13 || age > 100){ setError("errAge","Age must be 13–100."); errors.push("Age must be in a reasonable range."); }

  if(membershipType === ""){ setError("errMembershipType","Select a membership type."); errors.push("Membership type is required."); }

  if(!startDate){ setError("errStartDate","Choose a start date."); errors.push("Start date is required."); }
  else{
    const today = new Date(); today.setHours(0,0,0,0);
    const chosen = new Date(startDate + "T00:00:00");
    if(chosen < today){ setError("errStartDate","Start date cannot be in the past."); errors.push("Start date cannot be in the past."); }
  }

  if(goals.length < 10){ setError("errGoals","Write at least 10 characters."); errors.push("Goals must be filled out."); }
  if(emergencyName.length < 2){ setError("errEmergencyName","Emergency name required."); errors.push("Emergency contact name is required."); }
  if(!isValidPhone(emergencyPhone)){ setError("errEmergencyPhone","Enter a valid phone."); errors.push("Emergency contact phone must be valid."); }

  if(!agree){ setError("errAgree","You must agree before submitting."); errors.push("Agreement checkbox must be checked."); }

  if(errors.length > 0){
    let msg = "Please fix the following:\n";
    for(let i=0;i<errors.length;i++){ msg += `• ${errors[i]}\n`; } // loop
    showAlert(msg);
    successCard.classList.add("hidden");
    return null;
  }

  return { fullName, email, phone, age, membershipType, startDate, goals, emergencyName, emergencyPhone };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = validate();
  if(!data) return;

  summaryDiv.innerHTML = `
    <div class="card" style="margin:0; box-shadow:none;">
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Age:</strong> ${data.age}</p>
      <p><strong>Membership:</strong> ${membershipLabel(data.membershipType)}</p>
      <p><strong>Start Date:</strong> ${data.startDate}</p>
      <p><strong>Goals:</strong> ${data.goals}</p>
      <p><strong>Emergency:</strong> ${data.emergencyName} (${data.emergencyPhone})</p>
      <p class="muted">✅ Validation passed (client-side JavaScript).</p>
    </div>
  `;
  successCard.classList.remove("hidden");
  window.scrollTo({ top: successCard.offsetTop - 20, behavior: "smooth" });
});

resetBtn.addEventListener("click", () => {
  clearErrors();
  hideAlert();
  successCard.classList.add("hidden");
});
