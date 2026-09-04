/* =========================================================
   CONFIG — edit these before you launch
   ========================================================= */
const CONFIG = {
  whatsappGroupLink: "https://chat.whatsapp.com/GMx5wzytyEQ6PlewITd7T1",
  // If/when you split into tier-specific groups, add links here and
  // the result page will use them instead of the shared link above.
  whatsappTier1: "", // leave blank to use whatsappGroupLink
  whatsappTier2: "",
  whatsappTier3: ""
};

/* =========================================================
   QUESTIONS — from approved Stage 5.4
   ========================================================= */
const questions = [
  {
    id: "q1",
    eyebrow: "Question 1 of 6",
    title: "Where are you right now with starting solids?",
    options: [
      { id: "a", text: "Haven't started yet, just researching" },
      { id: "b", text: "Started, but my baby won't finish most packs" },
      { id: "c", text: "Already switched cereals more than once trying to find \"the one\"" },
      { id: "d", text: "Doing okay, just want to make sure I'm not wasting money" }
    ]
  },
  {
    id: "q2",
    eyebrow: "Question 2 of 6",
    title: "What have you already tried?",
    options: [
      { id: "a", text: "Cerelac" },
      { id: "b", text: "Nutrend" },
      { id: "c", text: "Pap / home mix" },
      { id: "d", text: "A mix of a few, still not sure what's working" }
    ]
  },
  {
    id: "q3",
    eyebrow: "Question 3 of 6",
    title: "What's making this harder than it should be?",
    options: [
      { id: "a", text: "Everyone in my family has different advice" },
      { id: "b", text: "I don't know which brand is actually worth the money" },
      { id: "c", text: "I'm scared of wasting money on the wrong pack again" },
      { id: "d", text: "I just don't know where to start" }
    ]
  },
  {
    id: "q4",
    eyebrow: "Question 4 of 6",
    title: "What matters most to you right now?",
    options: [
      { id: "a", text: "Stretching my budget without cutting corners on my baby" },
      { id: "b", text: "A clear answer I can trust, no more guessing" },
      { id: "c", text: "My baby actually enjoying mealtime" },
      { id: "d", text: "Something to show my family so they stop second-guessing me" }
    ]
  },
  {
    id: "q5",
    eyebrow: "Question 5 of 6",
    title: "How much time do you realistically have to figure this out?",
    options: [
      { id: "a", text: "Very little, I need something fast and simple" },
      { id: "b", text: "Some, I'm willing to read a short guide" },
      { id: "c", text: "I want ongoing support, not just a one-time read" }
    ]
  },
  {
    id: "q6",
    eyebrow: "Question 6 of 6",
    title: "If this guide could save you from buying even one more wrong pack, what would that be worth to you?",
    options: [
      { id: "a", text: "Just show me the basics, keep it cheap" },
      { id: "b", text: "I'd pay a bit more for extra support and a place to ask questions" },
      { id: "c", text: "I want the most complete help possible, including a plan made for my baby" }
    ]
  }
];

/* =========================================================
   ROUTING LOGIC — priority order, from approved Stage 5.4
   ========================================================= */
function routeToTier(answers){
  if(answers.q6 === "c"){
    return "tier3";
  }
  if(answers.q6 === "b" || (answers.q3 === "a" && answers.q5 === "c")){
    return "tier2";
  }
  return "tier1";
}

/* =========================================================
   RESULT CONTENT — from approved Stage 5.4 result pages
   ========================================================= */
const results = {
  tier1: {
    badge: "Your result",
    headline: "The Right Start Is Exactly What You Need",
    body: "Based on your answers, you're still finding your footing, and that's completely normal. The Right Start gives you the Nigeria-specific answers you've been missing, no more guessing, no more wasted packs.",
    tierName: "The Right Start",
    items: [
      "The full guide (PDF)",
      "Nigerian Baby Cereal Comparison Chart",
      "First 30 Days of Solids Planner"
    ],
    whatsapp: CONFIG.whatsappTier1 || CONFIG.whatsappGroupLink
  },
  tier2: {
    badge: "Your result",
    headline: "You Need More Than Just Information, You Need Backup",
    body: "From your answers, the real struggle isn't just choosing a cereal, it's dealing with everyone else's opinions too. The Confidence Kit gives you the guide plus a cheat sheet to answer your family, and a place to ask real questions when you're unsure.",
    tierName: "The Right Start + Confidence Kit",
    items: [
      "The full guide (PDF)",
      "Nigerian Baby Cereal Comparison Chart",
      "First 30 Days of Solids Planner",
      "Audio version of the guide",
      "\"What My Family Says vs What's True\" cheat sheet",
      "30 days of WhatsApp Q&A access"
    ],
    whatsapp: CONFIG.whatsappTier2 || CONFIG.whatsappGroupLink
  },
  tier3: {
    badge: "Your result",
    headline: "Let's Build Your Baby's Personal Feeding Plan",
    body: "You're ready for more than a general guide, you want something made for your baby specifically. The Personal Feeding Plan gives you that, plus priority support when you need it most.",
    tierName: "The Right Start + Personal Feeding Plan",
    items: [
      "The full guide (PDF)",
      "Nigerian Baby Cereal Comparison Chart",
      "First 30 Days of Solids Planner",
      "Audio version of the guide",
      "\"What My Family Says vs What's True\" cheat sheet",
      "Personalized recommendation for your baby",
      "Lifetime priority WhatsApp support"
    ],
    whatsapp: CONFIG.whatsappTier3 || CONFIG.whatsappGroupLink
  }
};

/* =========================================================
   APP LOGIC
   ========================================================= */
