/* Оригинальная версия от 5 января 2019 г., 2:12:11 с фиксами*/

let legacySnowIntervalId = null;
let legacySnowObjects = [];
let legacySnowGlobals = {
    amp: [],
    x_pos: [],
    y_pos: [],
    stx: [],
    sty: [],
    deltax: [],
    obj: [],
    col: 0,
    imgsrc1: "snow-old.png",
    initialized: false
};

function initLegacySnow() {
    stopLegacySnow();
    
    const container = document.getElementById('legacy-version-container');
    if (!container) {
        console.error("Legacy container not found!");
        return;
    }

    legacySnowObjects.forEach(flakeImg => {
        if (flakeImg.parentNode) flakeImg.parentNode.removeChild(flakeImg);
    });
    legacySnowObjects = [];
    legacySnowGlobals.obj = [];

    const height = window.innerHeight;
    const width = window.innerWidth;

    legacySnowGlobals.col = Math.round(height / 8);

    legacySnowGlobals.amp = new Array(legacySnowGlobals.col);
    legacySnowGlobals.x_pos = new Array(legacySnowGlobals.col);
    legacySnowGlobals.y_pos = new Array(legacySnowGlobals.col);
    legacySnowGlobals.stx = new Array(legacySnowGlobals.col);
    legacySnowGlobals.sty = new Array(legacySnowGlobals.col);
    legacySnowGlobals.deltax = new Array(legacySnowGlobals.col);

    for (let i = 0; i < legacySnowGlobals.col; ++i) {
        legacySnowGlobals.amp[i] = Math.random() * 19;
        legacySnowGlobals.x_pos[i] = Math.random() * (width - 30);
        legacySnowGlobals.y_pos[i] = Math.random() * height;
        legacySnowGlobals.stx[i] = 0.03 + Math.random() * 0.25;
        legacySnowGlobals.sty[i] = 2 + Math.random();
        legacySnowGlobals.deltax[i] = 0;

        const flakeImg = document.createElement("img");
        flakeImg.id = "sn_legacy_" + i;
        flakeImg.style.position = "absolute";
        flakeImg.style.zIndex = i;
        flakeImg.style.visibility = "visible";
        flakeImg.style.top = legacySnowGlobals.y_pos[i] + "px";
        flakeImg.style.left = legacySnowGlobals.x_pos[i] + "px";
        flakeImg.src = legacySnowGlobals.imgsrc1;
        flakeImg.border = 0;
        flakeImg.width = 15;
        flakeImg.height = 15;

        container.appendChild(flakeImg);
        legacySnowGlobals.obj[i] = flakeImg;
        legacySnowObjects.push(flakeImg);
    }
    
    legacySnowGlobals.initialized = true;
    
    if (legacySnowIntervalId) clearTimeout(legacySnowIntervalId);
    legacyFlake();
}

function legacyFlake() {
    const container = document.getElementById('legacy-version-container');
    if (!container || container.style.display === 'none' || !legacySnowGlobals.initialized) {
        stopLegacySnow();
        return;
    }
    
    const height = window.innerHeight;
    const width = window.innerWidth;

    for (let i = 0; i < legacySnowGlobals.col; ++i) {
        if (!legacySnowGlobals.obj[i]) continue;

        legacySnowGlobals.y_pos[i] += legacySnowGlobals.sty[i];
        if (legacySnowGlobals.y_pos[i] > height - 20) {
            legacySnowGlobals.x_pos[i] = Math.random() * (width - 30);
            legacySnowGlobals.y_pos[i] = 0;
        }
        legacySnowGlobals.deltax[i] += legacySnowGlobals.stx[i];
        legacySnowGlobals.obj[i].style.top = legacySnowGlobals.y_pos[i] + "px";
        legacySnowGlobals.obj[i].style.left = legacySnowGlobals.x_pos[i] + legacySnowGlobals.amp[i] * Math.sin(legacySnowGlobals.deltax[i]) + "px";
    }
    legacySnowIntervalId = setTimeout(legacyFlake, 95);
}

function stopLegacySnow() {
    clearTimeout(legacySnowIntervalId);
    legacySnowIntervalId = null;
    
    legacySnowObjects.forEach(flakeImg => {
        if (flakeImg && flakeImg.style) {
            flakeImg.style.visibility = 'hidden';
        }
    });
}

function updateLegacyCountdownText() {
    const countdownElement = document.getElementById('legacy-countdown');
    if (!countdownElement) return;

    var now = new Date();
    var ny = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
    var text = '';
    var daysLeft = Math.floor((ny.getTime() - now.getTime()) / 86400000);

    if (daysLeft < 364) {
        if (now.getMonth() === 0 && now.getDate() === 1) {
             text = 'С Новым ' + now.getFullYear() + ' Годом!';
        } else if (daysLeft != 0) {
            text = 'Текущий год ' + now.getFullYear();
            
            var daysString;
            var n = Math.abs(daysLeft);
            var mod10 = n % 10;
            var mod100 = n % 100;

            if (mod10 === 1 && mod100 !== 11) {
                daysString = "день";
            } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
                daysString = "дня";
            } else {
                daysString = "дней";
            }
            text += '. До ' + ny.getFullYear() + ' осталось ' + daysLeft + ' ' + daysString + '.';
        } else {
            text = 'Текущий год ' + now.getFullYear();
            text += '. До ' + ny.getFullYear() + ' осталось меньше 1 дня!';
        }
    } else {
        text = 'С Новым ' + now.getFullYear() + ' Годом!';
    }
    countdownElement.innerHTML = text;
}

window.startLegacyVersion = function() {
    updateLegacyCountdownText();
    initLegacySnow();
};

window.stopLegacyVersion = function() {
    legacySnowGlobals.initialized = false;
    stopLegacySnow();
};

window.updateLegacyVersionOnResize = function() {
    if (document.getElementById('legacy-version-container').style.display !== 'none') {
        initLegacySnow();
    }
};