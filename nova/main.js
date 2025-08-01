import { getHolidays } from './modules/holidayCalculator.js';
import { loadScene, allEffects, effectsMap } from './modules/effectsEngine.js';
import { setLanguage, getLocalization, pluralize } from './modules/localization.js';

// --- App State ---
const now = new Date();
let appState = {
    isShortFormat: localStorage.getItem('isShortFormat') === 'true',
    ...getLocalization(),
    holidays: getHolidays(),
    debug: {
        month: now.getMonth(),
        timeOfDay: (now.getHours() > 6 && now.getHours() < 20) ? 'day' : 'night',
        effect: null
    }
};

// --- DOM Elements ---
const elements = {
    countdown: document.getElementById('countdown'),
    mainTitle: document.getElementById('main-title'),
    holidaySelector: document.getElementById('holiday-selector'),
    holidayDate: document.getElementById('holiday-date'),
    settingsIcon: document.getElementById('settings-icon'),
    popupWrapper: document.getElementById('popup-wrapper'),
    settingsPopup: document.getElementById('settings-popup'),
    debugPopup: document.getElementById('debug-popup')
};

let countdownInterval;

// --- Countdown Logic ---
function updateCountdown(targetDate) {
    const { l, isShortFormat } = appState;
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        elements.countdown.innerHTML = l.holiday_greeting;
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (isShortFormat) {
        elements.countdown.innerHTML = `${days}${l.time_units_short.d} ${hours}${l.time_units_short.h} ${minutes}${l.time_units_short.m} ${seconds}${l.time_units_short.s}`;
    } else {
        elements.countdown.innerHTML = 
            `${days} ${pluralize(days, l.time_units_full.d)} ` +
            `${hours} ${pluralize(hours, l.time_units_full.h)} ` +
            `${minutes} ${pluralize(minutes, l.time_units_full.m)} ` +
            `${seconds} ${pluralize(seconds, l.time_units_full.s)}`;
    }
}

function setHoliday(holidayKey) {
    const { l, holidays, currentLang } = appState;
    const holiday = holidays[holidayKey];
    if (!holiday) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    let targetDate = holiday.getDate(currentYear);

    if (now > targetDate) {
        targetDate = holiday.getDate(currentYear + 1);
    }

    elements.mainTitle.textContent = `${l.until_prefix} ${holiday.title_genitive}`;
    elements.holidayDate.textContent = targetDate.toLocaleDateString(currentLang, { year: 'numeric', month: 'long', day: 'numeric' });

    clearInterval(countdownInterval);
    updateCountdown(targetDate);
    countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);
}

// --- UI & Popups ---
function populateHolidaySelector() {
    const { holidays } = appState;
    const selectedValue = elements.holidaySelector.value || 'newYear';
    elements.holidaySelector.innerHTML = '';
    Object.keys(holidays).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = holidays[key].title_nominative;
        elements.holidaySelector.appendChild(option);
    });
    elements.holidaySelector.value = selectedValue;
}

function updateUIText() {
    document.documentElement.lang = appState.currentLang;
    populateHolidaySelector();
    renderSettingsPopup();
    renderDebugPopup();
    setHoliday(elements.holidaySelector.value);
}

function renderSettingsPopup() {
    const { l, isShortFormat, currentLang } = appState;
    elements.settingsPopup.innerHTML = `
        <h2>${l.settings_title}</h2>
        <div class="setting">
            <label for="lang-select">${l.language}</label>
            <select id="lang-select">
                <option value="ru" ${currentLang === 'ru' ? 'selected' : ''}>Русский</option>
                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
            </select>
        </div>
        <div class="setting">
            <label for="format-select">${l.date_format}</label>
            <select id="format-select">
                <option value="full" ${!isShortFormat ? 'selected' : ''}>${l.format_full}</option>
                <option value="short" ${isShortFormat ? 'selected' : ''}>${l.format_short}</option>
            </select>
        </div>
        <button id="debug-mode-btn" class="full-width">${l.debug_button}</button>
    `;
}

