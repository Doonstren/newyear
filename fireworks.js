// Эти переменные будут инициализированы в main.js
let fwCanvas, fwCtx, fwWidth, fwHeight;
let fwTimer = 0;
let fireworks = [];
let particles = [];
let sparks = [];
let fireworksSystemActive = false;
let fireworkTriggerIntervalId = null;

const fwFrameDelay = 1000.0 / FIREWORK_SETTINGS.FRAME_RATE;

function initFireworks(canvasElement, context) {
    fwCanvas = canvasElement;
    fwCtx = context;
    resizeFireworksCanvas();
}

function resizeFireworksCanvas() {
    if (!fwCanvas) return;
    fwWidth = window.innerWidth;
    fwHeight = window.innerHeight;
    fwCanvas.width = fwWidth;
    fwCanvas.height = fwHeight;
}

function distance(px1, py1, px2, py2) {
  const xdis = px1 - px2;
  const ydis = py1 - py2;
  return Math.sqrt((xdis * xdis) + (ydis * ydis));
}

function getAngle(posx1, posy1, posx2, posy2) {
  if (posx1 == posx2) { return (posy1 > posy2) ? 90 : 270; }
  if (posy1 == posy2) { return (posx1 > posx2) ? 180 : 0; }
  const xDist = posx1 - posx2;
  const yDist = posy1 - posy2;
  if (xDist == yDist) { return (posx1 < posx2) ? 225 : 45; }
  if (-xDist == yDist) { return (posx1 < posx2) ? 135 : 315; }
  return Math.atan2(posy2 - posy1, posx2 - posx1) * (180 / Math.PI) + 180;
}

function random(min, max, round) {
  if (round === 'round') {
    return Math.round(Math.random() * (max - min) + min);
  } else {
    return Math.random() * (max - min) + min;
  }
}

function fireworkColors() {
  const colorList = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffac00', '#ff3377', '#33ff77', '#9900ff'];
  return colorList[Math.floor(Math.random() * colorList.length)];
}

function createNewFirework() {
  const firework = new Firework();
  firework.x = firework.sx = random(fwWidth * 0.1, fwWidth * 0.9);
  firework.y = firework.sy = fwHeight;
  firework.color = fireworkColors();
  firework.tx = random(fwWidth * 0.2, fwWidth * 0.8);
  firework.ty = random(fwHeight * 0.1, fwHeight * 0.5);
  const angle = getAngle(firework.sx, firework.sy, firework.tx, firework.ty);
  firework.vx = Math.cos(angle * Math.PI / 180.0);
  firework.vy = Math.sin(angle * Math.PI / 180.0);
  fireworks.push(firework);
}

function Firework() {
  this.x = 0; this.y = 0; this.sx = 0; this.sy = 0; this.tx = 0; this.ty = 0;
  this.vx = 0; this.vy = 0; this.color = 'rgb(255,255,255)'; this.dis = 0;
  this.speed = random(800, 1200); this.gravity = 0.5; this.ms = 0; this.s = 0;
  this.del = false; this.trail = []; this.maxTrail = 10;

  this.update = function(ms) {
    this.ms = ms / 1000;
    this.dis = distance(this.sx, this.sy, this.tx, this.ty);
    const currentDist = distance(this.sx, this.sy, this.x, this.y);
    const reachedPeak = currentDist >= this.dis * 0.8;

    if (reachedPeak) {
      const explosionType = random(1, 4, 'round');
      const explosionSize = 30 + Math.floor(Math.random() * 40);
      createExplosionParticles(explosionType, explosionSize, this.x, this.y, this.color);
      this.del = true;
    } else {
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > this.maxTrail) { this.trail.shift(); }
      this.speed *= 0.99;
      this.x -= this.vx * this.speed * this.ms;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
    }
    this.s++;
  }

  this.draw = function() {
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = i / this.trail.length;
      fwCtx.beginPath();
      fwCtx.globalAlpha = alpha;
      fwCtx.fillStyle = this.color;
      fwCtx.arc(this.trail[i].x, this.trail[i].y, 1 + i * 0.1, 0, 2 * Math.PI);
      fwCtx.fill();
    }
    fwCtx.globalAlpha = 1;
    fwCtx.beginPath();
    fwCtx.fillStyle = this.color;
    fwCtx.shadowBlur = 15;
    fwCtx.shadowColor = this.color;
    fwCtx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    fwCtx.fill();
    fwCtx.shadowBlur = 0;
  }
}

function createExplosionParticles(type, count, pox, poy, color) {
  const explosionType = random(1, 4, 'round');
  for (let i = 0; i < count; i++) {
    const par = new ExplosionParticle();
    par.type = explosionType;
    par.color = color;
    par.x = pox;
    par.y = poy;
    const angle = random(0, 360);
    par.vx = Math.cos(angle * Math.PI / 180.0);
    par.vy = Math.sin(angle * Math.PI / 180.0);
    particles.push(par);
  }
}

