// --- Управление сезонными эффектами на канвасе ---

let seasonalCanvas, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight;
let seasonalParticles = []; // Массив всех активных сезонных частиц
let lastParticleTime = Date.now(); // Для контроля частоты добавления новых частиц
let baseSeasonalParticleCount = 50; // Базовое кол-во частиц, зависит от размера экрана

// Инициализация модуля: установка канваса и первоначальный ресайз
function initSeasonalEffects(canvasElement, context) {
    seasonalCanvas = canvasElement;
    seasonalCtx = context;
    resizeSeasonalCanvas();
}

// Обновление размеров канваса и пересоздание частиц при изменении размера окна
function resizeSeasonalCanvas() {
    if (!seasonalCanvas) return;

    seasonalCanvasWidth = window.innerWidth;
    seasonalCanvasHeight = window.innerHeight;
    seasonalCanvas.width = seasonalCanvasWidth;
    seasonalCanvas.height = seasonalCanvasHeight;

    baseSeasonalParticleCount = Math.min(
        PARTICLE_SYSTEM_SETTINGS.MAX_PARTICLES,
        Math.max(
            PARTICLE_SYSTEM_SETTINGS.MIN_PARTICLES,
            Math.floor(seasonalCanvasWidth * seasonalCanvasHeight / PARTICLE_SYSTEM_SETTINGS.BASE_COUNT_DIVIDER)
        )
    );
    createSeasonalParticles(); // Пересоздать частицы для нового размера
}

