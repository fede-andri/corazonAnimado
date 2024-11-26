// Lista de mensajes personalizados
const messages = [
  "SHAMIRA NAHIARA LOPEZ ❤",
  "TE AMO 💖",
  "PUEDO SER TU NOVIO? 💖"
];

let currentMessageIndex = 0;

// Función para cambiar mensajes
function updateMessage() {
  const messageContainer = document.getElementById("messages");
  if (messageContainer) {
    messageContainer.textContent = messages[currentMessageIndex];
    currentMessageIndex = (currentMessageIndex + 1) % messages.length; // Alternar entre los mensajes
  }
}

// Cambia el mensaje cada 5 segundos
setInterval(updateMessage, 9000);

// Inicializa el primer mensaje
updateMessage();

// Inicializa la animación del corazón
let init = function () {
  let loaded = false;
  if (loaded) return;
  loaded = true;

  let canvas = document.getElementById("heart");
  let ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let rand = Math.random;

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, width, height);

  const heartPosition = (rad) => {
    return [
      Math.pow(Math.sin(rad), 3),
      -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
    ];
  };

  const scaleAndTranslate = (pos, sx, sy, dx, dy) => {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
  };

  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);
  });

  let pointsOrigin = [];
  let i;
  const dr = 0.1;
  for (i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
  }

  const targetPoints = [];
  const pulse = (kx, ky) => {
    for (i = 0; i < pointsOrigin.length; i++) {
      targetPoints[i] = [
        kx * pointsOrigin[i][0] + width / 2,
        ky * pointsOrigin[i][1] + height / 2
      ];
    }
  };

  let e = [];
  for (i = 0; i < pointsOrigin.length; i++) {
    e[i] = {
      vx: 0,
      vy: 0,
      R: 2,
      speed: rand() + 5,
      q: ~~(rand() * pointsOrigin.length),
      D: 2 * (i % 2) - 1,
      force: 0.2 * rand() + 0.7,
      f: "hsla(330," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
      trace: []
    };
    for (let k = 0; k < 50; k++) e[i].trace[k] = { x: rand() * width, y: rand() * height };
  }

  const config = { traceK: 0.4, timeDelta: 0.01 };
  let time = 0;

  const loop = () => {
    let n = -Math.cos(time);
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
    time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, width, height);

    for (let i = e.length; i--;) {
      let u = e[i];
      let q = targetPoints[u.q];
      let dx = u.trace[0].x - q[0];
      let dy = u.trace[0].y - q[1];
      let length = Math.sqrt(dx * dx + dy * dy);

      if (length < 10) {
        if (0.95 < rand()) {
          u.q = ~~(rand() * pointsOrigin.length);
        } else {
          if (0.99 < rand()) u.D *= -1;
          u.q += u.D;
          u.q %= pointsOrigin.length;
          if (u.q < 0) u.q += pointsOrigin.length;
        }
      }

      u.vx += -dx / length * u.speed;
      u.vy += -dy / length * u.speed;
      u.trace[0].x += u.vx;
      u.trace[0].y += u.vy;
      u.vx *= u.force;
      u.vy *= u.force;

      for (let k = 0; k < u.trace.length - 1;) {
        let T = u.trace[k];
        let N = u.trace[++k];
        N.x -= config.traceK * (N.x - T.x);
        N.y -= config.traceK * (N.y - T.y);
      }

      ctx.fillStyle = u.f;
      for (let k = 0; k < u.trace.length; k++) {
        ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
      }
    }

    window.requestAnimationFrame(loop, canvas);
  };
  loop();
};

// Carga la animación y los mensajes
let s = document.readyState;
if (s === "complete" || s === "loaded" || s === "interactive") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}
