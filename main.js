let overrideDate = null;
let currentAppMonth; // Хранит текущий месяц приложения (с учетом отладки)
let currentAppDay;   // Хранит текущий день приложения
let currentAppYear;  // Хранит текущий год приложения
let nextAppYear;     // Хранит следующий НГ (с учетом отладки)

let cheatCodeBuffer = '';
let isPageVisible = true;
let pausedTime = 0;
let animationFrameId = null;
let mainLoopLastSecondUpdate = null;
let mainLoopLastFrameTime = null;

// DOM Elements (будут переданы в ui.js)
const domElements = {};


// --- Функции, которые нужны другим модулям ---
function getCurrentDateInternal() {
    return overrideDate || new Date();
}

function isPageCurrentlyVisible() {
    return isPageVisible;
}

function isFireworksActive() { // Обёртка для fireworks.js
    return fireworksSystemActive;
}

function setGlobalNextYear(year) { // Вызывается из ui.js
    nextAppYear = year;
}

// --- Инициализация и основной цикл ---
document.addEventListener('DOMContentLoaded', () => {
    // Получение DOM элементов
    domElements.currentDateEl = document.getElementById('current-date');
    domElements.seasonIconEl = document.getElementById('season-icon');
    domElements.seasonNameEl = document.getElementById('season-name');
    domElements.nextYearEl = document.getElementById('next-year');
    domElements.countdownEl = document.getElementById('countdown');
    domElements.daysEl = document.getElementById('days');
    domElements.hoursEl = document.getElementById('hours');
    domElements.minutesEl = document.getElementById('minutes');
    domElements.secondsEl = document.getElementById('seconds');
    domElements.daysLabelEl = document.getElementById('days-label');
    domElements.hoursLabelEl = document.getElementById('hours-label');
    domElements.minutesLabelEl = document.getElementById('minutes-label');
    domElements.secondsLabelEl = document.getElementById('seconds-label');
    domElements.greetingEl = document.getElementById('greeting');
    domElements.currentYearFooterEl = document.getElementById('current-year');
    domElements.decorationsContainer = document.getElementById('decorations');
    domElements.bodyEl = document.body;
    domElements.h1El = document.querySelector('h1');
    domElements.centerContentEl = document.getElementById('center-content');
    domElements.debugMenuEl = document.getElementById('debug-menu');
    domElements.closeDebugMenuBtn = document.getElementById('close-debug-menu');
    domElements.resetDebugModeBtn = document.getElementById('reset-debug-mode');

    // Инициализация модулей
    initUIElements(domElements);
    initSeasonalEffects(document.getElementById('seasonal-canvas'), document.getElementById('seasonal-canvas').getContext('2d'));
    initFireworks(document.getElementById('fireworks-canvas'), document.getElementById('fireworks-canvas').getContext('2d'));
    
    // Обновление глобальных переменных даты/года приложения
    const initialDate = getCurrentDateInternal();
    currentAppMonth = initialDate.getMonth();
    currentAppDay = initialDate.getDate();
    currentAppYear = initialDate.getFullYear();
    nextAppYear = (currentAppMonth === 0 && currentAppDay === 1 && initialDate.getHours() < 6)
        ? currentAppYear
        : currentAppYear + 1;
    domElements.nextYearEl.textContent = nextAppYear;
    domElements.currentYearFooterEl.textContent = currentAppYear;


    initializeApp();

    // Обработчики событий для меню отладки
    document.addEventListener('keydown', handleCheatCode);
    domElements.closeDebugMenuBtn.addEventListener('click', () => toggleDebugMenuUI(false));
    domElements.resetDebugModeBtn.addEventListener('click', () => {
        overrideDate = null;
        forceFullUpdate();
        toggleDebugMenuUI(false);
    });

    domElements.debugMenuEl.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const button = event.target;
            const month = button.dataset.month;
            const mode = button.dataset.mode;

            if (month !== undefined) {
                const targetMonth = parseInt(month, 10);
                const currentActualYear = new Date().getFullYear();
                overrideDate = new Date(currentActualYear, targetMonth, 15, 12, 0, 0);
                forceFullUpdate();
                if (fireworksSystemActive && targetMonth !== 11 && targetMonth !== 0) {
                    stopFireworksSystem();
                }
            } else if (mode === 'new-year') {
                const currentActualYear = new Date().getFullYear();
                overrideDate = new Date(currentActualYear + 1, 0, 1, 0, 1, 0);
                forceFullUpdate();
                startFireworksSystem();
            }
        }
    });
});


