// --- Отрисовка и обновление различных типов сезонных частиц ---

// --- Снежинка ---
function drawSnowParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.globalAlpha = p.opacity;
    if (p.detail) {
        ctx.beginPath(); const armLength = p.r;
        for (let i = 0; i < p.arms; i++) {
            const angle = (Math.PI * 2 / p.arms) * i;
            const x1 = p.x + Math.cos(angle) * armLength;
            const y1 = p.y + Math.sin(angle) * armLength;
            ctx.moveTo(p.x, p.y); ctx.lineTo(x1, y1);
            if (p.arms <= 6) {
                const branchLength = armLength * 0.4;
                const branchAngle1 = angle + Math.PI / 4; const branchAngle2 = angle - Math.PI / 4;
                const midX = p.x + Math.cos(angle) * (armLength * 0.5); const midY = p.y + Math.sin(angle) * (armLength * 0.5);
                const branchX1 = midX + Math.cos(branchAngle1) * branchLength; const branchY1 = midY + Math.sin(branchAngle1) * branchLength;
                const branchX2 = midX + Math.cos(branchAngle2) * branchLength; const branchY2 = midY + Math.sin(branchAngle2) * branchLength;
                ctx.moveTo(midX, midY); ctx.lineTo(branchX1, branchY1);
                ctx.moveTo(midX, midY); ctx.lineTo(branchX2, branchY2);
            }
        }
        ctx.strokeStyle = '#fff'; ctx.lineWidth = p.r * 0.1; ctx.stroke();
    } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    }
    if (p.turbulence) { ctx.shadowBlur = 3; ctx.shadowColor = '#fff'; }
    ctx.restore();

    if (p.turbulence) { p.d += (Math.random() - 0.5) * p.turbulence; }
    p.y += p.speed; p.x += Math.sin(p.d) * p.drift; p.d += 0.01 + Math.random() * 0.01;
    if (p.y > canvasHeight + p.r) { p.y = -p.r; p.x = Math.random() * canvasWidth; }
    if (p.x > canvasWidth + p.r) p.x = -p.r; if (p.x < -p.r) p.x = canvasWidth + p.r;
    if (p.melting && Math.random() < 0.03) { p.r *= 0.95; p.opacity *= 0.95; }
}

// --- Капля дождя ---
function drawRainParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y + p.length);
    ctx.strokeStyle = `rgba(200, 200, 255, ${p.opacity})`; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();

    p.y += p.speed;
    if (p.y > canvasHeight) { p.y = -p.length; p.x = Math.random() * canvasWidth; }
}

// --- Лепесток ---
function drawPetalParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
    ctx.beginPath(); ctx.ellipse(0, 0, p.r * 0.6, p.r, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color; ctx.globalAlpha = 0.8; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-p.r * 0.4, 0); ctx.lineTo(p.r * 0.4, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 0.5; ctx.stroke();
    ctx.restore();

    p.y += p.speed; p.x += Math.sin(p.rotation * 2 + p.y * 0.05) * p.drift; p.rotation += p.rotationSpeed;
    if (p.y > canvasHeight + p.r) { p.y = -p.r; p.x = Math.random() * canvasWidth; }
    if (p.x > canvasWidth + p.r) p.x = -p.r; if (p.x < -p.r) p.x = canvasWidth + p.r;
}

// --- Солнечный блик ---
function drawSunflareParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); const flicker = Math.sin(Date.now() * p.speed + p.x) * 0.5 + 0.5;
    ctx.globalAlpha = p.opacity * flicker;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    gradient.addColorStop(0, p.color || 'rgba(255, 255, 200, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = gradient; ctx.shadowColor = p.color || 'rgba(255, 255, 200, 0.8)';
    ctx.shadowBlur = 10; ctx.fill();
    ctx.restore();

    p.x += (Math.random() - 0.5) * 0.3; p.y += (Math.random() - 0.5) * 0.3;
    if (p.y > canvasHeight + p.r) p.y = -p.r; if (p.x > canvasWidth + p.r) p.x = -p.r;
    if (p.x < -p.r) p.x = canvasWidth + p.r; if (p.y < -p.r) p.y = canvasHeight + p.r;
}