function ExplosionParticle() {
  this.x = 0; this.y = 0; this.vx = 0; this.vy = 0;
  this.speed = random(300, 600); this.gravity = 0.8; this.wind = 0;
  this.type = 1; this.opacity = 1; this.s = 0; this.scale = 1;
  this.color = '#FFF'; this.del = false; this.trail = []; this.maxTrail = 5;

  this.update = function(ms) {
    this.ms = ms / 1000;
    this.dis = distance(this.sx, this.sy, this.tx, this.ty);

    if (this.type == 3 || this.type == 4) {
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > this.maxTrail) { this.trail.shift(); }
    }

    if (this.s > 1200/ms) {
      if (this.opacity - 0.03 < 0) { this.opacity = 0; }
      else { this.opacity -= 0.03; }
    }

    if (this.type == 1) {
      this.speed *= 0.97;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
    } else if (this.type == 2) {
      if (this.s < 800/ms) { this.scale += 0.1; } else { this.scale -= 0.2; }
      this.speed *= 0.97;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
    } else if (this.type == 3) {
      this.speed *= 0.96;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms;
    } else if (this.type == 4) {
      this.speed *= 0.97;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
      if (this.s % 3 === 0) {
        const spark = new SparklerParticle();
        spark.x = this.x; spark.y = this.y;
        spark.vx = Math.cos(random(0, 360, 'round') * (Math.PI/180)) * 1.5;
        spark.vy = Math.sin(random(0, 360, 'round') * (Math.PI/180)) * 1.5;
        spark.tx = this.x; spark.ty = this.y;
        spark.color = this.color; spark.limit = random(5, 12, 'round');
        sparks.push(spark);
      }
    } else {
      this.speed *= 0.97;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
    }
    this.s++;
  }

  this.draw = function() {
    fwCtx.save();
    if ((this.type == 3 || this.type == 4) && this.trail.length > 0) {
      for (let i = 0; i < this.trail.length - 1; i++) {
        const alpha = i / this.trail.length * this.opacity * 0.5;
        fwCtx.globalAlpha = alpha;
        fwCtx.beginPath();
        fwCtx.moveTo(this.trail[i].x, this.trail[i].y);
        fwCtx.lineTo(this.trail[i+1].x, this.trail[i+1].y);
        fwCtx.strokeStyle = this.color;
        fwCtx.lineWidth = 1;
        fwCtx.stroke();
      }
    }
    fwCtx.globalAlpha = this.opacity;
    fwCtx.fillStyle = this.color;
    fwCtx.strokeStyle = this.color;
    fwCtx.shadowBlur = 10;
    fwCtx.shadowColor = this.color;

    if (this.type == 1) { fwCtx.beginPath(); fwCtx.arc(this.x, this.y, 2.5, 0, 2 * Math.PI); fwCtx.fill(); }
    else if (this.type == 2) { fwCtx.translate(this.x, this.y); fwCtx.scale(this.scale, this.scale); fwCtx.beginPath(); fwCtx.fillRect(-1, -1, 2, 2); }
    else if (this.type == 3) { fwCtx.beginPath(); fwCtx.moveTo(this.x, this.y); fwCtx.lineTo(this.x - this.vx * 12, this.y - this.vy * 12); fwCtx.lineWidth = 2; fwCtx.stroke(); }
    else if (this.type == 4) { fwCtx.beginPath(); fwCtx.arc(this.x, this.y, 2.5, 0, 2 * Math.PI); fwCtx.fill(); }
    else { fwCtx.beginPath(); fwCtx.arc(this.x, this.y, 2, 0, 2 * Math.PI); fwCtx.fill(); }
    fwCtx.restore();
  }
}

function SparklerParticle() {
  this.x = 0; this.y = 0; this.tx = 0; this.ty = 0;
  this.vx = 0; this.vy = 0; this.limit = 0; this.color = 'red';

  this.update = function() {
    this.tx += this.vx;
    this.ty += this.vy;
    this.limit--;
  }
  this.draw = function() {
    if (this.limit < 0) return;
    fwCtx.beginPath();
    fwCtx.moveTo(this.x, this.y);
    fwCtx.lineTo(this.tx, this.ty);
    fwCtx.lineWidth = 1;
    fwCtx.strokeStyle = this.color;
    fwCtx.stroke();
    fwCtx.closePath();
  }
}

function startFireworksSystem() {
  if (fireworksSystemActive || !isPageCurrentlyVisible()) return; // isPageCurrentlyVisible from main.js
  fireworksSystemActive = true;
  if (!fireworkTriggerIntervalId) {
    createNewFirework();
    fireworkTriggerIntervalId = setInterval(createNewFirework, FIREWORK_SETTINGS.TIMED_FIREWORK_INTERVAL);
  }
}

function stopFireworksSystem() {
  fireworksSystemActive = false;
  if (fireworkTriggerIntervalId) {
    clearInterval(fireworkTriggerIntervalId);
    fireworkTriggerIntervalId = null;
  }
  fireworks = []; particles = []; sparks = [];
  if (fwCtx && fwCanvas) fwCtx.clearRect(0, 0, fwWidth, fwHeight);
}

function updateFireworksFrame(ms) {
  if (!fireworksSystemActive || !fwCtx) return;
  fwCtx.clearRect(0, 0, fwWidth, fwHeight);
  fwTimer++;

  let i = fireworks.length;
  while (i--) {
    if (fireworks[i].del) { fireworks.splice(i, 1); }
    else { fireworks[i].update(ms); fireworks[i].draw(); }
  }
  i = particles.length;
  while (i--) {
    if (particles[i].opacity <= 0) { particles.splice(i, 1); }
    else { particles[i].update(ms); particles[i].draw(); }
  }
  i = sparks.length;
  while (i--) {
    if (sparks[i].limit < 0) { sparks.splice(i, 1); }
    else { sparks[i].update(); sparks[i].draw(); }
  }
}