// Создание начального набора сезонных частиц в зависимости от текущего месяца
function createSeasonalParticles() {
    seasonalParticles = [];
    const date = getCurrentDateInternal();
    const month = date.getMonth();
    const day = date.getDate();
    const isCurrentlyNewYear = (month === 11 && day === 31) || (month === 0 && day === 1);
    const pConfig = SEASONAL_PARTICLES_CONFIG;

    switch (month) {
        case 0: // Январь
            const snowJanCount = Math.floor(baseSeasonalParticleCount * (pConfig.snow.countMultiplier.january || pConfig.snow.countMultiplier.default));
            for (let i = 0; i < snowJanCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max),
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max),
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance
                });
            }
            break;
        case 1: // Февраль
            const snowFebCount = Math.floor(baseSeasonalParticleCount * (pConfig.snow.countMultiplier.february || pConfig.snow.countMultiplier.default));
            for (let i = 0; i < snowFebCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max) * 1.5,
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max) * 1.5,
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance / 2,
                    turbulence: getRandomInRange(pConfig.snow.turbulence.min, pConfig.snow.turbulence.max)
                });
            }
            break;
        case 2: // Март
            const snowMarCount = Math.floor(baseSeasonalParticleCount * (pConfig.snow.countMultiplier.march || pConfig.snow.countMultiplier.default));
            for (let i = 0; i < snowMarCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max) * 0.8,
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max) * 0.7,
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max) * 0.7,
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max) * 0.8,
                    type: 'snow', melting: true,
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance
                });
            }
            const rainMarCount = Math.floor(baseSeasonalParticleCount * (pConfig.rain.countMultiplier.march || 0.7));
            for (let i = 0; i < rainMarCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max),
                    speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max),
                    opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                    type: 'rain'
                });
            }
            const mistMarCount = Math.floor(baseSeasonalParticleCount * (pConfig.mist.countMultiplier.march || 0.2));
            for (let i = 0; i < mistMarCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: seasonalCanvasHeight - (Math.random() * seasonalCanvasHeight * 0.4),
                    r: getRandomInRange(pConfig.mist.radius.min, pConfig.mist.radius.max),
                    opacity: getRandomInRange(pConfig.mist.opacity.min, pConfig.mist.opacity.max),
                    type: 'mist',
                    speed: getRandomInRange(pConfig.mist.speed.min, pConfig.mist.speed.max)
                });
            }
            break;
        case 3: // Апрель
            const rainAprCount = Math.floor(baseSeasonalParticleCount * (pConfig.rain.countMultiplier.april || 0.4));
            for (let i = 0; i < rainAprCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max),
                    speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max),
                    opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                    type: 'rain'
                });
            }
            const petalAprCount = Math.floor(baseSeasonalParticleCount * (pConfig.petal.countMultiplier.april || 0.25));
            for (let i = 0; i < petalAprCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.petal.radius.min, pConfig.petal.radius.max),
                    drift: getRandomInRange(pConfig.petal.drift.min, pConfig.petal.drift.max),
                    speed: getRandomInRange(pConfig.petal.speed.min, pConfig.petal.speed.max),
                    color: pConfig.petal.colors[Math.floor(Math.random() * pConfig.petal.colors.length)],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: getRandomInRange(pConfig.petal.rotationSpeed.min, pConfig.petal.rotationSpeed.max),
                    type: 'petal'
                });
            }
            const budAprCount = Math.floor(baseSeasonalParticleCount * (pConfig.bud.countMultiplier.april || 0.15));
            for (let i = 0; i < budAprCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.bud.radius.min, pConfig.bud.radius.max),
                    color: pConfig.bud.color,
                    opacity: getRandomInRange(pConfig.bud.opacity.min, pConfig.bud.opacity.max),
                    speed: getRandomInRange(pConfig.bud.speed.min, pConfig.bud.speed.max),
                    drift: getRandomInRange(pConfig.bud.drift.min, pConfig.bud.drift.max),
                    type: 'bud'
                });
            }
            break;
        case 4: // Май
            if (Math.random() < 0.5) { // Вариант 1: Гроза
                const rainMayStormCount = Math.floor(baseSeasonalParticleCount * (pConfig.rain.countMultiplier.may_storm || 1.5));
                for (let i = 0; i < rainMayStormCount; i++) {
                    seasonalParticles.push({
                        x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                        length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max) * 1.2,
                        speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max) * 1.2,
                        opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                        type: 'rain'
                    });
                }
                const lightningCount = getRandomIntInRange(pConfig.lightning.count.min, pConfig.lightning.count.max);
                for (let i = 0; i < lightningCount; i++) {
                    seasonalParticles.push({
                        x: Math.random() * seasonalCanvasWidth, y: 0,
                        opacity: pConfig.lightning.opacity, type: 'lightning',
                        nextStrike: getRandomInRange(pConfig.lightning.nextStrikeDelay.min, pConfig.lightning.nextStrikeDelay.max),
                        lastStrike: Date.now() + Math.random() * pConfig.lightning.initialStrikeDelayMax
                    });
                }
            } else { // Вариант 2: Насекомые и лепестки
                const butterflyMayCount = Math.floor(baseSeasonalParticleCount * (pConfig.butterfly.countMultiplier.may_calm || 0.1));
                for (let i = 0; i < butterflyMayCount; i++) {
                    seasonalParticles.push({
                        x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                        size: getRandomInRange(pConfig.butterfly.size.min, pConfig.butterfly.size.max),
                        speed: getRandomInRange(pConfig.butterfly.speed.min, pConfig.butterfly.speed.max),
                        angle: Math.random() * Math.PI * 2,
                        wingSpeed: getRandomInRange(pConfig.butterfly.wingSpeed.min, pConfig.butterfly.wingSpeed.max),
                        wingPhase: Math.random() * Math.PI * 2,
                        color: pConfig.butterfly.colors[Math.floor(Math.random() * pConfig.butterfly.colors.length)],
                        type: 'butterfly'
                    });
                }
                const ladybugMayCount = Math.floor(baseSeasonalParticleCount * (pConfig.ladybug.countMultiplier.may_calm || 0.05));
                for (let i = 0; i < ladybugMayCount; i++) {
                    seasonalParticles.push({
                        x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                        size: getRandomInRange(pConfig.ladybug.size.min, pConfig.ladybug.size.max),
                        speed: getRandomInRange(pConfig.ladybug.speed.min, pConfig.ladybug.speed.max),
                        angle: Math.random() * Math.PI * 2, color: '#FF3333', type: 'ladybug',
                        spots: getRandomIntInRange(pConfig.ladybug.spots.min, pConfig.ladybug.spots.max),
                        wiggleSpeed: getRandomInRange(pConfig.ladybug.wiggleSpeedFactor.min, pConfig.ladybug.wiggleSpeedFactor.max),
                        wiggleAmount: getRandomInRange(pConfig.ladybug.wiggleAmountFactor.min, pConfig.ladybug.wiggleAmountFactor.max),
                        lastWiggle: Date.now()
                    });
                }
                const pollenMayCount = Math.floor(baseSeasonalParticleCount * (pConfig.pollen.countMultiplier.may_calm || 0.15));
                for (let i = 0; i < pollenMayCount; i++) {
                    seasonalParticles.push({
                        x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                        r: getRandomInRange(pConfig.pollen.radius.min, pConfig.pollen.radius.max),
                        d: Math.random() * Math.PI * 2,
                        speed: getRandomInRange(pConfig.pollen.speed.min, pConfig.pollen.speed.max),
                        drift: getRandomInRange(pConfig.pollen.drift.min, pConfig.pollen.drift.max),
                        opacity: getRandomInRange(pConfig.pollen.opacity.min, pConfig.pollen.opacity.max),
                        color: pConfig.pollen.color, type: 'pollen'
                    });
                }
                const petalMayCount = Math.floor(baseSeasonalParticleCount * (pConfig.petal.countMultiplier.may_calm || 0.1));
                for (let i = 0; i < petalMayCount; i++) {
                    seasonalParticles.push({
                        x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                        r: getRandomInRange(pConfig.petal.radius.min, pConfig.petal.radius.max),
                        drift: getRandomInRange(pConfig.petal.drift.min, pConfig.petal.drift.max),
                        speed: getRandomInRange(pConfig.petal.speed.min, pConfig.petal.speed.max),
                        color: pConfig.petal.colors[Math.floor(Math.random() * pConfig.petal.colors.length)],
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: getRandomInRange(pConfig.petal.rotationSpeed.min, pConfig.petal.rotationSpeed.max),
                        type: 'petal'
                    });
                }
            }
            break;
        case 5: // Июнь
            const sunflareJuneCount = Math.floor(baseSeasonalParticleCount * (pConfig.sunflare.countMultiplier.june || 0.2));
            for (let i = 0; i < sunflareJuneCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.sunflare.radius.min, pConfig.sunflare.radius.max),
                    opacity: getRandomInRange(pConfig.sunflare.opacity.min, pConfig.sunflare.opacity.max),
                    speed: getRandomInRange(pConfig.sunflare.twinkleSpeedBase.min, pConfig.sunflare.twinkleSpeedBase.max),
                    color: pConfig.sunflare.colorDay, type: 'sunflare'
                });
            }
            const butterflyJuneCount = Math.floor(baseSeasonalParticleCount * (pConfig.butterfly.countMultiplier.june || 0.1));
            for (let i = 0; i < butterflyJuneCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    size: getRandomInRange(pConfig.butterfly.size.min, pConfig.butterfly.size.max),
                    speed: getRandomInRange(pConfig.butterfly.speed.min, pConfig.butterfly.speed.max),
                    angle: Math.random() * Math.PI * 2,
                    wingSpeed: getRandomInRange(pConfig.butterfly.wingSpeed.min, pConfig.butterfly.wingSpeed.max),
                    wingPhase: Math.random() * Math.PI * 2,
                    color: pConfig.butterfly.colors[Math.floor(Math.random() * pConfig.butterfly.colors.length)],
                    type: 'butterfly'
                });
            }
            const dandelionJuneCount = Math.floor(baseSeasonalParticleCount * (pConfig.dandelion.countMultiplier.june || 0.15));
            for (let i = 0; i < dandelionJuneCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.dandelion.radius.min, pConfig.dandelion.radius.max),
                    opacity: getRandomInRange(pConfig.dandelion.opacity.min, pConfig.dandelion.opacity.max),
                    speed: getRandomInRange(pConfig.dandelion.speed.min, pConfig.dandelion.speed.max),
                    drift: getRandomInRange(pConfig.dandelion.drift.min, pConfig.dandelion.drift.max),
                    type: 'dandelion', angle: Math.random() * Math.PI * 2
                });
            }
            break;
        case 6: // Июль
            const sunflareJulyCount = Math.floor(baseSeasonalParticleCount * (pConfig.sunflare.countMultiplier.july || 0.25));
            for (let i = 0; i < sunflareJulyCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.sunflare.radius.min, pConfig.sunflare.radius.max),
                    opacity: getRandomInRange(pConfig.sunflare.opacity.min, pConfig.sunflare.opacity.max),
                    speed: getRandomInRange(pConfig.sunflare.twinkleSpeedBase.min, pConfig.sunflare.twinkleSpeedBase.max),
                    color: Math.random() < pConfig.sunflare.eveningColorChance ? pConfig.sunflare.colorEvening : pConfig.sunflare.colorDay,
                    type: 'sunflare'
                });
            }
            for (let i = 0; i < pConfig.cloud.countMax; i++) {
                seasonalParticles.push({
                    x: seasonalCanvasWidth * i / pConfig.cloud.countMax - getRandomInRange(50,150),
                    y: Math.random() * seasonalCanvasHeight * 0.4,
                    width: getRandomInRange(pConfig.cloud.width.min, pConfig.cloud.width.max),
                    height: getRandomInRange(pConfig.cloud.height.min, pConfig.cloud.height.max),
                    speed: getRandomInRange(pConfig.cloud.speed.min, pConfig.cloud.speed.max),
                    opacity: getRandomInRange(pConfig.cloud.opacity.min, pConfig.cloud.opacity.max),
                    type: 'cloud'
                });
            }
            const dragonflyJulyCount = Math.floor(baseSeasonalParticleCount * (pConfig.dragonfly.countMultiplier.july || 0.02));
            for (let i = 0; i < dragonflyJulyCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight * 0.7,
                    size: getRandomInRange(pConfig.dragonfly.size.min, pConfig.dragonfly.size.max),
                    speed: getRandomInRange(pConfig.dragonfly.speed.min, pConfig.dragonfly.speed.max),
                    angle: Math.random() * Math.PI * 2,
                    wingSpeed: getRandomInRange(pConfig.dragonfly.wingSpeed.min, pConfig.dragonfly.wingSpeed.max),
                    wingPhase: Math.random() * Math.PI * 2, type: 'dragonfly'
                });
            }
            break;
        case 7: // Август
            const sunflareAugCount = Math.floor(baseSeasonalParticleCount * (pConfig.sunflare.countMultiplier.august || 0.22));
            for (let i = 0; i < sunflareAugCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.sunflare.radius.min, pConfig.sunflare.radius.max),
                    opacity: getRandomInRange(pConfig.sunflare.opacity.min, pConfig.sunflare.opacity.max),
                    speed: getRandomInRange(pConfig.sunflare.twinkleSpeedBase.min, pConfig.sunflare.twinkleSpeedBase.max),
                    color: pConfig.sunflare.colorEvening, type: 'sunflare'
                });
            }
            const heatAugCount = Math.floor(baseSeasonalParticleCount * (pConfig.heat.countMultiplier.august || 0.3));
            for (let i = 0; i < heatAugCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: seasonalCanvasHeight - (Math.random() * seasonalCanvasHeight * 0.5),
                    r: getRandomInRange(pConfig.heat.radius.min, pConfig.heat.radius.max),
                    opacity: getRandomInRange(pConfig.heat.opacity.min, pConfig.heat.opacity.max),
                    type: 'heat',
                    speed: getRandomInRange(pConfig.heat.speed.min, pConfig.heat.speed.max)
                });
            }
            const dragonflyAugCount = Math.floor(baseSeasonalParticleCount * (pConfig.dragonfly.countMultiplier.august || 0.04));
            for (let i = 0; i < dragonflyAugCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight * 0.7,
                    size: getRandomInRange(pConfig.dragonfly.size.min, pConfig.dragonfly.size.max),
                    speed: getRandomInRange(pConfig.dragonfly.speed.min, pConfig.dragonfly.speed.max),
                    angle: Math.random() * Math.PI * 2,
                    wingSpeed: getRandomInRange(pConfig.dragonfly.wingSpeed.min, pConfig.dragonfly.wingSpeed.max),
                    wingPhase: Math.random() * Math.PI * 2, type: 'dragonfly'
                });
            }
            break;
        case 8: // Сентябрь
            const leafSepCount = Math.floor(baseSeasonalParticleCount * (pConfig.leaf.countMultiplier.september || 0.3));
            for (let i = 0; i < leafSepCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.leaf.radius.min, pConfig.leaf.radius.max),
                    rotation: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.leaf.speed.min, pConfig.leaf.speed.max),
                    drift: getRandomInRange(pConfig.leaf.drift.min, pConfig.leaf.drift.max),
                    rotationSpeed: getRandomInRange(pConfig.leaf.rotationSpeed.min, pConfig.leaf.rotationSpeed.max),
                    color: pConfig.leaf.colors.september[Math.floor(Math.random() * pConfig.leaf.colors.september.length)],
                    type: 'leaf', shape: Math.floor(Math.random() * pConfig.leaf.shapeVariety)
                });
            }
            break;
        case 9: // Октябрь
            const leafOctCount = Math.floor(baseSeasonalParticleCount * (pConfig.leaf.countMultiplier.october || 0.8));
            for (let i = 0; i < leafOctCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.leaf.radius.min, pConfig.leaf.radius.max),
                    rotation: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.leaf.speed.min, pConfig.leaf.speed.max),
                    drift: getRandomInRange(pConfig.leaf.drift.min, pConfig.leaf.drift.max),
                    rotationSpeed: getRandomInRange(pConfig.leaf.rotationSpeed.min, pConfig.leaf.rotationSpeed.max),
                    color: pConfig.leaf.colors.october[Math.floor(Math.random() * pConfig.leaf.colors.october.length)],
                    type: 'leaf', shape: Math.floor(Math.random() * pConfig.leaf.shapeVariety),
                    swingFactor: getRandomInRange(pConfig.leaf.swingFactor.min, pConfig.leaf.swingFactor.max)
                });
            }
            break;
        case 10: // Ноябрь
            const leafNovCount = Math.floor(baseSeasonalParticleCount * (pConfig.leaf.countMultiplier.november || 0.4));
            for (let i = 0; i < leafNovCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.leaf.radius.min, pConfig.leaf.radius.max),
                    rotation: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.leaf.speed.min, pConfig.leaf.speed.max),
                    drift: getRandomInRange(pConfig.leaf.drift.min, pConfig.leaf.drift.max),
                    rotationSpeed: getRandomInRange(pConfig.leaf.rotationSpeed.min, pConfig.leaf.rotationSpeed.max),
                    color: pConfig.leaf.colors.november[Math.floor(Math.random() * pConfig.leaf.colors.november.length)],
                    type: 'leaf', shape: Math.floor(Math.random() * pConfig.leaf.shapeVariety), withered: true,
                    swingFactor: getRandomInRange(pConfig.leaf.swingFactor.min, pConfig.leaf.swingFactor.max)
                });
            }
            const rainNovCount = Math.floor(baseSeasonalParticleCount * (pConfig.rain.countMultiplier.november || 0.8));
            for (let i = 0; i < rainNovCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max),
                    speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max),
                    opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                    type: 'rain'
                });
            }
            const mistNovCount = Math.floor(baseSeasonalParticleCount * (pConfig.mist.countMultiplier.november || 0.4));
            for (let i = 0; i < mistNovCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.mist.radius.min, pConfig.mist.radius.max),
                    opacity: getRandomInRange(pConfig.mist.opacity.min, pConfig.mist.opacity.max),
                    type: 'mist',
                    speed: getRandomInRange(pConfig.mist.speed.min, pConfig.mist.speed.max)
                });
            }
            break;
        case 11: // Декабрь
            const snowDecCount = Math.floor(baseSeasonalParticleCount * (pConfig.snow.countMultiplier.december || pConfig.snow.countMultiplier.default));
            for (let i = 0; i < snowDecCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max),
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max),
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance
                });
            }
            break;
        default: // По умолчанию
            const snowDefCount = Math.floor(baseSeasonalParticleCount * pConfig.snow.countMultiplier.default);
            for (let i = 0; i < snowDefCount; i++) {
                seasonalParticles.push({
                    x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max),
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max),
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance
                });
            }
    }

    // Специальные частицы для Нового Года
    if (isCurrentlyNewYear) {
        seasonalParticles = seasonalParticles.filter(p => Math.random() < 0.1 && p.type === 'snow');
        const snowNYCount = Math.floor(baseSeasonalParticleCount * (pConfig.snow.countMultiplier.newYear || 0.4));
        for (let i = 0; i < snowNYCount; i++) {
            seasonalParticles.push({
                x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max) * 1.2,
                d: Math.random() * Math.PI * 2,
                speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max) * 0.8,
                drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max) * 0.8,
                opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                type: 'snow', arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max) + 2, detail: true
            });
        }
        const twinkleNYCount = Math.floor(baseSeasonalParticleCount * (pConfig.twinkle.countMultiplier.newYear || 0.3));
        for (let i = 0; i < twinkleNYCount; i++) {
            seasonalParticles.push({
                x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                r: getRandomInRange(pConfig.twinkle.radius.min, pConfig.twinkle.radius.max),
                opacity: getRandomInRange(pConfig.twinkle.opacity.min, pConfig.twinkle.opacity.max),
                color: pConfig.twinkle.colors[Math.floor(Math.random() * pConfig.twinkle.colors.length)],
                type: 'twinkle',
                speed: getRandomInRange(pConfig.twinkle.moveSpeedFactor.min, pConfig.twinkle.moveSpeedFactor.max),
                twinkleSpeed: getRandomInRange(pConfig.twinkle.twinkleFrequency.min, pConfig.twinkle.twinkleFrequency.max)
            });
        }
        const confettiNYCount = Math.floor(baseSeasonalParticleCount * (pConfig.confetti.countMultiplier.newYear || 0.3));
        for (let i = 0; i < confettiNYCount; i++) {
            seasonalParticles.push({
                x: Math.random() * seasonalCanvasWidth, y: Math.random() * seasonalCanvasHeight,
                r: getRandomInRange(pConfig.confetti.radius.min, pConfig.confetti.radius.max),
                rotation: Math.random() * Math.PI * 2,
                speed: getRandomInRange(pConfig.confetti.speed.min, pConfig.confetti.speed.max),
                drift: getRandomInRange(pConfig.confetti.drift.min, pConfig.confetti.drift.max),
                rotationSpeed: getRandomInRange(pConfig.confetti.rotationSpeed.min, pConfig.confetti.rotationSpeed.max),
                color: pConfig.confetti.colors[Math.floor(Math.random() * pConfig.confetti.colors.length)],
                type: 'confetti', shape: Math.floor(Math.random() * pConfig.confetti.shapeVariety)
            });
        }
    }
}