function initializeApp() {
    console.log("Initializing App...");
    updateDateTimeUI();
    updateMonthSeasonUI();
    updateCountdownUI();
    resizeAllCanvases(); // Это вызовет createSeasonalParticles и настроит размеры fw-канваса
    setupDecorationsUI();

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    requestAnimationFrame(mainLoop);

    setInterval(() => {
        const checkDate = getCurrentDateInternal();
        if (checkDate.getMonth() !== currentAppMonth) { // Сравниваем с currentAppMonth, а не глобальной currentMonth
            console.log("Ежечасная проверка: Месяц изменился, обновляем UI.");
            currentAppMonth = checkDate.getMonth(); // Обновляем currentAppMonth
            updateMonthSeasonUI();
            setupDecorationsUI();
            resizeAllCanvases();
        }
    }, 3600000);
}

function mainLoop(timestamp) {
    const now = getCurrentDateInternal();

    if (!mainLoopLastSecondUpdate || timestamp - mainLoopLastSecondUpdate >= 1000) {
        updateDateTimeUI();
        updateCountdownUI();

        if (now.getDate() !== currentAppDay || now.getMonth() !== currentAppMonth) {
            currentAppDay = now.getDate(); // Обновляем currentAppDay
            currentAppMonth = now.getMonth(); // Обновляем currentAppMonth
            updateMonthSeasonUI();
            setupDecorationsUI();
            if (now.getMonth() !== currentAppMonth) { // Если именно месяц сменился
                 resizeAllCanvases(); // Это включает createSeasonalParticles
            }
        }
        mainLoopLastSecondUpdate = timestamp;
    }

    updateAndDrawSeasonalParticles();

    const frameTime = timestamp - (mainLoopLastFrameTime || timestamp);
    updateFireworksFrame(Math.min(frameTime, fwFrameDelay * 2));
    mainLoopLastFrameTime = timestamp;

    animationFrameId = requestAnimationFrame(mainLoop);
}

function resizeAllCanvases() {
    resizeSeasonalCanvas(); // из seasonalEffects.js
    resizeFireworksCanvas(); // из fireworks.js
}

function forceFullUpdate() {
    const date = getCurrentDateInternal();
    currentAppMonth = date.getMonth(); // Обновляем состояние перед полным обновлением
    currentAppDay = date.getDate();
    currentAppYear = date.getFullYear();
     nextAppYear = (currentAppMonth === 0 && currentAppDay === 1 && date.getHours() < 6)
        ? currentAppYear
        : currentAppYear + 1;


    updateDateTimeUI();
    updateMonthSeasonUI();
    resizeAllCanvases(); 
    updateCountdownUI();
    setupDecorationsUI();
    stopFireworksSystem();

    const isCurrentlyNewYearDebug = (date.getMonth() === 11 && date.getDate() === 31) || (date.getMonth() === 0 && date.getDate() === 1);
    const newYearDateCheckDebug = new Date(date.getFullYear() + ( (date.getMonth()===0 && date.getDate()===1) ? 0 : 1), 0, 1, 0, 0, 0);
    const diffCheckDebug = newYearDateCheckDebug - date;

    if (isCurrentlyNewYearDebug && diffCheckDebug <= 0) {
        startFireworksSystem();
    }
}

function handleCheatCode(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key.toLowerCase();
    if (key.length === 1 && key >= 'a' && key <= 'z') {
        cheatCodeBuffer += key;
        if (cheatCodeBuffer.length > 4) {
            cheatCodeBuffer = cheatCodeBuffer.slice(-4);
        }
        if (cheatCodeBuffer === 'test') {
            toggleDebugMenuUI(true);
            cheatCodeBuffer = '';
        }
    } else {
        cheatCodeBuffer = '';
    }
}

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isPageVisible = false;
        pausedTime = Date.now();
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (fireworkTriggerIntervalId) { // fireworkTriggerIntervalId из fireworks.js
            clearInterval(fireworkTriggerIntervalId);
            fireworkTriggerIntervalId = null; // Важно сбросить, чтобы fireworks.js не думал, что он еще активен
        }
    } else {
        isPageVisible = true;
        if (mainLoopLastFrameTime) {
            const pauseDuration = Date.now() - pausedTime;
            mainLoopLastFrameTime += pauseDuration;
            mainLoopLastSecondUpdate = mainLoopLastSecondUpdate ? mainLoopLastSecondUpdate + pauseDuration : null;
        }
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(mainLoop);
        }
        if (fireworksSystemActive && !fireworkTriggerIntervalId) { // fireworksSystemActive, fireworkTriggerIntervalId из fireworks.js
            fireworkTriggerIntervalId = setInterval(createNewFirework, FIREWORK_SETTINGS.TIMED_FIREWORK_INTERVAL); // createNewFirework из fireworks.js
        }
        updateDateTimeUI();
        updateCountdownUI();
    }
});