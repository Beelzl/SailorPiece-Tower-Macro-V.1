function initParticles() {
  var canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 240;

  var particles = [];
  for (var i = 0; i < 28; i++) {
    particles.push({
      id: i,
      x: Math.random() * 300,
      y: Math.random() * 240,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, 300, 240);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.speed;
      p.opacity += Math.sin(Date.now() / 800 + p.id) * 0.004;
      if (p.y < -4) { p.y = 244; p.x = Math.random() * 300; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      var op = Math.max(0.05, Math.min(0.6, p.opacity));
      ctx.fillStyle = "rgba(246,51,154," + op + ")";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function initTitleShimmer() {
  var style = document.createElement("style");
  style.textContent =
    "@keyframes titleGlimmer {" +
    "  0%,100% { text-shadow: none; color: #c2185b; }" +
    "  50%     { text-shadow: 0 0 6px rgba(246,51,154,0.6); color: #e8558a; }" +
    "}" +
    "#title {" +
    "  animation: titleGlimmer 3s ease-in-out infinite;" +
    "}";
  document.head.appendChild(style);
}

function initLogoSpin() {
  var logo = document.getElementById("logo");
  if (!logo) return;
  var spinning = false;

  logo.addEventListener("mousedown", function (e) {
    e.stopPropagation();
    if (spinning) return;
    spinning = true;
    var deg = 0;
    var interval = setInterval(function () {
      deg += 18;
      logo.style.transform = "rotate(" + deg + "deg) scale(1.15)";
      if (deg >= 360) {
        clearInterval(interval);
        logo.style.transform = "";
        spinning = false;
      }
    }, 16);
  });
}

function initTimerShimmer() {
  var style = document.createElement("style");
  style.textContent =
    "@keyframes timerGlimmer {" +
    "  0%,100% { text-shadow: none; color: #880e4f; }" +
    "  50%     { text-shadow: 0 0 6px rgba(246,51,154,0.6); color: #b03070; }" +
    "}" +
    "#timer.shimmer {" +
    "  animation: timerGlimmer 3s ease-in-out infinite;" +
    "}";
  document.head.appendChild(style);
}

var _origSetStatus = window.setStatus;
window.setStatus = function (state) {
  _origSetStatus(state);
  var timer = document.getElementById("timer");
  if (timer) {
    timer.className = state === "running" ? "timer-value shimmer" : "timer-value";
  }
};

window.addEventListener("load", function () {
  initParticles();
  initTitleShimmer();
  initLogoSpin();
  initTimerShimmer();
});
