// Reveal a personal note and celebrate with a small, dependency-free confetti burst.
const revealButton = document.querySelector('#reveal-button');
const birthdayMessage = document.querySelector('#birthday-message');

revealButton.addEventListener('click', () => {
  birthdayMessage.hidden = false;
  revealButton.textContent = 'Birthday wishes delivered ✨';
  revealButton.disabled = true;
  launchConfetti();
  birthdayMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function launchConfetti() {
  const colors = ['#ff91c5', '#ffd96d', '#a991ff', '#8be3b0', '#89b7ff'];
  const pieces = 100;

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement('span');
    const size = 5 + Math.random() * 7;
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * (0.6 + Math.random())}px`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 260}px`);
    piece.style.setProperty('--spin', `${Math.random() * 900 - 450}deg`);
    piece.style.animationDuration = `${2.4 + Math.random() * 2.2}s`;
    document.body.append(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
  }
}

// Add a few slow stars behind the page. The canvas resizes with the viewport.
const canvas = document.querySelector('#particle-canvas');
const context = canvas.getContext('2d');
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = document.documentElement.scrollHeight;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(95, Math.floor(canvasWidth / 13)) }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: 0.5 + Math.random() * 1.2,
    alpha: 0.15 + Math.random() * 0.5,
    speed: 0.08 + Math.random() * 0.22,
  }));
}

function drawParticles() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  for (const particle of particles) {
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(204, 190, 255, ${particle.alpha})`;
    context.fill();
    particle.y -= particle.speed;
    if (particle.y < 0) particle.y = canvasHeight;
  }
  window.requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener('resize', resizeCanvas);

// Confetti styling lives here so the effect can be created entirely with CSS and JS.
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
  .confetti-piece { position: fixed; top: -16px; z-index: 10; pointer-events: none;
    border-radius: 2px; animation: confetti-fall linear forwards; }
  @keyframes confetti-fall { to { transform: translate3d(var(--drift), 110vh, 0) rotate(var(--spin)); opacity: .25; } }
  @media (prefers-reduced-motion: reduce) { .confetti-piece { display: none; } }
`;
document.head.append(confettiStyles);
