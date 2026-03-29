
type Status = "stopped" | "running";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  id: number;
}

let status: Status = "stopped";
let clearCount = 0;
let startTime = 0;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let clearInterval_: ReturnType<typeof setInterval> | null = null;

function initParticles(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d")!;
  canvas.width = 300;
  canvas.height = 240;

  const particles: Particle[] = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 240,
    size: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.5 + 0.1,
    speed: Math.random() * 0.3 + 0.1,
  }));

  let raf: number;

  const draw = () => {
    ctx.clearRect(0, 0, 300, 240);
    for (const p of particles) {
      p.y -= p.speed;
      p.opacity += Math.sin(Date.now() / 800 + p.id) * 0.004;
      if (p.y < -4) {
        p.y = 244;
        p.x = Math.random() * 300;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(246,51,154,${Math.max(0.05, Math.min(0.6, p.opacity))})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };

  draw();
  return () => cancelAnimationFrame(raf);
}

function initGlitchTitle(el: HTMLElement): () => void {
  const interval = setInterval(() => {
    el.style.letterSpacing = "2px";
    el.style.textShadow = "1px 0 #f6339a, -1px 0 #00e5ff";
    setTimeout(() => {
      el.style.letterSpacing = "0px";
      el.style.textShadow = "none";
    }, 120);
  }, 4000 + Math.random() * 2000);

  return () => clearInterval(interval);
}

function fmt(n: number): string {
  return String(n).padStart(2, "0");
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${fmt(Math.floor(s / 3600))}:${fmt(Math.floor((s % 3600) / 60))}:${fmt(s % 60)}`;
}

function setStatusUI(s: Status): void {
  const text = document.getElementById("status-text");
  const dot = document.getElementById("status-dot");
  const pill = document.getElementById("status-pill");
  const timer = document.getElementById("timer");
  const clearEl = document.getElementById("clear-count");

  if (!text || !dot || !pill || !timer || !clearEl) return;

  if (s === "running") {
    text.textContent = "RUNNING";
    text.className = "status-text running";
    dot.className = "dot running";
    pill.className = "status-pill running";
    timer.textContent = "00:00:00";
  } else {
    text.textContent = "STOPPED";
    text.className = "status-text";
    dot.className = "dot";
    pill.className = "status-pill";
    timer.textContent = "--:--:--";
    clearEl.textContent = "Clear: 0";
  }
}

function startMacro(): void {
  if (status === "running") return;
  status = "running";
  clearCount = 0;
  startTime = Date.now();
  setStatusUI("running");

  timerInterval = setInterval(() => {
    const el = document.getElementById("timer");
    if (el) el.textContent = formatElapsed(Date.now() - startTime);
  }, 1000);

  clearInterval_ = setInterval(() => {
    clearCount++;
    const el = document.getElementById("clear-count");
    if (el) el.textContent = `Clear: ${clearCount}`;
  }, 7750);
}

function stopMacro(): void {
  if (status === "stopped") return;
  status = "stopped";
  clearCount = 0;
  if (timerInterval) clearInterval(timerInterval);
  if (clearInterval_) clearInterval(clearInterval_);
  setStatusUI("stopped");
}

function initToggle(el: HTMLElement): void {
  el.addEventListener("click", () => {
    const isOn = el.classList.contains("on");
    el.classList.toggle("on", !isOn);
  });
}

function init(): void {
  const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement | null;
  if (canvas) initParticles(canvas);

  const titleEl = document.getElementById("title");
  if (titleEl) initGlitchTitle(titleEl);

  const toggle = document.getElementById("toggle");
  if (toggle) initToggle(toggle);

  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  if (btnStart) btnStart.addEventListener("click", startMacro);
  if (btnStop) btnStop.addEventListener("click", stopMacro);
}

if (typeof window !== "undefined") {
  (window as Window & typeof globalThis & { TowerAutomation: object }).TowerAutomation = {
    init,
    startMacro,
    stopMacro,
    formatElapsed,
  };
  window.addEventListener("DOMContentLoaded", init);
}

export { init, startMacro, stopMacro, formatElapsed };