// --- Бабочка ---
function drawButterflyParticle(p, ctx, canvasWidth, canvasHeight) {
    const wingOpen = Math.sin(Date.now() * p.wingSpeed + p.wingPhase) * 0.5 + 0.5;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle + Math.PI / 2);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.moveTo(0, -p.size * 0.7);
    ctx.bezierCurveTo(-p.size * 1.5 * wingOpen, -p.size * 1.2, -p.size * 1.5 * wingOpen, p.size * 0.8, 0, p.size * 0.3);
    ctx.moveTo(0, -p.size * 0.7);
    ctx.bezierCurveTo(p.size * 1.5 * wingOpen, -p.size * 1.2, p.size * 1.5 * wingOpen, p.size * 0.8, 0, p.size * 0.3);
    ctx.fillStyle = p.color; ctx.fill();
    ctx.beginPath(); ctx.arc(-p.size * 0.8 * wingOpen, -p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
    ctx.arc(p.size * 0.8 * wingOpen, -p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, p.size / 4, p.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#333'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -p.size * 0.7); ctx.lineTo(-p.size * 0.3, -p.size * 1);
    ctx.moveTo(0, -p.size * 0.7); ctx.lineTo(p.size * 0.3, -p.size * 1);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();

    p.x += Math.cos(p.angle) * p.speed; p.y += Math.sin(p.angle) * p.speed;
    if (Math.random() < 0.05) { p.angle += (Math.random() - 0.5) * Math.PI / 4; }
    if (p.x < p.size * 2 || p.x > canvasWidth - p.size * 2) {
        p.angle = Math.PI - p.angle + (Math.random() - 0.5) * 0.2;
        p.x = Math.max(p.size * 2, Math.min(canvasWidth - p.size * 2, p.x));
    }
    if (p.y < p.size * 2 || p.y > canvasHeight - p.size * 2) {
        p.angle = -p.angle + (Math.random() - 0.5) * 0.2;
        p.y = Math.max(p.size * 2, Math.min(canvasHeight - p.size * 2, p.y));
    }
}

// --- Стрекоза ---
function drawDragonflyParticle(p, ctx, canvasWidth, canvasHeight) {
    const wingBeat = Math.sin(Date.now() * p.wingSpeed + p.wingPhase);
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle + Math.PI / 2);
    const bodyGradient = ctx.createLinearGradient(0, -p.size, 0, p.size);
    bodyGradient.addColorStop(0, '#45CFFF'); bodyGradient.addColorStop(0.3, '#5DA4FF');
    bodyGradient.addColorStop(0.7, '#4580FF'); bodyGradient.addColorStop(1, '#45CFFF');
    ctx.beginPath(); ctx.ellipse(0, 0, p.size/7, p.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyGradient; ctx.fill();
    ctx.beginPath(); ctx.arc(0, -p.size * 0.8, p.size/5, 0, Math.PI * 2);
    ctx.fillStyle = '#5DA4FF'; ctx.fill();
    ctx.globalAlpha = 0.25; const wingAngle = Math.PI/5 * wingBeat;
    const wingGradient = ctx.createLinearGradient(-p.size, 0, p.size, 0);
    wingGradient.addColorStop(0, 'rgba(200, 240, 255, 0.9)');
    wingGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
    wingGradient.addColorStop(1, 'rgba(200, 240, 255, 0.9)');
    ctx.beginPath();
    ctx.ellipse(-p.size * 0.6, -p.size * 0.3, p.size * 0.5, p.size * 0.15, wingAngle, 0, Math.PI * 2);
    ctx.ellipse(p.size * 0.6, -p.size * 0.3, p.size * 0.5, p.size * 0.15, -wingAngle, 0, Math.PI * 2);
    ctx.ellipse(-p.size * 0.5, p.size * 0.1, p.size * 0.4, p.size * 0.12, wingAngle * 0.8, 0, Math.PI * 2);
    ctx.ellipse(p.size * 0.5, p.size * 0.1, p.size * 0.4, p.size * 0.12, -wingAngle * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = wingGradient; ctx.fill();
    ctx.globalAlpha = 0.15; ctx.beginPath();
    ctx.moveTo(-p.size * 0.6, -p.size * 0.3); ctx.lineTo(-p.size * 1.1, -p.size * 0.4);
    ctx.moveTo(p.size * 0.6, -p.size * 0.3); ctx.lineTo(p.size * 1.1, -p.size * 0.4);
    ctx.moveTo(-p.size * 0.5, p.size * 0.1); ctx.lineTo(-p.size * 0.9, p.size * 0.2);
    ctx.moveTo(p.size * 0.5, p.size * 0.1); ctx.lineTo(p.size * 0.9, p.size * 0.2);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();

    p.x += Math.cos(p.angle) * p.speed; p.y += Math.sin(p.angle) * p.speed;
    if (Math.random() < 0.02) { p.angle += (Math.random() - 0.5) * Math.PI / 2; }
    if (p.x < p.size || p.x > canvasWidth - p.size) {
        p.angle = Math.PI - p.angle; p.x = Math.max(p.size, Math.min(canvasWidth - p.size, p.x));
    }
    if (p.y < p.size || p.y > canvasHeight - p.size) {
        p.angle = -p.angle; p.y = Math.max(p.size, Math.min(canvasHeight - p.size, p.y));
    }
}

// --- Лист ---
function drawLeafParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
    ctx.beginPath(); ctx.moveTo(0, -p.r * 1.2);
    ctx.bezierCurveTo(p.r * 0.8, -p.r * 0.5, p.r * 0.7, p.r * 0.5, 0, p.r);
    ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.5, -p.r * 0.8, -p.r * 0.5, 0, -p.r * 1.2);
    ctx.fillStyle = p.color; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -p.r * 1.1); ctx.lineTo(0, p.r * 0.9);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; ctx.lineWidth = p.r * 0.05; ctx.stroke();
    ctx.beginPath(); const veinsCount = 5;
    for (let i = 0; i < veinsCount; i++) {
        const yPos = -p.r + i * (2 * p.r) / (veinsCount - 1);
        const veinLength = p.r * 0.5 * (1 - Math.abs(yPos) / p.r);
        ctx.moveTo(0, yPos); ctx.lineTo(veinLength, yPos + veinLength * 0.2);
        ctx.moveTo(0, yPos); ctx.lineTo(-veinLength, yPos + veinLength * 0.2);
    }
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; ctx.lineWidth = p.r * 0.03; ctx.stroke();
    if (p.withered) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(100, 60, 30, 0.4)'; ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath(); ctx.moveTo(-p.r * 0.5, p.r * 0.3);
        ctx.quadraticCurveTo(0, p.r * 0.5, p.r * 0.5, p.r * 0.2);
        ctx.strokeStyle = 'rgba(100, 60, 30, 0.4)'; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();

    p.y += p.speed;
    if (p.swingFactor) {
        const swingAmount = p.swingFactor * Math.sin(p.y * 0.03);
        p.x += swingAmount * p.drift;
    } else {
        p.x += Math.sin(p.rotation * 3) * p.drift;
    }
    p.rotation += p.rotationSpeed;
    if (p.y > canvasHeight + p.r * 2) {
        p.y = -p.r * 2; p.x = Math.random() * canvasWidth;
        p.speed = p.speed * (0.9 + Math.random() * 0.2);
        p.drift = p.drift * (0.9 + Math.random() * 0.2);
        p.rotationSpeed = p.rotationSpeed * (0.9 + Math.random() * 0.2);
    }
    if (p.x > canvasWidth + p.r) p.x = -p.r; if (p.x < -p.r) p.x = canvasWidth + p.r;
}

