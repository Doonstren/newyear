// --- Система Фейерверков ---

let fwCanvas, fwCtx, fwWidth, fwHeight;
let fireworks = [];
let particles = [];
let sparks = [];

const fwFrameDelay = 1000.0 / FIREWORK_SYSTEM_SETTINGS.FRAME_RATE;

// Объект для управления системой фейерверков
const FireworksManager = {
    isActive: false,
    intervalId: null,
    isPageVisibleFn: () => true,

    init: function(canvasElement, context, visibilityCallback) {
        fwCanvas = canvasElement;
        fwCtx = context;
        this.isPageVisibleFn = visibilityCallback;
        this.resize();
    },

    resize: function() {
        if (!fwCanvas) return;
        fwWidth = window.innerWidth;
        fwHeight = window.innerHeight;
        fwCanvas.width = fwWidth;
        fwCanvas.height = fwHeight;
    },

    start: function() {
        if (this.isActive || !this.isPageVisibleFn()) return;
        this.isActive = true;
        if (!this.intervalId) {
            createNewFireworkInternal();
            this.intervalId = setInterval(createNewFireworkInternal, FIREWORK_SYSTEM_SETTINGS.ROCKET_LAUNCH_INTERVAL_MS);
        }
    },

    stop: function() {
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        fireworks = []; particles = []; sparks = [];
        if (fwCtx && fwCanvas) fwCtx.clearRect(0, 0, fwWidth, fwHeight);
    },

    updateFrame: function(ms) {
        if (!this.isActive || !fwCtx) return;
        fwCtx.clearRect(0, 0, fwWidth, fwHeight);

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
    },

    isSystemActive: function() {
        return this.isActive;
    }
};

// --- Вспомогательные функции для геометрии и цветов ---
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

function getFireworkExplosionColor() {
  const colors = FIREWORK_SYSTEM_SETTINGS.EXPLOSION_COLORS;
  return colors[Math.floor(Math.random() * colors.length)];
}

// --- Создание новых элементов фейерверка (внутренние функции) ---
function createNewFireworkInternal() {
  const firework = new Firework();
  const rocketConfig = FIREWORK_SYSTEM_SETTINGS.rocket;

  firework.x = firework.sx = getRandomInRange(fwWidth * 0.1, fwWidth * 0.9);
  firework.y = firework.sy = fwHeight;
  firework.color = getFireworkExplosionColor();
  firework.tx = getRandomInRange(fwWidth * 0.2, fwWidth * 0.8);
  firework.ty = getRandomInRange(fwHeight * 0.1, fwHeight * 0.5);

  const angle = getAngle(firework.sx, firework.sy, firework.tx, firework.ty);
  firework.vx = Math.cos(angle * Math.PI / 180.0);
  firework.vy = Math.sin(angle * Math.PI / 180.0);

  firework.speed = getRandomInRange(rocketConfig.speed.min, rocketConfig.speed.max);
  firework.gravity = rocketConfig.gravity;
  firework.maxTrail = rocketConfig.trailLength;
  firework.size = rocketConfig.size;

  fireworks.push(firework);
}

function createExplosionParticlesInternal(type, count, pox, poy, color) {
  const particleConfig = FIREWORK_SYSTEM_SETTINGS.explosionParticle;
  for (let i = 0; i < count; i++) {
    const par = new ExplosionParticle();
    par.type = type;
    par.color = color;
    par.x = pox; par.y = poy;
    const angle = getRandomInRange(0, 360);
    par.vx = Math.cos(angle * Math.PI / 180.0);
    par.vy = Math.sin(angle * Math.PI / 180.0);

    par.speed = getRandomInRange(particleConfig.speed.min, particleConfig.speed.max);
    par.gravity = particleConfig.gravity;
    par.maxTrail = particleConfig.trailLength;
    par.size = particleConfig.size;
    par.lineWidth = particleConfig.lineWidth;

    particles.push(par);
  }
}

// --- Класс Ракеты Фейерверка ---
function Firework() {
  this.x = 0; this.y = 0; this.sx = 0; this.sy = 0; this.tx = 0; this.ty = 0;
  this.vx = 0; this.vy = 0; this.color = '#FFF'; this.dis = 0;
  this.speed = 1000; this.gravity = 0.5; this.size = 3;
  this.ms = 0; this.s = 0; this.del = false; this.trail = []; this.maxTrail = 10;

  this.update = function(ms) {
    this.ms = ms / 1000;
    this.dis = distance(this.sx, this.sy, this.tx, this.ty);
    const currentDist = distance(this.sx, this.sy, this.x, this.y);
    const reachedPeak = currentDist >= this.dis * FIREWORK_SYSTEM_SETTINGS.rocket.explosionPointRatio;

    if (reachedPeak) {
      const explosionType = getRandomIntInRange(1, 4);
      const explosionSize = getRandomIntInRange(
          FIREWORK_SYSTEM_SETTINGS.explosionParticle.count.min,
          FIREWORK_SYSTEM_SETTINGS.explosionParticle.count.max
      );
      createExplosionParticlesInternal(explosionType, explosionSize, this.x, this.y, this.color);
      this.del = true;
    } else {
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > this.maxTrail) { this.trail.shift(); }
      this.speed *= 0.99; // Небольшое замедление ракеты со временем
      this.x -= this.vx * this.speed * this.ms;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
    }
    this.s++;
  };

  this.draw = function() {
    // Отрисовка следа ракеты
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = i / this.trail.length;
      fwCtx.beginPath(); fwCtx.globalAlpha = alpha; fwCtx.fillStyle = this.color;
      fwCtx.arc(this.trail[i].x, this.trail[i].y, 1 + i * 0.1, 0, 2 * Math.PI);
      fwCtx.fill();
    }
    // Отрисовка "головы" ракеты
    fwCtx.globalAlpha = 1; fwCtx.beginPath(); fwCtx.fillStyle = this.color;
    fwCtx.shadowBlur = 15; fwCtx.shadowColor = this.color;
    fwCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    fwCtx.fill(); fwCtx.shadowBlur = 0;
  };
}