// Обновление и отрисовка всех сезонных частиц
function updateAndDrawSeasonalParticles() {
    if (!seasonalCtx || !seasonalCanvas) return;
    seasonalCtx.clearRect(0, 0, seasonalCanvasWidth, seasonalCanvasHeight);
    const currentTime = Date.now();

    // Периодическое добавление новых частиц
    if (seasonalParticles.length < baseSeasonalParticleCount * (PARTICLE_SYSTEM_SETTINGS.MAX_PARTICLE_BUFFER_MULTIPLIER - 0.2) &&
        currentTime - lastParticleTime > PARTICLE_SYSTEM_SETTINGS.CREATION_INTERVAL_MS) {
        addNewSeasonalParticles();
        lastParticleTime = currentTime;
    }

    for (let i = seasonalParticles.length - 1; i >= 0; i--) {
        const p = seasonalParticles[i];
        let particleRemoved = false;

        switch (p.type) {
            case 'snow':
                drawSnowParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight);
                if (p.melting && (p.r < 0.5 || p.opacity < 0.1)) { seasonalParticles.splice(i, 1); particleRemoved = true; }
                break;
            case 'rain': drawRainParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'petal': drawPetalParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'sunflare': drawSunflareParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'butterfly': drawButterflyParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'dragonfly': drawDragonflyParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'leaf': drawLeafParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'mist': drawMistParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'cloud': drawCloudParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'pollen': drawPollenParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'heat': drawHeatParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'dandelion': drawDandelionParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'twinkle': drawTwinkleParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'confetti': drawConfettiParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'ladybug': drawLadybugParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'bud': drawBudParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight); break;
            case 'lightning':
                drawLightningParticle(p, seasonalCtx, seasonalCanvasWidth, seasonalCanvasHeight);
                if (p.opacity <= 0 && !p.hasOwnProperty('nextStrike')) {
                    seasonalParticles.splice(i, 1); particleRemoved = true;
                } else if (p.opacity <= 0 && p.hasOwnProperty('nextStrike')) {
                    if (Date.now() - p.lastStrike > p.nextStrike) {
                         p.opacity = SEASONAL_PARTICLES_CONFIG.lightning.opacity;
                         p.x = Math.random() * seasonalCanvasWidth; p.y = 0;
                         p.lastStrike = Date.now();
                         p.nextStrike = getRandomInRange(SEASONAL_PARTICLES_CONFIG.lightning.nextStrikeDelay.min, SEASONAL_PARTICLES_CONFIG.lightning.nextStrikeDelay.max);
                    }
                }
                break;
            default:
                seasonalParticles.splice(i, 1); particleRemoved = true;
                break;
        }
        // Удаление частиц, вышедших далеко за пределы экрана
        const buffer = (p.r || p.length || p.size || 50) * PARTICLE_SYSTEM_SETTINGS.SCREEN_EXIT_BUFFER_MULTIPLIER;
        if (!particleRemoved && !p.hasOwnProperty('nextStrike') &&
            (p.y > seasonalCanvasHeight + buffer ||
             p.y < -buffer ||
             p.x > seasonalCanvasWidth + buffer ||
             p.x < -buffer))
        {
            seasonalParticles.splice(i, 1);
        }
    }
}

