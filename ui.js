// --- Управление элементами пользовательского интерфейса ---

let currentDateEl, seasonIconEl, seasonNameEl, nextYearEl, countdownEl, daysEl, hoursEl, minutesEl, secondsEl,
    daysLabelEl, hoursLabelEl, minutesLabelEl, secondsLabelEl, greetingEl, currentYearFooterEl,
    decorationsContainer, bodyEl, h1El, centerContentEl, mainContentEl, debugMenuEl, closeDebugMenuBtn, resetDebugModeBtn;

function initUIElements(elements) {
    currentDateEl = elements.currentDateEl;
    seasonIconEl = elements.seasonIconEl;
    seasonNameEl = elements.seasonNameEl;
    nextYearEl = elements.nextYearEl;
    countdownEl = elements.countdownEl;
    daysEl = elements.daysEl;
    hoursEl = elements.hoursEl;
    minutesEl = elements.minutesEl;
    secondsEl = elements.secondsEl;
    daysLabelEl = elements.daysLabelEl;
    hoursLabelEl = elements.hoursLabelEl;
    minutesLabelEl = elements.minutesLabelEl;
    secondsLabelEl = elements.secondsLabelEl;
    greetingEl = elements.greetingEl;
    currentYearFooterEl = elements.currentYearFooterEl;
    decorationsContainer = elements.decorationsContainer;
    bodyEl = elements.bodyEl;
    h1El = elements.h1El;
    centerContentEl = elements.centerContentEl;
    mainContentEl = elements.mainContentEl;
    debugMenuEl = elements.debugMenuEl;
    closeDebugMenuBtn = elements.closeDebugMenuBtn;
    resetDebugModeBtn = elements.resetDebugModeBtn;
}

function updateDateTimeUI() {
    const displayDate = getCurrentDateInternal();
    const currentYear = displayDate.getFullYear();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    try {
        const dateTimeString = displayDate.toLocaleString('ru-RU', options);
        currentDateEl.textContent = dateTimeString.charAt(0).toUpperCase() + dateTimeString.slice(1);
    } catch (e) {
        const monthsNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
        const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        currentDateEl.textContent =
            `${daysOfWeek[displayDate.getDay()]}, ${displayDate.getDate()} ${monthsNames[displayDate.getMonth()]} ${displayDate.getFullYear()}, ${String(displayDate.getHours()).padStart(2, '0')}:${String(displayDate.getMinutes()).padStart(2, '0')}:${String(displayDate.getSeconds()).padStart(2, '0')}`;
    }
    currentYearFooterEl.textContent = currentYear;
}

function updateMonthSeasonUI() {
    const date = getCurrentDateInternal();
    const currentMonth = date.getMonth();
    const currentDay = date.getDate();
    const currentMonthData = MONTHS_CONFIG[currentMonth];
    const isNewYearEve = currentMonth === 11 && currentDay === 31;
    const isNewYearDay = currentMonth === 0 && currentDay === 1;
    const isCurrentlyNewYear = isNewYearEve || isNewYearDay;

    seasonNameEl.textContent = SEASONS_CONFIG[currentMonthData.season].name;
    seasonIconEl.textContent = currentMonthData.icon;
    bodyEl.className = '';
    if (isCurrentlyNewYear) {
        bodyEl.classList.add('new-year');
    } else {
        bodyEl.classList.add(currentMonthData.class);
    }

    let faviconEmoji = '🎆';
    if (isCurrentlyNewYear) {
        faviconEmoji = '🎄';
    } else {
      switch (currentMonthData.season) {
        case 'winter': faviconEmoji = '❄️'; break;
        case 'spring': faviconEmoji = '🌸'; break;
        case 'summer': faviconEmoji = '☀️'; break;
        case 'autumn': faviconEmoji = '🍁'; break;
      }
    }
    document.querySelector('link[rel="icon"]').href =
      `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${faviconEmoji}</text></svg>`;
}

function getPluralForm(number, forms) {
    number = Math.abs(number);
    const n100 = number % 100;
    const n10 = number % 10;
    if (n100 > 10 && n100 < 20) return forms[2];
    if (n10 > 1 && n10 < 5) return forms[1];
    if (n10 === 1) return forms[0];
    return forms[2];
}