function renderDebugPopup() {
    const { l, currentLang, debug } = appState;
    const monthOptions = [...Array(12).keys()].map(i => {
        const monthName = new Date(0, i).toLocaleString(currentLang, { month: 'long' });
        return `<option value="${i}" ${i === debug.month ? 'selected' : ''}>${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</option>`;
    }).join('');

    const effectForMonth = effectsMap[debug.month]?.effect || '';
    const selectedEffect = debug.effect !== null ? debug.effect : effectForMonth;
    
    const effectNames = {
        '': l.effect_none,
        'particles_snow': l.effect_snow,
        'autumn_rain': l.effect_autumn_rain
    };

    const effectOptions = allEffects.map(e => {
        const localizedName = effectNames[e] || e;
        return `<option value="${e}" ${e === selectedEffect ? 'selected' : ''}>${localizedName}</option>`;
    }).join('');

    elements.debugPopup.innerHTML = `
        <h2>${l.debug_title}</h2>
        <div class="setting">
            <label for="month-select">${l.month}</label>
            <select id="month-select">${monthOptions}</select>
        </div>
        <div class="setting">
            <label for="tod-select">${l.time_of_day}</label>
            <select id="tod-select">
                <option value="day">${l.day}</option>
                <option value="night">${l.night}</option>
            </select>
        </div>
        <div class="setting">
            <label for="effect-select">${l.select_effect}</label>
            <select id="effect-select"><option value="">${l.effect_none}</option>${effectOptions}</select>
        </div>
        <button id="reset-btn" class="full-width">${l.reset_button}</button>
        <button id="back-to-settings-btn" class="full-width secondary">${l.back_button}</button>
    `;
    
    // Set initial values after rendering
    document.getElementById('tod-select').value = debug.timeOfDay;
    document.getElementById('effect-select').value = selectedEffect;
}

function togglePopup(visible) {
    if (visible) {
        renderDebugPopup();
        elements.settingsPopup.style.display = 'block';
        elements.debugPopup.style.display = 'none';
    }
    elements.popupWrapper.classList.toggle('visible', visible);
}

// --- Event Listeners ---
function setupEventListeners() {
    elements.settingsIcon.addEventListener('click', () => togglePopup(true));
    elements.popupWrapper.addEventListener('click', (e) => {
        if (e.target === elements.popupWrapper) togglePopup(false);
    });

    // Settings Popup
    elements.settingsPopup.addEventListener('change', (e) => {
        if (e.target.id === 'lang-select') {
            setLanguage(e.target.value);
            appState = { ...appState, ...getLocalization(), holidays: getHolidays() };
            updateUIText();
        }
        if (e.target.id === 'format-select') {
            appState.isShortFormat = e.target.value === 'short';
            localStorage.setItem('isShortFormat', appState.isShortFormat);
            setHoliday(elements.holidaySelector.value);
        }
    });
    elements.settingsPopup.addEventListener('click', (e) => {
        if (e.target.id === 'debug-mode-btn') {
            elements.settingsPopup.style.display = 'none';
            elements.debugPopup.style.display = 'block';
        }
    });

    // Debug Popup
    elements.debugPopup.addEventListener('change', (e) => {
        const month = parseInt(document.getElementById('month-select').value, 10);
        const timeOfDay = document.getElementById('tod-select').value;
        const effect = document.getElementById('effect-select').value;

        appState.debug.month = month;
        appState.debug.timeOfDay = timeOfDay;
        appState.debug.effect = effect;

        if (e.target.id !== 'effect-select') {
            const effectForMonth = effectsMap[month]?.effect || '';
            document.getElementById('effect-select').value = effectForMonth;
            appState.debug.effect = effectForMonth;
        }

        loadScene({ month, timeOfDay, effect: appState.debug.effect });
    });

    elements.debugPopup.addEventListener('click', (e) => {
        if (e.target.id === 'reset-btn') {
            const now = new Date();
            appState.debug.month = now.getMonth();
            appState.debug.timeOfDay = (now.getHours() > 6 && now.getHours() < 20) ? 'day' : 'night';
            appState.debug.effect = null;
            loadScene();
            togglePopup(false);
        }
        if (e.target.id === 'back-to-settings-btn') {
            elements.debugPopup.style.display = 'none';
            elements.settingsPopup.style.display = 'block';
        }
    });

    elements.holidaySelector.addEventListener('change', (e) => setHoliday(e.target.value));
}

// --- Initialization ---
function init() {
    elements.mainTitle.textContent = appState.l.calculating;
    elements.countdown.textContent = '...';

    populateHolidaySelector();
    renderSettingsPopup();
    renderDebugPopup();
    setupEventListeners();

    setHoliday('newYear');
    loadScene();
}

document.addEventListener('DOMContentLoaded', init);