// Добавление новых частиц для поддержания плотности эффекта
function addNewSeasonalParticles() {
    const date = getCurrentDateInternal();
    const month = date.getMonth();
    const day = date.getDate();
    const isCurrentlyNewYear = (month === 11 && day === 31) || (month === 0 && day === 1);
    const countToAdd = Math.max(1, Math.floor(baseSeasonalParticleCount * PARTICLE_SYSTEM_SETTINGS.ADD_PARTICLES_RATIO));
    const pConfig = SEASONAL_PARTICLES_CONFIG;

    for (let i = 0; i < countToAdd; i++) {
        let newParticle = null;
        const randomTypeChoice = Math.random();

        switch (month) {
            case 0:
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max),
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max),
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance
                };
                break;
            case 1:
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max)*1.5,
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max)*1.5,
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance/2,
                    turbulence: getRandomInRange(pConfig.snow.turbulence.min, pConfig.snow.turbulence.max)
                };
                break;
            case 2:
                if (randomTypeChoice < 0.7) {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max),
                        speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max),
                        opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                        type: 'rain'
                    };
                } else {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max)*0.8,
                        d: Math.random() * Math.PI * 2,
                        speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max)*0.7,
                        drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max)*0.7,
                        opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max)*0.8,
                        type: 'snow', melting: true,
                        arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                        detail: Math.random() < pConfig.snow.detailChance
                    };
                }
                break;
            case 3: // Апрель
                if (randomTypeChoice < 0.5) {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max),
                        speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max),
                        opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                        type: 'rain'
                    };
                } else if (randomTypeChoice < 0.8) {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        r: getRandomInRange(pConfig.petal.radius.min, pConfig.petal.radius.max),
                        drift: getRandomInRange(pConfig.petal.drift.min, pConfig.petal.drift.max),
                        speed: getRandomInRange(pConfig.petal.speed.min, pConfig.petal.speed.max),
                        color: pConfig.petal.colors[Math.floor(Math.random() * pConfig.petal.colors.length)],
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: getRandomInRange(pConfig.petal.rotationSpeed.min, pConfig.petal.rotationSpeed.max),
                        type: 'petal'
                    };
                } else {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        r: getRandomInRange(pConfig.bud.radius.min, pConfig.bud.radius.max),
                        color: pConfig.bud.color,
                        opacity: getRandomInRange(pConfig.bud.opacity.min, pConfig.bud.opacity.max),
                        speed: getRandomInRange(pConfig.bud.speed.min, pConfig.bud.speed.max),
                        drift: getRandomInRange(pConfig.bud.drift.min, pConfig.bud.drift.max),
                        type: 'bud'
                    };
                }
                break;
            case 4: // Май
              const isRainingMay = seasonalParticles.some(p => p.type === 'rain');
              if (isRainingMay) {
                 if (randomTypeChoice < 0.8) {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max)*1.2,
                        speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max)*1.2,
                        opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                        type: 'rain'
                    };
                 }
              } else {
                 if (randomTypeChoice < 0.3) {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        size: getRandomInRange(pConfig.butterfly.size.min, pConfig.butterfly.size.max),
                        speed: getRandomInRange(pConfig.butterfly.speed.min, pConfig.butterfly.speed.max),
                        angle: Math.random() * Math.PI * 2,
                        wingSpeed: getRandomInRange(pConfig.butterfly.wingSpeed.min, pConfig.butterfly.wingSpeed.max),
                        wingPhase: Math.random() * Math.PI * 2,
                        color: pConfig.butterfly.colors[Math.floor(Math.random() * pConfig.butterfly.colors.length)],
                        type: 'butterfly'
                    };
                 } else if (randomTypeChoice < 0.5) {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        size: getRandomInRange(pConfig.ladybug.size.min, pConfig.ladybug.size.max),
                        speed: getRandomInRange(pConfig.ladybug.speed.min, pConfig.ladybug.speed.max),
                        angle: Math.random() * Math.PI * 2, color: '#FF3333', type: 'ladybug',
                        spots: getRandomIntInRange(pConfig.ladybug.spots.min, pConfig.ladybug.spots.max),
                        wiggleSpeed: getRandomInRange(pConfig.ladybug.wiggleSpeedFactor.min, pConfig.ladybug.wiggleSpeedFactor.max),
                        wiggleAmount: getRandomInRange(pConfig.ladybug.wiggleAmountFactor.min, pConfig.ladybug.wiggleAmountFactor.max),
                        lastWiggle: Date.now()
                    };
                 } else if (randomTypeChoice < 0.8) {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        r: getRandomInRange(pConfig.pollen.radius.min, pConfig.pollen.radius.max),
                        d: Math.random() * Math.PI * 2,
                        speed: getRandomInRange(pConfig.pollen.speed.min, pConfig.pollen.speed.max),
                        drift: getRandomInRange(pConfig.pollen.drift.min, pConfig.pollen.drift.max),
                        opacity: getRandomInRange(pConfig.pollen.opacity.min, pConfig.pollen.opacity.max),
                        color: pConfig.pollen.color, type: 'pollen'
                    };
                 } else {
                    newParticle = {
                        x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                        r: getRandomInRange(pConfig.petal.radius.min, pConfig.petal.radius.max),
                        drift: getRandomInRange(pConfig.petal.drift.min, pConfig.petal.drift.max),
                        speed: getRandomInRange(pConfig.petal.speed.min, pConfig.petal.speed.max),
                        color: pConfig.petal.colors[Math.floor(Math.random() * pConfig.petal.colors.length)],
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: getRandomInRange(pConfig.petal.rotationSpeed.min, pConfig.petal.rotationSpeed.max),
                        type: 'petal'
                    };
                 }
              }
              break;
            case 5: // Июнь
              if (randomTypeChoice < 0.3) {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.sunflare.radius.min, pConfig.sunflare.radius.max),
                    opacity: getRandomInRange(pConfig.sunflare.opacity.min, pConfig.sunflare.opacity.max),
                    speed: getRandomInRange(pConfig.sunflare.twinkleSpeedBase.min, pConfig.sunflare.twinkleSpeedBase.max),
                    color: pConfig.sunflare.colorDay, type: 'sunflare'
                };
              } else if (randomTypeChoice < 0.7) {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    size: getRandomInRange(pConfig.butterfly.size.min, pConfig.butterfly.size.max),
                    speed: getRandomInRange(pConfig.butterfly.speed.min, pConfig.butterfly.speed.max),
                    angle: Math.random() * Math.PI * 2,
                    wingSpeed: getRandomInRange(pConfig.butterfly.wingSpeed.min, pConfig.butterfly.wingSpeed.max),
                    wingPhase: Math.random() * Math.PI * 2,
                    color: pConfig.butterfly.colors[Math.floor(Math.random() * pConfig.butterfly.colors.length)],
                    type: 'butterfly'
                };
              } else {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.dandelion.radius.min, pConfig.dandelion.radius.max),
                    opacity: getRandomInRange(pConfig.dandelion.opacity.min, pConfig.dandelion.opacity.max),
                    speed: getRandomInRange(pConfig.dandelion.speed.min, pConfig.dandelion.speed.max),
                    drift: getRandomInRange(pConfig.dandelion.drift.min, pConfig.dandelion.drift.max),
                    type: 'dandelion', angle: Math.random() * Math.PI * 2
                };
              }
              break;
            case 6: // Июль
              const cloudCount = seasonalParticles.filter(p => p.type === 'cloud').length;
              if (randomTypeChoice < 0.6) {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.sunflare.radius.min, pConfig.sunflare.radius.max),
                    opacity: getRandomInRange(pConfig.sunflare.opacity.min, pConfig.sunflare.opacity.max),
                    speed: getRandomInRange(pConfig.sunflare.twinkleSpeedBase.min, pConfig.sunflare.twinkleSpeedBase.max),
                    color: Math.random() < pConfig.sunflare.eveningColorChance ? pConfig.sunflare.colorEvening : pConfig.sunflare.colorDay,
                    type: 'sunflare'
                };
              } else if (randomTypeChoice < 0.85 && cloudCount < pConfig.cloud.countMax) {
                newParticle = {
                    x: -getRandomInRange(50,150), y: Math.random() * seasonalCanvasHeight * 0.4,
                    width: getRandomInRange(pConfig.cloud.width.min, pConfig.cloud.width.max),
                    height: getRandomInRange(pConfig.cloud.height.min, pConfig.cloud.height.max),
                    speed: getRandomInRange(pConfig.cloud.speed.min, pConfig.cloud.speed.max),
                    opacity: getRandomInRange(pConfig.cloud.opacity.min, pConfig.cloud.opacity.max),
                    type: 'cloud'
                };
              } else {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    size: getRandomInRange(pConfig.dragonfly.size.min, pConfig.dragonfly.size.max),
                    speed: getRandomInRange(pConfig.dragonfly.speed.min, pConfig.dragonfly.speed.max),
                    angle: Math.random() * Math.PI * 2,
                    wingSpeed: getRandomInRange(pConfig.dragonfly.wingSpeed.min, pConfig.dragonfly.wingSpeed.max),
                    wingPhase: Math.random() * Math.PI * 2, type: 'dragonfly'
                };
              }
              break;
            case 7: // Август
              if (randomTypeChoice < 0.4) {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.sunflare.radius.min, pConfig.sunflare.radius.max),
                    opacity: getRandomInRange(pConfig.sunflare.opacity.min, pConfig.sunflare.opacity.max),
                    speed: getRandomInRange(pConfig.sunflare.twinkleSpeedBase.min, pConfig.sunflare.twinkleSpeedBase.max),
                    color: pConfig.sunflare.colorEvening, type: 'sunflare'
                };
              } else if (randomTypeChoice < 0.7) {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: seasonalCanvasHeight + getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.heat.radius.min, pConfig.heat.radius.max),
                    opacity: getRandomInRange(pConfig.heat.opacity.min, pConfig.heat.opacity.max),
                    type: 'heat',
                    speed: getRandomInRange(pConfig.heat.speed.min, pConfig.heat.speed.max)
                };
              } else {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    size: getRandomInRange(pConfig.dragonfly.size.min, pConfig.dragonfly.size.max),
                    speed: getRandomInRange(pConfig.dragonfly.speed.min, pConfig.dragonfly.speed.max),
                    angle: Math.random() * Math.PI * 2,
                    wingSpeed: getRandomInRange(pConfig.dragonfly.wingSpeed.min, pConfig.dragonfly.wingSpeed.max),
                    wingPhase: Math.random() * Math.PI * 2, type: 'dragonfly'
                };
              }
              break;
            case 8: // Сентябрь
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.leaf.radius.min, pConfig.leaf.radius.max),
                    rotation: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.leaf.speed.min, pConfig.leaf.speed.max),
                    drift: getRandomInRange(pConfig.leaf.drift.min, pConfig.leaf.drift.max),
                    rotationSpeed: getRandomInRange(pConfig.leaf.rotationSpeed.min, pConfig.leaf.rotationSpeed.max),
                    color: pConfig.leaf.colors.september[Math.floor(Math.random() * pConfig.leaf.colors.september.length)],
                    type: 'leaf', shape: Math.floor(Math.random() * pConfig.leaf.shapeVariety)
                };
                break;
            case 9: // Октябрь
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.leaf.radius.min, pConfig.leaf.radius.max),
                    rotation: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.leaf.speed.min, pConfig.leaf.speed.max),
                    drift: getRandomInRange(pConfig.leaf.drift.min, pConfig.leaf.drift.max),
                    rotationSpeed: getRandomInRange(pConfig.leaf.rotationSpeed.min, pConfig.leaf.rotationSpeed.max),
                    color: pConfig.leaf.colors.october[Math.floor(Math.random() * pConfig.leaf.colors.october.length)],
                    type: 'leaf', shape: Math.floor(Math.random() * pConfig.leaf.shapeVariety),
                    swingFactor: getRandomInRange(pConfig.leaf.swingFactor.min, pConfig.leaf.swingFactor.max)
                };
                break;
            case 10: // Ноябрь
              if (randomTypeChoice < 0.3) {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.leaf.radius.min, pConfig.leaf.radius.max),
                    rotation: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.leaf.speed.min, pConfig.leaf.speed.max),
                    drift: getRandomInRange(pConfig.leaf.drift.min, pConfig.leaf.drift.max),
                    rotationSpeed: getRandomInRange(pConfig.leaf.rotationSpeed.min, pConfig.leaf.rotationSpeed.max),
                    color: pConfig.leaf.colors.november[Math.floor(Math.random() * pConfig.leaf.colors.november.length)],
                    type: 'leaf', shape: Math.floor(Math.random() * pConfig.leaf.shapeVariety), withered: true,
                    swingFactor: getRandomInRange(pConfig.leaf.swingFactor.min, pConfig.leaf.swingFactor.max)
                };
              } else if (randomTypeChoice < 0.8) {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    length: getRandomInRange(pConfig.rain.length.min, pConfig.rain.length.max),
                    speed: getRandomInRange(pConfig.rain.speed.min, pConfig.rain.speed.max),
                    opacity: getRandomInRange(pConfig.rain.opacity.min, pConfig.rain.opacity.max),
                    type: 'rain'
                };
              } else {
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.mist.radius.min, pConfig.mist.radius.max),
                    opacity: getRandomInRange(pConfig.mist.opacity.min, pConfig.mist.opacity.max),
                    type: 'mist',
                    speed: getRandomInRange(pConfig.mist.speed.min, pConfig.mist.speed.max)
                };
              }
              break;
            case 11: // Декабрь
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max),
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max),
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance
                };
                break;
            default: // По умолчанию
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max),
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max),
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max),
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow',
                    arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max),
                    detail: Math.random() < pConfig.snow.detailChance
                };
        }

        // Добавление особых новогодних частиц
        if (isCurrentlyNewYear) {
            const nyChoice = Math.random();
            if (nyChoice < 0.4) { // Снежинки
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.snow.radius.min, pConfig.snow.radius.max) * 1.2,
                    d: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.snow.speed.min, pConfig.snow.speed.max) * 0.8,
                    drift: getRandomInRange(pConfig.snow.drift.min, pConfig.snow.drift.max) * 0.8,
                    opacity: getRandomInRange(pConfig.snow.opacity.min, pConfig.snow.opacity.max),
                    type: 'snow', arms: getRandomIntInRange(pConfig.snow.arms.min, pConfig.snow.arms.max) + 2, detail: true
                };
            } else if (nyChoice < 0.7) { // Мерцающие огоньки
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.twinkle.radius.min, pConfig.twinkle.radius.max),
                    opacity: getRandomInRange(pConfig.twinkle.opacity.min, pConfig.twinkle.opacity.max),
                    color: pConfig.twinkle.colors[Math.floor(Math.random() * pConfig.twinkle.colors.length)],
                    type: 'twinkle',
                    speed: getRandomInRange(pConfig.twinkle.moveSpeedFactor.min, pConfig.twinkle.moveSpeedFactor.max),
                    twinkleSpeed: getRandomInRange(pConfig.twinkle.twinkleFrequency.min, pConfig.twinkle.twinkleFrequency.max)
                };
            } else { // Конфетти
                newParticle = {
                    x: Math.random() * seasonalCanvasWidth, y: -getRandomInRange(10,30),
                    r: getRandomInRange(pConfig.confetti.radius.min, pConfig.confetti.radius.max),
                    rotation: Math.random() * Math.PI * 2,
                    speed: getRandomInRange(pConfig.confetti.speed.min, pConfig.confetti.speed.max),
                    drift: getRandomInRange(pConfig.confetti.drift.min, pConfig.confetti.drift.max),
                    rotationSpeed: getRandomInRange(pConfig.confetti.rotationSpeed.min, pConfig.confetti.rotationSpeed.max),
                    color: pConfig.confetti.colors[Math.floor(Math.random() * pConfig.confetti.colors.length)],
                    type: 'confetti', shape: Math.floor(Math.random() * pConfig.confetti.shapeVariety)
                };
            }
        }

        if (newParticle && seasonalParticles.length < baseSeasonalParticleCount * PARTICLE_SYSTEM_SETTINGS.MAX_PARTICLE_BUFFER_MULTIPLIER) {
            seasonalParticles.push(newParticle);
        }
    }
}