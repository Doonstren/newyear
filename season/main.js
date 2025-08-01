// --- Основной управляющий скрипт ---

let overrideDate = null;    // Для отладки: переопределенная дата
let currentAppMonth;        // Актуальный месяц приложения
let currentAppDay;          // Актуальный день приложения
let currentAppYear;         // Актуальный год приложения

let cheatCodeBuffer = '';   // Буфер для чит-кода
let isPageVisible = true;   // Видимость вкладки
let pausedTime = 0;
let animationFrameId = null;
let mainLoopLastSecondUpdate = null;
let mainLoopLastFrameTime = null;

const domElements = {}; // Хранилище ссылок на DOM-элементы

// Возвращает текущую дату (реальную или отладочную)
function getCurrentDateInternal() {
    return overrideDate || new Date();
}

// Возвращает состояние видимости вкладки
function isPageCurrentlyVisible() {
    return isPageVisible;
}

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация ссылок на DOM
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
    domElements.mainContentEl = document.querySelector('.main-content');
    domElements.debugMenuEl = document.getElementById('debug-menu');
    domElements.closeDebugMenuBtn = document.getElementById('close-debug-menu');
    domElements.resetDebugModeBtn = document.getElementById('reset-debug-mode');

    // Инициализация модулей
    initUIElements(domElements);
    initSeasonalEffects(document.getElementById('seasonal-canvas'), document.getElementById('seasonal-canvas').getContext('2d'));
    FireworksManager.init(
        document.getElementById('fireworks-canvas'),
        document.getElementById('fireworks-canvas').getContext('2d'),
        isPageCurrentlyVisible
    );

    // Первичная установка даты
    const initialDate = getCurrentDateInternal();
    currentAppMonth = initialDate.getMonth();
    currentAppDay = initialDate.getDate();
    currentAppYear = initialDate.getFullYear();

    initializeApp();

    // Обработчики событий
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
                overrideDate = new Date(new Date().getFullYear(), parseInt(month, 10), 15, 12, 0, 0);
            } else if (mode === 'new-year') {
                overrideDate = new Date(new Date().getFullYear() + 1, 0, 1, 0, 1, 0);
            }
            forceFullUpdate();
        }
    });
});

// Запуск приложения
function initializeApp() {
    console.log("Initializing App...");
    updateDateTimeUI();
    updateMonthSeasonUI();
    updateCountdownUI();
    resizeAllCanvases();
    setupDecorationsUI();

    const currentDate = getCurrentDateInternal();
    if (shouldFireworksBeActiveForDate(currentDate) && !FireworksManager.isSystemActive()) {
        FireworksManager.start();
    }

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(mainLoop);

    // Ежечасная проверка на смену месяца
    setInterval(() => {
        const checkDate = getCurrentDateInternal();
        if (checkDate.getMonth() !== currentAppMonth) {
            console.log("Hourly check: Month changed, updating UI.");
            currentAppMonth = checkDate.getMonth();
            updateMonthSeasonUI();
            setupDecorationsUI();
            resizeAllCanvases();
        }
    }, 3600000);
}

// Главный цикл анимации
function mainLoop(timestamp) {
    const now = getCurrentDateInternal();

    if (!mainLoopLastSecondUpdate || timestamp - mainLoopLastSecondUpdate >= 1000) {
        updateDateTimeUI();
        updateCountdownUI();

        const newAppDay = now.getDate();
        const newAppMonth = now.getMonth();
        if (newAppDay !== currentAppDay || newAppMonth !== currentAppMonth) {
            currentAppDay = newAppDay;
            const monthChanged = newAppMonth !== currentAppMonth;
            currentAppMonth = newAppMonth;
            updateMonthSeasonUI();
            setupDecorationsUI();
            if (monthChanged) resizeAllCanvases();
        }
        mainLoopLastSecondUpdate = timestamp;
    }

    updateAndDrawSeasonalParticles();
    const frameTime = timestamp - (mainLoopLastFrameTime || timestamp);
    FireworksManager.updateFrame(Math.min(frameTime, fwFrameDelay * 2));
    mainLoopLastFrameTime = timestamp;

    animationFrameId = requestAnimationFrame(mainLoop);
}

// Ресайз всех канвасов
function resizeAllCanvases() {
    resizeSeasonalCanvas();
    FireworksManager.resize();
}

// Проверка, должны ли фейерверки быть активны для даты
function shouldFireworksBeActiveForDate(date) {
    const isNewYearPeriod = (date.getMonth() === 11 && date.getDate() === 31) ||
                            (date.getMonth() === 0 && date.getDate() === 1);
    if (!isNewYearPeriod) return false;

    let yearForNewYearMoment = date.getFullYear();
    if (date.getMonth() === 11) yearForNewYearMoment++;
    const newYearMoment = new Date(yearForNewYearMoment, 0, 1, 0, 0, 0);
    return date >= newYearMoment;
}

// Принудительное обновление всего
function forceFullUpdate() {
    const date = getCurrentDateInternal();
    currentAppMonth = date.getMonth();
    currentAppDay = date.getDate();
    currentAppYear = date.getFullYear();

    updateDateTimeUI();
    updateMonthSeasonUI();
    resizeAllCanvases();
    updateCountdownUI();
    setupDecorationsUI();

    if (shouldFireworksBeActiveForDate(date)) {
        if (!FireworksManager.isSystemActive()) FireworksManager.start();
    } else {
        if (FireworksManager.isSystemActive()) FireworksManager.stop();
    }
}

// Обработка чит-кода
function handleCheatCode(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key.toLowerCase();
    if (key.length === 1 && key >= 'a' && key <= 'z') {
        cheatCodeBuffer += key;
        if (cheatCodeBuffer.length > 4) cheatCodeBuffer = cheatCodeBuffer.slice(-4);
        if (cheatCodeBuffer === 'test') {
            toggleDebugMenuUI(true);
            cheatCodeBuffer = '';
        }
    } else {
        cheatCodeBuffer = '';
    }
}

// Обработка изменения видимости вкладки
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isPageVisible = false;
        pausedTime = Date.now();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        if (FireworksManager.isSystemActive()) FireworksManager.stop();
    } else {
        isPageVisible = true;
        if (mainLoopLastFrameTime) {
            const pauseDuration = Date.now() - pausedTime;
            mainLoopLastFrameTime += pauseDuration;
            mainLoopLastSecondUpdate = mainLoopLastSecondUpdate ? mainLoopLastSecondUpdate + pauseDuration : null;
        }
        if (!animationFrameId) animationFrameId = requestAnimationFrame(mainLoop);

        updateDateTimeUI();
        updateCountdownUI(); // Может запустить фейерверки

        const currentDate = getCurrentDateInternal();
        if (shouldFireworksBeActiveForDate(currentDate) && !FireworksManager.isSystemActive()) {
            FireworksManager.start();
        }
    }
});