// --- Туман/Дымка ---
function drawMistParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save();
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    gradient.addColorStop(0, `rgba(200, 200, 210, ${p.opacity})`);
    gradient.addColorStop(1, 'rgba(200, 200, 210, 0)');
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = gradient; ctx.globalCompositeOperation = 'lighter'; ctx.fill();
    ctx.restore();

    p.x += (Math.random() - 0.5) * p.speed; p.y += (Math.random() - 0.5) * p.speed * 0.5;
    if (Math.random() < 0.01) { p.r = p.r * (0.95 + Math.random() * 0.1); }
    if (p.x > canvasWidth + p.r) p.x = -p.r; if (p.x < -p.r) p.x = canvasWidth + p.r;
    if (p.y > canvasHeight + p.r) p.y = -p.r; if (p.y < -p.r) p.y = canvasHeight + p.r;
}

// --- Облако ---
function drawCloudParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save();
    let cloudColor = p.isThunder ? `rgba(180, 180, 200, ${p.opacity})` : `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fillStyle = cloudColor; ctx.beginPath();
    ctx.arc(p.x, p.y, p.width * 0.4, 0, Math.PI * 2);
    ctx.arc(p.x + p.width * 0.2, p.y - p.height * 0.1, p.width * 0.3, 0, Math.PI * 2);
    ctx.arc(p.x + p.width * 0.4, p.y, p.width * 0.3, 0, Math.PI * 2);
    ctx.arc(p.x - p.width * 0.2, p.y + p.height * 0.1, p.width * 0.25, 0, Math.PI * 2);
    ctx.arc(p.x + p.width * 0.2, p.y + p.height * 0.1, p.width * 0.3, 0, Math.PI * 2);
    ctx.fill();
    if (p.isThunder) {
        ctx.fillStyle = 'rgba(100, 100, 120, 0.2)'; ctx.beginPath();
        ctx.ellipse(p.x, p.y + p.height * 0.2, p.width * 0.5, p.height * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    p.x += p.speed;
    if (p.x > canvasWidth + p.width) { p.x = -p.width; p.y = Math.random() * canvasHeight * 0.4; }
}

// --- Пыльца ---
function drawPollenParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.globalAlpha = p.opacity;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color; ctx.fill();
    ctx.restore();

    p.y += Math.sin(Date.now() * 0.001 + p.x) * 0.1;
    p.x += Math.cos(Date.now() * 0.001 + p.y) * 0.1 + p.drift;
    if (p.y > canvasHeight + p.r) p.y = -p.r; if (p.y < -p.r) p.y = canvasHeight + p.r;
    if (p.x > canvasWidth + p.r) p.x = -p.r; if (p.x < -p.r) p.x = canvasWidth + p.r;
}

// --- Марево (тепловые искажения) ---
function drawHeatParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save();
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = gradient; ctx.globalCompositeOperation = 'difference'; ctx.fill();
    ctx.restore();

    p.y -= p.speed; p.x += Math.sin(Date.now() * 0.001 + p.y * 0.1) * 0.3;
    if (p.y < -p.r) { p.y = canvasHeight + p.r; p.x = Math.random() * canvasWidth; }
}

// --- Молния ---
function drawLightningParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.lineWidth = 2 + Math.random() * 3; ctx.shadowColor = '#CCFFFF'; ctx.shadowBlur = 20;
    ctx.beginPath(); let x = p.x; let y = p.y; ctx.moveTo(x, y);
    const segments = 7 + Math.floor(Math.random() * 5); const maxDeviation = 40;
    for (let i = 0; i < segments; i++) {
        const targetY = canvasHeight;
        const nextY = y + (targetY - p.y) / segments * (i + 1);
        const nextX = x + (Math.random() - 0.5) * maxDeviation;
        if (i > 0 && i < segments - 1 && Math.random() < 0.5) {
            const midX = (x + nextX) / 2 + (Math.random() - 0.5) * maxDeviation * 0.5;
            const midY = (y + nextY) / 2; ctx.lineTo(midX, midY);
        }
        ctx.lineTo(nextX, nextY); x = nextX; y = nextY;
    }
    ctx.stroke();
    if (Math.random() < 0.6) {
        const branchStartSegment = Math.floor(Math.random() * (segments - 2)) + 1;
        const startY = p.y + (canvasHeight - p.y) / segments * branchStartSegment;
        let startX = p.x; let tempX = p.x;
        for(let k=0; k < branchStartSegment; k++){ tempX += (Math.random() - 0.5)*maxDeviation; }
        startX = tempX; ctx.beginPath(); ctx.moveTo(startX, startY);
        let branchX = startX; let branchY = startY;
        const branchSegments = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < branchSegments; i++) {
            branchX += (Math.random() - 0.3) * maxDeviation * 0.8;
            branchY += (canvasHeight - startY) / (segments * 1.5); ctx.lineTo(branchX, branchY);
        }
        ctx.lineWidth = ctx.lineWidth * 0.7; ctx.stroke();
    }
    ctx.restore();
    if (p.opacity > 0.8) {
        ctx.save(); ctx.fillStyle = `rgba(200, 230, 255, ${p.opacity * 0.2})`;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight); ctx.restore();
    }
    p.opacity -= 0.05 + Math.random() * 0.05;
}

// --- Божья коровка ---
function drawLadybugParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle + Math.PI / 2);
    ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color; ctx.fill();
    ctx.beginPath(); ctx.arc(0, -p.size * 0.7, p.size * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#000000'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -p.size * 0.5); ctx.lineTo(0, p.size * 0.8);
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#000000';
    const spotPositions = [ [-p.size*0.4,-p.size*0.3],[p.size*0.4,-p.size*0.3],[-p.size*0.5,0],[p.size*0.5,0],[-p.size*0.3,p.size*0.3],[p.size*0.3,p.size*0.3] ];
    for (let i=0; i<Math.min(p.spots,spotPositions.length); i++) {
        ctx.beginPath(); ctx.arc(spotPositions[i][0],spotPositions[i][1],p.size*0.2,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();

    const now = Date.now(); const elapsed = now - p.lastWiggle;
    const wiggle = Math.sin(elapsed * p.wiggleSpeed) * p.wiggleAmount;
    p.x += Math.cos(p.angle + wiggle) * p.speed; p.y += Math.sin(p.angle + wiggle) * p.speed;
    if (Math.random() < 0.02) { p.angle += (Math.random() - 0.5) * Math.PI / 4; }
    if (p.x < p.size || p.x > canvasWidth - p.size) {
        p.angle = Math.PI - p.angle; p.x = Math.max(p.size, Math.min(canvasWidth - p.size, p.x));
    }
    if (p.y < p.size || p.y > canvasHeight - p.size) {
        p.angle = -p.angle; p.y = Math.max(p.size, Math.min(canvasHeight - p.size, p.y));
    }
}

// --- Пушинка одуванчика ---
function drawDandelionParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.globalAlpha = p.opacity; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + p.angle; const rayLength = p.r * 2;
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(angle) * rayLength, p.y + Math.sin(angle) * rayLength);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(angle) * rayLength, p.y + Math.sin(angle) * rayLength, p.r * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    p.y += p.speed; p.x += Math.sin(p.y * 0.05) * p.drift; p.angle += 0.01;
    if (p.y > canvasHeight + p.r * 3) { p.y = -p.r * 3; p.x = Math.random() * canvasWidth; }
    if (p.x > canvasWidth + p.r * 3) p.x = -p.r * 3; if (p.x < -p.r * 3) p.x = canvasWidth + p.r * 3;
}

// --- Мерцающая звездочка/огонёк ---
function drawTwinkleParticle(p, ctx, canvasWidth, canvasHeight) {
    const twinkle = Math.sin(Date.now() * p.twinkleSpeed) * 0.5 + 0.5;
    ctx.save(); ctx.globalAlpha = p.opacity * twinkle;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
    ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 5 + twinkle * 10; ctx.fill();
    if (twinkle > 0.7) {
        const rayLength = p.r * 2 * twinkle; ctx.beginPath();
        ctx.moveTo(p.x - rayLength, p.y); ctx.lineTo(p.x + rayLength, p.y);
        ctx.moveTo(p.x, p.y - rayLength); ctx.lineTo(p.x, p.y + rayLength);
        const diagLength = rayLength * 0.7;
        ctx.moveTo(p.x - diagLength, p.y - diagLength); ctx.lineTo(p.x + diagLength, p.y + diagLength);
        ctx.moveTo(p.x - diagLength, p.y + diagLength); ctx.lineTo(p.x + diagLength, p.y - diagLength);
        ctx.strokeStyle = p.color; ctx.lineWidth = 1; ctx.globalAlpha = p.opacity * twinkle * 0.5; ctx.stroke();
    }
    ctx.restore();

    p.y += Math.sin(Date.now() * 0.0005 + p.x) * p.speed * 50;
    p.x += Math.cos(Date.now() * 0.0005 + p.y) * p.speed * 50;
    if (p.y > canvasHeight + p.r) p.y = -p.r; if (p.y < -p.r) p.y = canvasHeight + p.r;
    if (p.x > canvasWidth + p.r) p.x = -p.r; if (p.x < -p.r) p.x = canvasWidth + p.r;
}

// --- Конфетти ---
function drawConfettiParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
    switch (p.shape) {
        case 0: ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r); break;
        case 1: ctx.beginPath(); ctx.arc(0,0,p.r/2,0,Math.PI*2); ctx.fill(); break;
        case 2: ctx.beginPath(); ctx.moveTo(0,-p.r/2); ctx.lineTo(p.r/2,p.r/2); ctx.lineTo(-p.r/2,p.r/2); ctx.closePath(); ctx.fill(); break;
    }
    ctx.restore();

    p.y += p.speed; p.x += Math.sin(p.rotation*5 + p.y*0.02) * p.drift; p.rotation += p.rotationSpeed; p.speed *= 0.99;
    if (p.y > canvasHeight + p.r) { p.y = -p.r; p.x = Math.random() * canvasWidth; p.speed = 1 + Math.random() * 3; }
    if (p.x > canvasWidth + p.r) p.x = -p.r; if (p.x < -p.r) p.x = canvasWidth + p.r;
}

// --- Почка (растения) ---
function drawBudParticle(p, ctx, canvasWidth, canvasHeight) {
    ctx.save(); ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
    ctx.beginPath(); p.r += 0.01; if (p.r > 3) p.r = 3;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    p.y += p.speed; p.x += Math.sin(p.y * 0.1) * p.drift;
    if (p.y > canvasHeight + p.r) { p.y = -p.r; p.x = Math.random() * canvasWidth; }
}