// --- Основной управляющий скрипт ---

// Глобальные переменные состояния приложения
let overrideDate = null;    // Для переопределения даты в режиме отладки
let currentAppMonth;        // Текущий месяц, используемый приложением (с учетом отладки)
let currentAppDay;          // Текущий день приложения
let currentAppYear;         // Текущий год приложения
let nextAppYear;            // Следующий Новый год, до которого идет отсчет

let cheatCodeBuffer = '';   // Буфер для ввода чит-кода (для меню отладки)
let isPageVisible = true;   // Флаг: активна ли текущая вкладка браузера
let pausedTime = 0;         // Для коррекции времени анимации после паузы
let animationFrameId = null;// ID для requestAnimationFrame (основной цикл анимации)
let mainLoopLastSecondUpdate = null; // Для ограничения некоторых обновлений до одного раза в секунду
let mainLoopLastFrameTime = null;    // Для расчета delta time в цикле анимации

// Объект для хранения ссылок на DOM-элементы
const domElements = {};

// --- Функции, используемые другими модулями ---
// Возвращает текущую дату (реальную или отладочную)
function getCurrentDateInternal() {
    return overrideDate || new Date();
}

// Возвращает состояние видимости текущей вкладки браузера
function isPageCurrentlyVisible() {
    return isPageVisible;
}

// Устанавливает год следующего Нового Года (вызывается из ui.js)
function setGlobalNextYear(year) {
    nextAppYear = year;
}

// --- Инициализация приложения и основной цикл ---
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация ссылок на DOM-элементы
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

    const initialDate = getCurrentDateInternal();
    currentAppMonth = initialDate.getMonth();
    currentAppDay = initialDate.getDate();
    currentAppYear = initialDate.getFullYear();
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
                // Фейерверки останавливаются/запускаются в forceFullUpdate
            } else if (mode === 'new-year') {
                const currentActualYear = new Date().getFullYear();
                overrideDate = new Date(currentActualYear + 1, 0, 1, 0, 1, 0);
                forceFullUpdate();
            }
        }
    });
});

// Инициализирует компоненты и запускает главный цикл
function initializeApp() {
    console.log("Initializing App...");
    updateDateTimeUI();
    updateMonthSeasonUI();
    updateCountdownUI();
    resizeAllCanvases();
    setupDecorationsUI();

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    requestAnimationFrame(mainLoop);

    // Периодическая проверка смены месяца
    setInterval(() => {
        const checkDate = getCurrentDateInternal();
        if (checkDate.getMonth() !== currentAppMonth) {
            console.log("Hourly check: Month changed, updating UI.");
            currentAppMonth = checkDate.getMonth();
            updateMonthSeasonUI();
            setupDecorationsUI();
            resizeAllCanvases();
        }
    }, 3600000); // 1 час
}

// Главный цикл анимации и обновлений
function mainLoop(timestamp) {
    const now = getCurrentDateInternal();

    // Обновления, выполняемые примерно раз в секунду
    if (!mainLoopLastSecondUpdate || timestamp - mainLoopLastSecondUpdate >= 1000) {
        updateDateTimeUI();
        updateCountdownUI(); // Может запустить фейерверки при наступлении НГ

        const newAppDay = now.getDate();
        const newAppMonth = now.getMonth();
        if (newAppDay !== currentAppDay || newAppMonth !== currentAppMonth) {
            currentAppDay = newAppDay;
            const monthChanged = newAppMonth !== currentAppMonth;
            currentAppMonth = newAppMonth;

            updateMonthSeasonUI();
            setupDecorationsUI();
            if (monthChanged) {
                 resizeAllCanvases(); // Пересоздание частиц при смене месяца
            }
        }
        mainLoopLastSecondUpdate = timestamp;
    }

    updateAndDrawSeasonalParticles(); // Обновление сезонных частиц
    const frameTime = timestamp - (mainLoopLastFrameTime || timestamp);
    FireworksManager.updateFrame(Math.min(frameTime, fwFrameDelay * 2)); // Обновление фейерверков
    mainLoopLastFrameTime = timestamp;

    animationFrameId = requestAnimationFrame(mainLoop);
}

// Изменение размера для всех канвасов
function resizeAllCanvases() {
    resizeSeasonalCanvas(); // Из seasonalEffects.js
    FireworksManager.resize(); // Из fireworks.js
}

// Проверяет, должны ли фейерверки быть активны для указанной даты
function shouldFireworksBeActiveForDate(date) {
    const isNewYearPeriod = (date.getMonth() === 11 && date.getDate() === 31) ||
                            (date.getMonth() === 0 && date.getDate() === 1);
    if (!isNewYearPeriod) return false;

    let yearForNewYearMoment = date.getFullYear();
    if (date.getMonth() === 11) { yearForNewYearMoment++; }
    const newYearMoment = new Date(yearForNewYearMoment, 0, 1, 0, 0, 0);
    return date >= newYearMoment;
}

// Принудительное полное обновление UI и эффектов
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

    FireworksManager.stop(); // Сначала останавливаем
    if (shouldFireworksBeActiveForDate(date)) { // Затем запускаем, если нужно
        FireworksManager.start();
    }
}

// Обработка ввода чит-кода для меню отладки
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
            toggleDebugMenuUI(true); // Функция из ui.js
            cheatCodeBuffer = '';
        }
    } else {
        cheatCodeBuffer = '';
    }
}

// Обработка изменения видимости вкладки браузера
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isPageVisible = false;
        pausedTime = Date.now();
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (FireworksManager.isSystemActive()) {
             FireworksManager.stop();
        }
    } else {
        isPageVisible = true;
        if (mainLoopLastFrameTime) { // Коррекция времени для анимации
            const pauseDuration = Date.now() - pausedTime;
            mainLoopLastFrameTime += pauseDuration;
            mainLoopLastSecondUpdate = mainLoopLastSecondUpdate ? mainLoopLastSecondUpdate + pauseDuration : null;
        }
        if (!animationFrameId) { // Возобновление цикла анимации
            animationFrameId = requestAnimationFrame(mainLoop);
        }

        // Проверка и возможный запуск фейерверков при возвращении на вкладку
        const currentDate = getCurrentDateInternal();
        if (shouldFireworksBeActiveForDate(currentDate)) {
            if (!FireworksManager.isSystemActive()) {
                FireworksManager.start();
            }
        }
        // Обновление UI, т.к. время могло "уйти"
        updateDateTimeUI();
        updateCountdownUI();
    }
});