let currentQuestion = 0;
const answers = {};

const screenIntro = document.getElementById("screen-intro");
const screenQuiz = document.getElementById("screen-quiz");
const screenResult = document.getElementById("screen-result");
const qBody = document.getElementById("q-body");
const progressEl = document.getElementById("progress");
const backBtn = document.getElementById("btn-back");

document.getElementById("btn-start").addEventListener("click", () => {
  showScreen(screenQuiz);
  renderQuestion();
});

backBtn.addEventListener("click", () => {
  if(currentQuestion === 0){
    showScreen(screenIntro);
  } else {
    currentQuestion--;
    renderQuestion();
  }
});

function showScreen(screen){
  [screenIntro, screenQuiz, screenResult].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
  window.scrollTo(0,0);
}

function renderProgress(){
  progressEl.innerHTML = "";
  questions.forEach((q, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i <= currentQuestion ? " filled" : "");
    progressEl.appendChild(dot);
  });
}

function renderQuestion(){
  renderProgress();
  const q = questions[currentQuestion];
  qBody.innerHTML = `
    <p class="q-eyebrow">${q.eyebrow}</p>
    <h2 class="q-title">${q.title}</h2>
    <div class="q-options"></div>
  `;
  const optionsWrap = qBody.querySelector(".q-options");
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "btn-option";
    btn.type = "button";
    btn.textContent = opt.text;
    if(answers[q.id] === opt.id) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      answers[q.id] = opt.id;
      // small delay so the user sees the selection before advancing
      btn.classList.add("selected");
      setTimeout(() => {
        if(currentQuestion < questions.length - 1){
          currentQuestion++;
          renderQuestion();
        } else {
          showResult();
        }
      }, 180);
    });
    optionsWrap.appendChild(btn);
  });

  backBtn.textContent = currentQuestion === 0 ? "Back to start" : "Back";
}

function showResult(){
  const tierKey = routeToTier(answers);
  const r = results[tierKey];

  document.getElementById("result-body").innerHTML = `
    <div id="capture-area">
      <div class="capture-brand">The Right Start</div>
      <span class="result-badge">${r.badge}</span>
      <h1>${r.headline}</h1>
      <p>${r.body}</p>

      <div class="tier-card">
        <h3>${r.tierName}</h3>
        <p class="tier-includes-label">What's included for you:</p>
        <ul class="tier-list">
          ${r.items.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>
    </div>

    <button class="btn btn-screenshot" id="btn-screenshot" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .83-.45l.94-1.4A2 2 0 0 1 10.6 3h2.8a2 2 0 0 1 1.63 1.15l.94 1.4a1 1 0 0 0 .83.45H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
        <circle cx="12" cy="13" r="3.2" stroke="currentColor" stroke-width="1.7"/>
      </svg>
      Screenshot & save this result
    </button>
    <p id="screenshot-status" class="screenshot-status" aria-live="polite"></p>

    <div class="screenshot-note">
      <p><strong>Before you tap join below:</strong> take a screenshot of this page (or use the button above). As soon as you join the group, post the screenshot there, that's how we match your plan to your baby specifically when it's time.</p>
    </div>

    <div class="cta-block">
      <a class="btn btn-primary" style="display:block;text-decoration:none;text-align:center;" href="${r.whatsapp}" target="_blank" rel="noopener">Join the Waitlist Group</a>
      <p class="cta-subtext">Join other mums getting ready for launch, first access and the best guidance go to the group first.</p>
    </div>

    <button class="restart-link" id="btn-restart">Retake the quiz</button>
  `;

  document.getElementById("btn-screenshot").addEventListener("click", captureResultScreenshot);

  document.getElementById("btn-restart").addEventListener("click", () => {
    currentQuestion = 0;
    Object.keys(answers).forEach(k => delete answers[k]);
    showScreen(screenIntro);
  });

  showScreen(screenResult);
}

/* =========================================================
   SCREENSHOT CAPTURE — turns the result card into a real
   image the user can save or share directly to WhatsApp
   ========================================================= */
async function captureResultScreenshot(){
  const statusEl = document.getElementById("screenshot-status");
  const btn = document.getElementById("btn-screenshot");
  const target = document.getElementById("capture-area");

  if(typeof html2canvas === "undefined"){
    statusEl.textContent = "Couldn't load the screenshot tool, please take a manual screenshot instead.";
    return;
  }

  btn.disabled = true;
  statusEl.textContent = "Preparing your image…";

  try{
    const canvas = await html2canvas(target, {
      backgroundColor: "#FCF3E4",
      scale: Math.min(window.devicePixelRatio || 1, 2.5),
      useCORS: true
    });

    canvas.toBlob(async (blob) => {
      if(!blob){
        statusEl.textContent = "Something went wrong, please take a manual screenshot instead.";
        btn.disabled = false;
        return;
      }

      const fileName = "my-right-start-result.png";
      const file = new File([blob], fileName, { type: "image/png" });

      // Try the native share sheet first (works on most modern mobile browsers)
      if(navigator.canShare && navigator.canShare({ files: [file] })){
        try{
          await navigator.share({
            files: [file],
            title: "My Right Start result"
          });
          statusEl.textContent = "Done, you can now share or save it.";
          btn.disabled = false;
          return;
        } catch(shareErr){
          // user cancelled the share sheet, fall through to download
        }
      }

      // Fallback: trigger a normal download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      statusEl.textContent = "Saved! Check your downloads or photos.";
      btn.disabled = false;
    }, "image/png");

  } catch(err){
    statusEl.textContent = "Couldn't capture automatically, please take a manual screenshot instead.";
    btn.disabled = false;
  }
}