// --- Класс Частицы Взрыва Фейерверка ---
function ExplosionParticle() {
  this.x = 0; this.y = 0; this.vx = 0; this.vy = 0;
  this.speed = 450; this.gravity = 0.8; this.wind = 0;
  this.type = 1; this.opacity = 1; this.s = 0; this.scale = 1;
  this.color = '#FFF'; this.del = false; this.trail = []; this.maxTrail = 5;
  this.size = 2.5; this.lineWidth = 2;

  this.update = function(ms) {
    this.ms = ms / 1000;

    // Добавление следа для определенных типов частиц
    if (this.type == 3 || this.type == 4) {
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > this.maxTrail) { this.trail.shift(); }
    }

    // Уменьшение прозрачности частицы со временем
    if (this.s > FIREWORK_SYSTEM_SETTINGS.explosionParticle.decayStartTicksThresholdFactor / ms) {
      if (this.opacity - FIREWORK_SYSTEM_SETTINGS.explosionParticle.opacityDecay < 0) { this.opacity = 0; }
      else { this.opacity -= FIREWORK_SYSTEM_SETTINGS.explosionParticle.opacityDecay; }
    }

    // Логика движения в зависимости от типа взрыва
    if (this.type == 1) { // Стандартный разлет
      this.speed *= 0.97;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
    } else if (this.type == 2) { // Разлет с изменением размера (квадратики)
      if (this.s < 800/ms) { this.scale += 0.1; } else { this.scale -= 0.2; } // 800/ms - условный порог
      this.speed *= 0.97;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms - this.gravity;
    } else if (this.type == 3) { // Разлет линиями (хвосты комет)
      this.speed *= 0.96;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms; // Без гравитации
    } else if (this.type == 4) { // Бенгальский огонь (создает искры)
      this.speed *= 0.97;
      this.x -= this.vx * this.speed * this.ms + this.wind;
      this.y -= this.vy * this.speed * this.ms - this.gravity;

      if (this.s % 3 === 0) { // Создаем искры не каждый кадр для производительности
        const spark = new SparklerParticle();
        const sparkConfig = FIREWORK_SYSTEM_SETTINGS.sparkler;
        spark.x = this.x; spark.y = this.y;
        spark.vx = Math.cos(getRandomInRange(0, 360) * (Math.PI/180)) * sparkConfig.speedFactor;
        spark.vy = Math.sin(getRandomInRange(0, 360) * (Math.PI/180)) * sparkConfig.speedFactor;
        spark.tx = this.x; spark.ty = this.y;
        spark.color = this.color;
        spark.limit = getRandomIntInRange(sparkConfig.lifeTicks.min, sparkConfig.lifeTicks.max);
        sparks.push(spark);
      }
    }
    this.s++;
  };

  this.draw = function() {
    fwCtx.save();
    // Отрисовка следа для частиц типа 3 и 4
    if ((this.type == 3 || this.type == 4) && this.trail.length > 0) {
      for (let i = 0; i < this.trail.length - 1; i++) {
        const alpha = i / this.trail.length * this.opacity * 0.5;
        fwCtx.globalAlpha = alpha; fwCtx.beginPath();
        fwCtx.moveTo(this.trail[i].x, this.trail[i].y);
        fwCtx.lineTo(this.trail[i+1].x, this.trail[i+1].y);
        fwCtx.strokeStyle = this.color; fwCtx.lineWidth = 1; fwCtx.stroke();
      }
    }
    // Отрисовка самой частицы
    fwCtx.globalAlpha = this.opacity; fwCtx.fillStyle = this.color;
    fwCtx.strokeStyle = this.color; fwCtx.shadowBlur = 10; fwCtx.shadowColor = this.color;

    if (this.type == 1) { fwCtx.beginPath(); fwCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); fwCtx.fill(); }
    else if (this.type == 2) { fwCtx.translate(this.x, this.y); fwCtx.scale(this.scale, this.scale); fwCtx.beginPath(); fwCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size); }
    else if (this.type == 3) { fwCtx.beginPath(); fwCtx.moveTo(this.x, this.y); fwCtx.lineTo(this.x - this.vx * 12, this.y - this.vy * 12); fwCtx.lineWidth = this.lineWidth; fwCtx.stroke(); }
    else if (this.type == 4) { fwCtx.beginPath(); fwCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); fwCtx.fill(); }
    fwCtx.restore();
  };
}

// --- Класс Искры (для типа взрыва "бенгальский огонь") ---
function SparklerParticle() {
  this.x = 0; this.y = 0; this.tx = 0; this.ty = 0;
  this.vx = 0; this.vy = 0; this.limit = 0; this.color = 'red';

  this.update = function() { this.tx += this.vx; this.ty += this.vy; this.limit--; }

  this.draw = function() {
    if (this.limit < 0) return;
    fwCtx.beginPath(); fwCtx.moveTo(this.x, this.y); fwCtx.lineTo(this.tx, this.ty);
    fwCtx.lineWidth = 1; fwCtx.strokeStyle = this.color; fwCtx.stroke(); fwCtx.closePath();
  }
}