function updateCountdownUI() {
    const dateNow = getCurrentDateInternal();
    let tempCurrentYear = dateNow.getFullYear();
    let calculatedNextYear = (dateNow.getMonth() === 0 && dateNow.getDate() === 1 && dateNow.getHours() < 6)
      ? tempCurrentYear
      : tempCurrentYear + 1;

    if (typeof setGlobalNextYear === 'function') {
        setGlobalNextYear(calculatedNextYear);
    }
    nextYearEl.textContent = calculatedNextYear;

    const newYearDate = new Date(calculatedNextYear, 0, 1, 0, 0, 0);
    const diff = newYearDate - dateNow;

    if (diff <= 0) {
        if (countdownEl.style.display !== 'none') {
            countdownEl.style.display = 'none';
            h1El.style.display = 'none';
            greetingEl.textContent = `С Новым ${calculatedNextYear} Годом! 🎉`;
            greetingEl.style.margin = '0';
            mainContentEl.classList.add('greeting-active');

            if (shouldFireworksBeActiveForDate(dateNow) && !FireworksManager.isSystemActive()) {
               FireworksManager.start();
            }
            setupDecorationsUI();
        }
        return;
    } else {
        if (countdownEl.style.display === 'none') {
            countdownEl.style.display = 'flex';
            h1El.style.display = 'block';
            h1El.innerHTML = `До Нового <span id="next-year">${calculatedNextYear}</span> года осталось:`;
            document.getElementById('next-year').textContent = calculatedNextYear;
            mainContentEl.classList.remove('greeting-active');
            if (FireworksManager.isSystemActive()) {
                FireworksManager.stop();
            }
        }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = days;
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');

    daysLabelEl.textContent = getPluralForm(days, ['день', 'дня', 'дней']);
    hoursLabelEl.textContent = getPluralForm(hours, ['час', 'часа', 'часов']);
    minutesLabelEl.textContent = getPluralForm(minutes, ['минута', 'минуты', 'минут']);
    secondsLabelEl.textContent = getPluralForm(seconds, ['секунда', 'секунды', 'секунд']);

    greetingEl.textContent = '';
}

function setupDecorationsUI() {
    const date = getCurrentDateInternal();
    const month = date.getMonth();
    const day = date.getDate();
    decorationsContainer.innerHTML = '';

    if (month === 11 || (month === 0 && day < 15)) {
        decorationsContainer.classList.add('active');
        const colors = GARLAND_SETTINGS.LIGHT_COLORS;
        const lightDensity = GARLAND_SETTINGS.LIGHT_DENSITY_DIVIDER;
        const lightCountHorizontal = Math.floor(window.innerWidth / lightDensity);
        const lightCountVertical = Math.floor(window.innerHeight / lightDensity);

        const createGarland = (className, count, isVertical = false) => {
            const garland = document.createElement('div');
            garland.className = `garland ${className}`;
            if (isVertical) garland.classList.add('vertical');
            for (let i = 0; i < count; i++) {
                const light = document.createElement('div');
                light.className = 'garland-light';
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                light.style.backgroundColor = randomColor;
                light.style.boxShadow = `0 0 8px ${randomColor}, 0 0 16px ${randomColor}`;
                light.style.animationDelay = `${Math.random() * GARLAND_SETTINGS.twinkleAnimation.durationSeconds}s`;
                garland.appendChild(light);
            }
            decorationsContainer.appendChild(garland);
        };
        createGarland('top', lightCountHorizontal);
        createGarland('bottom', lightCountHorizontal);
        createGarland('left', lightCountVertical, true);
        createGarland('right', lightCountVertical, true);
    } else {
        decorationsContainer.classList.remove('active');
    }
}

function toggleDebugMenuUI(show) {
    if (show) {
        bodyEl.classList.add('debug-menu-open');
        debugMenuEl.classList.add('active');
    } else {
        bodyEl.classList.remove('debug-menu-open');
        debugMenuEl.classList.remove('active');
    }
}