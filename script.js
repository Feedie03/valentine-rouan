const heartBtn = document.getElementById("heartBtn");
const message = document.getElementById("message");
const actions = document.getElementById("actions");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const final = document.getElementById("final");
const burstLayer = document.getElementById("burstLayer");
const floatHearts = document.querySelector(".float-hearts");
const card = document.querySelector(".card");

let revealed = false;
let noTries = 0;

// --- Background floating hearts ---
const bgHearts = ["💗", "💖", "💘", "💕", "💞", "❤"];
function spawnBgHeart() {
  const el = document.createElement("div");
  el.className = "bg-heart";
  el.textContent = bgHearts[Math.floor(Math.random() * bgHearts.length)];

  const left = Math.random() * 100; // vw
  const size = 14 + Math.random() * 22; // px
  const dur = 6 + Math.random() * 6; // seconds
  const drift = (Math.random() * 120 - 60).toFixed(0) + "px";

  el.style.setProperty("--left", left + "vw");
  el.style.setProperty("--size", size + "px");
  el.style.setProperty("--dur", dur + "s");
  el.style.setProperty("--drift", drift);

  floatHearts.appendChild(el);

  // Cleanup after one cycle to avoid DOM bloat (dur seconds)
  setTimeout(() => el.remove(), dur * 1000);
}

// Start a gentle heart flow
setInterval(spawnBgHeart, 650);
for (let i = 0; i < 10; i++) setTimeout(spawnBgHeart, i * 180);

// --- Particle burst (hearts + sparkles) ---
const burstEmojis = ["💖", "💗", "✨", "💞", "💕", "💘", "🌸", "⭐"];
function burst(x, y, count = 26) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];

    // start position
    p.style.left = x + "px";
    p.style.top = y + "px";

    // random travel
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 140;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 30; // bias upward

    p.style.setProperty("--x0", "0px");
    p.style.setProperty("--y0", "0px");
    p.style.setProperty("--x1", dx.toFixed(0) + "px");
    p.style.setProperty("--y1", dy.toFixed(0) + "px");
    p.style.setProperty("--r", (Math.random() * 220 - 110).toFixed(0) + "deg");

    // random size
    const fs = 16 + Math.random() * 16;
    p.style.fontSize = fs.toFixed(0) + "px";

    burstLayer.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}

// Helper to get center of element
function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// Heart click: reveal message + buttons
heartBtn.addEventListener("click", () => {
  // cute bounce
  heartBtn.classList.remove("bounce");
  void heartBtn.offsetWidth; // reflow to restart animation
  heartBtn.classList.add("bounce");

  const { x, y } = centerOf(heartBtn);
  burst(x, y, 30);

  if (!revealed) {
    revealed = true;
    message.hidden = false;
    actions.hidden = false;
  }
});

// YES click
yesBtn.addEventListener("click", () => {
  const { x, y } = centerOf(yesBtn);
  burst(x, y, 45);

  // extra celebration across screen
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      burst(
        Math.random() * window.innerWidth,
        Math.random() * (window.innerHeight * 0.7),
        22
      );
    }, i * 120);
  }

  final.hidden = false;
  final.textContent = "YAY!! 🥰💞 Ik hou van jou habibti!";
  card.classList.add("glow");

  // make buttons chill after success
  noBtn.disabled = true;
  noBtn.style.opacity = "0.5";
  noBtn.style.cursor = "not-allowed";
  yesBtn.disabled = true;
  yesBtn.style.opacity = "0.9";
});

// NO button dodge (playful)
function moveNoButton() {
  // Move within the card area
  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Limit region to keep it visible inside card
  const padding = 18;
  const minX = cardRect.left + padding;
  const maxX = cardRect.right - btnRect.width - padding;
  const minY = cardRect.top + padding;
  const maxY = cardRect.bottom - btnRect.height - padding;

  const newX = Math.min(maxX, Math.max(minX, minX + Math.random() * (maxX - minX)));
  const newY = Math.min(maxY, Math.max(minY, minY + Math.random() * (maxY - minY)));

  // translate relative to its current position (using fixed positioning temporarily)
  noBtn.style.position = "fixed";
  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";
  noBtn.style.zIndex = "10";
}

noBtn.addEventListener("mouseenter", () => {
  if (!revealed) return;
  if (noTries >= 3) return;
  moveNoButton();
});

noBtn.addEventListener("click", () => {
  if (!revealed) return;
  noTries++;

  const { x, y } = centerOf(noBtn);
  burst(x, y, 18);

  if (noTries === 1) {
    noBtn.textContent = "Pardon… wil je klappen? 😭";
  } else if (noTries === 2) {
    noBtn.textContent = "Nee hehe 🙈💞";
  } else if (noTries >= 3) {
    // Stop dodging and turn into a yes-ish prompt
    noBtn.textContent = "Het is gwn ja dus klik maar 😇";
    noBtn.style.position = "static";
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.removeEventListener("mouseenter", moveNoButton);
  } else {
    moveNoButton();
  }
});
